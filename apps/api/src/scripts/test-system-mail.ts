/**
 * Diagnostic: send a test email through the system SMTP.
 * Usage:
 *   npx tsx apps/api/src/scripts/test-system-mail.ts you@example.com
 */
import { env } from "../env";
import { isSystemMailConfigured, sendSystemMail } from "../lib/system-mail";

async function main() {
  const to = process.argv[2];
  if (!to) {
    console.error("Usage: tsx test-system-mail.ts <recipient-email>");
    process.exit(1);
  }

  console.log("System SMTP config:");
  console.log("  HOST:", env.SYSTEM_SMTP_HOST ?? "(unset)");
  console.log("  PORT:", env.SYSTEM_SMTP_PORT ?? "(unset)");
  console.log("  USER:", env.SYSTEM_SMTP_USER ?? "(unset)");
  console.log("  PASSWORD:", env.SYSTEM_SMTP_PASSWORD ? "(set)" : "(unset)");
  console.log("  FROM:", env.SYSTEM_SMTP_FROM ?? "(unset)");
  console.log("  configured:", isSystemMailConfigured());
  console.log();

  console.log(`Sending test email to ${to}…`);
  const result = await sendSystemMail({
    to,
    subject: "Mailler system SMTP test",
    text:
      "If you're reading this, your SYSTEM_SMTP_* configuration is working.\n\n" +
      "This message was sent by the test-system-mail diagnostic script."
  });

  if (result.delivered) {
    console.log("✓ Delivered (or logged via dev fallback).", result.reason ? `[${result.reason}]` : "");
  } else {
    console.error("✗ Send failed:", result.reason);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
