import { FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";
import { formatAuditLogs } from "../../lib/audit-summary";
import { AuthenticatedRequest, getUserContext } from "./context";

export async function auditLogsController(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
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

export async function systemLogsController(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
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

export async function emailLogsController(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
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
