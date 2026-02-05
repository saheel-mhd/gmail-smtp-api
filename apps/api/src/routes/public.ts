import { FastifyInstance } from "fastify";
import { Prisma } from "../../generated/prisma/client";
import { sendRequestSchema } from "@gmail-smtp/shared";
import { prisma } from "../lib/prisma";
import { authenticateApiKey, enforceDailyQuota, enforceRateLimit } from "../plugins/security";
import { assertSafeHeaders } from "../lib/validation";
import { getSendQueue } from "../queue";
import { writeAuditLog } from "../plugins/audit";

export async function publicRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    "/v1/senders",
    { preHandler: authenticateApiKey },
    async (request, reply) => {
      const actor = request.actor;
      if (!actor || actor.actorType !== "api_key") {
        return reply.unauthorized();
      }

      const senders = await prisma.smtpAccount.findMany({
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

      return reply.send({ data: senders });
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
      if (!input.text && !input.html) {
        return reply.badRequest("one of text or html must be provided");
      }
      assertSafeHeaders(input.headers ?? {});

      if (!actor.allowedSmtpAccountIds.includes(input.senderId)) {
        return reply.forbidden("api key cannot use this sender");
      }

      const sender = await prisma.smtpAccount.findFirst({
        where: {
          id: input.senderId,
          tenantId: actor.tenantId
        }
      });

      if (!sender || sender.status !== "active") {
        return reply.badRequest("sender is unavailable");
      }

      const totalRecipients = input.to.length + input.cc.length + input.bcc.length;
      if (totalRecipients > 10) {
        return reply.badRequest("max 10 recipients allowed");
      }

      const minuteKeyPerApi = `rl:api:${actor.apiKeyId}:${Math.floor(Date.now() / 60000)}`;
      const minuteKeyPerTenant = `rl:tenant:${actor.tenantId}:${Math.floor(Date.now() / 60000)}`;
      const minuteKeyPerSender = `rl:sender:${sender.id}:${Math.floor(Date.now() / 60000)}`;
      const dayKeyPerSender = `quota:sender:${sender.id}:${new Date().toISOString().slice(0, 10)}`;
      const dayKeyPerTenant = `quota:tenant:${actor.tenantId}:${new Date().toISOString().slice(0, 10)}`;

      const [apiRate, tenantRate, senderRate, senderDaily, tenantDaily] = await Promise.all([
        enforceRateLimit(minuteKeyPerApi, actor.rateLimitPerMinute),
        enforceRateLimit(minuteKeyPerTenant, Math.max(actor.rateLimitPerMinute * 3, 200)),
        enforceRateLimit(minuteKeyPerSender, sender.perMinuteLimit),
        enforceDailyQuota(dayKeyPerSender, sender.perDayLimit),
        enforceDailyQuota(dayKeyPerTenant, Math.max(sender.perDayLimit * 2, 5000))
      ]);

      if (!apiRate.allowed || !tenantRate.allowed || !senderRate.allowed) {
        return reply.tooManyRequests("rate limit exceeded");
      }
      if (!senderDaily.allowed || !tenantDaily.allowed) {
        return reply.tooManyRequests("daily quota exceeded");
      }

      try {
        const message = await prisma.message.create({
          data: {
            tenantId: actor.tenantId,
            apiKeyId: actor.apiKeyId,
            smtpAccountId: sender.id,
            idempotencyKey: input.idempotencyKey,
            to: input.to,
            cc: input.cc,
            bcc: input.bcc,
            subject: input.subject,
            text: input.text,
            html: input.html,
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
          metadata: { messageId: message.id, senderId: sender.id }
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
}
