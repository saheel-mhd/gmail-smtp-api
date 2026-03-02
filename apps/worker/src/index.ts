import { Job, UnrecoverableError, Worker } from "bullmq";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import nodemailer from "nodemailer";
import pino from "pino";
import { env } from "./env";
import { prisma } from "./lib/prisma";
import { redis } from "./lib/redis";
import { decryptSecret } from "./lib/crypto";

const log = pino({ name: "gmail-smtp-worker" });
const QUEUE_NAME = "send_email_jobs";
const retryDelaysMs = [30_000, 120_000, 600_000, 1_800_000, 7_200_000];

type SendJobData = {
  messageId: string;
};

const workerMeta = (() => {
  const hostname = os.hostname();
  let version = "unknown";
  try {
    const pkgPath = path.resolve(process.cwd(), "package.json");
    const raw = fs.readFileSync(pkgPath, "utf-8");
    const pkg = JSON.parse(raw) as { version?: string };
    if (pkg.version) version = pkg.version;
  } catch {
    // best-effort only
  }
  return { hostname, version };
})();

async function writeSystemEvent(action: "system.worker.started" | "system.worker.stopped") {
  const tenants = await prisma.tenant.findMany({
    select: { id: true }
  });
  if (!tenants.length) return;

  await prisma.auditLog.createMany({
    data: tenants.map((tenant) => ({
      tenantId: tenant.id,
      actorType: "system",
      actorId: "worker",
      action,
      metadata: {
        detail: action === "system.worker.started" ? "Worker started" : "Worker stopped",
        hostname: workerMeta.hostname,
        version: workerMeta.version
      }
    }))
  });
}

function classifyError(error: unknown): "transient" | "permanent" | "auth" {
  const message = (error as Error)?.message?.toLowerCase() ?? "";
  if (
    message.includes("invalid login") ||
    message.includes("auth") ||
    message.includes("username and password")
  ) {
    return "auth";
  }
  if (
    message.includes("invalid recipient") ||
    message.includes("mailbox unavailable") ||
    message.includes("policy")
  ) {
    return "permanent";
  }
  return "transient";
}

function currentDayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function dayStartUtc(dayKey: string): Date {
  return new Date(`${dayKey}T00:00:00.000Z`);
}

async function reserveDailySlot(
  senderId: string,
  perDayLimit: number,
  existingCount: number,
  existingResetAt: Date | null
): Promise<number> {
  const dayKey = currentDayKey();
  const key = `quota:sender:${senderId}:${dayKey}`;
  const dayStart = dayStartUtc(dayKey);
  const initialCount = existingResetAt && existingResetAt >= dayStart ? existingCount : 0;
  await redis.set(key, String(initialCount), "EX", 24 * 60 * 60, "NX");
  const count = await redis.incr(key);
  if (count > perDayLimit) {
    await redis.decr(key);
    throw new Error("sender daily limit reached");
  }
  return count;
}

