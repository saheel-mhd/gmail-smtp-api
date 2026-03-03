import { FastifyInstance } from "fastify";
import type { FastifyRequest } from "fastify";
import { Prisma } from "../../generated/prisma/client";
import { randomUUID } from "node:crypto";
import { sendRequestSchema, templateSendSchema } from "@gmail-smtp/shared";
import { prisma } from "../lib/prisma";
import { authenticateApiKey, enforceDailyQuota, enforceRateLimit } from "../plugins/security";
import { assertSafeHeaders } from "../lib/validation";
import { getSendQueue } from "../queue";
import { writeAuditLog } from "../plugins/audit";
import { renderTemplate } from "../lib/template";
import { redis } from "../lib/redis";
import { env } from "../env";

export async function publicRoutes(app: FastifyInstance): Promise<void> {
  const pixelGif = Buffer.from("R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==", "base64");

  function buildFailedIdempotencyKey(source: string) {
    const base = source.slice(0, 80);
    const suffix = `:fail:${Date.now().toString(36)}${randomUUID().slice(0, 6)}`;
    return (base + suffix).slice(0, 120);
  }

  async function recordFailedMessage({
    request,
    actor,
    input,
    senderType,
    senderId,
    error,
    subject
  }: {
    request: FastifyRequest;
    actor: {
      tenantId: string;
      apiKeyId: string;
    };
    input: {
      idempotencyKey: string;
      to: string[];
      cc: string[];
      bcc: string[];
      fromName?: string;
      replyTo?: string;
      headers?: Record<string, string>;
    };
    senderType?: "gmail" | "domain";
    senderId?: string;
    error: string;
    subject?: string;
  }) {
    const safeSubject = (subject ?? `Failed: ${error}`).slice(0, 250);
    const lastError = error.slice(0, 400);
    try {
      await prisma.message.create({
        data: {
          tenantId: actor.tenantId,
          apiKeyId: actor.apiKeyId,
          smtpAccountId: senderType === "gmail" ? senderId ?? null : null,
          domainSenderId: senderType === "domain" ? senderId ?? null : null,
          idempotencyKey: buildFailedIdempotencyKey(input.idempotencyKey),
          to: input.to,
          cc: input.cc,
          bcc: input.bcc,
          subject: safeSubject,
          text: null,
          html: null,
          fromName: input.fromName,
          replyTo: input.replyTo,
          headers: input.headers ?? {},
          status: "failed",
          lastError
        }
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return;
      }
      request.log.warn({ err: error }, "failed to record failed message");
    }
  }

  app.get("/v1/track/open/:token", async (request, reply) => {
    const params = request.params as { token: string };
    const recipient = await prisma.campaignRecipient.findUnique({
      where: { trackingToken: params.token },
      select: { id: true, campaignId: true, openedAt: true }
    });
    if (recipient) {
      const firstOpen = recipient.openedAt === null;
      await prisma.campaignRecipient.update({
        where: { id: recipient.id },
        data: {
          openedAt: recipient.openedAt ?? new Date(),
          openCount: { increment: 1 }
        }
      });
      if (firstOpen) {
        await prisma.campaign.update({
          where: { id: recipient.campaignId },
          data: { openedCount: { increment: 1 } }
        });
      }
    }

    reply
      .header("Content-Type", "image/gif")
      .header("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
      .header("Pragma", "no-cache")
      .header("Expires", "0")
      .send(pixelGif);
  });

  app.get("/v1/track/click/:token", async (request, reply) => {
    const params = request.params as { token: string };
    const query = request.query as { url?: string };
    const rawUrl = query.url ? decodeURIComponent(query.url) : "";
    if (!rawUrl || !/^https?:\/\//i.test(rawUrl)) {
      return reply.badRequest("invalid url");
    }

    const recipient = await prisma.campaignRecipient.findUnique({
      where: { trackingToken: params.token },
      select: { id: true, campaignId: true, clickedAt: true }
    });
    if (recipient) {
      const firstClick = recipient.clickedAt === null;
      await prisma.campaignRecipient.update({
        where: { id: recipient.id },
        data: {
          clickedAt: recipient.clickedAt ?? new Date(),
          clickCount: { increment: 1 },
          clickedUrl: rawUrl.slice(0, 500)
        }
      });
      if (firstClick) {
        await prisma.campaign.update({
          where: { id: recipient.campaignId },
          data: { clickedCount: { increment: 1 } }
        });
      }
    }

    return reply.redirect(rawUrl);
  });

  app.post("/v1/track/reply/:token", async (request, reply) => {
    const params = request.params as { token: string };
    const secret = env.REPLY_TRACKING_SECRET;
    if (secret) {
      const provided = request.headers["x-reply-secret"];
      if (provided !== secret) return reply.forbidden("invalid secret");
    }

    const recipient = await prisma.campaignRecipient.findUnique({
      where: { trackingToken: params.token },
      select: { id: true, campaignId: true, repliedAt: true }
    });
    if (recipient) {
      const firstReply = recipient.repliedAt === null;
      await prisma.campaignRecipient.update({
        where: { id: recipient.id },
        data: {
          repliedAt: recipient.repliedAt ?? new Date(),
          replyCount: { increment: 1 }
        }
      });
      if (firstReply) {
        await prisma.campaign.update({
          where: { id: recipient.campaignId },
          data: { repliedCount: { increment: 1 } }
        });
      }
    }

    return reply.send({ ok: true });
  });

  app.get(
    "/v1/senders",
    { preHandler: authenticateApiKey },
    async (request, reply) => {
      const actor = request.actor;
      if (!actor || actor.actorType !== "api_key") {
        return reply.unauthorized();
      }

      const gmailSenders = await prisma.smtpAccount.findMany({
        where: {
          tenantId: actor.tenantId,
          status: "active",
          id: { in: actor.allowedSmtpAccountIds }
        },
        select: {
          id: true,
          label: true,
          gmailAddress: true
        }
      });

      const domainSenders = await prisma.domainSender.findMany({
        where: {
          tenantId: actor.tenantId,
          status: "active",
          id: { in: actor.allowedDomainSenderIds }
        },
        select: {
          id: true,
          label: true,
          emailAddress: true,
          domain: { select: { domain: true } }
        }
      });

      return reply.send({
        data: [
          ...gmailSenders.map((sender) => ({
            id: sender.id,
            label: sender.label,
            emailAddress: sender.gmailAddress,
            gmailAddress: sender.gmailAddress,
            type: "gmail" as const
          })),
          ...domainSenders.map((sender) => ({
            id: sender.id,
            label: sender.label,
            emailAddress: sender.emailAddress,
            type: "domain" as const,
            domain: sender.domain.domain
          }))
        ]
      });
    }
  );

  app.get(
    "/v1/messages/:id",
    { preHandler: authenticateApiKey },
    async (request, reply) => {
      const actor = request.actor;
      if (!actor || actor.actorType !== "api_key") {
        return reply.unauthorized();
      }
      const params = request.params as { id: string };
      const message = await prisma.message.findFirst({
        where: {
          id: params.id,
          tenantId: actor.tenantId,
          apiKeyId: actor.apiKeyId
        },
        select: {
          id: true,
          status: true,
          attempts: true,
          lastError: true,
          createdAt: true,
          queuedAt: true,
          sentAt: true
        }
      });
      if (!message) return reply.notFound("message not found");
      return reply.send({ data: message });
    }
  );

  app.post(
    "/v1/send",
    { preHandler: authenticateApiKey },
    async (request, reply) => {
      const actor = request.actor;
      if (!actor || actor.actorType !== "api_key") {
        return reply.unauthorized();
      }

      const parsed = sendRequestSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest(parsed.error.message);
      }
      const input = parsed.data;
      const usingTemplate = Boolean(input.templateId);
      assertSafeHeaders(input.headers ?? {});

      const allowedSenders = [
        ...actor.allowedSmtpAccountIds.map((id) => ({ id, type: "gmail" as const })),
        ...actor.allowedDomainSenderIds.map((id) => ({ id, type: "domain" as const }))
      ];
      if (allowedSenders.length !== 1) {
        await recordFailedMessage({
          request,
          actor,
          input,
          error: "api key must be scoped to exactly one sender"
        });
        return reply.badRequest("api key must be scoped to exactly one sender");
      }
      const senderRef = allowedSenders[0];
      const senderType = senderRef.type;

      const sender =
        senderType === "gmail"
          ? await prisma.smtpAccount.findFirst({
              where: {
                id: senderRef.id,
                tenantId: actor.tenantId
              }
            })
          : await prisma.domainSender.findFirst({
              where: {
                id: senderRef.id,
                tenantId: actor.tenantId
              },
              include: { domain: true }
            });

      if (!sender || sender.status !== "active") {
        await recordFailedMessage({
          request,
          actor,
          input,
          senderType,
          senderId: senderRef.id,
          error: "sender is unavailable"
        });
        return reply.badRequest("sender is unavailable");
      }
      if (senderType === "domain") {
        const domainSender = sender as typeof sender & { domain?: { smtpHost: string | null } };
        if (!domainSender.domain?.smtpHost) {
          await recordFailedMessage({
            request,
            actor,
            input,
            senderType,
            senderId: senderRef.id,
            error: "domain smtp settings are missing"
          });
          return reply.badRequest("domain smtp settings are missing");
        }
      }

      const totalRecipients = input.to.length + input.cc.length + input.bcc.length;
      if (totalRecipients > 10) {
        await recordFailedMessage({
          request,
          actor,
          input,
          senderType,
          senderId: senderRef.id,
          error: "max 10 recipients allowed"
        });
        return reply.badRequest("max 10 recipients allowed");
      }

      const minuteKeyPerApi = `rl:api:${actor.apiKeyId}:${Math.floor(Date.now() / 60000)}`;
      const dayKey = new Date().toISOString().slice(0, 10);
      const dayKeyPerTenant = `quota:tenant:${actor.tenantId}:${dayKey}`;
      const dayKeyPerSender = `quota:sender:${sender.id}:${dayKey}`;

      const [apiRate, tenantDaily] = await Promise.all([
        enforceRateLimit(minuteKeyPerApi, actor.rateLimitPerMinute),
        enforceDailyQuota(dayKeyPerTenant, Math.max(sender.perDayLimit * 2, 5000))
      ]);

      if (!apiRate.allowed) {
        await recordFailedMessage({
          request,
          actor,
          input,
          senderType,
          senderId: senderRef.id,
          error: "rate limit exceeded"
        });
        return reply.tooManyRequests("rate limit exceeded");
      }
      if (!tenantDaily.allowed) {
        await recordFailedMessage({
          request,
          actor,
          input,
          senderType,
          senderId: senderRef.id,
          error: "daily quota exceeded"
        });
        return reply.tooManyRequests("daily quota exceeded");
      }
      try {
        const currentCount = await redis.get(dayKeyPerSender);
        const sentToday = currentCount ? Number(currentCount) : 0;
        if (Number.isFinite(sentToday) && sentToday >= sender.perDayLimit) {
          await recordFailedMessage({
            request,
            actor,
            input,
            senderType,
            senderId: senderRef.id,
            error: "sender daily limit reached"
          });
          return reply.tooManyRequests("sender daily limit reached");
        }
      } catch (error) {
        request.log.warn({ err: error }, "failed to check sender daily quota");
      }

      try {
        let subject = input.subject ?? "";
        let html = input.html;
        let text = input.text;

        if (usingTemplate) {
          const template = await prisma.template.findFirst({
            where: {
              id: input.templateId,
              tenantId: actor.tenantId,
              status: "active"
            }
          });
          if (!template) {
            await recordFailedMessage({
              request,
              actor,
              input,
              senderType,
              senderId: senderRef.id,
              error: "template not found or inactive"
            });
            return reply.badRequest("template not found or inactive");
          }

          const variables = input.variables ?? {};
          const subjectRendered = renderTemplate(template.subject, variables);
          const htmlRendered = renderTemplate(template.html, variables);
          const textRendered = template.text
            ? renderTemplate(template.text, variables)
            : null;

          const missing = [
            ...subjectRendered.missing,
            ...htmlRendered.missing,
            ...(textRendered?.missing ?? [])
          ];
          const missingUnique = Array.from(new Set(missing));
          if (missingUnique.length) {
            await recordFailedMessage({
              request,
              actor,
              input,
              senderType,
              senderId: senderRef.id,
              error: `missing template variables: ${missingUnique.join(", ")}`
            });
            return reply.badRequest(`missing template variables: ${missingUnique.join(", ")}`);
          }

          subject = subjectRendered.value;
          html = htmlRendered.value;
          text = textRendered ? textRendered.value : undefined;
        }

        if (!text && !html) {
          await recordFailedMessage({
            request,
            actor,
            input,
            senderType,
            senderId: senderRef.id,
            error: "one of text or html must be provided"
          });
          return reply.badRequest("one of text or html must be provided");
        }

        const message = await prisma.message.create({
          data: {
            tenantId: actor.tenantId,
            apiKeyId: actor.apiKeyId,
            smtpAccountId: senderType === "gmail" ? sender.id : null,
            domainSenderId: senderType === "domain" ? sender.id : null,
            idempotencyKey: input.idempotencyKey,
            to: input.to,
            cc: input.cc,
            bcc: input.bcc,
            subject,
            text,
            html,
            fromName: input.fromName,
            replyTo: input.replyTo,
            headers: input.headers ?? {},
            status: "queued"
          }
        });

        try {
          await getSendQueue().add(
            "send-email",
            { messageId: message.id },
            { jobId: message.id }
          );
        } catch (error) {
          await prisma.message.update({
            where: { id: message.id },
            data: {
              status: "failed",
              lastError: "queue unavailable"
            }
          });
          request.log.error({ err: error }, "failed to enqueue public message");
          return reply.code(503).send({
            error: "queue_unavailable",
            message: "Redis queue is unavailable. Start Redis and worker, then retry."
          });
        }

        await writeAuditLog(request, {
          tenantId: actor.tenantId,
          actorType: "api_key",
          actorId: actor.apiKeyId,
          action: "public.message.queued",
          metadata: { messageId: message.id, senderId: sender.id, senderType }
        });

        return reply.code(202).send({
          messageId: message.id,
          status: "queued"
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          const existing = await prisma.message.findFirst({
            where: {
              apiKeyId: actor.apiKeyId,
              idempotencyKey: input.idempotencyKey
            },
            select: {
              id: true,
              status: true
            }
          });
          if (existing) {
            return reply.code(200).send({
              messageId: existing.id,
              status: existing.status,
              idempotentReplay: true
            });
          }
        }
        request.log.error({ err: error }, "failed to enqueue message");
        return reply.internalServerError("failed to queue message");
      }
    }
  );

  app.post(
    "/v1/send/:templateName",
    { preHandler: authenticateApiKey },
    async (request, reply) => {
      const actor = request.actor;
      if (!actor || actor.actorType !== "api_key") {
        return reply.unauthorized();
      }

      const params = request.params as { templateName: string };
      const templateName = params.templateName?.toLowerCase();
      if (!templateName || !/^[a-z0-9-]+$/.test(templateName)) {
        return reply.badRequest("template name must be URL-safe (lowercase letters, numbers, hyphens)");
      }

      const parsed = templateSendSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest(parsed.error.message);
      }
      const input = parsed.data;
      assertSafeHeaders(input.headers ?? {});

      const allowedSenders = [
        ...actor.allowedSmtpAccountIds.map((id) => ({ id, type: "gmail" as const })),
        ...actor.allowedDomainSenderIds.map((id) => ({ id, type: "domain" as const }))
      ];
      if (allowedSenders.length !== 1) {
        await recordFailedMessage({
          request,
          actor,
          input,
          error: "api key must be scoped to exactly one sender"
        });
        return reply.badRequest("api key must be scoped to exactly one sender");
      }
      const senderRef = allowedSenders[0];
      const senderType = senderRef.type;

      const sender =
        senderType === "gmail"
          ? await prisma.smtpAccount.findFirst({
              where: {
                id: senderRef.id,
                tenantId: actor.tenantId
              }
            })
          : await prisma.domainSender.findFirst({
              where: {
                id: senderRef.id,
                tenantId: actor.tenantId
              },
              include: { domain: true }
            });

      if (!sender || sender.status !== "active") {
        await recordFailedMessage({
          request,
          actor,
          input,
          senderType,
          senderId: senderRef.id,
          error: "sender is unavailable"
        });
        return reply.badRequest("sender is unavailable");
      }
      if (senderType === "domain") {
        const domainSender = sender as typeof sender & { domain?: { smtpHost: string | null } };
        if (!domainSender.domain?.smtpHost) {
          await recordFailedMessage({
            request,
            actor,
            input,
            senderType,
            senderId: senderRef.id,
            error: "domain smtp settings are missing"
          });
          return reply.badRequest("domain smtp settings are missing");
        }
      }

      const totalRecipients = input.to.length + input.cc.length + input.bcc.length;
      if (totalRecipients > 10) {
        await recordFailedMessage({
          request,
          actor,
          input,
          senderType,
          senderId: senderRef.id,
          error: "max 10 recipients allowed"
        });
        return reply.badRequest("max 10 recipients allowed");
      }

      const minuteKeyPerApi = `rl:api:${actor.apiKeyId}:${Math.floor(Date.now() / 60000)}`;
      const dayKey = new Date().toISOString().slice(0, 10);
      const dayKeyPerTenant = `quota:tenant:${actor.tenantId}:${dayKey}`;
      const dayKeyPerSender = `quota:sender:${sender.id}:${dayKey}`;

      const [apiRate, tenantDaily] = await Promise.all([
        enforceRateLimit(minuteKeyPerApi, actor.rateLimitPerMinute),
        enforceDailyQuota(dayKeyPerTenant, Math.max(sender.perDayLimit * 2, 5000))
      ]);

      if (!apiRate.allowed) {
        await recordFailedMessage({
          request,
          actor,
          input,
          senderType,
          senderId: senderRef.id,
          error: "rate limit exceeded"
        });
        return reply.tooManyRequests("rate limit exceeded");
      }
      if (!tenantDaily.allowed) {
        await recordFailedMessage({
          request,
          actor,
          input,
          senderType,
          senderId: senderRef.id,
          error: "daily quota exceeded"
        });
        return reply.tooManyRequests("daily quota exceeded");
      }
      try {
        const currentCount = await redis.get(dayKeyPerSender);
        const sentToday = currentCount ? Number(currentCount) : 0;
        if (Number.isFinite(sentToday) && sentToday >= sender.perDayLimit) {
          await recordFailedMessage({
            request,
            actor,
            input,
            senderType,
            senderId: senderRef.id,
            error: "sender daily limit reached"
          });
          return reply.tooManyRequests("sender daily limit reached");
        }
      } catch (error) {
        request.log.warn({ err: error }, "failed to check sender daily quota");
      }

      try {
        const template = await prisma.template.findFirst({
          where: {
            name: { equals: templateName, mode: "insensitive" },
            tenantId: actor.tenantId,
            status: "active"
          }
        });
        if (!template) {
          await recordFailedMessage({
            request,
            actor,
            input,
            senderType,
            senderId: senderRef.id,
            error: "template not found or inactive",
            subject: `Failed template: ${templateName}`
          });
          return reply.badRequest("template not found or inactive");
        }

        const variables = input.variables ?? {};
        const subjectRendered = renderTemplate(template.subject, variables);
        const htmlRendered = renderTemplate(template.html, variables);
        const textRendered = template.text ? renderTemplate(template.text, variables) : null;

          const missing = [
            ...subjectRendered.missing,
            ...htmlRendered.missing,
            ...(textRendered?.missing ?? [])
          ];
          const missingUnique = Array.from(new Set(missing));
          if (missingUnique.length) {
            await recordFailedMessage({
              request,
              actor,
              input,
              senderType,
              senderId: senderRef.id,
              error: `missing template variables: ${missingUnique.join(", ")}`
            });
            return reply.badRequest(`missing template variables: ${missingUnique.join(", ")}`);
          }

        const subject = subjectRendered.value;
        const html = htmlRendered.value;
        const text = textRendered ? textRendered.value : undefined;

        const message = await prisma.message.create({
          data: {
            tenantId: actor.tenantId,
            apiKeyId: actor.apiKeyId,
            smtpAccountId: senderType === "gmail" ? sender.id : null,
            domainSenderId: senderType === "domain" ? sender.id : null,
            idempotencyKey: input.idempotencyKey,
            to: input.to,
            cc: input.cc,
            bcc: input.bcc,
            subject,
            text,
            html,
            fromName: input.fromName,
            replyTo: input.replyTo,
            headers: input.headers ?? {},
            status: "queued"
          }
        });

        try {
          await getSendQueue().add(
            "send-email",
            { messageId: message.id },
            { jobId: message.id }
          );
        } catch (error) {
          await prisma.message.update({
            where: { id: message.id },
            data: {
              status: "failed",
              lastError: "queue unavailable"
            }
          });
          request.log.error({ err: error }, "failed to enqueue public template message");
          return reply.code(503).send({
            error: "queue_unavailable",
            message: "Redis queue is unavailable. Start Redis and worker, then retry."
          });
        }

        await writeAuditLog(request, {
          tenantId: actor.tenantId,
          actorType: "api_key",
          actorId: actor.apiKeyId,
          action: "public.message.queued",
          metadata: { messageId: message.id, senderId: sender.id, senderType }
        });

        return reply.code(202).send({
          messageId: message.id,
          status: "queued"
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          const existing = await prisma.message.findFirst({
            where: {
              apiKeyId: actor.apiKeyId,
              idempotencyKey: input.idempotencyKey
            },
            select: {
              id: true,
              status: true
            }
          });
          if (existing) {
            return reply.code(200).send({
              messageId: existing.id,
              status: existing.status,
              idempotentReplay: true
            });
          }
        }
        request.log.error({ err: error }, "failed to enqueue template message");
        return reply.internalServerError("failed to queue message");
      }
    }
  );
}
