import { FastifyReply } from "fastify";
import { Prisma } from "../../../generated/prisma/client";
import { createSenderSchema } from "@gmail-smtp/shared";
import { prisma } from "../../lib/prisma";
import { env } from "../../env";
import { encryptSecret } from "../../lib/crypto";
import { verifyGmailCredentials } from "../../lib/smtp";
import { writeAuditLog } from "../../plugins/audit";
import { AuthenticatedRequest, getUserContext } from "./context";

export async function listSendersController(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
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
    .filter((sender) => !sender.sentTodayResetAt || sender.sentTodayResetAt < dayStart)
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
    .filter((sender) => !sender.sentTodayResetAt || sender.sentTodayResetAt < dayStart)
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

export async function createSenderController(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
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
      const err = error instanceof Error ? error : new Error("unknown error");
      request.log.error({ err }, "failed to create sender");
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
    const err = error instanceof Error ? error : new Error("unknown error");
    request.log.error({ err }, "failed to create domain sender");
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
