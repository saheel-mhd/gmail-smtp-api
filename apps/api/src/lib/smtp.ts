import nodemailer from "nodemailer";
import { env } from "../env";

export async function verifyGmailCredentials(
  gmailAddress: string,
  appPassword: string
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: gmailAddress, pass: appPassword }
  });
  await transporter.verify();
}

type SendMailParams = {
  gmailAddress: string;
  appPassword: string;
  fromName?: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
  headers?: Record<string, string>;
};

export async function sendGmailMessage({
  gmailAddress,
  appPassword,
  fromName,
  to,
  cc = [],
  bcc = [],
  subject,
  text,
  html,
  replyTo,
  headers = {}
}: SendMailParams): Promise<void> {
  if (env.SKIP_SMTP_VERIFY) {
    return;
  }
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: gmailAddress, pass: appPassword }
  });

  await transporter.sendMail({
    from: fromName ? `"${fromName}" <${gmailAddress}>` : gmailAddress,
    to,
    cc,
    bcc,
    subject,
    text: text ?? undefined,
    html: html ?? undefined,
    replyTo: replyTo ?? undefined,
    headers
  });
}

export function classifySendError(error: unknown): "transient" | "permanent" | "auth" {
  const message = (error as Error)?.message?.toLowerCase() ?? "";
  if (
    message.includes("invalid login") ||
    message.includes("auth") ||
    message.includes("username and password")
  ) {
    return "auth";
  }
  if (
    message.includes("invalid recipient") ||
    message.includes("mailbox unavailable") ||
    message.includes("policy")
  ) {
    return "permanent";
  }
  return "transient";
}
