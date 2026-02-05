import { Job, UnrecoverableError, Worker } from "bullmq";
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

async function senderThrottle(senderId: string, perMinuteLimit: number): Promise<void> {
  const key = `worker:sender:${senderId}:${Math.floor(Date.now() / 60000)}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, 60);
  if (count > perMinuteLimit) {
    throw new Error("sender minute throttle exceeded");
  }
}

async function processSendJob(job: Job<SendJobData>): Promise<void> {
  const message = await prisma.message.findUnique({
    where: { id: job.data.messageId },
    include: {
      smtpAccount: true
    }
  });
  if (!message) throw new UnrecoverableError("message not found");
  if (message.status === "sent") return;
  if (message.smtpAccount.status !== "active") {
    throw new UnrecoverableError("sender is not active");
  }

  await senderThrottle(message.smtpAccount.id, message.smtpAccount.perMinuteLimit);

  await prisma.message.update({
    where: { id: message.id },
    data: {
      status: "sending",
      attempts: { increment: 1 }
    }
  });

  try {
    const appPassword = decryptSecret({
      encrypted: message.smtpAccount.encryptedAppPassword,
      iv: message.smtpAccount.iv,
      authTag: message.smtpAccount.authTag
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: message.smtpAccount.gmailAddress,
        pass: appPassword
      }
    });

    await transporter.sendMail({
      from: message.fromName
        ? `"${message.fromName}" <${message.smtpAccount.gmailAddress}>`
        : message.smtpAccount.gmailAddress,
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
      prisma.smtpAccount.update({
        where: { id: message.smtpAccount.id },
        data: {
          lastSuccessAt: new Date(),
          errorStreak: 0,
          healthScore: {
            set: Math.min((message.smtpAccount.healthScore ?? 100) + 3, 100)
          }
        }
      })
    ]);
  } catch (error) {
    const errorType = classifyError(error);
    const nextAttempt = job.attemptsMade + 1;
    const lastAttempt = nextAttempt >= retryDelaysMs.length;
    const lastError = (error as Error).message;

    const updateSender = prisma.smtpAccount.update({
      where: { id: message.smtpAccount.id },
      data: {
        lastErrorAt: new Date(),
        errorStreak: { increment: 1 },
        healthScore: {
          set: Math.max((message.smtpAccount.healthScore ?? 100) - 15, 0)
        },
        status:
          errorType === "auth" && message.smtpAccount.errorStreak + 1 >= 3
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

  const shutdown = async () => {
    await worker.close();
    await Promise.all([prisma.$disconnect(), redis.quit()]);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  log.info({ concurrency: env.WORKER_CONCURRENCY }, "worker started");
}

start().catch((error) => {
  log.error({ err: error }, "worker failed to start");
  process.exit(1);
});
