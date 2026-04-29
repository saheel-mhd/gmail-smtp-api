/**
 * Diagnostic: inspect DB state related to a forgot-password request.
 * Usage:
 *   npx tsx apps/api/src/scripts/diagnose-password-reset.ts user@example.com
 */
import { prisma } from "../lib/prisma";

async function main() {
  const email = (process.argv[2] ?? "").toLowerCase().trim();
  if (!email) {
    console.error("Usage: tsx diagnose-password-reset.ts <email>");
    process.exit(1);
  }

  console.log("Looking up email:", email);
  const user = await prisma.user.findFirst({
    where: { email },
    select: { id: true, email: true, role: true, tenantId: true, createdAt: true }
  });

  if (!user) {
    console.log("\n✗ NO USER FOUND with that email.");
    console.log("  → The forgot-password endpoint silently no-ops on missing emails.");
    console.log("  → Listing all users in DB so you can see the exact registered emails:\n");
    const all = await prisma.user.findMany({
      select: { email: true, role: true, tenantId: true, createdAt: true },
      orderBy: { createdAt: "asc" }
    });
    for (const u of all) {
      console.log(`    - ${u.email}   (${u.role}, tenant=${u.tenantId})`);
    }
    process.exit(0);
  }

  console.log("\n✓ User found:", user);

  console.log("\nRecent reset tokens for this user:");
  const tokens = await prisma.passwordResetToken.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      createdAt: true,
      expiresAt: true,
      usedAt: true,
      requestIp: true
    }
  });
  if (tokens.length === 0) {
    console.log("  (none)");
  } else {
    for (const t of tokens) {
      console.log(
        `  - ${t.createdAt.toISOString()}  used=${t.usedAt ? "yes" : "no"}  expires=${t.expiresAt.toISOString()}  ip=${t.requestIp ?? "?"}`
      );
    }
  }

  console.log("\nRecent password-reset audit entries:");
  const audits = await prisma.auditLog.findMany({
    where: {
      tenantId: user.tenantId,
      action: { in: ["admin.auth.password_reset_request", "admin.auth.password_reset_complete"] }
    },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { createdAt: true, action: true, metadata: true, ip: true }
  });
  if (audits.length === 0) {
    console.log("  (none)");
  } else {
    for (const a of audits) {
      console.log(`  - ${a.createdAt.toISOString()}  ${a.action}  ip=${a.ip ?? "?"}  meta=${JSON.stringify(a.metadata)}`);
    }
  }

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("Unexpected error:", err);
  await prisma.$disconnect();
  process.exit(1);
});
