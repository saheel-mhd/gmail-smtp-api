import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { authenticator } from "otplib";
import nodemailer from "nodemailer";
import { z } from "zod";
import {
  createApiKeySchema,
  createSenderSchema,
  patchSenderSchema
} from "@gmail-smtp/shared";
import { prisma } from "../lib/prisma";
import {
  authenticateUserSession,
  enforceCsrf,
  requireRole,
  setSessionCookies
} from "../plugins/security";
import { decryptSecret, encryptSecret } from "../lib/crypto";
import { generateApiKey, hashApiKey } from "../lib/api-key";
import { writeAuditLog } from "../plugins/audit";
import { verifyGmailCredentials } from "../lib/smtp";
import { env } from "../env";
import { getSendQueue } from "../queue";

const mutatingPreHandlers = [
  authenticateUserSession,
  enforceCsrf,
  requireRole("owner", "admin")
] as const;

function getUserContext(request: Parameters<typeof authenticateUserSession>[0]) {
  if (!request.actor || request.actor.actorType !== "user") {
    throw new Error("missing user context");
  }
  return request.actor;
}

export async function adminRoutes(app: FastifyInstance): Promise<void> {
  const testApiSendSchema = z.object({
    apiKeyId: z.string().min(1),
    senderId: z.string().min(1),
    toEmail: z.string().email(),
    subject: z.string().min(1).max(250).optional()
  });

  app.post("/admin/v1/auth/login", async (request, reply) => {
    const body = request.body as {
      tenantName?: string;
      email: string;
      password: string;
      mfaCode?: string;
    };

    if (!body?.email || !body?.password) return reply.badRequest("missing credentials");

    const user = await prisma.user.findFirst({
      where: { email: body.email },
      include: { tenant: true }
    });
    if (!user || user.tenant.status !== "active") {
      return reply.unauthorized("invalid credentials");
    }

    const validPassword = await bcrypt.compare(body.password, user.passwordHash);
    if (!validPassword) return reply.unauthorized("invalid credentials");

    if (user.role === "owner" && user.mfaEnabled) {
      if (!body.mfaCode || !user.mfaSecretEnc || !user.mfaSecretIv || !user.mfaSecretTag) {
        return reply.unauthorized("owner account requires mfa");
      }
      const secret = decryptSecret({
        encrypted: user.mfaSecretEnc,
        iv: user.mfaSecretIv,
        authTag: user.mfaSecretTag,
        keyVersion: env.ENCRYPTION_KEY_VERSION
      });
      const validOtp = authenticator.check(body.mfaCode, secret);
      if (!validOtp) return reply.unauthorized("invalid mfa code");
    }

    const csrfToken = setSessionCookies(request, reply, {
      sub: user.id,
      tenantId: user.tenantId,
      role: user.role
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    await writeAuditLog(request, {
      tenantId: user.tenantId,
      actorType: "user",
      actorId: user.id,
      action: "admin.auth.login"
    });

    return reply.send({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId
      },
      csrfToken
    });
  });

  app.post(
    "/admin/v1/auth/logout",
    { preHandler: [authenticateUserSession, enforceCsrf] },
    async (request, reply) => {
      const user = getUserContext(request);
      reply.clearCookie(env.SESSION_COOKIE_NAME, { path: "/" });
      reply.clearCookie(env.CSRF_COOKIE_NAME, { path: "/" });
      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.auth.logout"
      });
      return reply.send({ ok: true });
    }
  );

  app.get(
    "/admin/v1/me",
    { preHandler: [authenticateUserSession] },
    async (request, reply) => {
      const user = getUserContext(request);
      const row = await prisma.user.findFirst({
        where: { id: user.actorId, tenantId: user.tenantId },
        select: {
          id: true,
          email: true,
          role: true,
          mfaEnabled: true,
          tenant: { select: { id: true, name: true, plan: true, status: true } }
        }
      });
      if (!row) return reply.unauthorized();
      return reply.send({ data: row });
    }
  );

  app.post(
    "/admin/v1/test-api/send",
    { preHandler: [...mutatingPreHandlers] },
    async (request, reply) => {
      const user = getUserContext(request);
      const parsed = testApiSendSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest(parsed.error.message);

      const apiKey = await prisma.apiKey.findFirst({
        where: {
          id: parsed.data.apiKeyId,
          tenantId: user.tenantId,
          status: "active"
        },
        include: {
          permissions: {
            select: { smtpAccountId: true }
          }
        }
      });
      if (!apiKey) return reply.notFound("api key not found");

      const senderAllowed = apiKey.permissions.some(
        (p) => p.smtpAccountId === parsed.data.senderId
      );
      if (!senderAllowed) {
        return reply.badRequest("selected api key cannot use this sender");
      }

      const sender = await prisma.smtpAccount.findFirst({
        where: {
          id: parsed.data.senderId,
          tenantId: user.tenantId,
          status: "active"
        }
      });
      if (!sender) return reply.badRequest("sender unavailable");

      const message = await prisma.message.create({
        data: {
          tenantId: user.tenantId,
          apiKeyId: apiKey.id,
          smtpAccountId: sender.id,
          idempotencyKey: `admin-test-${randomUUID()}`,
          to: [parsed.data.toEmail],
          cc: [],
          bcc: [],
          subject: parsed.data.subject ?? "Test Email from Gmail SMTP API",
          text: `This is a test message for API key '${apiKey.name}' using /v1/send.`,
          html: `<p>This is a test message for API key '<strong>${apiKey.name}</strong>' using <code>/v1/send</code>.</p>`,
          status: "queued"
        },
        select: { id: true, status: true }
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
        request.log.error({ err: error }, "failed to enqueue admin test-api message");
        return reply.code(503).send({
          error: "queue_unavailable",
          message: "Redis queue is unavailable. Start Redis and worker, then retry."
        });
      }

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.test_api.send",
        metadata: {
          testedApi: "POST /v1/send",
          apiKeyId: apiKey.id,
          senderId: sender.id,
          toEmail: parsed.data.toEmail,
          messageId: message.id
        }
      });

      return reply.code(202).send({
        testedApi: "POST /v1/send",
        messageId: message.id,
        status: message.status
      });
    }
  );

  app.get(
    "/admin/v1/senders",
    { preHandler: [authenticateUserSession] },
    async (request, reply) => {
      const user = getUserContext(request);
      const senders = await prisma.smtpAccount.findMany({
        where: { tenantId: user.tenantId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          label: true,
          gmailAddress: true,
          status: true,
          perMinuteLimit: true,
          perDayLimit: true,
          errorStreak: true,
          healthScore: true,
          lastSuccessAt: true,
          lastErrorAt: true,
          createdAt: true
        }
      });
      return reply.send({ data: senders });
    }
  );

  app.post(
    "/admin/v1/senders",
    { preHandler: [...mutatingPreHandlers] },
    async (request, reply) => {
      const user = getUserContext(request);
      const parsed = createSenderSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest(parsed.error.message);

      if (!env.SKIP_SMTP_VERIFY) {
        await verifyGmailCredentials(parsed.data.gmailAddress, parsed.data.appPassword);
      }
      const encrypted = encryptSecret(parsed.data.appPassword);

      const sender = await prisma.smtpAccount.create({
        data: {
          tenantId: user.tenantId,
          label: parsed.data.label,
          gmailAddress: parsed.data.gmailAddress,
          encryptedAppPassword: encrypted.encrypted,
          iv: encrypted.iv,
          authTag: encrypted.authTag,
          keyVersion: encrypted.keyVersion,
          perMinuteLimit: parsed.data.perMinuteLimit ?? env.DEFAULT_PER_MINUTE_LIMIT,
          perDayLimit: parsed.data.perDayLimit ?? env.DEFAULT_PER_DAY_LIMIT
        },
        select: {
          id: true,
          label: true,
          gmailAddress: true,
          status: true,
          perMinuteLimit: true,
          perDayLimit: true
        }
      });

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.sender.create",
        metadata: { senderId: sender.id, gmailAddress: sender.gmailAddress }
      });

      return reply.code(201).send({ data: sender });
    }
  );

  app.patch(
    "/admin/v1/senders/:id",
    { preHandler: [...mutatingPreHandlers] },
    async (request, reply) => {
      const user = getUserContext(request);
      const params = request.params as { id: string };
      const parsed = patchSenderSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest(parsed.error.message);

      const sender = await prisma.smtpAccount.updateMany({
        where: { id: params.id, tenantId: user.tenantId },
        data: parsed.data
      });
      if (!sender.count) return reply.notFound("sender not found");

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.sender.update",
        metadata: { senderId: params.id, fields: Object.keys(parsed.data) }
      });

      return reply.send({ ok: true });
    }
  );

  app.delete(
    "/admin/v1/senders/:id",
    { preHandler: [...mutatingPreHandlers] },
    async (request, reply) => {
      const user = getUserContext(request);
      const params = request.params as { id: string };
      const updated = await prisma.smtpAccount.updateMany({
        where: { id: params.id, tenantId: user.tenantId },
        data: { status: "disabled" }
      });
      if (!updated.count) return reply.notFound("sender not found");

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.sender.disable",
        metadata: { senderId: params.id }
      });

      return reply.send({ ok: true });
    }
  );

  app.post(
    "/admin/v1/senders/:id/test",
    { preHandler: [...mutatingPreHandlers] },
    async (request, reply) => {
      const user = getUserContext(request);
      const params = request.params as { id: string };
      const body = request.body as { to: string };
      if (!body?.to) return reply.badRequest("missing to");

      const sender = await prisma.smtpAccount.findFirst({
        where: { id: params.id, tenantId: user.tenantId }
      });
      if (!sender) return reply.notFound("sender not found");
      if (sender.status !== "active") return reply.badRequest("sender not active");

      if (!env.SKIP_SMTP_VERIFY) {
        const appPassword = decryptSecret({
          encrypted: sender.encryptedAppPassword,
          iv: sender.iv,
          authTag: sender.authTag,
          keyVersion: sender.keyVersion
        });
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: { user: sender.gmailAddress, pass: appPassword }
        });

        await transporter.sendMail({
          from: sender.gmailAddress,
          to: body.to,
          subject: "Gmail SMTP API test",
          text: "Sender verification test successful."
        });
      }

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.sender.test_send",
        metadata: { senderId: sender.id, to: body.to }
      });

      return reply.send({ ok: true });
    }
  );

  app.get(
    "/admin/v1/api-keys",
    { preHandler: [authenticateUserSession] },
    async (request, reply) => {
      const user = getUserContext(request);
      const keys = await prisma.apiKey.findMany({
        where: { tenantId: user.tenantId },
        include: {
          permissions: {
            select: { smtpAccountId: true }
          }
        },
        orderBy: { createdAt: "desc" }
      });
      return reply.send({
        data: keys.map((key) => ({
          id: key.id,
          name: key.name,
          prefix: key.prefix,
          status: key.status,
          createdAt: key.createdAt,
          revokedAt: key.revokedAt,
          rateLimitPerMinute: key.rateLimitPerMinute,
          allowedIps: key.allowedIps,
          smtpAccountIds: key.permissions.map((p) => p.smtpAccountId)
        }))
      });
    }
  );

  app.post(
    "/admin/v1/api-keys",
    { preHandler: [...mutatingPreHandlers] },
    async (request, reply) => {
      const user = getUserContext(request);
      const parsed = createApiKeySchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest(parsed.error.message);

      const senders = await prisma.smtpAccount.findMany({
        where: {
          tenantId: user.tenantId,
          id: { in: parsed.data.smtpAccountIds }
        },
        select: { id: true }
      });
      if (senders.length !== parsed.data.smtpAccountIds.length) {
        return reply.badRequest("one or more sender ids are invalid");
      }

      const generated = generateApiKey();
      const keyHash = await hashApiKey(generated.token);

      const apiKey = await prisma.apiKey.create({
        data: {
          tenantId: user.tenantId,
          name: parsed.data.name,
          keyHash,
          prefix: generated.prefix,
          status: "active",
          rateLimitPerMinute: parsed.data.rateLimitPerMinute ?? env.DEFAULT_API_KEY_RATE_LIMIT,
          allowedIps: parsed.data.allowedIps,
          permissions: {
            createMany: {
              data: parsed.data.smtpAccountIds.map((id) => ({
                smtpAccountId: id
              }))
            }
          }
        }
      });

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.api_key.create",
        metadata: { apiKeyId: apiKey.id, permissions: parsed.data.smtpAccountIds }
      });

      return reply.code(201).send({
        data: {
          id: apiKey.id,
          name: apiKey.name,
          prefix: apiKey.prefix,
          rateLimitPerMinute: apiKey.rateLimitPerMinute,
          status: apiKey.status,
          key: generated.token
        }
      });
    }
  );

  app.post(
    "/admin/v1/api-keys/:id/rotate",
    { preHandler: [...mutatingPreHandlers] },
    async (request, reply) => {
      const user = getUserContext(request);
      const params = request.params as { id: string };
      const existing = await prisma.apiKey.findFirst({
        where: { id: params.id, tenantId: user.tenantId, status: "active" }
      });
      if (!existing) return reply.notFound("api key not found");

      const generated = generateApiKey();
      const keyHash = await hashApiKey(generated.token);
      await prisma.apiKey.update({
        where: { id: existing.id },
        data: { keyHash, prefix: generated.prefix }
      });

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.api_key.rotate",
        metadata: { apiKeyId: existing.id }
      });

      return reply.send({
        data: {
          id: existing.id,
          key: generated.token,
          prefix: generated.prefix
        }
      });
    }
  );

  app.delete(
    "/admin/v1/api-keys/:id",
    { preHandler: [...mutatingPreHandlers] },
    async (request, reply) => {
      const user = getUserContext(request);
      const params = request.params as { id: string };

      const updated = await prisma.apiKey.updateMany({
        where: { id: params.id, tenantId: user.tenantId, status: "active" },
        data: { status: "revoked", revokedAt: new Date() }
      });
      if (!updated.count) return reply.notFound("api key not found");

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.api_key.revoke",
        metadata: { apiKeyId: params.id }
      });

      return reply.send({ ok: true });
    }
  );

  app.get(
    "/admin/v1/logs",
    { preHandler: [authenticateUserSession] },
    async (request, reply) => {
      const user = getUserContext(request);
      const query = request.query as { limit?: string };
      const limit = Math.min(Number(query.limit ?? 50), 200);
      const logs = await prisma.auditLog.findMany({
        where: { tenantId: user.tenantId },
        orderBy: { createdAt: "desc" },
        take: limit
      });
      return reply.send({ data: logs });
    }
  );
}
