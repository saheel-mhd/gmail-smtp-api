import { FastifyReply } from "fastify";
import { randomUUID } from "node:crypto";
import { prisma } from "../../lib/prisma";
import { env } from "../../env";
import { writeAuditLog } from "../../plugins/audit";
import { resolveCname, resolveMx, resolveTxt } from "../../lib/dns";
import { domainSchema, patchDomainSchema } from "../../schemas/admin/domain.schema";
import { AuthenticatedRequest, getUserContext } from "./context";

export async function listDomainsController(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
  const user = getUserContext(request);
  const domains = await prisma.domain.findMany({
    where: { tenantId: user.tenantId, userId: user.actorId },
    orderBy: { createdAt: "desc" }
  });
  const gmailSenders = await prisma.smtpAccount.findMany({
    where: { tenantId: user.tenantId },
    select: {
      id: true,
      label: true,
      gmailAddress: true,
      status: true
    }
  });
  const domainSenders = await prisma.domainSender.findMany({
    where: {
      tenantId: user.tenantId,
      domain: { userId: user.actorId }
    },
    select: {
      id: true,
      label: true,
      emailAddress: true,
      status: true
    }
  });
  const [smtpCounts, domainCounts] = await Promise.all([
    prisma.message.groupBy({
      by: ["smtpAccountId"],
      where: { tenantId: user.tenantId, status: "sent", smtpAccountId: { not: null } },
      _count: { _all: true }
    }),
    prisma.message.groupBy({
      by: ["domainSenderId"],
      where: { tenantId: user.tenantId, status: "sent", domainSenderId: { not: null } },
      _count: { _all: true }
    })
  ]);
  const smtpCountMap = new Map<string, number>(
    smtpCounts.map((row) => [row.smtpAccountId ?? "", row._count._all])
  );
  const domainCountMap = new Map<string, number>(
    domainCounts.map((row) => [row.domainSenderId ?? "", row._count._all])
  );

  const allSenders = [
    ...gmailSenders.map((sender) => ({
      id: sender.id,
      label: sender.label,
      emailAddress: sender.gmailAddress,
      status: sender.status,
      sentCount: smtpCountMap.get(sender.id) ?? 0
    })),
    ...domainSenders.map((sender) => ({
      id: sender.id,
      label: sender.label,
      emailAddress: sender.emailAddress,
      status: sender.status,
      sentCount: domainCountMap.get(sender.id) ?? 0
    }))
  ];

  const data = domains.map((domain) => {
    const domainName = domain.domain.toLowerCase();
    const domainSenders = allSenders.filter((sender) =>
      sender.emailAddress.toLowerCase().endsWith(`@${domainName}`)
    );
    const domainSentCount = domainSenders.reduce(
      (sum, sender) => sum + sender.sentCount,
      0
    );
    return {
      ...domain,
      senders: domainSenders,
      sentCount: domainSentCount
    };
  });

  return reply.send({ data });
}

export async function createDomainController(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
  const user = getUserContext(request);
  const parsed = domainSchema.safeParse(request.body);
  if (!parsed.success) return reply.badRequest(parsed.error.message);

  const domain = parsed.data.domain.toLowerCase();
  const verificationToken = randomUUID().replace(/-/g, "");
  const txtHost = `_gmailsmtp.${domain}`;
  const txtValue = `gmail-smtp-verify=${verificationToken}`;
  const spfHost = domain;
  const spfValue = `v=spf1 include:${env.APP_DOMAIN} ~all`;
  const cnameHost = `mail.${domain}`;
  const cnameValue = `mail.${env.APP_DOMAIN}`;
  const mxHost = `mx.${env.APP_DOMAIN}`;

  const created = await prisma.domain.upsert({
    where: { userId_domain: { userId: user.actorId, domain } },
    create: {
      tenantId: user.tenantId,
      userId: user.actorId,
      domain,
      verificationToken,
      txtHost,
      txtValue,
      spfHost,
      spfValue,
      cnameHost,
      cnameValue,
      mxHost,
      smtpHost: parsed.data.smtpHost ?? null,
      smtpPort: parsed.data.smtpPort ?? 587,
      smtpSecure: parsed.data.smtpSecure ?? false,
      status: "pending"
    },
    update: {
      verificationToken,
      txtHost,
      txtValue,
      spfHost,
      spfValue,
      cnameHost,
      cnameValue,
      mxHost,
      smtpHost: parsed.data.smtpHost ?? null,
      smtpPort: parsed.data.smtpPort ?? 587,
      smtpSecure: parsed.data.smtpSecure ?? false,
      status: "pending",
      verifiedAt: null
    }
  });

  await writeAuditLog(request, {
    tenantId: user.tenantId,
    actorType: "user",
    actorId: user.actorId,
    action: "admin.domain.create",
    metadata: { domainId: created.id, domain }
  });

  return reply.code(201).send({ data: created });
}

