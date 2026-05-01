import { FastifyInstance } from "fastify";
import { Prisma } from "../../generated/prisma/client";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { promises as dns } from "node:dns";
import bcrypt from "bcryptjs";
import { authenticator } from "otplib";
import nodemailer from "nodemailer";
import { z } from "zod";
import { redis } from "../lib/redis";
import {
  sendPasswordChangedNotification,
  sendRegistrationOtp,
  sendSystemMail,
  sendWelcomeEmail
} from "../lib/system-mail";
import {
  campaignRecipientsSchema,
  createApiKeySchema,
  createCampaignSchema,
  createSenderSchema,
  createTemplateSchema,
  patchSenderSchema,
  patchTemplateSchema
} from "@gmail-smtp/shared";
import { prisma } from "../lib/prisma";
import { authenticateUserSession, enforceCsrf, requireRole, setSessionCookies } from "../plugins/security";
import { decryptSecret, encryptSecret } from "../lib/crypto";
import { generateApiKey, hashApiKey } from "../lib/api-key";
import { writeAuditLog } from "../plugins/audit";
import { createGmailTransport, verifyGmailCredentials } from "../lib/smtp";
import { extractTemplateVariables, renderTemplate } from "../lib/template";
import { assertSafeHeaders } from "../lib/validation";
import { env } from "../env";
import { getCampaignQueue, getSendQueue } from "../queue";

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

const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
const ATTACHMENT_UPLOAD_BODY_LIMIT = 8 * 1024 * 1024;

