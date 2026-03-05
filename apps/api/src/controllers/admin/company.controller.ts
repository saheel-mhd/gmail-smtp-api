import { FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";
import { writeAuditLog } from "../../plugins/audit";
import { companySchema, isBlockedCompanyEmail } from "../../schemas/admin/company.schema";
import { AuthenticatedRequest, getUserContext } from "./context";

export async function getCompanyController(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
  const user = getUserContext(request);
  const company = await prisma.company.findFirst({
    where: { tenantId: user.tenantId, userId: user.actorId }
  });
  return reply.send({ data: company ?? null });
}

export async function upsertCompanyController(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
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
