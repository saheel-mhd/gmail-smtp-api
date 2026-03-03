import { Job, Queue, UnrecoverableError, Worker } from "bullmq";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import nodemailer from "nodemailer";
import pino from "pino";
import type { Prisma } from "../../api/generated/prisma/client";
import { env } from "./env";
import { prisma } from "./lib/prisma";
import { redis } from "./lib/redis";
import { decryptSecret } from "./lib/crypto";
import { renderTemplate } from "../../api/src/lib/template";

const log = pino({ name: "gmail-smtp-worker" });
const QUEUE_NAME = "send_email_jobs";
const CAMPAIGN_QUEUE_NAME = "campaign_dispatch_jobs";
const MAX_DISPATCH_BATCH = 200;
const retryDelaysMs = [30_000, 120_000, 600_000, 1_800_000, 7_200_000];

type SendJobData = {
  messageId: string;
};

type CampaignDispatchJobData = {
  campaignId: string;
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

let sendQueue: Queue<SendJobData> | null = null;
let campaignQueue: Queue<CampaignDispatchJobData> | null = null;

function getSendQueue(): Queue<SendJobData> {
  if (sendQueue) return sendQueue;
  sendQueue = new Queue<SendJobData>(QUEUE_NAME, { connection: redis });
  return sendQueue;
}

function getCampaignQueue(): Queue<CampaignDispatchJobData> {
  if (campaignQueue) return campaignQueue;
  campaignQueue = new Queue<CampaignDispatchJobData>(CAMPAIGN_QUEUE_NAME, {
    connection: redis
  });
  return campaignQueue;
}

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

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, "");
}

function buildOpenPixelUrl(baseUrl: string, token: string): string {
  return `${baseUrl}/v1/track/open/${token}`;
}

function buildClickUrl(baseUrl: string, token: string, url: string): string {
  const encoded = encodeURIComponent(url);
  return `${baseUrl}/v1/track/click/${token}?url=${encoded}`;
}

function applyTracking(
  html: string,
  baseUrl: string,
  token: string,
  trackOpens: boolean,
  trackClicks: boolean
): string {
  let next = html;
  if (trackClicks) {
    next = next.replace(
      /href=(["'])(https?:\/\/[^"']+)\1/gi,
      (match, quote, url: string) => {
        if (url.includes("/v1/track/click/")) return match;
        return `href=${quote}${buildClickUrl(baseUrl, token, url)}${quote}`;
      }
    );
  }
  if (trackOpens) {
    const pixel = `<img src="${buildOpenPixelUrl(baseUrl, token)}" width="1" height="1" style="display:none" alt="" />`;
    next = `${next}${pixel}`;
  }
  return next;
}

async function consumeRateLimit(
  key: string,
  limit: number,
  desired: number
): Promise<number> {
  if (limit <= 0 || desired <= 0) return 0;
  const currentRaw = await redis.get(key);
  const current = currentRaw ? Number(currentRaw) : 0;
  const remaining = Math.max(0, limit - (Number.isFinite(current) ? current : 0));
  const take = Math.min(remaining, desired);
  if (!take) return 0;

  const next = await redis.incrby(key, take);
  if (next > limit) {
    await redis.decrby(key, take);
    return 0;
  }
  const ttl = await redis.ttl(key);
  if (ttl < 0) {
    await redis.expire(key, 60);
  }
  return take;
}

function computeWarmupLimit(campaign: {
  perMinuteLimit: number | null;
  warmupEnabled: boolean;
  warmupStartPerMinute: number;
  warmupStep: number;
  warmupIntervalMinutes: number;
  warmupMaxPerMinute: number;
  startedAt: Date | null;
}): number {
  const baseLimit = campaign.perMinuteLimit ?? 0;
  if (!campaign.warmupEnabled || !campaign.startedAt) {
    return baseLimit;
  }
  const minutes = Math.max(
    0,
    Math.floor((Date.now() - campaign.startedAt.getTime()) / 60000)
  );
  const steps = Math.floor(minutes / campaign.warmupIntervalMinutes);
  const warmed = campaign.warmupStartPerMinute + steps * campaign.warmupStep;
  const capped = Math.min(warmed, campaign.warmupMaxPerMinute);
  return baseLimit ? Math.min(baseLimit, capped) : capped;
}

async function maybeCompleteCampaign(campaignId: string): Promise<void> {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    select: {
      status: true,
      totalRecipients: true,
      sentCount: true,
      failedCount: true,
      queuedCount: true
    }
  });
  if (!campaign || campaign.status !== "running") return;
  if (
    campaign.totalRecipients > 0 &&
    campaign.sentCount + campaign.failedCount >= campaign.totalRecipients &&
    campaign.queuedCount <= 0
  ) {
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: "completed", completedAt: new Date() }
    });
  }
}

