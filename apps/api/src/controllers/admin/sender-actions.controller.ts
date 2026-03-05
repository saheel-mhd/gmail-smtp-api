import { FastifyReply } from "fastify";
import nodemailer from "nodemailer";
import { patchSenderSchema } from "@gmail-smtp/shared";
import { prisma } from "../../lib/prisma";
import { env } from "../../env";
import { decryptSecret } from "../../lib/crypto";
import { createGmailTransport } from "../../lib/smtp";
import { writeAuditLog } from "../../plugins/audit";
import { AuthenticatedRequest, getUserContext } from "./context";

export async function updateSenderController(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
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

export async function disableSenderController(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
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

export async function testSenderController(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
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
