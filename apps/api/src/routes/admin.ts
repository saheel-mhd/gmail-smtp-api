import { FastifyInstance } from "fastify";
import { Prisma } from "../../generated/prisma/client";
import { randomUUID } from "node:crypto";
import { promises as dns } from "node:dns";
import bcrypt from "bcryptjs";
import { authenticator } from "otplib";
import nodemailer from "nodemailer";
import { z } from "zod";
import {
  createApiKeySchema,
  createSenderSchema,
  createTemplateSchema,
  patchSenderSchema,
  patchTemplateSchema
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
  const companySchema = z.object({
    name: z.string().min(1).max(120),
    service: z.string().min(1).max(120),
    phone: z.string().min(3).max(40),
    email: z.string().email().max(160),
    address: z.string().min(3).max(240),
    website: z.string().max(200).optional()
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

  app.post(
    "/admin/v1/auth/logout",
    { preHandler: [authenticateUserSession, enforceCsrf] },
    async (request, reply) => {
      const user = getUserContext(request);
      const sameSite = env.NODE_ENV === "production" ? "none" : "lax";
      const cookieOptions = {
        path: "/",
        sameSite,
        secure: env.NODE_ENV === "production"
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

      const company = await prisma.company.upsert({
        where: { userId: user.actorId },
        create: {
          tenantId: user.tenantId,
          userId: user.actorId,
          name: parsed.data.name,
          service: parsed.data.service,
          phone: parsed.data.phone,
          email: parsed.data.email,
          address: parsed.data.address,
          website: parsed.data.website?.trim() || null
        },
        update: {
          name: parsed.data.name,
          service: parsed.data.service,
          phone: parsed.data.phone,
          email: parsed.data.email,
          address: parsed.data.address,
          website: parsed.data.website?.trim() || null
        }
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
      const sentCounts = await prisma.message.groupBy({
        by: ["smtpAccountId"],
        where: { tenantId: user.tenantId, status: "sent" },
        _count: { _all: true }
      });
      const sentCountMap = new Map<string, number>(
        sentCounts.map((row) => [row.smtpAccountId, row._count._all])
      );

      const allSenders = [
        ...gmailSenders.map((sender) => ({
          id: sender.id,
          label: sender.label,
          emailAddress: sender.gmailAddress,
          status: sender.status,
          sentCount: sentCountMap.get(sender.id) ?? 0
        })),
        ...domainSenders.map((sender) => ({
          id: sender.id,
          label: sender.label,
          emailAddress: sender.emailAddress,
          status: sender.status,
          sentCount: 0
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

      const [txtRecords, spfRecords, cnameRecords, mxRecords] = await Promise.all([
        resolveTxt(domain.txtHost),
        resolveTxt(domain.spfHost),
        resolveCname(domain.cnameHost),
        resolveMx(domain.domain)
      ]);

      const txtOk = txtRecords.includes(domain.txtValue);
      const spfOk = spfRecords.some(
        (value) => value.includes("v=spf1") && value.includes(`include:${env.APP_DOMAIN}`)
      );
      const cnameOk = cnameRecords.includes(domain.cnameValue.toLowerCase());
      const mxOk = mxRecords.some((row) => row.exchange === domain.mxHost.toLowerCase());

      const allOk = txtOk && spfOk && cnameOk && mxOk;
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
          mxOk
        }
      });
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
          apiKeyName: apiKey.name,
          senderLabel: sender.label
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

      const sender = await prisma.smtpAccount.updateMany({
        where: { id: params.id, tenantId: user.tenantId },
        data: parsed.data
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
        data: parsed.data
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
      const updated = await prisma.smtpAccount.updateMany({
        where: { id: params.id, tenantId: user.tenantId },
        data: { status: "disabled" }
      });
      if (updated.count) {
        const disabledSender = await prisma.smtpAccount.findFirst({
          where: { id: params.id, tenantId: user.tenantId },
          select: { label: true, gmailAddress: true }
        });

        await writeAuditLog(request, {
          tenantId: user.tenantId,
          actorType: "user",
          actorId: user.actorId,
          action: "admin.sender.disable",
          metadata: {
            senderId: params.id,
            senderLabel: disabledSender?.label,
            gmailAddress: disabledSender?.gmailAddress,
            status: "disabled",
            type: "gmail"
          }
        });

        return reply.send({ ok: true });
      }

      const updatedDomain = await prisma.domainSender.updateMany({
        where: {
          id: params.id,
          tenantId: user.tenantId,
          domain: { userId: user.actorId }
        },
        data: { status: "disabled" }
      });
      if (!updatedDomain.count) return reply.notFound("sender not found");

      const disabledDomainSender = await prisma.domainSender.findFirst({
        where: {
          id: params.id,
          tenantId: user.tenantId,
          domain: { userId: user.actorId }
        },
        select: { label: true, emailAddress: true }
      });

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.sender.disable",
        metadata: {
          senderId: params.id,
          senderLabel: disabledDomainSender?.label,
          emailAddress: disabledDomainSender?.emailAddress,
          status: "disabled",
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

      const template = await prisma.template.create({
        data: {
          tenantId: user.tenantId,
          name: parsed.data.name,
          subject: parsed.data.subject,
          html: parsed.data.html,
          text: parsed.data.text ?? null
        }
      });

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

      const updated = await prisma.template.updateMany({
        where: { id: params.id, tenantId: user.tenantId },
        data: update
      });
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
      const updated = await prisma.template.updateMany({
        where: { id: params.id, tenantId: user.tenantId },
        data: { status: "disabled" }
      });
      if (!updated.count) return reply.notFound("template not found");

      const latest = await prisma.template.findFirst({
        where: { id: params.id, tenantId: user.tenantId },
        select: { name: true }
      });

      await writeAuditLog(request, {
        tenantId: user.tenantId,
        actorType: "user",
        actorId: user.actorId,
        action: "admin.template.disable",
        metadata: { templateName: latest?.name, status: "disabled" }
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
          createdAt: true,
          sentAt: true,
          smtpAccount: {
            select: {
              label: true,
              gmailAddress: true
            }
          }
        }
      });

      const formatted = messages.map((message) => {
        const recipients = Array.isArray(message.to)
          ? message.to.filter((value) => typeof value === "string")
          : [];
        const senderLabel =
          message.smtpAccount.label || message.smtpAccount.gmailAddress || "Sender";

        return {
          status: message.status,
          senderLabel,
          to: recipients,
          subject: message.subject,
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
