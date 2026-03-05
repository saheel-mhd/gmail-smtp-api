import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcryptjs";
import { authenticator } from "otplib";
import { prisma } from "../../lib/prisma";
import { decryptSecret } from "../../lib/crypto";
import { env } from "../../env";
import { setSessionCookies } from "../../plugins/security";
import { writeAuditLog } from "../../plugins/audit";
import { registerSchema } from "../../schemas/admin/auth.schema";
import { AuthenticatedRequest, getUserContext } from "./context";

export async function loginController(request: FastifyRequest, reply: FastifyReply) {
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
}

export async function registerController(request: FastifyRequest, reply: FastifyReply) {
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
}

export async function logoutController(request: AuthenticatedRequest, reply: FastifyReply) {
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

export async function meController(request: AuthenticatedRequest, reply: FastifyReply) {
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