async function processSendJob(job: Job<SendJobData>): Promise<void> {
  const message = await prisma.message.findUnique({
    where: { id: job.data.messageId },
    include: {
      smtpAccount: true,
      domainSender: {
        include: {
          domain: true
        }
      }
    }
  });
  if (!message) throw new UnrecoverableError("message not found");
  if (message.status === "sent") return;
  if (!message.smtpAccount && !message.domainSender) {
    throw new UnrecoverableError("sender is missing");
  }

  const senderType = message.smtpAccount ? "gmail" : "domain";
  const sender = message.smtpAccount ?? message.domainSender;
  if (!sender || sender.status !== "active") {
    throw new UnrecoverableError("sender is not active");
  }
  if (senderType === "domain" && !message.domainSender?.domain?.smtpHost) {
    throw new UnrecoverableError("domain smtp settings are missing");
  }

  const dayKey = currentDayKey();
  const quotaKey = `quota:sender:${sender.id}:${dayKey}`;
  let reservedCount: number | null = null;
  try {
    reservedCount = await reserveDailySlot(
      sender.id,
      sender.perDayLimit,
      sender.sentTodayCount ?? 0,
      sender.sentTodayResetAt
    );
  } catch (error) {
    await prisma.message.update({
      where: { id: message.id },
      data: {
        status: "failed",
        lastError: "sender daily limit reached"
      }
    });
    throw new UnrecoverableError((error as Error).message);
  }

  await prisma.message.update({
    where: { id: message.id },
    data: {
      status: "sending",
      attempts: { increment: 1 }
    }
  });

  try {
    let transporter: nodemailer.Transporter;
    let fromEmail = "";

    if (senderType === "gmail" && message.smtpAccount) {
      const appPassword = decryptSecret({
        encrypted: message.smtpAccount.encryptedAppPassword,
        iv: message.smtpAccount.iv,
        authTag: message.smtpAccount.authTag
      });
      transporter = nodemailer.createTransport({
        host: env.GMAIL_SMTP_HOST,
        port: env.GMAIL_SMTP_PORT,
        secure: env.GMAIL_SMTP_SECURE,
        requireTLS: env.GMAIL_SMTP_REQUIRE_TLS,
        auth: {
          user: message.smtpAccount.gmailAddress,
          pass: appPassword
        }
      });
      fromEmail = message.smtpAccount.gmailAddress;
    } else if (message.domainSender?.domain?.smtpHost) {
      const password = decryptSecret({
        encrypted: message.domainSender.encryptedPassword,
        iv: message.domainSender.iv,
        authTag: message.domainSender.authTag
      });
      transporter = nodemailer.createTransport({
        host: message.domainSender.domain.smtpHost,
        port: message.domainSender.domain.smtpPort,
        secure: message.domainSender.domain.smtpSecure,
        auth: {
          user: message.domainSender.username,
          pass: password
        }
      });
      fromEmail = message.domainSender.emailAddress;
    } else {
      throw new UnrecoverableError("sender is not configured");
    }

    await transporter.sendMail({
      from: message.fromName ? `"${message.fromName}" <${fromEmail}>` : fromEmail,
      to: message.to as string[],
      cc: message.cc as string[],
      bcc: message.bcc as string[],
      subject: message.subject,
      text: message.text ?? undefined,
      html: message.html ?? undefined,
      replyTo: message.replyTo ?? undefined,
      headers: (message.headers ?? {}) as Record<string, string>
    });

    await prisma.$transaction([
      prisma.message.update({
        where: { id: message.id },
        data: {
          status: "sent",
          sentAt: new Date(),
          lastError: null
        }
      }),
      senderType === "gmail"
        ? prisma.smtpAccount.update({
            where: { id: sender.id },
            data: {
              lastSuccessAt: new Date(),
              errorStreak: 0,
              healthScore: { set: 100 }
            }
          })
        : prisma.domainSender.update({
            where: { id: sender.id },
            data: {
              lastSuccessAt: new Date(),
              errorStreak: 0,
              healthScore: { set: 100 }
            }
          })
    ]);

    if (reservedCount) {
      if (senderType === "gmail") {
        await prisma.smtpAccount.updateMany({
          where: {
            id: sender.id,
            OR: [
              { sentTodayResetAt: null },
              { sentTodayResetAt: { lt: dayStartUtc(dayKey) } },
              { sentTodayCount: { lt: reservedCount } }
            ]
          },
          data: {
            sentTodayCount: reservedCount,
            sentTodayResetAt: dayStartUtc(dayKey)
          }
        });
      } else {
        await prisma.domainSender.updateMany({
          where: {
            id: sender.id,
            OR: [
              { sentTodayResetAt: null },
              { sentTodayResetAt: { lt: dayStartUtc(dayKey) } },
              { sentTodayCount: { lt: reservedCount } }
            ]
          },
          data: {
            sentTodayCount: reservedCount,
            sentTodayResetAt: dayStartUtc(dayKey)
          }
        });
      }
    }
  } catch (error) {
    if (reservedCount) {
      await redis.decr(quotaKey);
    }
    const errorType = classifyError(error);
    const nextAttempt = job.attemptsMade + 1;
    const lastAttempt = nextAttempt >= retryDelaysMs.length;
    const lastError = (error as Error).message;

    const updateSender =
      senderType === "gmail"
        ? prisma.smtpAccount.update({
            where: { id: sender.id },
            data: {
              lastErrorAt: new Date(),
              errorStreak: { increment: 1 },
              healthScore: {
                set: Math.max((sender.healthScore ?? 100) - 15, 0)
              },
              status:
                errorType === "auth" && sender.errorStreak + 1 >= 3
                  ? "needs_attention"
                  : undefined
            }
          })
        : prisma.domainSender.update({
            where: { id: sender.id },
            data: {
              lastErrorAt: new Date(),
              errorStreak: { increment: 1 },
              healthScore: {
                set: Math.max((sender.healthScore ?? 100) - 15, 0)
              },
              status:
                errorType === "auth" && sender.errorStreak + 1 >= 3
                  ? "needs_attention"
                  : undefined
            }
          });

    const updateMessage = prisma.message.update({
      where: { id: message.id },
      data: {
        status: errorType === "permanent" || lastAttempt ? "failed" : "queued",
        lastError
      }
    });

    await prisma.$transaction([updateSender, updateMessage]);

    if (errorType === "permanent" || errorType === "auth") {
      throw new UnrecoverableError(lastError);
    }
    throw error;
  }
}

async function start(): Promise<void> {
  const worker = new Worker<SendJobData>(QUEUE_NAME, processSendJob, {
    connection: redis,
    concurrency: env.WORKER_CONCURRENCY,
    settings: {
      backoffStrategy: (attemptsMade) => {
        const idx = Math.max(0, Math.min(attemptsMade - 1, retryDelaysMs.length - 1));
        return retryDelaysMs[idx];
      }
    }
  });

  worker.on("completed", (job) => {
    log.info({ messageId: job.data.messageId }, "message sent");
  });
  worker.on("failed", (job, err) => {
    log.error(
      { messageId: job?.data.messageId, err: err.message, attempts: job?.attemptsMade },
      "message failed"
    );
  });

  let shuttingDown = false;
  const shutdown = async (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    log.info({ signal }, "worker shutdown initiated");
    try {
      await worker.close();
    } catch (error) {
      log.warn({ err: error }, "failed to close worker");
    }
    try {
      await writeSystemEvent("system.worker.stopped");
    } catch (error) {
      log.warn({ err: error }, "failed to write worker stopped system log");
    }
    try {
      await Promise.all([prisma.$disconnect(), redis.quit()]);
    } catch (error) {
      log.warn({ err: error }, "failed to close connections");
    } finally {
      process.exit(0);
    }
  };
  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));

  try {
    await writeSystemEvent("system.worker.started");
  } catch (error) {
    log.warn({ err: error }, "failed to write worker started system log");
  }
  log.info({ concurrency: env.WORKER_CONCURRENCY }, "worker started");
}

start().catch((error) => {
  log.error({ err: error }, "worker failed to start");
  process.exit(1);
});
