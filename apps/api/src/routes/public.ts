import { FastifyInstance } from "fastify";
import { Prisma } from "../../generated/prisma/client";
import { sendRequestSchema } from "@gmail-smtp/shared";
import { prisma } from "../lib/prisma";
import { authenticateApiKey } from "../plugins/security";
import { assertSafeHeaders } from "../lib/validation";
import { writeAuditLog } from "../plugins/audit";
import { renderTemplate } from "../lib/template";
import { decryptSecret } from "../lib/crypto";
import { classifySendError, sendGmailMessage } from "../lib/smtp";
import {
  enforceApiKeyRateLimit,
  releaseSenderDailyQuota,
  reserveSenderDailyQuota,
  reserveTenantDailyQuota
} from "../lib/limits";

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
      const usingTemplate = Boolean(input.templateId);
      assertSafeHeaders(input.headers ?? {});

      if (!actor.allowedSmtpAccountIds.includes(input.senderId)) {
        return reply.forbidden("api key cannot use this sender");
      }

      const sender = await prisma.smtpAccount.findFirst({
        where: {
          id: input.senderId,
          tenantId: actor.tenantId
        },
        select: {
          id: true,
          tenantId: true,
          label: true,
          gmailAddress: true,
          encryptedAppPassword: true,
          iv: true,
          authTag: true,
          keyVersion: true,
          status: true,
          perDayLimit: true,
          sentTodayCount: true,
          sentTodayResetAt: true,
          errorStreak: true,
          healthScore: true
        }
      });

      if (!sender || sender.status !== "active") {
        return reply.badRequest("sender is unavailable");
      }

      const totalRecipients = input.to.length + input.cc.length + input.bcc.length;
      if (totalRecipients > 10) {
        return reply.badRequest("max 10 recipients allowed");
      }

      const apiRate = await enforceApiKeyRateLimit(
        actor.apiKeyId,
        actor.rateLimitPerMinute
      );

      if (!apiRate.allowed) {
        return reply.tooManyRequests("rate limit exceeded");
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
          if (missing.length) {
            return reply.badRequest(`missing template variables: ${missing.join(", ")}`);
          }

          subject = subjectRendered.value;
          html = htmlRendered.value;
          text = textRendered ? textRendered.value : undefined;
        }

        if (!text && !html) {
          return reply.badRequest("one of text or html must be provided");
        }

        const senderQuota = await reserveSenderDailyQuota(sender.id, sender.perDayLimit);
        if (!senderQuota.allowed) {
          return reply.tooManyRequests("sender daily limit reached");
        }

        const tenantDaily = await reserveTenantDailyQuota(
          actor.tenantId,
          Math.max(sender.perDayLimit * 2, 5000)
        );
        if (!tenantDaily.allowed) {
          await releaseSenderDailyQuota(sender.id, senderQuota.dayStart);
          return reply.tooManyRequests("daily quota exceeded");
        }

        let message;
        try {
          message = await prisma.message.create({
            data: {
              tenantId: actor.tenantId,
              apiKeyId: actor.apiKeyId,
              smtpAccountId: sender.id,
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
        } catch (error) {
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
          ) {
            await releaseSenderDailyQuota(sender.id, senderQuota.dayStart);
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
          await releaseSenderDailyQuota(sender.id, senderQuota.dayStart);
          throw error;
        }

        let finalStatus: "sent" | "failed" = "sent";
        try {
          await prisma.message.update({
            where: { id: message.id },
            data: { status: "sending", attempts: { increment: 1 } }
          });

          const appPassword = decryptSecret({
            encrypted: sender.encryptedAppPassword,
            iv: sender.iv,
            authTag: sender.authTag,
            keyVersion: sender.keyVersion
          });

          await sendGmailMessage({
            gmailAddress: sender.gmailAddress,
            appPassword,
            fromName: input.fromName,
            to: input.to,
            cc: input.cc,
            bcc: input.bcc,
            subject,
            text: text ?? undefined,
            html: html ?? undefined,
            replyTo: input.replyTo,
            headers: input.headers ?? {}
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
              where: { id: sender.id },
              data: {
                lastSuccessAt: new Date(),
                errorStreak: 0,
                healthScore: {
                  set: Math.min((sender.healthScore ?? 100) + 3, 100)
                }
              }
            })
          ]);
          finalStatus = "sent";
        } catch (error) {
          await releaseSenderDailyQuota(sender.id, senderQuota.dayStart);

          const errorType = classifySendError(error);
          const lastError = (error as Error).message;

          await prisma.$transaction([
            prisma.smtpAccount.update({
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
            }),
            prisma.message.update({
              where: { id: message.id },
              data: {
                status: "failed",
                lastError
              }
            })
          ]);
          request.log.error({ err: error }, "failed to send message");
          finalStatus = "failed";
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
          status: finalStatus
        });
      } catch (error) {
        request.log.error({ err: error }, "failed to send message");
        return reply.internalServerError("failed to send message");
      }
    }
  );
}
