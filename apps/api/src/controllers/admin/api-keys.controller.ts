import { FastifyReply } from "fastify";
import { createApiKeySchema } from "@gmail-smtp/shared";
import { prisma } from "../../lib/prisma";
import { env } from "../../env";
import { generateApiKey, hashApiKey } from "../../lib/api-key";
import { writeAuditLog } from "../../plugins/audit";
import { AuthenticatedRequest, getUserContext } from "./context";

export async function listApiKeysController(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
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

export async function createApiKeyController(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
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

export async function rotateApiKeyController(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
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

export async function revokeApiKeyController(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
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
