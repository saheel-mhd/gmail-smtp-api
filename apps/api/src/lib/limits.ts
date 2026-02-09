import { prisma } from "./prisma";

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
};

function startOfUtcDay(date = new Date()): Date {
  const iso = date.toISOString().slice(0, 10);
  return new Date(`${iso}T00:00:00.000Z`);
}

function minuteBucketUtc(date = new Date()): Date {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      0,
      0
    )
  );
}

export async function enforceApiKeyRateLimit(
  apiKeyId: string,
  limit: number
): Promise<RateLimitResult> {
  const bucket = minuteBucketUtc();
  const rows = await prisma.$queryRaw<{ count: number }[]>`
    INSERT INTO "ApiKeyRateLimit" ("apiKeyId", "minuteBucket", "count")
    VALUES (${apiKeyId}, ${bucket}, 1)
    ON CONFLICT ("apiKeyId", "minuteBucket")
    DO UPDATE SET "count" = "ApiKeyRateLimit"."count" + 1
    RETURNING "count";
  `;
  if (Math.random() < 0.02) {
    const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000);
    await prisma.$executeRaw`
      DELETE FROM "ApiKeyRateLimit"
      WHERE "minuteBucket" < ${cutoff};
    `;
  }
  const count = Number(rows?.[0]?.count ?? 0);
  return {
    allowed: count <= limit,
    remaining: Math.max(limit - count, 0)
  };
}

export async function reserveTenantDailyQuota(
  tenantId: string,
  limit: number
): Promise<RateLimitResult> {
  const dayStart = startOfUtcDay();
  const result = await prisma.$transaction(async (tx) => {
    const rows = await tx.$queryRaw<
      { dailySentCount: number; dailyCountResetAt: Date | null }[]
    >`SELECT "dailySentCount", "dailyCountResetAt" FROM "Tenant" WHERE "id" = ${tenantId} FOR UPDATE`;
    if (!rows.length) {
      return { allowed: false, remaining: 0 };
    }
    const row = rows[0];
    const shouldReset = !row.dailyCountResetAt || row.dailyCountResetAt < dayStart;
    const current = shouldReset ? 0 : row.dailySentCount ?? 0;
    if (current >= limit) {
      return { allowed: false, remaining: 0 };
    }
    const next = current + 1;
    await tx.tenant.update({
      where: { id: tenantId },
      data: {
        dailySentCount: next,
        dailyCountResetAt: dayStart
      }
    });
    return { allowed: true, remaining: Math.max(limit - next, 0) };
  });
  return result;
}

export async function reserveSenderDailyQuota(
  senderId: string,
  perDayLimit: number
): Promise<{ allowed: boolean; dayStart: Date }> {
  const dayStart = startOfUtcDay();
  const result = await prisma.$transaction(async (tx) => {
    const rows = await tx.$queryRaw<
      { sentTodayCount: number; sentTodayResetAt: Date | null }[]
    >`SELECT "sentTodayCount", "sentTodayResetAt" FROM "SmtpAccount" WHERE "id" = ${senderId} FOR UPDATE`;
    if (!rows.length) {
      return { allowed: false };
    }
    const row = rows[0];
    const shouldReset = !row.sentTodayResetAt || row.sentTodayResetAt < dayStart;
    const current = shouldReset ? 0 : row.sentTodayCount ?? 0;
    if (current >= perDayLimit) {
      return { allowed: false };
    }
    const next = current + 1;
    await tx.smtpAccount.update({
      where: { id: senderId },
      data: {
        sentTodayCount: next,
        sentTodayResetAt: dayStart
      }
    });
    return { allowed: true };
  });

  return { allowed: result.allowed, dayStart };
}

export async function releaseSenderDailyQuota(
  senderId: string,
  dayStart: Date
): Promise<void> {
  await prisma.smtpAccount.updateMany({
    where: {
      id: senderId,
      sentTodayResetAt: dayStart,
      sentTodayCount: { gt: 0 }
    },
    data: {
      sentTodayCount: { decrement: 1 }
    }
  });
}
