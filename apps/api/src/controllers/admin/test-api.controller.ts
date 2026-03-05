import { FastifyReply } from "fastify";
import { randomUUID } from "node:crypto";
import { prisma } from "../../lib/prisma";
import { renderTemplate } from "../../lib/template";
import { getSendQueue } from "../../queue";
import { writeAuditLog } from "../../plugins/audit";
import { testApiSendSchema } from "../../schemas/admin/test-api.schema";
import { AuthenticatedRequest, getUserContext } from "./context";

export async function testApiSendController(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
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
