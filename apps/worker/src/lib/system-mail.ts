import nodemailer, { Transporter } from "nodemailer";
import { env } from "../env";

let cachedTransport: Transporter | null = null;

function buildTransport(): Transporter | null {
  if (
    !env.SYSTEM_SMTP_HOST ||
    !env.SYSTEM_SMTP_PORT ||
    !env.SYSTEM_SMTP_USER ||
    !env.SYSTEM_SMTP_PASSWORD
  ) {
    return null;
  }
  if (!cachedTransport) {
    const isImplicitTls = env.SYSTEM_SMTP_PORT === 465;
    cachedTransport = nodemailer.createTransport({
      host: env.SYSTEM_SMTP_HOST,
      port: env.SYSTEM_SMTP_PORT,
      secure: isImplicitTls,
      requireTLS: !isImplicitTls,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
      auth: {
        user: env.SYSTEM_SMTP_USER,
        pass: env.SYSTEM_SMTP_PASSWORD
      }
    });
  }
  return cachedTransport;
}

export type SystemMail = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export async function deliverSystemMail(mail: SystemMail): Promise<void> {
  const transport = buildTransport();
  const fromCandidate = env.SYSTEM_SMTP_FROM?.trim();
  const from =
    fromCandidate && fromCandidate.includes("@")
      ? fromCandidate
      : env.SYSTEM_SMTP_USER || "noreply@localhost";

  if (!transport) {
    // Dev fallback so devs can copy reset URLs / OTPs from logs.
    // eslint-disable-next-line no-console
    console.warn(
      "\n[system-mail] SYSTEM_SMTP_* not configured — printing email instead of sending:\n" +
        `  to:      ${mail.to}\n` +
        `  subject: ${mail.subject}\n` +
        `  ----\n${mail.text.replace(/^/gm, "  ")}\n  ----\n`
    );
    return;
  }

  await transport.sendMail({
    from,
    to: mail.to,
    subject: mail.subject,
    text: mail.text,
    html: mail.html
  });
}
