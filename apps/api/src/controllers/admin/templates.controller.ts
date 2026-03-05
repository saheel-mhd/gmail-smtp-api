import { FastifyReply } from "fastify";
import { Prisma } from "../../../generated/prisma/client";
import { createTemplateSchema, patchTemplateSchema } from "@gmail-smtp/shared";
import { prisma } from "../../lib/prisma";
import { writeAuditLog } from "../../plugins/audit";
import { AuthenticatedRequest, getUserContext } from "./context";

export async function listTemplatesController(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
  const user = getUserContext(request);
  const templates = await prisma.template.findMany({
    where: { tenantId: user.tenantId },
    orderBy: { createdAt: "desc" }
  });
  return reply.send({ data: templates });
}

export async function createTemplateController(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
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
    const err = error instanceof Error ? error : new Error("unknown error");
    request.log.error({ err }, "failed to create template");
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

export async function updateTemplateController(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
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
    const err = error instanceof Error ? error : new Error("unknown error");
    request.log.error({ err }, "failed to update template");
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

export async function disableTemplateController(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
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
