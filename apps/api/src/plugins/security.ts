import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";
import { verifyApiKey } from "../lib/api-key";
import { redis } from "../lib/redis";
import { env } from "../env";
import { randomToken } from "../lib/crypto";

const minuteWindow = 60;
const dayWindow = 24 * 60 * 60;

export async function authenticateApiKey(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return reply.unauthorized("missing bearer token");
  }

  const token = authHeader.slice("Bearer ".length).trim();
  const prefix = token.slice(0, 6);
  const candidates = await prisma.apiKey.findMany({
    where: { prefix, status: "active" },
    include: {
      permissions: { select: { smtpAccountId: true } }
    }
  });

  for (const candidate of candidates) {
    const valid = await verifyApiKey(token, candidate.keyHash);
    if (!valid) continue;
    const reqIp = request.ip;
    const allowedIps = Array.isArray(candidate.allowedIps)
      ? (candidate.allowedIps as string[])
      : [];
    if (allowedIps.length > 0 && !allowedIps.includes(reqIp)) {
      return reply.forbidden("ip not allowed for this key");
    }

    request.actor = {
      actorType: "api_key",
      actorId: candidate.id,
      apiKeyId: candidate.id,
      tenantId: candidate.tenantId,
      allowedSmtpAccountIds: candidate.permissions.map((p) => p.smtpAccountId),
      rateLimitPerMinute: candidate.rateLimitPerMinute,
      allowedIps
    };
    return;
  }

  return reply.unauthorized("invalid api key");
}

export async function authenticateUserSession(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const token = request.cookies[env.SESSION_COOKIE_NAME];
  if (!token) return reply.unauthorized("not authenticated");

  try {
    const decoded = request.server.jwt.verify<{
      sub: string;
      tenantId: string;
      role: "owner" | "admin" | "readonly";
    }>(token);
    request.actor = {
      actorType: "user",
      actorId: decoded.sub,
      tenantId: decoded.tenantId,
      role: decoded.role
    };
  } catch {
    return reply.unauthorized("invalid session");
  }
}

export function requireRole(...roles: Array<"owner" | "admin" | "readonly">) {
  return async function roleGuard(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    if (!request.actor || request.actor.actorType !== "user") {
      return reply.unauthorized("not authenticated");
    }
    if (!roles.includes(request.actor.role)) {
      return reply.forbidden("insufficient role");
    }
  };
}

export async function enforceCsrf(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return;
  const cookieToken = request.cookies[env.CSRF_COOKIE_NAME];
  const headerToken = request.headers["x-csrf-token"];
  if (!cookieToken || typeof headerToken !== "string" || cookieToken !== headerToken) {
    return reply.forbidden("csrf token mismatch");
  }
}

export function setSessionCookies(
  request: FastifyRequest,
  reply: FastifyReply,
  payload: { sub: string; tenantId: string; role: "owner" | "admin" | "readonly" }
): string {
  const sessionToken = request.server.jwt.sign(payload, { expiresIn: "12h" });
  const csrfToken = randomToken(24);

  reply.setCookie(env.SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });
  reply.setCookie(env.CSRF_COOKIE_NAME, csrfToken, {
    httpOnly: false,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });

  return csrfToken;
}

export async function enforceRateLimit(
  key: string,
  limit: number,
  windowSec = minuteWindow
): Promise<{ allowed: boolean; remaining: number }> {
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, windowSec);
  }
  return {
    allowed: current <= limit,
    remaining: Math.max(limit - current, 0)
  };
}

export async function enforceDailyQuota(
  key: string,
  limit: number
): Promise<{ allowed: boolean; remaining: number }> {
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, dayWindow);
  }
  return {
    allowed: current <= limit,
    remaining: Math.max(limit - current, 0)
  };
}