export async function updateDomainController(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
  const user = getUserContext(request);
  const params = request.params as { id: string };
  const parsed = patchDomainSchema.safeParse(request.body);
  if (!parsed.success) return reply.badRequest(parsed.error.message);

  const updated = await prisma.domain.updateMany({
    where: { id: params.id, tenantId: user.tenantId, userId: user.actorId },
    data: {
      smtpHost: parsed.data.smtpHost,
      smtpPort: parsed.data.smtpPort,
      smtpSecure: parsed.data.smtpSecure
    }
  });
  if (!updated.count) return reply.notFound("domain not found");

  await writeAuditLog(request, {
    tenantId: user.tenantId,
    actorType: "user",
    actorId: user.actorId,
    action: "admin.domain.update",
    metadata: { domainId: params.id }
  });

  const fresh = await prisma.domain.findFirst({
    where: { id: params.id, tenantId: user.tenantId, userId: user.actorId }
  });

  return reply.send({ data: fresh });
}

export async function verifyDomainController(
  request: AuthenticatedRequest,
  reply: FastifyReply
) {
  const user = getUserContext(request);
  const params = request.params as { id: string };
  const domain = await prisma.domain.findFirst({
    where: { id: params.id, tenantId: user.tenantId, userId: user.actorId }
  });
  if (!domain) return reply.notFound("domain not found");

  const mxAliasHost = `mx.${domain.domain}`.toLowerCase();
  const [txtRecords, spfRecords, cnameRecords, mxRecords, mxAliasCnames] =
    await Promise.all([
      resolveTxt(domain.txtHost),
      resolveTxt(domain.spfHost),
      resolveCname(domain.cnameHost),
      resolveMx(domain.domain),
      resolveCname(mxAliasHost)
    ]);

  const txtOk = txtRecords.includes(domain.txtValue);
  const spfOk = spfRecords.some(
    (value) => value.includes("v=spf1") && value.includes(`include:${env.APP_DOMAIN}`)
  );
  const cnameOk = cnameRecords.includes(domain.cnameValue.toLowerCase());
  const mxExpected = domain.mxHost.toLowerCase();
  const mxUsesAlias = mxRecords.some((row) => row.exchange === mxAliasHost);
  const mxOk = mxRecords.some(
    (row) => row.exchange === mxExpected || row.exchange === mxAliasHost
  );
  const mxCnameOk = mxUsesAlias ? mxAliasCnames.includes(mxExpected) : true;

  const allOk = txtOk && spfOk && cnameOk && mxOk && mxCnameOk;
  const updated = await prisma.domain.update({
    where: { id: domain.id },
    data: {
      status: allOk ? "verified" : "failed",
      verifiedAt: allOk ? new Date() : null
    }
  });

  await writeAuditLog(request, {
    tenantId: user.tenantId,
    actorType: "user",
    actorId: user.actorId,
    action: "admin.domain.verify",
    metadata: { domainId: domain.id, status: updated.status }
  });

  return reply.send({
    data: updated,
    checks: {
      txtOk,
      spfOk,
      cnameOk,
      mxOk,
      mxCnameOk
    }
  });
}