export async function adminRoutes(app: FastifyInstance): Promise<void> {
  const testApiSendSchema = z.object({
    apiKeyId: z.string().min(1),
    toEmail: z.string().email(),
    subject: z.string().min(1).max(250).optional(),
    templateName: z.string().min(1).max(80).optional()
  });
  const attachmentUploadSchema = z.object({
    filename: z.string().min(1).max(255),
    contentType: z.string().min(1).max(255),
    data: z.string().min(1)
  });
  const companySchema = z.object({
    name: z.string().min(1).max(120),
    service: z.string().min(1).max(120),
    phone: z.string().min(3).max(40),
    email: z.string().email().max(160),
    address: z.string().min(3).max(240),
    website: z.string().max(200).optional(),
    industry: z.string().max(80).optional(),
    companySize: z.string().max(40).optional(),
    country: z.string().max(80).optional(),
    timezone: z.string().max(80).optional(),
    logoUrl: z.string().max(500).optional(),
    about: z.string().max(2000).optional()
  });
  const blockedCompanyDomains = new Set(["gmail.com", "yahoo.com", "yahoo.co.uk", "yahoo.in"]);
  const isBlockedCompanyEmail = (email: string) => {
    const domain = email.split("@")[1]?.toLowerCase();
    return domain ? blockedCompanyDomains.has(domain) : false;
  };
  const domainSchema = z.object({
    domain: z
      .string()
      .min(3)
      .max(255)
      .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    smtpHost: z.string().min(3).max(255).optional(),
    smtpPort: z.number().int().min(1).max(65535).optional(),
    smtpSecure: z.boolean().optional()
  });
  const patchDomainSchema = z.object({
    smtpHost: z.string().min(3).max(255),
    smtpPort: z.number().int().min(1).max(65535),
    smtpSecure: z.boolean()
  });
  const createCampaignBulkSchema = createCampaignSchema.and(
    z.object({
      recipients: campaignRecipientsSchema.shape.recipients,
      start: z.boolean().optional()
    })
  );

  const normalizeTxt = (rows: string[][]) =>
    rows.map((parts) => parts.join("")).map((value) => value.trim());

  async function resolveTxt(host: string) {
    try {
      return normalizeTxt(await dns.resolveTxt(host));
    } catch {
      return [];
    }
  }

  async function resolveCname(host: string) {
    try {
      return (await dns.resolveCname(host)).map((value) => value.toLowerCase());
    } catch {
      return [];
    }
  }

  async function resolveMx(host: string) {
    try {
      return (await dns.resolveMx(host)).map((row) => ({
        exchange: row.exchange.toLowerCase(),
        priority: row.priority
      }));
    } catch {
      return [];
    }
  }
  const registerSchema = z.object({
    tenantName: z.string().min(2).max(120),
    email: z.string().email(),
    password: z.string().min(8).max(128)
  });

  async function resolveCampaignSender({
    tenantId,
    userId,
    senderType,
    senderId
  }: {
    tenantId: string;
    userId: string;
    senderType: "gmail" | "domain";
    senderId: string;
  }) {
    if (senderType === "gmail") {
      const sender = await prisma.smtpAccount.findFirst({
        where: { id: senderId, tenantId, status: "active" },
        select: { id: true, label: true, gmailAddress: true }
      });
      if (!sender) return null;
      return {
        senderType,
        smtpAccountId: sender.id,
        domainSenderId: null,
        senderLabel: sender.label,
        senderEmail: sender.gmailAddress
      };
    }

    const sender = await prisma.domainSender.findFirst({
      where: {
        id: senderId,
        tenantId,
        status: "active",
        domain: { userId }
      },
      select: { id: true, label: true, emailAddress: true }
    });
    if (!sender) return null;
    return {
      senderType,
      smtpAccountId: null,
      domainSenderId: sender.id,
      senderLabel: sender.label,
      senderEmail: sender.emailAddress
    };
  }

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

  app.post("/admin/v1/auth/register", async (request, reply) => {
    const body = registerSchema.safeParse(request.body);
    if (!body.success) {
      return reply.badRequest("invalid registration payload");
    }

    const existing = await prisma.user.findFirst({
      where: { email: body.data.email }
    });
    if (existing) {
      return reply.conflict("user already exists");
    }

    const passwordHash = await bcrypt.hash(body.data.password, 12);
    const tenant = await prisma.tenant.create({
      data: {
        name: body.data.tenantName.trim(),
        users: {
          create: {
            email: body.data.email,
            passwordHash,
            role: "owner"
          }
        }
      },
      include: { users: true }
    });

    const user = tenant.users[0];
    const csrfToken = setSessionCookies(request, reply, {
      sub: user.id,
      tenantId: tenant.id,
      role: user.role
    });

    await writeAuditLog(request, {
      tenantId: tenant.id,
      actorType: "user",
      actorId: user.id,
      action: "admin.auth.register"
    });

    return reply.send({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: tenant.id
      },
      csrfToken
    });
  });

  // ---------- Email-verified registration (2-step) ----------

  const REGISTER_OTP_TTL_SECONDS = 600; // 10 min
  const REGISTER_OTP_MAX_ATTEMPTS = 5;
  const REGISTER_RATE_PER_MIN = 1;
  const REGISTER_RATE_PER_HOUR = 10;

  const registerStartSchema = registerSchema; // same shape: tenantName, email, password
  const registerVerifySchema = z.object({
    email: z.string().email().max(160),
    otp: z.string().regex(/^\d{6}$/, "code must be 6 digits")
  });

  type PendingRegistration = {
    tenantName: string;
    email: string;
    passwordHash: string;
    otp: string;
    attempts: number;
  };

  function registerKey(email: string) {
    return `register:pending:${email}`;
  }

  app.post("/admin/v1/auth/register/start", async (request, reply) => {
    const parsed = registerStartSchema.safeParse(request.body);
    if (!parsed.success) return reply.badRequest("invalid registration payload");

    const email = parsed.data.email.toLowerCase().trim();
    const tenantName = parsed.data.tenantName.trim();

    // Reject if a real account already exists.
    const existing = await prisma.user.findFirst({ where: { email } });
    if (existing) return reply.conflict("an account with this email already exists");

    // Rate limit per email.
    try {
      const minuteKey = `register:rate:min:${email}`;
      const hourKey = `register:rate:hour:${email}`;
      const minuteCount = await redis.incr(minuteKey);
      if (minuteCount === 1) await redis.expire(minuteKey, 60);
      const hourCount = await redis.incr(hourKey);
      if (hourCount === 1) await redis.expire(hourKey, 3600);
      if (minuteCount > REGISTER_RATE_PER_MIN) {
        return reply.tooManyRequests("please wait a minute before requesting another code");
      }
      if (hourCount > REGISTER_RATE_PER_HOUR) {
        return reply.tooManyRequests("too many requests for this email — try again later");
      }
    } catch (err) {
      request.log.warn({ err }, "register start: rate limit redis error");
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);

    const payload: PendingRegistration = {
      tenantName,
      email,
      passwordHash,
      otp,
      attempts: 0
    };

    await redis.set(registerKey(email), JSON.stringify(payload), "EX", REGISTER_OTP_TTL_SECONDS);

    // Fire-and-forget — don't block the HTTP response on SMTP delivery.
    // Errors are logged via system-mail's own logger; user can hit "Resend code" if it doesn't arrive.
    void sendRegistrationOtp({
      to: email,
      otp,
      tenantName,
      ttlMinutes: Math.floor(REGISTER_OTP_TTL_SECONDS / 60)
    }).then((sendResult) => {
      request.log.info(
        { email, delivered: sendResult.delivered, reason: sendResult.reason },
        "register start: verification code dispatch result"
      );
    });

    return reply.send({
      ok: true,
      email,
      expiresInSeconds: REGISTER_OTP_TTL_SECONDS,
      maxAttempts: REGISTER_OTP_MAX_ATTEMPTS
    });
  });

  app.post("/admin/v1/auth/register/verify", async (request, reply) => {
    const parsed = registerVerifySchema.safeParse(request.body);
    if (!parsed.success) return reply.badRequest("invalid email or code");

    const email = parsed.data.email.toLowerCase().trim();
    const key = registerKey(email);
    const raw = await redis.get(key);
    if (!raw) {
      return reply.badRequest("verification expired — please request a new code");
    }

    let pending: PendingRegistration;
    try {
      pending = JSON.parse(raw) as PendingRegistration;
    } catch {
      await redis.del(key);
      return reply.badRequest("verification expired — please request a new code");
    }

    if (pending.attempts >= REGISTER_OTP_MAX_ATTEMPTS) {
      await redis.del(key);
      return reply.badRequest("too many incorrect attempts — please request a new code");
    }

    if (pending.otp !== parsed.data.otp) {
      pending.attempts += 1;
      const ttl = await redis.ttl(key);
      await redis.set(key, JSON.stringify(pending), "EX", Math.max(ttl, 1));
      const remaining = REGISTER_OTP_MAX_ATTEMPTS - pending.attempts;
      return reply.badRequest(
        remaining > 0
          ? `incorrect code — ${remaining} attempt${remaining === 1 ? "" : "s"} left`
          : "incorrect code — please request a new code"
      );
    }

    // Race-condition guard: someone else may have grabbed this email during the OTP window.
    const collision = await prisma.user.findFirst({ where: { email } });
    if (collision) {
      await redis.del(key);
      return reply.conflict("an account with this email already exists");
    }

    const tenant = await prisma.tenant.create({
      data: {
        name: pending.tenantName,
        users: {
          create: {
            email: pending.email,
            passwordHash: pending.passwordHash,
            role: "owner"
          }
        }
      },
      include: { users: true }
    });

    const user = tenant.users[0];
    const csrfToken = setSessionCookies(request, reply, {
      sub: user.id,
      tenantId: tenant.id,
      role: user.role
    });

    await redis.del(key);

    await writeAuditLog(request, {
      tenantId: tenant.id,
      actorType: "user",
      actorId: user.id,
      action: "admin.auth.register_verified"
    });

    // Fire-and-forget welcome email — never block sign-in on it.
    void sendWelcomeEmail({
      to: user.email,
      tenantName: tenant.name
    });

    return reply.send({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: tenant.id
      },
      csrfToken
    });
  });

  app.post(
    "/admin/v1/auth/logout",
    { preHandler: [authenticateUserSession, enforceCsrf] },
    async (request, reply) => {
      const user = getUserContext(request);
      const sameSite = env.NODE_ENV === "production" ? "none" : "lax";
      const cookieDomain = env.APP_COOKIE_DOMAIN?.trim();
      const cookieOptions = {
        path: "/",
        sameSite,
        secure: env.NODE_ENV === "production",
        ...(cookieDomain ? { domain: cookieDomain } : {})
      } as const;
      reply.clearCookie(env.SESSION_COOKIE_NAME, cookieOptions);
      reply.clearCookie(env.CSRF_COOKIE_NAME, cookieOptions);
      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.auth.logout"
      });
      return reply.send({ ok: true });
    }
  );

  // ---------- Password reset ----------

  const forgotPasswordSchema = z.object({
    email: z.string().email().max(160)
  });
  const resetPasswordWithTokenSchema = z.object({
    token: z.string().min(20).max(200),
    newPassword: z.string().min(8).max(128)
  });

  const PASSWORD_RESET_TTL_MIN = 30;
  const RESET_RATE_LIMIT_PER_MIN = 1;
  const RESET_RATE_LIMIT_PER_HOUR = 5;

  function hashToken(raw: string): string {
    return createHash("sha256").update(raw).digest("hex");
  }

  app.post("/admin/v1/auth/forgot-password", async (request, reply) => {
    const parsed = forgotPasswordSchema.safeParse(request.body);
    // Always behave as if accepted, even on bad input — prevents enumeration timing.
    if (!parsed.success) {
      request.log.info("password reset: invalid email payload");
      return reply.send({ ok: true });
    }
    const email = parsed.data.email.toLowerCase().trim();
    request.log.info({ email }, "password reset: request received");

    // Rate limit by email — Redis counters with TTL.
    try {
      const minuteKey = `pwreset:min:${email}`;
      const hourKey = `pwreset:hour:${email}`;
      const minuteCount = await redis.incr(minuteKey);
      if (minuteCount === 1) await redis.expire(minuteKey, 60);
      const hourCount = await redis.incr(hourKey);
      if (hourCount === 1) await redis.expire(hourKey, 3600);
      if (minuteCount > RESET_RATE_LIMIT_PER_MIN || hourCount > RESET_RATE_LIMIT_PER_HOUR) {
        request.log.warn({ email, minuteCount, hourCount }, "password reset: rate-limited");
        // Silently no-op so attackers can't probe rate-limit state.
        return reply.send({ ok: true });
      }
    } catch (err) {
      request.log.warn({ err }, "password reset rate limit redis error");
    }

    const user = await prisma.user.findFirst({
      where: { email },
      select: { id: true, email: true, tenantId: true }
    });

    if (!user) {
      request.log.info({ email }, "password reset: no user with this email — silently noop");
    }

    if (user) {
      request.log.info({ userId: user.id, email }, "password reset: user found, sending email");
      // Invalidate any prior unused tokens for this user.
      await prisma.passwordResetToken.deleteMany({
        where: { userId: user.id, usedAt: null }
      });

      const rawToken = randomBytes(32).toString("base64url");
      const tokenHash = hashToken(rawToken);
      const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MIN * 60_000);

      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
          requestIp: request.ip ?? null
        }
      });

      const resetUrl = `${env.APP_BASE_URL.replace(/\/$/, "")}/reset-password?token=${rawToken}`;

      // Fire-and-forget — don't block the HTTP response on SMTP delivery.
      const sendPromise = sendSystemMail({
        to: user.email,
        subject: "Reset your Mailler password",
        text: [
          "Hi,",
          "",
          "We received a request to reset the password for your Mailler account.",
          "Click the link below to set a new password. This link expires in 30 minutes and can only be used once.",
          "",
          resetUrl,
          "",
          "If you didn't request this, you can safely ignore this email — your password will stay the same.",
          "",
          "— Mailler"
        ].join("\n"),
        html: `
          <div style="font-family:Inter,Segoe UI,Arial,sans-serif;background:#f5f7fb;padding:32px 16px;color:#0e1726">
            <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #e2e8f1;border-radius:18px;padding:28px;box-shadow:0 14px 32px rgba(15,23,42,.08)">
              <h1 style="margin:0 0 8px;font-size:20px">Reset your password</h1>
              <p style="color:#5a6577;margin:0 0 20px;font-size:14px;line-height:1.55">
                We received a request to reset the password for your Mailler account.
                The link below expires in <strong>30 minutes</strong> and can only be used once.
              </p>
              <p style="margin:24px 0">
                <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#0a7f51,#14b882);color:#fff;font-weight:600;padding:11px 20px;border-radius:10px;text-decoration:none;font-size:14px">
                  Reset password
                </a>
              </p>
              <p style="color:#5a6577;margin:0;font-size:12px;line-height:1.55">
                If the button doesn't work, copy and paste this URL into your browser:<br>
                <span style="font-family:ui-monospace,SFMono-Regular,monospace;color:#055f3c;word-break:break-all">${resetUrl}</span>
              </p>
              <hr style="border:0;border-top:1px solid #ecf0f7;margin:24px 0">
              <p style="color:#94a3b8;margin:0;font-size:12px">
                If you didn't request this, you can safely ignore this email — your password will stay the same.
              </p>
            </div>
          </div>
        `
      });

      void sendPromise.then((sendResult) => {
        request.log.info(
          { email, delivered: sendResult.delivered, reason: sendResult.reason },
          "password reset: send attempt complete"
        );
      });

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "system",
        actorId: user.id,
        action: "admin.auth.password_reset_request"
      });
    }

    // Always return generic success — never leak whether the email exists.
    return reply.send({ ok: true });
  });

  app.post("/admin/v1/auth/reset-password", async (request, reply) => {
    const parsed = resetPasswordWithTokenSchema.safeParse(request.body);
    if (!parsed.success) return reply.badRequest("invalid token or password");

    const tokenHash = hashToken(parsed.data.token);
    const record = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        userId: true,
        usedAt: true,
        expiresAt: true,
        user: { select: { id: true, tenantId: true, email: true } }
      }
    });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      return reply.badRequest("token is invalid or has expired");
    }

    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash }
      }),
      prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() }
      }),
      // Invalidate any other unused tokens for this user.
      prisma.passwordResetToken.deleteMany({
        where: { userId: record.userId, id: { not: record.id }, usedAt: null }
      })
    ]);

    await writeAuditLog(request, {
      tenantId: record.user.tenantId,
      actorType: "system",
      actorId: record.userId,
      action: "admin.auth.password_reset_complete",
      metadata: { ip: request.ip, userAgent: request.headers["user-agent"] ?? null }
    });

    void sendPasswordChangedNotification({
      to: record.user.email,
      method: "via the reset link",
      ip: request.ip ?? null,
      userAgent: (request.headers["user-agent"] as string) ?? null
    });

    return reply.send({ ok: true });
  });

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
          lastLogin: true,
          createdAt: true,
          tenant: { select: { id: true, name: true, plan: true, status: true, createdAt: true } }
        }
      });
      if (!row) return reply.unauthorized();
      return reply.send({ data: row });
    }
  );

  const passwordChangeSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).max(128)
  });

  app.post(
    "/admin/v1/account/password",
    { preHandler: [authenticateUserSession, enforceCsrf] },
    async (request, reply) => {
      const user = getUserContext(request);
      const parsed = passwordChangeSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest(parsed.error.message);
      if (parsed.data.currentPassword === parsed.data.newPassword) {
        return reply.badRequest("new password must differ from current");
      }

      const userRow = await prisma.user.findUnique({
        where: { id: user.actorId },
        select: { passwordHash: true, email: true }
      });
      if (!userRow) return reply.unauthorized();

      const valid = await bcrypt.compare(parsed.data.currentPassword, userRow.passwordHash);
      if (!valid) return reply.unauthorized("current password incorrect");

      const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
      await prisma.user.update({
        where: { id: user.actorId },
        data: { passwordHash }
      });

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.account.password_change",
        metadata: { ip: request.ip, userAgent: request.headers["user-agent"] ?? null }
      });

      // Fire-and-forget notification — don't block the response on email delivery.
      void sendPasswordChangedNotification({
        to: userRow.email,
        method: "from your account settings",
        ip: request.ip ?? null,
        userAgent: (request.headers["user-agent"] as string) ?? null
      });

      return reply.send({ ok: true });
    }
  );

  app.post(
    "/admin/v1/account/mfa/init",
    { preHandler: [authenticateUserSession, enforceCsrf] },
    async (request, reply) => {
      const user = getUserContext(request);
      const userRow = await prisma.user.findUnique({
        where: { id: user.actorId },
        select: { email: true, mfaEnabled: true }
      });
      if (!userRow) return reply.unauthorized();
      if (userRow.mfaEnabled) return reply.badRequest("mfa already enabled");

      const secret = authenticator.generateSecret();
      const encrypted = encryptSecret(secret);

      await prisma.user.update({
        where: { id: user.actorId },
        data: {
          mfaSecretEnc: encrypted.encrypted,
          mfaSecretIv: encrypted.iv,
          mfaSecretTag: encrypted.authTag,
          mfaEnabled: false
        }
      });

      const otpauthUri = authenticator.keyuri(userRow.email, "Mailler", secret);
      return reply.send({ data: { secret, otpauthUri } });
    }
  );

  const mfaCodeSchema = z.object({
    code: z.string().regex(/^\d{6,8}$/, "code must be 6-8 digits")
  });

  app.post(
    "/admin/v1/account/mfa/enable",
    { preHandler: [authenticateUserSession, enforceCsrf] },
    async (request, reply) => {
      const user = getUserContext(request);
      const parsed = mfaCodeSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest(parsed.error.message);

      const userRow = await prisma.user.findUnique({
        where: { id: user.actorId },
        select: {
          mfaEnabled: true,
          mfaSecretEnc: true,
          mfaSecretIv: true,
          mfaSecretTag: true
        }
      });
      if (!userRow) return reply.unauthorized();
      if (userRow.mfaEnabled) return reply.badRequest("mfa already enabled");
      if (!userRow.mfaSecretEnc || !userRow.mfaSecretIv || !userRow.mfaSecretTag) {
        return reply.badRequest("mfa not initialized — call /mfa/init first");
      }

      const secret = decryptSecret({
        encrypted: userRow.mfaSecretEnc,
        iv: userRow.mfaSecretIv,
        authTag: userRow.mfaSecretTag,
        keyVersion: env.ENCRYPTION_KEY_VERSION
      });
      const valid = authenticator.check(parsed.data.code, secret);
      if (!valid) return reply.badRequest("invalid code");

      await prisma.user.update({
        where: { id: user.actorId },
        data: { mfaEnabled: true }
      });

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.account.mfa_enable"
      });
      return reply.send({ ok: true });
    }
  );

  const mfaDisableSchema = z.object({
    currentPassword: z.string().min(1),
    code: z.string().regex(/^\d{6,8}$/, "code must be 6-8 digits")
  });

  app.post(
    "/admin/v1/account/mfa/disable",
    { preHandler: [authenticateUserSession, enforceCsrf] },
    async (request, reply) => {
      const user = getUserContext(request);
      const parsed = mfaDisableSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest(parsed.error.message);

      const userRow = await prisma.user.findUnique({
        where: { id: user.actorId },
        select: {
          passwordHash: true,
          mfaEnabled: true,
          mfaSecretEnc: true,
          mfaSecretIv: true,
          mfaSecretTag: true
        }
      });
      if (!userRow) return reply.unauthorized();
      if (!userRow.mfaEnabled) return reply.badRequest("mfa not enabled");
      if (!userRow.mfaSecretEnc || !userRow.mfaSecretIv || !userRow.mfaSecretTag) {
        return reply.badRequest("mfa state missing — contact support");
      }

      const validPw = await bcrypt.compare(parsed.data.currentPassword, userRow.passwordHash);
      if (!validPw) return reply.unauthorized("current password incorrect");

      const secret = decryptSecret({
        encrypted: userRow.mfaSecretEnc,
        iv: userRow.mfaSecretIv,
        authTag: userRow.mfaSecretTag,
        keyVersion: env.ENCRYPTION_KEY_VERSION
      });
      const validOtp = authenticator.check(parsed.data.code, secret);
      if (!validOtp) return reply.unauthorized("invalid mfa code");

      await prisma.user.update({
        where: { id: user.actorId },
        data: {
          mfaEnabled: false,
          mfaSecretEnc: null,
          mfaSecretIv: null,
          mfaSecretTag: null
        }
      });

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.account.mfa_disable"
      });
      return reply.send({ ok: true });
    }
  );

  // ---------- Members management ----------

  const memberRoleSchema = z.enum(["owner", "admin", "readonly"]);
  const createMemberSchema = z.object({
    email: z.string().email().max(160),
    password: z.string().min(8).max(128),
    role: memberRoleSchema
  });
  const patchMemberRoleSchema = z.object({ role: memberRoleSchema });
  const resetPasswordSchema = z.object({ newPassword: z.string().min(8).max(128) });

  app.get(
    "/admin/v1/members",
    { preHandler: [authenticateUserSession] },
    async (request, reply) => {
      const user = getUserContext(request);
      const members = await prisma.user.findMany({
        where: { tenantId: user.tenantId },
        select: {
          id: true,
          email: true,
          role: true,
          mfaEnabled: true,
          lastLogin: true,
          createdAt: true
        },
        orderBy: [{ role: "asc" }, { createdAt: "asc" }]
      });
      return reply.send({ data: members });
    }
  );

  app.post(
    "/admin/v1/members",
    { preHandler: [authenticateUserSession, enforceCsrf, requireRole("owner", "admin")] },
    async (request, reply) => {
      const user = getUserContext(request);
      const parsed = createMemberSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest(parsed.error.message);

      // Admins can't promote to owner
      if (user.role === "admin" && parsed.data.role === "owner") {
        return reply.forbidden("admins cannot create owners");
      }

      const email = parsed.data.email.toLowerCase().trim();
      const existing = await prisma.user.findFirst({
        where: { tenantId: user.tenantId, email }
      });
      if (existing) return reply.badRequest("user with this email already exists");

      const passwordHash = await bcrypt.hash(parsed.data.password, 12);
      const created = await prisma.user.create({
        data: {
          tenantId: user.tenantId,
          email,
          passwordHash,
          role: parsed.data.role
        },
        select: {
          id: true,
          email: true,
          role: true,
          mfaEnabled: true,
          lastLogin: true,
          createdAt: true
        }
      });

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.members.create",
        metadata: { memberId: created.id, role: created.role }
      });
      return reply.send({ data: created });
    }
  );

  app.patch(
    "/admin/v1/members/:id/role",
    { preHandler: [authenticateUserSession, enforceCsrf, requireRole("owner")] },
    async (request, reply) => {
      const user = getUserContext(request);
      const { id } = request.params as { id: string };
      const parsed = patchMemberRoleSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest(parsed.error.message);

      const target = await prisma.user.findFirst({
        where: { id, tenantId: user.tenantId },
        select: { id: true, role: true }
      });
      if (!target) return reply.notFound("member not found");

      // Don't let an owner demote themselves if they're the last owner
      if (target.id === user.actorId && target.role === "owner" && parsed.data.role !== "owner") {
        const ownerCount = await prisma.user.count({
          where: { tenantId: user.tenantId, role: "owner" }
        });
        if (ownerCount <= 1) {
          return reply.badRequest("cannot demote the last owner — promote another member first");
        }
      }

      const updated = await prisma.user.update({
        where: { id },
        data: { role: parsed.data.role },
        select: {
          id: true,
          email: true,
          role: true,
          mfaEnabled: true,
          lastLogin: true,
          createdAt: true
        }
      });

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.members.role_change",
        metadata: { memberId: id, previousRole: target.role, newRole: parsed.data.role }
      });
      return reply.send({ data: updated });
    }
  );

  app.post(
    "/admin/v1/members/:id/reset-password",
    { preHandler: [authenticateUserSession, enforceCsrf, requireRole("owner")] },
    async (request, reply) => {
      const user = getUserContext(request);
      const { id } = request.params as { id: string };
      const parsed = resetPasswordSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest(parsed.error.message);

      const target = await prisma.user.findFirst({
        where: { id, tenantId: user.tenantId },
        select: { id: true, email: true }
      });
      if (!target) return reply.notFound("member not found");

      const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
      await prisma.user.update({
        where: { id },
        data: { passwordHash }
      });

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.members.password_reset",
        metadata: { memberId: id, ip: request.ip, userAgent: request.headers["user-agent"] ?? null }
      });

      void sendPasswordChangedNotification({
        to: target.email,
        method: "by an owner of your tenant",
        ip: request.ip ?? null,
        userAgent: (request.headers["user-agent"] as string) ?? null
      });

      return reply.send({ ok: true });
    }
  );

  app.delete(
    "/admin/v1/members/:id",
    { preHandler: [authenticateUserSession, enforceCsrf, requireRole("owner", "admin")] },
    async (request, reply) => {
      const user = getUserContext(request);
      const { id } = request.params as { id: string };

      if (id === user.actorId) {
        return reply.badRequest("you cannot remove yourself — ask another owner");
      }

      const target = await prisma.user.findFirst({
        where: { id, tenantId: user.tenantId },
        select: { id: true, role: true, email: true }
      });
      if (!target) return reply.notFound("member not found");

      // Admins cannot remove owners or other admins
      if (user.role === "admin" && (target.role === "owner" || target.role === "admin")) {
        return reply.forbidden("admins can only remove readonly members");
      }

      // Prevent deleting the last owner
      if (target.role === "owner") {
        const ownerCount = await prisma.user.count({
          where: { tenantId: user.tenantId, role: "owner" }
        });
        if (ownerCount <= 1) {
          return reply.badRequest("cannot remove the last owner — promote another member first");
        }
      }

      await prisma.user.delete({ where: { id } });

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.members.delete",
        metadata: { memberId: id, role: target.role, email: target.email }
      });
      return reply.send({ ok: true });
    }
  );

  app.get(
    "/admin/v1/company",
    { preHandler: [authenticateUserSession] },
    async (request, reply) => {
      const user = getUserContext(request);
      const company = await prisma.company.findFirst({
        where: { tenantId: user.tenantId, userId: user.actorId }
      });
      return reply.send({ data: company ?? null });
    }
  );

  app.post(
    "/admin/v1/company",
    { preHandler: [...mutatingPreHandlers] },
    async (request, reply) => {
      const user = getUserContext(request);
      const parsed = companySchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest(parsed.error.message);
      if (isBlockedCompanyEmail(parsed.data.email)) {
        return reply.badRequest("company email only");
      }

      const optional = (value: string | undefined) => (value?.trim() ? value.trim() : null);
      const fields = {
        name: parsed.data.name,
        service: parsed.data.service,
        phone: parsed.data.phone,
        email: parsed.data.email,
        address: parsed.data.address,
        website: optional(parsed.data.website),
        industry: optional(parsed.data.industry),
        companySize: optional(parsed.data.companySize),
        country: optional(parsed.data.country),
        timezone: optional(parsed.data.timezone),
        logoUrl: optional(parsed.data.logoUrl),
        about: optional(parsed.data.about)
      };

      const company = await prisma.company.upsert({
        where: { userId: user.actorId },
        create: {
          tenantId: user.tenantId,
          userId: user.actorId,
          ...fields
        },
        update: fields
      });

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.company.upsert",
        metadata: { companyId: company.id }
      });

      return reply.send({ data: company });
    }
  );

  app.get(
    "/admin/v1/domains",
    { preHandler: [authenticateUserSession] },
    async (request, reply) => {
      const user = getUserContext(request);
      const domains = await prisma.domain.findMany({
        where: { tenantId: user.tenantId, userId: user.actorId },
        orderBy: { createdAt: "desc" }
      });
      const gmailSenders = await prisma.smtpAccount.findMany({
        where: { tenantId: user.tenantId },
        select: {
          id: true,
          label: true,
          gmailAddress: true,
          status: true
        }
      });
      const domainSenders = await prisma.domainSender.findMany({
        where: {
          tenantId: user.tenantId,
          domain: { userId: user.actorId }
        },
        select: {
          id: true,
          label: true,
          emailAddress: true,
          status: true
        }
      });
      const [smtpCounts, domainCounts] = await Promise.all([
        prisma.message.groupBy({
          by: ["smtpAccountId"],
          where: { tenantId: user.tenantId, status: "sent", smtpAccountId: { not: null } },
          _count: { _all: true }
        }),
        prisma.message.groupBy({
          by: ["domainSenderId"],
          where: { tenantId: user.tenantId, status: "sent", domainSenderId: { not: null } },
          _count: { _all: true }
        })
      ]);
      const smtpCountMap = new Map<string, number>(
        smtpCounts.map((row) => [row.smtpAccountId ?? "", row._count._all])
      );
      const domainCountMap = new Map<string, number>(
        domainCounts.map((row) => [row.domainSenderId ?? "", row._count._all])
      );

      const allSenders = [
        ...gmailSenders.map((sender) => ({
          id: sender.id,
          label: sender.label,
          emailAddress: sender.gmailAddress,
          status: sender.status,
          sentCount: smtpCountMap.get(sender.id) ?? 0
        })),
        ...domainSenders.map((sender) => ({
          id: sender.id,
          label: sender.label,
          emailAddress: sender.emailAddress,
          status: sender.status,
          sentCount: domainCountMap.get(sender.id) ?? 0
        }))
      ];

      const data = domains.map((domain) => {
        const domainName = domain.domain.toLowerCase();
        const domainSenders = allSenders.filter((sender) =>
          sender.emailAddress.toLowerCase().endsWith(`@${domainName}`)
        );
        const domainSentCount = domainSenders.reduce(
          (sum, sender) => sum + sender.sentCount,
          0
        );
        return {
          ...domain,
          senders: domainSenders,
          sentCount: domainSentCount
        };
      });

      return reply.send({ data });
    }
  );

  app.post(
    "/admin/v1/domains",
    { preHandler: [...mutatingPreHandlers] },
    async (request, reply) => {
      const user = getUserContext(request);
      const parsed = domainSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest(parsed.error.message);

      const domain = parsed.data.domain.toLowerCase();
      const verificationToken = randomUUID().replace(/-/g, "");
      const txtHost = `_gmailsmtp.${domain}`;
      const txtValue = `gmail-smtp-verify=${verificationToken}`;
      const spfHost = domain;
      const spfValue = `v=spf1 include:${env.APP_DOMAIN} ~all`;
      const cnameHost = `mail.${domain}`;
      const cnameValue = `mail.${env.APP_DOMAIN}`;
      const mxHost = `mx.${env.APP_DOMAIN}`;

      const created = await prisma.domain.upsert({
        where: { userId_domain: { userId: user.actorId, domain } },
        create: {
          tenantId: user.tenantId,
          userId: user.actorId,
          domain,
          verificationToken,
          txtHost,
          txtValue,
          spfHost,
          spfValue,
          cnameHost,
          cnameValue,
          mxHost,
          smtpHost: parsed.data.smtpHost ?? null,
          smtpPort: parsed.data.smtpPort ?? 587,
          smtpSecure: parsed.data.smtpSecure ?? false,
          status: "pending"
        },
        update: {
          verificationToken,
          txtHost,
          txtValue,
          spfHost,
          spfValue,
          cnameHost,
          cnameValue,
          mxHost,
          smtpHost: parsed.data.smtpHost ?? null,
          smtpPort: parsed.data.smtpPort ?? 587,
          smtpSecure: parsed.data.smtpSecure ?? false,
          status: "pending",
          verifiedAt: null
        }
      });

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.domain.create",
        metadata: { domainId: created.id, domain }
      });

      return reply.code(201).send({ data: created });
    }
  );

  app.patch(
    "/admin/v1/domains/:id",
    { preHandler: [...mutatingPreHandlers] },
    async (request, reply) => {
      const user = getUserContext(request);
      const params = request.params as { id: string };
      const parsed = patchDomainSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest(parsed.error.message);

      const updated = await prisma.domain.updateMany({
        where: { id: params.id, tenantId: user.tenantId, userId: user.actorId },
        data: {
          smtpHost: parsed.data.smtpHost,
          smtpPort: parsed.data.smtpPort,
          smtpSecure: parsed.data.smtpSecure
        }
      });
      if (!updated.count) return reply.notFound("domain not found");

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.domain.update",
        metadata: { domainId: params.id }
      });

      const fresh = await prisma.domain.findFirst({
        where: { id: params.id, tenantId: user.tenantId, userId: user.actorId }
      });

      return reply.send({ data: fresh });
    }
  );

  app.post(
    "/admin/v1/domains/:id/verify",
    { preHandler: [...mutatingPreHandlers] },
    async (request, reply) => {
      const user = getUserContext(request);
      const params = request.params as { id: string };
      const domain = await prisma.domain.findFirst({
        where: { id: params.id, tenantId: user.tenantId, userId: user.actorId }
      });
      if (!domain) return reply.notFound("domain not found");

      const mxAliasHost = `mx.${domain.domain}`.toLowerCase();
      const [txtRecords, spfRecords, cnameRecords, mxRecords, mxAliasCnames] = await Promise.all([
        resolveTxt(domain.txtHost),
        resolveTxt(domain.spfHost),
        resolveCname(domain.cnameHost),
        resolveMx(domain.domain),
        resolveCname(mxAliasHost)
      ]);

      const txtOk = txtRecords.includes(domain.txtValue);
      const spfOk = spfRecords.some(
        (value) => value.includes("v=spf1") && value.includes(`include:${env.APP_DOMAIN}`)
      );
      const cnameOk = cnameRecords.includes(domain.cnameValue.toLowerCase());
      const mxExpected = domain.mxHost.toLowerCase();
      const mxUsesAlias = mxRecords.some((row) => row.exchange === mxAliasHost);
      const mxOk = mxRecords.some(
        (row) => row.exchange === mxExpected || row.exchange === mxAliasHost
      );
      const mxCnameOk = mxUsesAlias ? mxAliasCnames.includes(mxExpected) : true;

      const allOk = txtOk && spfOk && cnameOk && mxOk && mxCnameOk;
      const updated = await prisma.domain.update({
        where: { id: domain.id },
        data: {
          status: allOk ? "verified" : "failed",
          verifiedAt: allOk ? new Date() : null
        }
      });

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.domain.verify",
        metadata: { domainId: domain.id, status: updated.status }
      });

      return reply.send({
        data: updated,
        checks: {
          txtOk,
          spfOk,
          cnameOk,
          mxOk,
          mxCnameOk
        }
      });
    }
  );

  app.get(
    "/admin/v1/campaigns",
    { preHandler: [authenticateUserSession] },
    async (request, reply) => {
      const user = getUserContext(request);
      const campaigns = await prisma.campaign.findMany({
        where: { tenantId: user.tenantId, userId: user.actorId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          status: true,
          senderType: true,
          totalRecipients: true,
          queuedCount: true,
          sentCount: true,
          failedCount: true,
          createdAt: true,
          startedAt: true,
          completedAt: true,
          smtpAccount: { select: { label: true, gmailAddress: true } },
          domainSender: { select: { label: true, emailAddress: true } }
        }
      });

      const data = campaigns.map((campaign) => {
        const senderLabel =
          campaign.smtpAccount?.label ||
          campaign.smtpAccount?.gmailAddress ||
          campaign.domainSender?.label ||
          campaign.domainSender?.emailAddress ||
          "Sender";

        return {
          id: campaign.id,
          name: campaign.name,
          status: campaign.status,
          senderType: campaign.senderType,
          senderLabel,
          totalRecipients: campaign.totalRecipients,
          queuedCount: campaign.queuedCount,
          sentCount: campaign.sentCount,
          failedCount: campaign.failedCount,
          createdAt: campaign.createdAt,
          startedAt: campaign.startedAt,
          completedAt: campaign.completedAt
        };
      });

      return reply.send({ data });
    }
  );

  app.get(
    "/admin/v1/campaigns/:id",
    { preHandler: [authenticateUserSession] },
    async (request, reply) => {
      const user = getUserContext(request);
      const params = request.params as { id: string };
      const query = request.query as { limit?: string; cursor?: string };
      const limit = Math.min(Number(query.limit ?? 200), 500);

      const campaign = await prisma.campaign.findFirst({
        where: { id: params.id, tenantId: user.tenantId, userId: user.actorId },
        select: {
          id: true,
          name: true,
          status: true,
          senderType: true,
          fromName: true,
          replyTo: true,
          perMinuteLimit: true,
          warmupEnabled: true,
          warmupStartPerMinute: true,
          warmupStep: true,
          warmupIntervalMinutes: true,
          warmupMaxPerMinute: true,
          trackOpens: true,
          trackClicks: true,
          trackReplies: true,
          totalRecipients: true,
          queuedCount: true,
          sentCount: true,
          failedCount: true,
          openedCount: true,
          clickedCount: true,
          repliedCount: true,
          createdAt: true,
          startedAt: true,
          completedAt: true,
          smtpAccount: { select: { label: true, gmailAddress: true } },
          domainSender: { select: { label: true, emailAddress: true } },
          template: { select: { id: true, name: true } }
        }
      });
      if (!campaign) return reply.notFound("campaign not found");

      const recipients = await prisma.campaignRecipient.findMany({
        where: { campaignId: campaign.id },
        orderBy: { createdAt: "desc" },
        take: limit,
        ...(query.cursor
          ? {
              skip: 1,
              cursor: { id: query.cursor }
            }
          : {})
      });

      const attachments = await prisma.campaignAttachment.findMany({
        where: { campaignId: campaign.id },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          filename: true,
          contentType: true,
          size: true,
          createdAt: true
        }
      });

      const nextCursor =
        recipients.length === limit ? recipients[recipients.length - 1]?.id ?? null : null;

      const senderLabel =
        campaign.smtpAccount?.label ||
        campaign.smtpAccount?.gmailAddress ||
        campaign.domainSender?.label ||
        campaign.domainSender?.emailAddress ||
        "Sender";

      return reply.send({
        data: {
          id: campaign.id,
          name: campaign.name,
          status: campaign.status,
          senderType: campaign.senderType,
          senderLabel,
          fromName: campaign.fromName,
          replyTo: campaign.replyTo,
          template: campaign.template,
          perMinuteLimit: campaign.perMinuteLimit,
          warmupEnabled: campaign.warmupEnabled,
          warmupStartPerMinute: campaign.warmupStartPerMinute,
          warmupStep: campaign.warmupStep,
          warmupIntervalMinutes: campaign.warmupIntervalMinutes,
          warmupMaxPerMinute: campaign.warmupMaxPerMinute,
          trackOpens: campaign.trackOpens,
          trackClicks: campaign.trackClicks,
          trackReplies: campaign.trackReplies,
          totalRecipients: campaign.totalRecipients,
          queuedCount: campaign.queuedCount,
          sentCount: campaign.sentCount,
          failedCount: campaign.failedCount,
          openedCount: campaign.openedCount,
          clickedCount: campaign.clickedCount,
          repliedCount: campaign.repliedCount,
          createdAt: campaign.createdAt,
          startedAt: campaign.startedAt,
          completedAt: campaign.completedAt
        },
        recipients,
        attachments,
        nextCursor
      });
    }
  );

  app.post(
    "/admin/v1/campaigns",
    { preHandler: [...mutatingPreHandlers] },
    async (request, reply) => {
      const user = getUserContext(request);
      const parsed = createCampaignSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest(parsed.error.message);

      assertSafeHeaders(parsed.data.headers ?? {});

      const sender = await resolveCampaignSender({
        tenantId: user.tenantId,
        userId: user.actorId,
        senderType: parsed.data.senderType,
        senderId: parsed.data.senderId
      });
      if (!sender) return reply.badRequest("sender not found or inactive");

      if (parsed.data.templateId) {
        const template = await prisma.template.findFirst({
          where: {
            id: parsed.data.templateId,
            tenantId: user.tenantId,
            status: "active"
          },
          select: { id: true }
        });
        if (!template) return reply.badRequest("template not found or inactive");
      }

      const campaign = await prisma.campaign.create({
        data: {
          tenantId: user.tenantId,
          userId: user.actorId,
          name: parsed.data.name.trim(),
          status: "draft",
          senderType: parsed.data.senderType,
          smtpAccountId: sender.smtpAccountId,
          domainSenderId: sender.domainSenderId,
          templateId: parsed.data.templateId,
          subject: parsed.data.subject,
          html: parsed.data.html,
          text: parsed.data.text,
          fromName: parsed.data.fromName,
          replyTo: parsed.data.replyTo,
          headers: parsed.data.headers ?? {},
          perMessageDelaySeconds: parsed.data.perMessageDelaySeconds ?? 0,
          perMinuteLimit: parsed.data.perMinuteLimit ?? env.DEFAULT_API_KEY_RATE_LIMIT,
          warmupEnabled: parsed.data.warmupEnabled ?? false,
          warmupStartPerMinute: parsed.data.warmupStartPerMinute ?? 20,
          warmupStep: parsed.data.warmupStep ?? 10,
          warmupIntervalMinutes: parsed.data.warmupIntervalMinutes ?? 60,
          warmupMaxPerMinute: parsed.data.warmupMaxPerMinute ?? 200,
          trackOpens: parsed.data.trackOpens ?? true,
          trackClicks: parsed.data.trackClicks ?? true,
          trackReplies: parsed.data.trackReplies ?? false
        }
      });

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.campaign.create",
        metadata: { campaignId: campaign.id, name: campaign.name }
      });

      return reply.code(201).send({ data: campaign });
    }
  );

  app.post(
    "/admin/v1/campaigns/bulk",
    { preHandler: [...mutatingPreHandlers] },
    async (request, reply) => {
      const user = getUserContext(request);
      const parsed = createCampaignBulkSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest(parsed.error.message);

      assertSafeHeaders(parsed.data.headers ?? {});

      const sender = await resolveCampaignSender({
        tenantId: user.tenantId,
        userId: user.actorId,
        senderType: parsed.data.senderType,
        senderId: parsed.data.senderId
      });
      if (!sender) return reply.badRequest("sender not found or inactive");

      if (parsed.data.templateId) {
        const template = await prisma.template.findFirst({
          where: {
            id: parsed.data.templateId,
            tenantId: user.tenantId,
            status: "active"
          },
          select: { id: true }
        });
        if (!template) return reply.badRequest("template not found or inactive");
      }

      const campaign = await prisma.campaign.create({
        data: {
          tenantId: user.tenantId,
          userId: user.actorId,
          name: parsed.data.name.trim(),
          status: "draft",
          senderType: parsed.data.senderType,
          smtpAccountId: sender.smtpAccountId,
          domainSenderId: sender.domainSenderId,
          templateId: parsed.data.templateId,
          subject: parsed.data.subject,
          html: parsed.data.html,
          text: parsed.data.text,
          fromName: parsed.data.fromName,
          replyTo: parsed.data.replyTo,
          headers: parsed.data.headers ?? {},
          perMessageDelaySeconds: parsed.data.perMessageDelaySeconds ?? 0,
          perMinuteLimit: parsed.data.perMinuteLimit ?? env.DEFAULT_API_KEY_RATE_LIMIT,
          warmupEnabled: parsed.data.warmupEnabled ?? false,
          warmupStartPerMinute: parsed.data.warmupStartPerMinute ?? 20,
          warmupStep: parsed.data.warmupStep ?? 10,
          warmupIntervalMinutes: parsed.data.warmupIntervalMinutes ?? 60,
          warmupMaxPerMinute: parsed.data.warmupMaxPerMinute ?? 200,
          trackOpens: parsed.data.trackOpens ?? true,
          trackClicks: parsed.data.trackClicks ?? true,
          trackReplies: parsed.data.trackReplies ?? false
        }
      });

      const recipientData = parsed.data.recipients.map((recipient) => ({
        campaignId: campaign.id,
        email: recipient.email.toLowerCase(),
        name: recipient.name?.trim() || null,
        variables: recipient.variables ?? {},
        trackingToken: randomUUID().replace(/-/g, "")
      }));

      const inserted = await prisma.campaignRecipient.createMany({
        data: recipientData,
        skipDuplicates: true
      });

      if (inserted.count) {
        await prisma.campaign.update({
          where: { id: campaign.id },
          data: {
            totalRecipients: { increment: inserted.count }
          }
        });
      }

      if (parsed.data.start) {
        const previousStatus = campaign.status;
        const previousStartedAt = campaign.startedAt;
        await prisma.campaign.update({
          where: { id: campaign.id },
          data: {
            status: "running",
            startedAt: new Date()
          }
        });
        const jobId = `campaign-dispatch-${campaign.id}`;
        try {
          const queue = getCampaignQueue();
          await queue.waitUntilReady();
          const existing = await queue.getJob(jobId);
          if (!existing) {
            await queue.add("campaign-dispatch", { campaignId: campaign.id }, { jobId });
          }
        } catch (error) {
          await prisma.campaign.update({
            where: { id: campaign.id },
            data: {
              status: previousStatus,
              startedAt: previousStartedAt
            }
          });
          request.log.error({ err: error }, "failed to enqueue campaign dispatch");
          return reply.code(503).send({
            error: "queue_unavailable",
            message: "Redis queue is unavailable. Start Redis and worker, then retry.",
            detail: (error as Error).message || String(error)
          });
        }
      }

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.campaign.bulk_create",
        metadata: { campaignId: campaign.id, added: inserted.count }
      });

      return reply.code(201).send({
        data: campaign,
        recipientsAdded: inserted.count
      });
    }
  );

  app.post(
    "/admin/v1/campaigns/:id/recipients",
    { preHandler: [...mutatingPreHandlers] },
    async (request, reply) => {
      const user = getUserContext(request);
      const params = request.params as { id: string };
      const parsed = campaignRecipientsSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest(parsed.error.message);

      const campaign = await prisma.campaign.findFirst({
        where: { id: params.id, tenantId: user.tenantId, userId: user.actorId }
      });
      if (!campaign) return reply.notFound("campaign not found");
      if (campaign.status === "running") {
        return reply.badRequest("pause the campaign before adding recipients");
      }
      if (campaign.status === "completed" || campaign.status === "cancelled") {
        return reply.badRequest("campaign is completed");
      }

      const data = parsed.data.recipients.map((recipient) => ({
        campaignId: campaign.id,
        email: recipient.email.toLowerCase(),
        name: recipient.name?.trim() || null,
        variables: recipient.variables ?? {},
        trackingToken: randomUUID().replace(/-/g, "")
      }));

      const inserted = await prisma.campaignRecipient.createMany({
        data,
        skipDuplicates: true
      });

      if (inserted.count) {
        await prisma.campaign.update({
          where: { id: campaign.id },
          data: {
            totalRecipients: { increment: inserted.count }
          }
        });
      }

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.campaign.recipients.added",
        metadata: { campaignId: campaign.id, added: inserted.count }
      });

      return reply.send({ data: { added: inserted.count } });
    }
  );

  app.get(
    "/admin/v1/campaigns/:id/attachments",
    { preHandler: [authenticateUserSession] },
    async (request, reply) => {
      const user = getUserContext(request);
      const params = request.params as { id: string };
      const campaign = await prisma.campaign.findFirst({
        where: { id: params.id, tenantId: user.tenantId, userId: user.actorId },
        select: { id: true }
      });
      if (!campaign) return reply.notFound("campaign not found");

      const attachments = await prisma.campaignAttachment.findMany({
        where: { campaignId: campaign.id },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          filename: true,
          contentType: true,
          size: true,
          createdAt: true
        }
      });
      return reply.send({ data: attachments });
    }
  );

  app.post(
    "/admin/v1/campaigns/:id/attachments",
    {
      bodyLimit: ATTACHMENT_UPLOAD_BODY_LIMIT,
      preHandler: [...mutatingPreHandlers]
    },
    async (request, reply) => {
      const user = getUserContext(request);
      const params = request.params as { id: string };
      const parsed = attachmentUploadSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest(parsed.error.message);

      const campaign = await prisma.campaign.findFirst({
        where: { id: params.id, tenantId: user.tenantId, userId: user.actorId },
        select: { id: true, status: true }
      });
      if (!campaign) return reply.notFound("campaign not found");
      if (campaign.status === "running") {
        return reply.badRequest("pause the campaign before changing attachments");
      }
      if (campaign.status === "completed" || campaign.status === "cancelled") {
        return reply.badRequest("campaign is completed");
      }

      let bytes: Buffer;
      try {
        bytes = Buffer.from(parsed.data.data, "base64");
      } catch {
        return reply.badRequest("invalid base64 data");
      }
      if (!bytes.length) return reply.badRequest("empty file");
      if (bytes.length > MAX_ATTACHMENT_BYTES) {
        return reply.badRequest("attachment exceeds 5MB limit");
      }

      const attachment = await prisma.campaignAttachment.create({
        data: {
          campaignId: campaign.id,
          filename: parsed.data.filename.slice(0, 255),
          contentType: parsed.data.contentType.slice(0, 255),
          size: bytes.length,
          data: Uint8Array.from(bytes)
        },
        select: {
          id: true,
          filename: true,
          contentType: true,
          size: true,
          createdAt: true
        }
      });

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.campaign.attachment.add",
        metadata: {
          campaignId: campaign.id,
          attachmentId: attachment.id,
          filename: attachment.filename,
          size: attachment.size
        }
      });

      return reply.code(201).send({ data: attachment });
    }
  );

  app.delete(
    "/admin/v1/campaigns/:id/attachments/:attachmentId",
    { preHandler: [...mutatingPreHandlers] },
    async (request, reply) => {
      const user = getUserContext(request);
      const params = request.params as { id: string; attachmentId: string };
      const campaign = await prisma.campaign.findFirst({
        where: { id: params.id, tenantId: user.tenantId, userId: user.actorId },
        select: { id: true, status: true }
      });
      if (!campaign) return reply.notFound("campaign not found");
      if (campaign.status === "running") {
        return reply.badRequest("pause the campaign before changing attachments");
      }

      const attachment = await prisma.campaignAttachment.findFirst({
        where: { id: params.attachmentId, campaignId: campaign.id },
        select: { id: true, filename: true }
      });
      if (!attachment) return reply.notFound("attachment not found");

      await prisma.campaignAttachment.delete({ where: { id: attachment.id } });

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.campaign.attachment.remove",
        metadata: {
          campaignId: campaign.id,
          attachmentId: attachment.id,
          filename: attachment.filename
        }
      });

      return reply.send({ ok: true });
    }
  );

  app.post(
    "/admin/v1/campaigns/:id/start",
    { preHandler: [...mutatingPreHandlers] },
    async (request, reply) => {
      const user = getUserContext(request);
      const params = request.params as { id: string };
      const campaign = await prisma.campaign.findFirst({
        where: { id: params.id, tenantId: user.tenantId, userId: user.actorId }
      });
      if (!campaign) return reply.notFound("campaign not found");
      if (!campaign.totalRecipients) return reply.badRequest("add recipients first");
      if (campaign.status === "completed") return reply.badRequest("campaign is completed");

      const previousStatus = campaign.status;
      const previousStartedAt = campaign.startedAt;
      const updated = await prisma.campaign.update({
        where: { id: campaign.id },
        data: {
          status: "running",
          startedAt: campaign.startedAt ?? new Date()
        }
      });

      const jobId = `campaign-dispatch-${campaign.id}`;
      try {
        const queue = getCampaignQueue();
        await queue.waitUntilReady();
        const existing = await queue.getJob(jobId);
        if (!existing) {
          await queue.add("campaign-dispatch", { campaignId: campaign.id }, { jobId });
        }
      } catch (error) {
        await prisma.campaign.update({
          where: { id: campaign.id },
          data: {
            status: previousStatus,
            startedAt: previousStartedAt
          }
        });
        request.log.error({ err: error }, "failed to enqueue campaign dispatch");
        return reply.code(503).send({
          error: "queue_unavailable",
          message: "Redis queue is unavailable. Start Redis and worker, then retry.",
          detail: (error as Error).message || String(error)
        });
      }

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.campaign.started",
        metadata: { campaignId: campaign.id }
      });

      return reply.send({ data: updated });
    }
  );

  app.post(
    "/admin/v1/campaigns/:id/pause",
    { preHandler: [...mutatingPreHandlers] },
    async (request, reply) => {
      const user = getUserContext(request);
      const params = request.params as { id: string };
      const campaign = await prisma.campaign.findFirst({
        where: { id: params.id, tenantId: user.tenantId, userId: user.actorId }
      });
      if (!campaign) return reply.notFound("campaign not found");

      const updated = await prisma.campaign.update({
        where: { id: campaign.id },
        data: { status: "paused" }
      });

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.campaign.paused",
        metadata: { campaignId: campaign.id }
      });

      return reply.send({ data: updated });
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
          },
          domainPermissions: {
            select: { domainSenderId: true }
          }
        }
      });
      if (!apiKey) return reply.notFound("api key not found");

      const allowedSenders = [
        ...apiKey.permissions.map((p) => ({ id: p.smtpAccountId, type: "gmail" as const })),
        ...apiKey.domainPermissions.map((p) => ({
          id: p.domainSenderId,
          type: "domain" as const
        }))
      ];
      if (allowedSenders.length !== 1) {
        return reply.badRequest("api key must be scoped to exactly one sender");
      }
      const senderRef = allowedSenders[0];
      const senderType = senderRef.type;
      const sender =
        senderType === "gmail"
          ? await prisma.smtpAccount.findFirst({
              where: {
                id: senderRef.id,
                tenantId: user.tenantId,
                status: "active"
              }
            })
          : await prisma.domainSender.findFirst({
              where: {
                id: senderRef.id,
                tenantId: user.tenantId,
                status: "active",
                domain: { userId: user.actorId }
              }
            });
      if (!sender) return reply.badRequest("sender unavailable");

      let subject = parsed.data.subject ?? "Test Email from Gmail SMTP API";
      let text = `This is a test message for API key '${apiKey.name}' using /v1/send.`;
      let html = `<p>This is a test message for API key '<strong>${apiKey.name}</strong>' using <code>/v1/send</code>.</p>`;

      const templateName = parsed.data.templateName?.toLowerCase();
      if (templateName && !/^[a-z0-9-]+$/.test(templateName)) {
        return reply.badRequest(
          "template name must be URL-safe (lowercase letters, numbers, hyphens)"
        );
      }
      if (templateName) {
        const template = await prisma.template.findFirst({
          where: {
            name: { equals: templateName, mode: "insensitive" },
            tenantId: user.tenantId,
            status: "active"
          }
        });
        if (!template) {
          return reply.badRequest("template not found or inactive");
        }
        const variables = {};
        const subjectRendered = renderTemplate(template.subject, variables);
        const htmlRendered = renderTemplate(template.html, variables);
        const textRendered = template.text ? renderTemplate(template.text, variables) : null;

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
        text = textRendered ? textRendered.value : "";
      }

      const message = await prisma.message.create({
        data: {
          tenantId: user.tenantId,
          apiKeyId: apiKey.id,
          smtpAccountId: senderType === "gmail" ? sender.id : null,
          domainSenderId: senderType === "domain" ? sender.id : null,
          idempotencyKey: `admin-test-${randomUUID()}`,
          to: [parsed.data.toEmail],
          cc: [],
          bcc: [],
          subject,
          text,
          html,
          status: "queued",
          isTest: true
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
          testedApi: templateName ? `POST /v1/send/${templateName}` : "POST /v1/send",
          apiKeyName: apiKey.name,
          senderLabel: sender.label
        }
      });

      return reply.code(202).send({
        testedApi: templateName ? `POST /v1/send/${templateName}` : "POST /v1/send",
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
      const dayKey = new Date().toISOString().slice(0, 10);
      const dayStart = new Date(`${dayKey}T00:00:00.000Z`);

      let gmailSenders = await prisma.smtpAccount.findMany({
        where: { tenantId: user.tenantId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          label: true,
          gmailAddress: true,
          status: true,
          perDayLimit: true,
          sentTodayCount: true,
          sentTodayResetAt: true,
          errorStreak: true,
          healthScore: true,
          lastSuccessAt: true,
          lastErrorAt: true,
          createdAt: true
        }
      });
      const resetGmailIds = gmailSenders
        .filter(
          (sender) => !sender.sentTodayResetAt || sender.sentTodayResetAt < dayStart
        )
        .map((sender) => sender.id);
      if (resetGmailIds.length) {
        await prisma.smtpAccount.updateMany({
          where: { tenantId: user.tenantId, id: { in: resetGmailIds } },
          data: {
            sentTodayCount: 0,
            sentTodayResetAt: dayStart
          }
        });
        const resetSet = new Set(resetGmailIds);
        gmailSenders = gmailSenders.map((sender) =>
          resetSet.has(sender.id)
            ? { ...sender, sentTodayCount: 0, sentTodayResetAt: dayStart }
            : sender
        );
      }
      let domainSenders = await prisma.domainSender.findMany({
        where: {
          tenantId: user.tenantId,
          domain: { userId: user.actorId }
        },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          label: true,
          emailAddress: true,
          status: true,
          perDayLimit: true,
          sentTodayCount: true,
          sentTodayResetAt: true,
          errorStreak: true,
          healthScore: true,
          lastSuccessAt: true,
          lastErrorAt: true,
          createdAt: true,
          domain: { select: { domain: true } }
        }
      });
      const resetDomainIds = domainSenders
        .filter(
          (sender) => !sender.sentTodayResetAt || sender.sentTodayResetAt < dayStart
        )
        .map((sender) => sender.id);
      if (resetDomainIds.length) {
        await prisma.domainSender.updateMany({
          where: { tenantId: user.tenantId, id: { in: resetDomainIds } },
          data: {
            sentTodayCount: 0,
            sentTodayResetAt: dayStart
          }
        });
        const resetSet = new Set(resetDomainIds);
        domainSenders = domainSenders.map((sender) =>
          resetSet.has(sender.id)
            ? { ...sender, sentTodayCount: 0, sentTodayResetAt: dayStart }
            : sender
        );
      }

      const data = [
        ...gmailSenders.map((sender) => ({
          id: sender.id,
          label: sender.label,
          emailAddress: sender.gmailAddress,
          status: sender.status,
          perDayLimit: sender.perDayLimit,
          sentTodayCount: sender.sentTodayCount,
          errorStreak: sender.errorStreak,
          healthScore: sender.healthScore,
          type: "gmail" as const,
          domain: sender.gmailAddress.split("@")[1] ?? null,
          createdAt: sender.createdAt
        })),
        ...domainSenders.map((sender) => ({
          id: sender.id,
          label: sender.label,
          emailAddress: sender.emailAddress,
          status: sender.status,
          perDayLimit: sender.perDayLimit,
          sentTodayCount: sender.sentTodayCount,
          errorStreak: sender.errorStreak,
          healthScore: sender.healthScore,
          type: "domain" as const,
          domain: sender.domain.domain,
          createdAt: sender.createdAt
        }))
      ]
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map(({ createdAt, ...rest }) => rest);

      return reply.send({ data });
    }
  );

  app.post(
    "/admin/v1/senders",
    { preHandler: [...mutatingPreHandlers] },
    async (request, reply) => {
      const user = getUserContext(request);
      const parsed = createSenderSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest(parsed.error.message);

      if (parsed.data.type === "gmail") {
        if (!env.SKIP_SMTP_VERIFY) {
          try {
            await verifyGmailCredentials(parsed.data.gmailAddress, parsed.data.appPassword);
          } catch (error) {
            request.log.warn({ err: error }, "gmail credential verification failed");
            return reply.badRequest(
              "gmail credentials could not be verified. check the address and app password."
            );
          }
        }
        const encrypted = encryptSecret(parsed.data.appPassword);

        let sender: {
          id: string;
          label: string;
          gmailAddress: string;
          status: string;
          perDayLimit: number;
        } | null = null;
        try {
          sender = await prisma.smtpAccount.create({
            data: {
              tenantId: user.tenantId,
              label: parsed.data.label,
              gmailAddress: parsed.data.gmailAddress,
              encryptedAppPassword: encrypted.encrypted,
              iv: encrypted.iv,
              authTag: encrypted.authTag,
              keyVersion: encrypted.keyVersion,
              perDayLimit: parsed.data.perDayLimit ?? env.DEFAULT_PER_DAY_LIMIT
            },
            select: {
              id: true,
              label: true,
              gmailAddress: true,
              status: true,
              perDayLimit: true
            }
          });
        } catch (error) {
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
          ) {
            return reply.conflict("sender already exists");
          }
          request.log.error({ err: error }, "failed to create sender");
          return reply.internalServerError("failed to create sender");
        }
        if (!sender) {
          return reply.internalServerError("failed to create sender");
        }

        await writeAuditLog(request, {
          tenantId: user.tenantId,
          actorType: "user",
          actorId: user.actorId,
          action: "admin.sender.create",
          metadata: {
            senderId: sender.id,
            senderLabel: sender.label,
            gmailAddress: sender.gmailAddress,
            type: "gmail"
          }
        });

        return reply.code(201).send({ data: sender });
      }

      const domain = await prisma.domain.findFirst({
        where: {
          id: parsed.data.domainId,
          tenantId: user.tenantId,
          userId: user.actorId
        }
      });
      if (!domain) return reply.notFound("domain not found");
      if (!domain.smtpHost) {
        return reply.badRequest("domain smtp settings are missing");
      }

      if (!env.SKIP_SMTP_VERIFY) {
        try {
          const transporter = nodemailer.createTransport({
            host: domain.smtpHost,
            port: domain.smtpPort,
            secure: domain.smtpSecure,
            auth: { user: parsed.data.username, pass: parsed.data.password }
          });
          await transporter.verify();
        } catch (error) {
          request.log.warn({ err: error }, "domain sender credential verification failed");
          return reply.badRequest(
            "domain smtp credentials could not be verified. check the username and password."
          );
        }
      }

      const emailDomain = parsed.data.emailAddress.split("@")[1]?.toLowerCase();
      if (!emailDomain || emailDomain !== domain.domain.toLowerCase()) {
        return reply.badRequest("email must match selected domain");
      }

      const encrypted = encryptSecret(parsed.data.password);
      let domainSender: {
        id: string;
        label: string;
        emailAddress: string;
        status: string;
        perDayLimit: number;
      } | null = null;
      try {
        domainSender = await prisma.domainSender.create({
          data: {
            tenantId: user.tenantId,
            domainId: domain.id,
            label: parsed.data.label,
            emailAddress: parsed.data.emailAddress,
            username: parsed.data.username,
            encryptedPassword: encrypted.encrypted,
            iv: encrypted.iv,
            authTag: encrypted.authTag,
            keyVersion: encrypted.keyVersion,
            perDayLimit: parsed.data.perDayLimit ?? env.DEFAULT_PER_DAY_LIMIT
          },
          select: {
            id: true,
            label: true,
            emailAddress: true,
            status: true,
            perDayLimit: true
          }
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          return reply.conflict("sender already exists");
        }
        request.log.error({ err: error }, "failed to create domain sender");
        return reply.internalServerError("failed to create sender");
      }
      if (!domainSender) {
        return reply.internalServerError("failed to create sender");
      }

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.sender.create",
        metadata: {
          senderId: domainSender.id,
          senderLabel: domainSender.label,
          emailAddress: domainSender.emailAddress,
          type: "domain"
        }
      });

      return reply.code(201).send({ data: domainSender });
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

      const { password, ...rest } = parsed.data;
      const resetOnActivate =
        parsed.data.status === "active"
          ? { errorStreak: 0, lastErrorAt: null, healthScore: 100 }
          : {};
      const encryptedPassword = password ? encryptSecret(password) : null;

      if (password) {
        const smtpSender = await prisma.smtpAccount.findFirst({
          where: { id: params.id, tenantId: user.tenantId },
          select: { gmailAddress: true }
        });
        if (smtpSender) {
          if (!env.SKIP_SMTP_VERIFY) {
            try {
              await verifyGmailCredentials(smtpSender.gmailAddress, password);
            } catch (error) {
              request.log.warn({ err: error }, "gmail credential verification failed");
              return reply.badRequest(
                "gmail credentials could not be verified. check the address and app password."
              );
            }
          }
        } else {
          const domainSender = await prisma.domainSender.findFirst({
            where: {
              id: params.id,
              tenantId: user.tenantId,
              domain: { userId: user.actorId }
            },
            select: {
              username: true,
              domain: { select: { smtpHost: true, smtpPort: true, smtpSecure: true } }
            }
          });
          if (domainSender?.domain?.smtpHost) {
            if (!env.SKIP_SMTP_VERIFY) {
              try {
                const transporter = nodemailer.createTransport({
                  host: domainSender.domain.smtpHost,
                  port: domainSender.domain.smtpPort,
                  secure: domainSender.domain.smtpSecure,
                  auth: { user: domainSender.username, pass: password }
                });
                await transporter.verify();
              } catch (error) {
                request.log.warn({ err: error }, "domain sender credential verification failed");
                return reply.badRequest(
                  "domain smtp credentials could not be verified. check the username and password."
                );
              }
            }
          } else if (domainSender) {
            return reply.badRequest("domain smtp settings are missing");
          }
        }
      }

      const sender = await prisma.smtpAccount.updateMany({
        where: { id: params.id, tenantId: user.tenantId },
        data: {
          ...rest,
          ...resetOnActivate,
          ...(encryptedPassword
            ? {
                encryptedAppPassword: encryptedPassword.encrypted,
                iv: encryptedPassword.iv,
                authTag: encryptedPassword.authTag,
                keyVersion: encryptedPassword.keyVersion
              }
            : {})
        }
      });
      if (sender.count) {
        const updatedSender = await prisma.smtpAccount.findFirst({
          where: { id: params.id, tenantId: user.tenantId },
          select: { label: true, status: true }
        });

        await writeAuditLog(request, {
          tenantId: user.tenantId,
          actorType: "user",
          actorId: user.actorId,
          action: "admin.sender.update",
          metadata: {
            senderId: params.id,
            senderLabel: updatedSender?.label,
            status: updatedSender?.status,
            fields: Object.keys(parsed.data),
            type: "gmail"
          }
        });

        return reply.send({ ok: true });
      }

      const domainSender = await prisma.domainSender.updateMany({
        where: {
          id: params.id,
          tenantId: user.tenantId,
          domain: { userId: user.actorId }
        },
        data: {
          ...rest,
          ...resetOnActivate,
          ...(encryptedPassword
            ? {
                encryptedPassword: encryptedPassword.encrypted,
                iv: encryptedPassword.iv,
                authTag: encryptedPassword.authTag,
                keyVersion: encryptedPassword.keyVersion
              }
            : {})
        }
      });
      if (!domainSender.count) return reply.notFound("sender not found");

      const updatedDomainSender = await prisma.domainSender.findFirst({
        where: {
          id: params.id,
          tenantId: user.tenantId,
          domain: { userId: user.actorId }
        },
        select: { label: true, status: true, emailAddress: true }
      });

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.sender.update",
        metadata: {
          senderId: params.id,
          senderLabel: updatedDomainSender?.label,
          status: updatedDomainSender?.status,
          emailAddress: updatedDomainSender?.emailAddress,
          fields: Object.keys(parsed.data),
          type: "domain"
        }
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
      const smtpSender = await prisma.smtpAccount.findFirst({
        where: { id: params.id, tenantId: user.tenantId },
        select: { id: true, label: true, gmailAddress: true }
      });
      if (smtpSender) {
        const messageCount = await prisma.message.count({
          where: { tenantId: user.tenantId, smtpAccountId: smtpSender.id }
        });
        if (messageCount > 0) {
          return reply.conflict("sender has messages and cannot be deleted");
        }

        await prisma.smtpAccount.deleteMany({
          where: { id: params.id, tenantId: user.tenantId }
        });

        await writeAuditLog(request, {
          tenantId: user.tenantId,
          actorType: "user",
          actorId: user.actorId,
          action: "admin.sender.delete",
          metadata: {
            senderId: params.id,
            senderLabel: smtpSender.label,
            gmailAddress: smtpSender.gmailAddress,
            type: "gmail"
          }
        });

        return reply.send({ ok: true });
      }

      const domainSender = await prisma.domainSender.findFirst({
        where: {
          id: params.id,
          tenantId: user.tenantId,
          domain: { userId: user.actorId }
        },
        select: { id: true, label: true, emailAddress: true }
      });
      if (!domainSender) return reply.notFound("sender not found");

      const domainMessageCount = await prisma.message.count({
        where: { tenantId: user.tenantId, domainSenderId: domainSender.id }
      });
      if (domainMessageCount > 0) {
        return reply.conflict("sender has messages and cannot be deleted");
      }

      await prisma.domainSender.deleteMany({
        where: {
          id: params.id,
          tenantId: user.tenantId,
          domain: { userId: user.actorId }
        }
      });

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.sender.delete",
        metadata: {
          senderId: params.id,
          senderLabel: domainSender.label,
          emailAddress: domainSender.emailAddress,
          type: "domain"
        }
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
      if (sender) {
        if (sender.status !== "active") return reply.badRequest("sender not active");

        if (!env.SKIP_SMTP_VERIFY) {
          const appPassword = decryptSecret({
            encrypted: sender.encryptedAppPassword,
            iv: sender.iv,
            authTag: sender.authTag,
            keyVersion: sender.keyVersion
          });
            const transporter = createGmailTransport(sender.gmailAddress, appPassword);

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
          metadata: { senderId: sender.id, senderLabel: sender.label, type: "gmail" }
        });

        return reply.send({ ok: true });
      }

      const domainSender = await prisma.domainSender.findFirst({
        where: {
          id: params.id,
          tenantId: user.tenantId,
          domain: { userId: user.actorId }
        }
      });
      if (!domainSender) return reply.notFound("sender not found");
      if (domainSender.status !== "active") return reply.badRequest("sender not active");

      if (!env.SKIP_SMTP_VERIFY) {
        const domain = await prisma.domain.findFirst({
          where: { id: domainSender.domainId, tenantId: user.tenantId }
        });
        if (!domain || !domain.smtpHost) {
          return reply.badRequest("domain smtp settings are missing");
        }
        const password = decryptSecret({
          encrypted: domainSender.encryptedPassword,
          iv: domainSender.iv,
          authTag: domainSender.authTag,
          keyVersion: domainSender.keyVersion
        });
        const transporter = nodemailer.createTransport({
          host: domain.smtpHost,
          port: domain.smtpPort,
          secure: domain.smtpSecure,
          auth: { user: domainSender.username, pass: password }
        });

        await transporter.sendMail({
          from: domainSender.emailAddress,
          to: body.to,
          subject: "SMTP API test",
          text: "Sender verification test successful."
        });
      }

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.sender.test_send",
        metadata: {
          senderId: domainSender.id,
          senderLabel: domainSender.label,
          emailAddress: domainSender.emailAddress,
          type: "domain"
        }
      });

      return reply.send({ ok: true });
    }
  );

  app.get(
    "/admin/v1/templates",
    { preHandler: [authenticateUserSession] },
    async (request, reply) => {
      const user = getUserContext(request);
      const templates = await prisma.template.findMany({
        where: { tenantId: user.tenantId },
        orderBy: { createdAt: "desc" }
      });
      return reply.send({ data: templates });
    }
  );

  app.post(
    "/admin/v1/templates",
    { preHandler: [...mutatingPreHandlers] },
    async (request, reply) => {
      const user = getUserContext(request);
      const parsed = createTemplateSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest(parsed.error.message);

      const nameCheck = await prisma.template.findFirst({
        where: {
          tenantId: user.tenantId,
          name: { equals: parsed.data.name, mode: "insensitive" }
        },
        select: { id: true }
      });
      if (nameCheck) {
        return reply.badRequest("template name already exists");
      }

      let template;
      try {
        template = await prisma.template.create({
          data: {
            tenantId: user.tenantId,
            name: parsed.data.name,
            subject: parsed.data.subject,
            html: parsed.data.html,
            text: parsed.data.text ?? null
          }
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          return reply.badRequest("template name already exists");
        }
        throw error;
      }

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.template.create",
        metadata: { templateName: template.name }
      });

      return reply.code(201).send({ data: template });
    }
  );

  app.patch(
    "/admin/v1/templates/:id",
    { preHandler: [...mutatingPreHandlers] },
    async (request, reply) => {
      const user = getUserContext(request);
      const params = request.params as { id: string };
      const parsed = patchTemplateSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest(parsed.error.message);

      const update = {
        ...parsed.data,
        text: parsed.data.text === undefined ? undefined : parsed.data.text
      };

      if (parsed.data.name) {
        const nameCheck = await prisma.template.findFirst({
          where: {
            tenantId: user.tenantId,
            name: { equals: parsed.data.name, mode: "insensitive" },
            NOT: { id: params.id }
          },
          select: { id: true }
        });
        if (nameCheck) {
          return reply.badRequest("template name already exists");
        }
      }

      let updated;
      try {
        updated = await prisma.template.updateMany({
          where: { id: params.id, tenantId: user.tenantId },
          data: update
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          return reply.badRequest("template name already exists");
        }
        throw error;
      }
      if (!updated.count) return reply.notFound("template not found");

      const latest = await prisma.template.findFirst({
        where: { id: params.id, tenantId: user.tenantId },
        select: { name: true, status: true }
      });

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.template.update",
        metadata: {
          templateName: latest?.name,
          status: latest?.status,
          fields: Object.keys(parsed.data)
        }
      });

      return reply.send({ ok: true });
    }
  );

  app.delete(
    "/admin/v1/templates/:id",
    { preHandler: [...mutatingPreHandlers] },
    async (request, reply) => {
      const user = getUserContext(request);
      const params = request.params as { id: string };
      const existing = await prisma.template.findFirst({
        where: { id: params.id, tenantId: user.tenantId },
        select: { name: true }
      });
      if (!existing) return reply.notFound("template not found");

      await prisma.template.deleteMany({
        where: { id: params.id, tenantId: user.tenantId }
      });

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.template.delete",
        metadata: { templateName: existing.name }
      });

      return reply.send({ ok: true });
    }
  );

  // ---------- Template preview & test-send ----------

  const templatePreviewSchema = z.object({
    subject: z.string().max(500).optional(),
    html: z.string().max(200_000).optional(),
    text: z.string().max(200_000).optional(),
    variables: z.record(z.string(), z.string()).optional()
  });

  app.post(
    "/admin/v1/templates/preview",
    { preHandler: [authenticateUserSession, enforceCsrf] },
    async (request, reply) => {
      const parsed = templatePreviewSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest(parsed.error.message);

      const { subject = "", html = "", text = "", variables = {} } = parsed.data;
      const detected = extractTemplateVariables([subject, html, text]);

      const subjectRendered = renderTemplate(subject, variables);
      const htmlRendered = renderTemplate(html, variables);
      const textRendered = renderTemplate(text, variables);

      const missing = Array.from(
        new Set([
          ...subjectRendered.missing,
          ...htmlRendered.missing,
          ...textRendered.missing
        ])
      );

      return reply.send({
        data: {
          subject: subjectRendered.value,
          html: htmlRendered.value,
          text: textRendered.value,
          detectedVariables: detected,
          missingVariables: missing
        }
      });
    }
  );

  const TEMPLATE_TEST_RATE_PER_MIN = 10;

  const templateTestSendSchema = z.object({
    senderType: z.enum(["gmail", "domain"]),
    senderId: z.string().min(1),
    to: z.string().email().max(160),
    subject: z.string().min(1).max(500),
    html: z.string().max(200_000).optional(),
    text: z.string().max(200_000).optional(),
    variables: z.record(z.string(), z.string()).optional(),
    templateId: z.string().optional() // optional, just for audit metadata
  });

  app.post(
    "/admin/v1/templates/test-send",
    { preHandler: [...mutatingPreHandlers] },
    async (request, reply) => {
      const user = getUserContext(request);
      const parsed = templateTestSendSchema.safeParse(request.body);
      if (!parsed.success) return reply.badRequest(parsed.error.message);

      // Per-user rate limit so people don't bombard their own inbox.
      try {
        const minuteKey = `tpltest:${user.actorId}:${Math.floor(Date.now() / 60_000)}`;
        const count = await redis.incr(minuteKey);
        if (count === 1) await redis.expire(minuteKey, 60);
        if (count > TEMPLATE_TEST_RATE_PER_MIN) {
          return reply.tooManyRequests(
            `you can send ${TEMPLATE_TEST_RATE_PER_MIN} test emails per minute`
          );
        }
      } catch (err) {
        request.log.warn({ err }, "template test-send: rate limit redis error");
      }

      const variables = parsed.data.variables ?? {};

      // Resolve sender (must belong to tenant + be active).
      let senderId: string | null = null;
      let senderLabel = "";
      let senderEmail = "";
      if (parsed.data.senderType === "gmail") {
        const sender = await prisma.smtpAccount.findFirst({
          where: { id: parsed.data.senderId, tenantId: user.tenantId, status: "active" },
          select: { id: true, label: true, gmailAddress: true }
        });
        if (!sender) return reply.badRequest("sender unavailable or inactive");
        senderId = sender.id;
        senderLabel = sender.label;
        senderEmail = sender.gmailAddress;
      } else {
        const sender = await prisma.domainSender.findFirst({
          where: {
            id: parsed.data.senderId,
            tenantId: user.tenantId,
            status: "active",
            domain: { userId: user.actorId }
          },
          select: { id: true, label: true, emailAddress: true }
        });
        if (!sender) return reply.badRequest("sender unavailable or inactive");
        senderId = sender.id;
        senderLabel = sender.label;
        senderEmail = sender.emailAddress;
      }

      // Render in case the editor sent raw template content with {{vars}}.
      const subjectRendered = renderTemplate(parsed.data.subject, variables);
      const htmlRendered = renderTemplate(parsed.data.html ?? "", variables);
      const textRendered = renderTemplate(parsed.data.text ?? "", variables);

      const message = await prisma.message.create({
        data: {
          tenantId: user.tenantId,
          smtpAccountId: parsed.data.senderType === "gmail" ? senderId : null,
          domainSenderId: parsed.data.senderType === "domain" ? senderId : null,
          idempotencyKey: `template-test-${randomUUID()}`,
          to: [parsed.data.to],
          cc: [],
          bcc: [],
          subject: subjectRendered.value,
          text: textRendered.value || null,
          html: htmlRendered.value || null,
          status: "queued",
          isTest: true
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
          data: { status: "failed", lastError: "queue unavailable" }
        });
        request.log.error({ err: error }, "failed to enqueue template test-send");
        return reply.code(503).send({
          error: "queue_unavailable",
          message: "Redis queue is unavailable. Start Redis and worker, then retry."
        });
      }

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.templates.test_send",
        metadata: {
          messageId: message.id,
          templateId: parsed.data.templateId ?? null,
          to: parsed.data.to,
          senderLabel,
          senderEmail
        }
      });

      return reply.code(202).send({
        data: {
          messageId: message.id,
          status: message.status,
          to: parsed.data.to
        }
      });
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
          },
          domainPermissions: {
            select: { domainSenderId: true }
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
          smtpAccountIds: key.permissions.map((p) => p.smtpAccountId),
          domainSenderIds: key.domainPermissions.map((p) => p.domainSenderId)
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
      const domainSenders = await prisma.domainSender.findMany({
        where: {
          tenantId: user.tenantId,
          id: { in: parsed.data.domainSenderIds },
          domain: { userId: user.actorId }
        },
        select: { id: true }
      });
      if (domainSenders.length !== parsed.data.domainSenderIds.length) {
        return reply.badRequest("one or more domain sender ids are invalid");
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
          ...(parsed.data.smtpAccountIds.length > 0
            ? {
                permissions: {
                  createMany: {
                    data: parsed.data.smtpAccountIds.map((id) => ({
                      smtpAccountId: id
                    }))
                  }
                }
              }
            : {}),
          ...(parsed.data.domainSenderIds.length > 0
            ? {
                domainPermissions: {
                  createMany: {
                    data: parsed.data.domainSenderIds.map((id) => ({
                      domainSenderId: id
                    }))
                  }
                }
              }
            : {})
        }
      });

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.api_key.create",
        metadata: { apiKeyId: apiKey.id, apiKeyName: apiKey.name }
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
        where: { id: params.id, tenantId: user.tenantId }
      });
      if (!existing) return reply.notFound("api key not found");

      const generated = generateApiKey();
      const keyHash = await hashApiKey(generated.token);
      await prisma.apiKey.update({
        where: { id: existing.id },
        data: { keyHash, prefix: generated.prefix, status: "active", revokedAt: null }
      });

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.api_key.rotate",
        metadata: { apiKeyId: existing.id, apiKeyName: existing.name }
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

      const existing = await prisma.apiKey.findFirst({
        where: { id: params.id, tenantId: user.tenantId }
      });
      if (!existing) return reply.notFound("api key not found");

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
        metadata: { apiKeyId: params.id, apiKeyName: existing.name }
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
      const userIds = Array.from(
        new Set(logs.filter((entry) => entry.actorType === "user").map((entry) => entry.actorId))
      );
      const apiKeyIds = Array.from(
        new Set(logs.filter((entry) => entry.actorType === "api_key").map((entry) => entry.actorId))
      );

      const [users, apiKeys] = await Promise.all([
        userIds.length
          ? prisma.user.findMany({
              where: { tenantId: user.tenantId, id: { in: userIds } },
              select: { id: true, email: true }
            })
          : Promise.resolve([]),
        apiKeyIds.length
          ? prisma.apiKey.findMany({
              where: { tenantId: user.tenantId, id: { in: apiKeyIds } },
              select: { id: true, name: true }
            })
          : Promise.resolve([])
      ]);

      const userNameById = new Map(
        users.map((entry) => {
          const raw = entry.email.split("@")[0] ?? "user";
          const spaced = raw.replace(/[._-]+/g, " ").trim() || "User";
          const titled = spaced.replace(/\b\w/g, (char) => char.toUpperCase());
          return [entry.id, titled] as const;
        })
      );
      const apiKeyNameById = new Map(apiKeys.map((entry) => [entry.id, entry.name]));

      const formatted = formatAuditLogs(logs, userNameById, apiKeyNameById);

      return reply.send({ data: formatted });
    }
  );

  app.get(
    "/admin/v1/system-logs",
    { preHandler: [authenticateUserSession] },
    async (request, reply) => {
      const user = getUserContext(request);
      const query = request.query as { limit?: string };
      const limit = Math.min(Number(query.limit ?? 50), 200);
      const logs = await prisma.auditLog.findMany({
        where: { tenantId: user.tenantId, actorType: "system" },
        orderBy: { createdAt: "desc" },
        take: limit
      });

      const formatted = formatAuditLogs(logs, new Map(), new Map());

      return reply.send({ data: formatted });
    }
  );

  app.get(
    "/admin/v1/email-logs",
    { preHandler: [authenticateUserSession] },
    async (request, reply) => {
      const user = getUserContext(request);
      const query = request.query as { limit?: string };
      const limit = Math.min(Number(query.limit ?? 50), 200);
      const messages = await prisma.message.findMany({
        where: { tenantId: user.tenantId },
        orderBy: { createdAt: "desc" },
        take: limit,
        select: {
          status: true,
          to: true,
          subject: true,
          lastError: true,
          createdAt: true,
          sentAt: true,
          smtpAccount: {
            select: {
              label: true,
              gmailAddress: true
            }
          },
          domainSender: {
            select: {
              label: true,
              emailAddress: true
            }
          }
        }
      });

      const formatted = messages.map((message) => {
        const recipients = Array.isArray(message.to)
          ? message.to.filter((value) => typeof value === "string")
          : [];
        const senderLabel =
          message.smtpAccount?.label ||
          message.smtpAccount?.gmailAddress ||
          message.domainSender?.label ||
          message.domainSender?.emailAddress ||
          "Sender";

        return {
          status: message.status,
          senderLabel,
          to: recipients,
          subject: message.subject,
          lastError: message.lastError,
          createdAt: message.createdAt,
          sentAt: message.sentAt
        };
      });

      return reply.send({ data: formatted });
    }
  );

  function isPrivateIp(ip: string): boolean {
    const cleaned = ip.trim();
    if (!cleaned) return true;
    if (cleaned === "::1") return true;
    const lower = cleaned.toLowerCase();
    if (lower.startsWith("fc") || lower.startsWith("fd") || lower.startsWith("fe80")) {
      return true;
    }
    if (cleaned.includes(".")) {
      const parts = cleaned.split(".").map((part) => Number(part));
      if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) return true;
      const [a, b] = parts;
      if (a === 10) return true;
      if (a === 127) return true;
      if (a === 192 && b === 168) return true;
      if (a === 172 && b >= 16 && b <= 31) return true;
      if (a === 169 && b === 254) return true;
    }
    return false;
  }

  function getString(value: unknown): string | undefined {
    return typeof value === "string" && value.trim().length > 0 ? value : undefined;
  }

  function buildSummary(
    action: string,
    actorName: string,
    metadata: Record<string, unknown> | null
  ) {
    const senderLabel = getString(metadata?.senderLabel);
    const apiKeyName = getString(metadata?.apiKeyName);
    const templateName = getString(metadata?.templateName);
    const status = getString(metadata?.status);
    const reason = getString(metadata?.reason);
    const path = getString(metadata?.path);
    const apiKeyPrefix = getString(metadata?.apiKeyPrefix);
    const fields = Array.isArray(metadata?.fields)
      ? metadata?.fields.filter((field) => typeof field === "string")
      : null;
    const statusChanged = fields ? fields.includes("status") : false;
    const senderText = senderLabel ? `Sender ${senderLabel}` : "Sender";
    const apiKeyText = apiKeyName ? `API key ${apiKeyName}` : "API key";
    const templateText = templateName ? `Template ${templateName}` : "Template";
    const fieldLabels: Record<string, string> = {
      label: "name",
      perDayLimit: "per-day limit",
      status: "status",
      name: "name",
      subject: "subject",
      html: "html",
      text: "text"
    };
    const changeDetails =
      fields && fields.length
        ? fields
            .map((field) => fieldLabels[field] ?? field)
            .filter((field) => field !== "status")
            .join(", ")
        : "";

    switch (action) {
      case "system.worker.started":
        return "Worker started by System";
      case "system.worker.stopped":
        return "Worker stopped by System";
      case "system.api.started":
        return "API started by System";
      case "system.api.stopped":
        return "API stopped by System";
      case "security.api_key.rejected": {
        const reasonText = reason ? ` (${reason})` : "";
        const pathText = path ? ` on ${path}` : "";
        const prefixText = apiKeyPrefix ? ` [${apiKeyPrefix}]` : "";
        return `API key rejected${reasonText}${pathText}${prefixText}`;
      }
      case "admin.auth.login":
        return `${actorName} signed in`;
      case "admin.auth.logout":
        return `${actorName} signed out`;
      case "admin.auth.register":
        return `${actorName} registered`;
      case "admin.sender.create":
        return `${senderText} created by ${actorName}`;
      case "admin.sender.update":
        if (statusChanged && status === "active") {
          return `${senderText} activated by ${actorName}`;
        }
        if (statusChanged && status === "disabled") {
          return `${senderText} deactivated by ${actorName}`;
        }
        if (changeDetails) {
          return `${senderText} updated (${changeDetails}) by ${actorName}`;
        }
        return `${senderText} updated by ${actorName}`;
      case "admin.sender.disable":
        return `${senderText} deactivated by ${actorName}`;
      case "admin.sender.test_send":
        return `${senderText} test email sent by ${actorName}`;
      case "admin.api_key.create":
        return `${apiKeyText} created by ${actorName}`;
      case "admin.api_key.rotate":
        return `${apiKeyText} rotated by ${actorName}`;
      case "admin.api_key.revoke":
        return `${apiKeyText} revoked by ${actorName}`;
      case "admin.template.create":
        return `${templateText} created by ${actorName}`;
      case "admin.template.update":
        if (statusChanged && status === "active") {
          return `${templateText} activated by ${actorName}`;
        }
        if (statusChanged && status === "disabled") {
          return `${templateText} deactivated by ${actorName}`;
        }
        if (changeDetails) {
          return `${templateText} updated (${changeDetails}) by ${actorName}`;
        }
        return `${templateText} updated by ${actorName}`;
      case "admin.template.disable":
        return `${templateText} deactivated by ${actorName}`;
      case "admin.test_api.send":
        return senderLabel
          ? `Test email queued by ${actorName} using ${senderLabel}`
          : `Test email queued by ${actorName}`;
      default:
        return `Audit event recorded by ${actorName}`;
    }
  }

  function formatAuditLogs(
    logs: Array<{
      id: string;
      action: string;
      actorType: "user" | "api_key" | "system";
      actorId: string;
      ip: string | null;
      createdAt: Date;
      metadata: unknown;
    }>,
    userNameById: Map<string, string>,
    apiKeyNameById: Map<string, string>
  ) {
    return logs.map((entry) => {
      const actorName =
        entry.actorType === "system"
          ? "System"
          : entry.actorType === "api_key"
          ? apiKeyNameById.get(entry.actorId) ?? "API Key"
          : userNameById.get(entry.actorId) ?? "User";

      const ip = entry.ip && !isPrivateIp(entry.ip) ? entry.ip : null;
      const metadata =
        entry.metadata && typeof entry.metadata === "object"
          ? (entry.metadata as Record<string, unknown>)
          : null;

      return {
        id: entry.id,
        action: entry.action,
        actorType: entry.actorType,
        actorName,
        ip,
        createdAt: entry.createdAt,
        summary: buildSummary(entry.action, actorName, metadata)
      };
    });
  }
}
