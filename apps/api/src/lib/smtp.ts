import nodemailer from "nodemailer";
import { env } from "../env";

export function createGmailTransport(gmailAddress: string, appPassword: string) {
  return nodemailer.createTransport({
    host: env.GMAIL_SMTP_HOST,
    port: env.GMAIL_SMTP_PORT,
    secure: env.GMAIL_SMTP_SECURE,
    requireTLS: env.GMAIL_SMTP_REQUIRE_TLS,
    auth: { user: gmailAddress, pass: appPassword }
  });
}

export async function verifyGmailCredentials(
  gmailAddress: string,
  appPassword: string
): Promise<void> {
  const transporter = createGmailTransport(gmailAddress, appPassword);
  await transporter.verify();
}
