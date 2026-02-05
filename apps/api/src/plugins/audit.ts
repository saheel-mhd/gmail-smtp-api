import { FastifyRequest } from "fastify";
import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

export async function writeAuditLog(
  request: FastifyRequest,
  args: {
    tenantId: string;
    actorType: "user" | "api_key" | "system";
    actorId: string;
    action: string;
    metadata?: Record<string, unknown>;
  }
): Promise<void> {
  await prisma.auditLog.create({
    data: {
      tenantId: args.tenantId,
      actorType: args.actorType,
      actorId: args.actorId,
      action: args.action,
      metadata: (args.metadata ?? {}) as Prisma.InputJsonValue,
      ip: request.ip,
      userAgent: request.headers["user-agent"]
    }
  });
}