function minutesKey(): string {
  return Math.floor(Date.now() / 60000).toString();
}

async function scheduleCampaignDispatch(campaignId: string, delayMs: number): Promise<void> {
  try {
    await getCampaignQueue().add(
      "campaign-dispatch",
      { campaignId },
      { delay: Math.max(0, delayMs), jobId: `campaign-dispatch-${campaignId}-${Date.now()}` }
    );
  } catch (error) {
    log.warn({ campaignId, err: error }, "failed to reschedule campaign dispatch");
  }
}

async function processCampaignDispatchJob(job: Job<CampaignDispatchJobData>): Promise<void> {
  const { campaignId } = job.data;
  const lockKey = `lock:campaign:${campaignId}`;
  const lock = await redis.set(lockKey, "1", "NX", "EX", 20);
  if (!lock) return;

  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        template: true,
        smtpAccount: true,
        domainSender: { include: { domain: true } }
      }
    });
    if (!campaign || campaign.status !== "running") return;

    const sender = campaign.smtpAccount ?? campaign.domainSender;
    if (!sender || sender.status !== "active") {
      await prisma.campaign.update({
        where: { id: campaign.id },
        data: { status: "paused" }
      });
      return;
    }
    if (campaign.senderType === "domain" && !campaign.domainSender?.domain?.smtpHost) {
      await prisma.campaign.update({
        where: { id: campaign.id },
        data: { status: "paused" }
      });
      return;
    }

    const warmupLimit = computeWarmupLimit(campaign);
    const senderLimit = "perMinuteLimit" in sender ? sender.perMinuteLimit : null;
    const effectiveLimit =
      senderLimit && senderLimit > 0
        ? Math.min(warmupLimit || senderLimit, senderLimit)
        : warmupLimit;

    if (!effectiveLimit || effectiveLimit <= 0) {
      await scheduleCampaignDispatch(campaign.id, 60_000);
      return;
    }

    const perMinuteKey = `rl:campaign:${campaign.id}:${minutesKey()}`;
    const allowance = await consumeRateLimit(
      perMinuteKey,
      effectiveLimit,
      Math.min(MAX_DISPATCH_BATCH, effectiveLimit)
    );
    if (!allowance) {
      await scheduleCampaignDispatch(campaign.id, 15_000);
      return;
    }

    const recipients = await prisma.campaignRecipient.findMany({
      where: { campaignId: campaign.id, status: "pending" },
      orderBy: { createdAt: "asc" },
      take: allowance
    });

    if (!recipients.length) {
      if (allowance > 0) {
        await redis.decrby(perMinuteKey, allowance);
      }
      await maybeCompleteCampaign(campaign.id);
      return;
    }

    if (campaign.templateId && !campaign.template) {
      await prisma.campaign.update({
        where: { id: campaign.id },
        data: { status: "paused" }
      });
      return;
    }

    const baseUrl = normalizeBaseUrl(env.APP_BASE_URL);
    const useTemplate = Boolean(campaign.templateId && campaign.template);
    const baseSubject = useTemplate ? campaign.template?.subject ?? "" : campaign.subject ?? "";
    const baseHtml = useTemplate ? campaign.template?.html ?? "" : campaign.html ?? "";
    const baseText = useTemplate ? campaign.template?.text ?? null : campaign.text ?? null;

    const now = new Date();
    const messageCreates: Prisma.MessageCreateManyInput[] = [];
    const recipientUpdates: Array<ReturnType<typeof prisma.campaignRecipient.update>> = [];
    let failedCount = 0;

    for (const recipient of recipients) {
      const variables =
        recipient.variables && typeof recipient.variables === "object"
          ? (recipient.variables as Record<string, string | number | boolean>)
          : {};
      const defaultVars: Record<string, string> = {
        Name: recipient.name ?? "",
        Email: recipient.email,
        name: recipient.name ?? "",
        email: recipient.email
      };
      const mergedVariables = {
        ...defaultVars,
        ...variables
      };

      const subjectRendered = renderTemplate(baseSubject, mergedVariables);
      const htmlRendered = baseHtml
        ? renderTemplate(baseHtml, mergedVariables)
        : { value: "", missing: [] };
      const textRendered = baseText
        ? renderTemplate(baseText, mergedVariables)
        : { value: "", missing: [] };

      const missing = Array.from(
        new Set([...subjectRendered.missing, ...htmlRendered.missing, ...textRendered.missing])
      );
      if (missing.length) {
        failedCount += 1;
        recipientUpdates.push(
          prisma.campaignRecipient.update({
            where: { id: recipient.id },
            data: {
              status: "failed",
              lastError: `missing template variables: ${missing.join(", ")}`,
              attempts: { increment: 1 }
            }
          })
        );
        continue;
      }

      let html = htmlRendered.value;
      if (html && (campaign.trackOpens || campaign.trackClicks)) {
        html = applyTracking(html, baseUrl, recipient.trackingToken, campaign.trackOpens, campaign.trackClicks);
      }

      const headers =
        campaign.headers && typeof campaign.headers === "object"
          ? { ...(campaign.headers as Record<string, string>) }
          : {};
      if (campaign.trackReplies) {
        headers["X-Reply-Token"] = recipient.trackingToken;
      }

      const messageId = randomUUID();
      messageCreates.push({
        id: messageId,
        tenantId: campaign.tenantId,
        apiKeyId: null,
        smtpAccountId: campaign.senderType === "gmail" ? campaign.smtpAccountId : null,
        domainSenderId: campaign.senderType === "domain" ? campaign.domainSenderId : null,
        campaignRecipientId: recipient.id,
        idempotencyKey: `campaign:${campaign.id}:${recipient.id}`,
        to: [recipient.email],
        cc: [],
        bcc: [],
        subject: subjectRendered.value,
        text: textRendered.value || null,
        html: html || null,
        fromName: campaign.fromName,
        replyTo: campaign.replyTo,
        headers,
        status: "queued",
        queuedAt: now
      });

      recipientUpdates.push(
        prisma.campaignRecipient.update({
          where: { id: recipient.id },
          data: {
            status: "queued",
            lastError: null,
            messageId
          }
        })
      );
    }

    if (recipientUpdates.length) {
      await prisma.$transaction(recipientUpdates);
    }

    let queueFailures: string[] = [];
    if (messageCreates.length) {
      await prisma.message.createMany({ data: messageCreates });
      for (const message of messageCreates) {
        try {
          await getSendQueue().add(
            "send-email",
            { messageId: message.id },
            { jobId: message.id }
          );
        } catch (error) {
          queueFailures.push(message.id);
          log.error({ err: error, messageId: message.id }, "failed to enqueue campaign message");
        }
      }
    }

    if (queueFailures.length) {
      const recipientIds = messageCreates
        .filter((message) => queueFailures.includes(message.id))
        .map((message) => message.campaignRecipientId)
        .filter((id): id is string => Boolean(id));
      const failureUpdates: Prisma.PrismaPromise<unknown>[] = [
        prisma.message.updateMany({
          where: { id: { in: queueFailures } },
          data: { status: "failed", lastError: "queue unavailable" }
        })
      ];
      if (recipientIds.length) {
        failureUpdates.push(
          prisma.campaignRecipient.updateMany({
            where: { id: { in: recipientIds } },
            data: { status: "failed", lastError: "queue unavailable" }
          })
        );
      }
      await prisma.$transaction(failureUpdates);
    }

    const queuedSuccessCount = Math.max(0, messageCreates.length - queueFailures.length);
    const failedTotal = failedCount + queueFailures.length;
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: {
        queuedCount: queuedSuccessCount ? { increment: queuedSuccessCount } : undefined,
        failedCount: failedTotal ? { increment: failedTotal } : undefined
      }
    });

    if (allowance > queuedSuccessCount) {
      await redis.decrby(perMinuteKey, allowance - queuedSuccessCount);
    }

    if (messageCreates.length >= allowance) {
      await scheduleCampaignDispatch(campaign.id, 5_000);
    } else {
      await scheduleCampaignDispatch(campaign.id, 10_000);
    }
  } finally {
    await redis.del(lockKey);
  }
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
      },
      campaignRecipient: {
        select: {
          id: true,
          campaignId: true
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
  if (message.campaignRecipient) {
    await prisma.campaignRecipient.update({
      where: { id: message.campaignRecipient.id },
      data: {
        status: "sending",
        attempts: { increment: 1 }
      }
    });
  }

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

    const now = new Date();
    const updates = [
      prisma.message.update({
        where: { id: message.id },
        data: {
          status: "sent",
          sentAt: now,
          lastError: null
        }
      }),
      senderType === "gmail"
        ? prisma.smtpAccount.update({
            where: { id: sender.id },
            data: {
              lastSuccessAt: now,
              errorStreak: 0,
              healthScore: { set: 100 }
            }
          })
        : prisma.domainSender.update({
            where: { id: sender.id },
            data: {
              lastSuccessAt: now,
              errorStreak: 0,
              healthScore: { set: 100 }
            }
          })
    ];

    if (message.campaignRecipient) {
      updates.push(
        prisma.campaignRecipient.update({
          where: { id: message.campaignRecipient.id },
          data: {
            status: "sent",
            sentAt: now,
            lastError: null
          }
        })
      );
      updates.push(
        prisma.campaign.update({
          where: { id: message.campaignRecipient.campaignId },
          data: {
            sentCount: { increment: 1 },
            queuedCount: { decrement: 1 }
          }
        })
      );
    }

    await prisma.$transaction(updates);
    if (message.campaignRecipient) {
      await maybeCompleteCampaign(message.campaignRecipient.campaignId);
    }

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
    const updates = [updateSender, updateMessage];

    if (message.campaignRecipient) {
      const terminal = errorType === "permanent" || lastAttempt;
      updates.push(
        prisma.campaignRecipient.update({
          where: { id: message.campaignRecipient.id },
          data: {
            status: terminal ? "failed" : "queued",
            lastError
          }
        })
      );
      if (terminal) {
        updates.push(
          prisma.campaign.update({
            where: { id: message.campaignRecipient.campaignId },
            data: {
              failedCount: { increment: 1 },
              queuedCount: { decrement: 1 }
            }
          })
        );
      }
    }

    await prisma.$transaction(updates);
    if (message.campaignRecipient && (errorType === "permanent" || lastAttempt)) {
      await maybeCompleteCampaign(message.campaignRecipient.campaignId);
    }

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

  const campaignWorker = new Worker<CampaignDispatchJobData>(
    CAMPAIGN_QUEUE_NAME,
    processCampaignDispatchJob,
    {
      connection: redis,
      concurrency: 1
    }
  );

  campaignWorker.on("failed", (job, err) => {
    log.error(
      { campaignId: job?.data.campaignId, err: err.message, attempts: job?.attemptsMade },
      "campaign dispatch failed"
    );
  });

  let shuttingDown = false;
  const shutdown = async (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    log.info({ signal }, "worker shutdown initiated");
    try {
      await Promise.all([worker.close(), campaignWorker.close()]);
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
