import { env } from "../env";
import { getSystemEmailQueue } from "../queue";

export type SystemMail = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

/**
 * Enqueue a transactional system email (password reset, account auth) for
 * the worker to deliver. The worker holds the SMTP transport so we can run
 * on hosts (Render free tier) that block outbound SMTP from the web service.
 *
 * Returns immediately; SMTP success/failure is logged in the worker.
 * Never throws — upstream callers should not surface transport failures to the user.
 */
export async function sendSystemMail(mail: SystemMail): Promise<{ delivered: boolean; reason?: string }> {
  try {
    await getSystemEmailQueue().add("system-mail", mail, {
      // Don't keep the OTP hanging in the queue if delivery is permanently broken.
      removeOnFail: 200
    });
    return { delivered: true, reason: "queued" };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[system-mail] enqueue failed:", err);
    return { delivered: false, reason: (err as Error).message };
  }
}

export function isSystemMailConfigured(): boolean {
  return Boolean(
    env.SYSTEM_SMTP_HOST && env.SYSTEM_SMTP_PORT && env.SYSTEM_SMTP_USER && env.SYSTEM_SMTP_PASSWORD
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Send a welcome email after a user finishes registration verification.
 */
export async function sendWelcomeEmail(opts: {
  to: string;
  tenantName: string;
}): Promise<{ delivered: boolean; reason?: string }> {
  const base = (env.APP_BASE_URL || "").replace(/\/$/, "");
  const sendersUrl = `${base}/dashboard/senders`;
  const apiKeysUrl = `${base}/dashboard/api-keys`;
  const docsUrl = `${base}/docs`;

  const subject = `Welcome to Mailler, ${opts.tenantName}`;
  const text = [
    `Welcome to Mailler!`,
    "",
    `Your workspace "${opts.tenantName}" is ready. Three quick steps to start sending:`,
    "",
    `  1. Add a sender (Gmail or custom domain SMTP)  —  ${sendersUrl}`,
    `  2. Create an API key for your environment      —  ${apiKeysUrl}`,
    `  3. Read the docs and run a test send           —  ${docsUrl}`,
    "",
    "Need a hand? Reply to this email or visit /support and we'll help.",
    "",
    "— Mailler"
  ].join("\n");

  const html = `
    <div style="font-family:Inter,Segoe UI,Arial,sans-serif;background:#f5f7fb;padding:32px 16px;color:#0e1726">
      <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e2e8f1;border-radius:18px;padding:28px;box-shadow:0 14px 32px rgba(15,23,42,.08)">
        <div style="display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(20,184,130,.10);border:1px solid rgba(10,127,81,.25);color:#055f3c;font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;margin-bottom:14px">
          Welcome
        </div>
        <h1 style="margin:0 0 8px;font-size:22px">Welcome to Mailler 👋</h1>
        <p style="color:#5a6577;margin:0 0 22px;font-size:14px;line-height:1.55">
          Your workspace <strong>${escapeHtml(opts.tenantName)}</strong> is ready. Here's how to get
          your first email out the door in a few minutes.
        </p>

        <ol style="padding:0;margin:0;list-style:none;display:grid;gap:10px">
          <li style="display:flex;gap:14px;padding:14px;border-radius:14px;border:1px solid #ecf0f7;background:#fafbfd">
            <div style="width:28px;height:28px;flex-shrink:0;border-radius:999px;background:linear-gradient(135deg,#0a7f51,#14b882);color:#fff;font-weight:700;display:inline-flex;align-items:center;justify-content:center;font-size:13px">1</div>
            <div>
              <div style="font-weight:600;font-size:14px">Add a sender</div>
              <div style="color:#5a6577;font-size:13px;margin-top:2px;line-height:1.5">Connect a Gmail address (with App Password) or a custom-domain SMTP account.</div>
              <a href="${sendersUrl}" style="display:inline-block;margin-top:8px;color:#055f3c;font-weight:600;text-decoration:none;font-size:13px">Open Sender Config →</a>
            </div>
          </li>
          <li style="display:flex;gap:14px;padding:14px;border-radius:14px;border:1px solid #ecf0f7;background:#fafbfd">
            <div style="width:28px;height:28px;flex-shrink:0;border-radius:999px;background:linear-gradient(135deg,#0a7f51,#14b882);color:#fff;font-weight:700;display:inline-flex;align-items:center;justify-content:center;font-size:13px">2</div>
            <div>
              <div style="font-weight:600;font-size:14px">Create an API key</div>
              <div style="color:#5a6577;font-size:13px;margin-top:2px;line-height:1.5">Issue a scoped key per environment with rate limits and IP allowlists.</div>
              <a href="${apiKeysUrl}" style="display:inline-block;margin-top:8px;color:#055f3c;font-weight:600;text-decoration:none;font-size:13px">Manage API Keys →</a>
            </div>
          </li>
          <li style="display:flex;gap:14px;padding:14px;border-radius:14px;border:1px solid #ecf0f7;background:#fafbfd">
            <div style="width:28px;height:28px;flex-shrink:0;border-radius:999px;background:linear-gradient(135deg,#0a7f51,#14b882);color:#fff;font-weight:700;display:inline-flex;align-items:center;justify-content:center;font-size:13px">3</div>
            <div>
              <div style="font-weight:600;font-size:14px">Read the docs and send a test</div>
              <div style="color:#5a6577;font-size:13px;margin-top:2px;line-height:1.5">POST to /v1/send and watch delivery in real time from the dashboard.</div>
              <a href="${docsUrl}" style="display:inline-block;margin-top:8px;color:#055f3c;font-weight:600;text-decoration:none;font-size:13px">Read the docs →</a>
            </div>
          </li>
        </ol>

        <hr style="border:0;border-top:1px solid #ecf0f7;margin:22px 0">
        <p style="color:#94a3b8;margin:0;font-size:12px;line-height:1.55">
          Stuck? Reply to this email or visit our support page — we usually answer within an hour.
        </p>
      </div>
    </div>
  `;

  return sendSystemMail({ to: opts.to, subject, text, html });
}

/**
 * Send a one-time verification code to a new registrant.
 */
export async function sendRegistrationOtp(opts: {
  to: string;
  otp: string;
  tenantName: string;
  ttlMinutes: number;
}): Promise<{ delivered: boolean; reason?: string }> {
  const subject = "Verify your email — Mailler";
  const text = [
    `Hi,`,
    "",
    `Use this code to finish creating your Mailler account for ${opts.tenantName}:`,
    "",
    `   ${opts.otp}`,
    "",
    `The code expires in ${opts.ttlMinutes} minutes.`,
    "",
    "If you didn't try to create an account, you can safely ignore this email.",
    "",
    "— Mailler"
  ].join("\n");

  const html = `
    <div style="font-family:Inter,Segoe UI,Arial,sans-serif;background:#f5f7fb;padding:32px 16px;color:#0e1726">
      <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #e2e8f1;border-radius:18px;padding:28px;box-shadow:0 14px 32px rgba(15,23,42,.08)">
        <div style="display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(20,184,130,.10);border:1px solid rgba(10,127,81,.25);color:#055f3c;font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;margin-bottom:14px">
          Email verification
        </div>
        <h1 style="margin:0 0 8px;font-size:20px">Confirm your email</h1>
        <p style="color:#5a6577;margin:0 0 18px;font-size:14px;line-height:1.55">
          Use this code to finish creating your Mailler account for
          <strong>${escapeHtml(opts.tenantName)}</strong>. It expires in ${opts.ttlMinutes} minutes.
        </p>
        <div style="text-align:center;margin:22px 0">
          <div style="display:inline-block;padding:18px 28px;border-radius:14px;background:linear-gradient(135deg,#f8fbf9 0%,#f0f7f3 100%);border:1px solid rgba(10,127,81,.18);font-family:ui-monospace,SFMono-Regular,monospace;font-size:32px;font-weight:700;letter-spacing:.36em;color:#055f3c">
            ${escapeHtml(opts.otp)}
          </div>
        </div>
        <p style="color:#94a3b8;margin:0;font-size:12px;line-height:1.55">
          If you didn't try to create an account, you can safely ignore this email — no account will be created.
        </p>
      </div>
    </div>
  `;

  return sendSystemMail({ to: opts.to, subject, text, html });
}

/**
 * Send a security notification when a user's password is changed.
 * `method` is a short label shown to the user — e.g. "via reset link" or "from account settings".
 */
export async function sendPasswordChangedNotification(opts: {
  to: string;
  method: string;
  ip?: string | null;
  userAgent: string | null;
  when?: Date;
}): Promise<{ delivered: boolean; reason?: string }> {
  // `ip` is captured by the audit log but no longer shown in the email — behind a proxy
  // (Render, etc.) it usually shows the load-balancer IP and isn't useful to end-users.
  void opts.ip;
  const when = opts.when ?? new Date();
  const formattedTime = when.toUTCString();
  const userAgent = opts.userAgent ?? "unknown";
  const supportUrl = `${(env.APP_BASE_URL || "").replace(/\/$/, "")}/support`;

  const subject = "Your Mailler password was changed";

  const text = [
    "Hi,",
    "",
    `Your Mailler account password was just changed ${opts.method}.`,
    "",
    `When:    ${formattedTime}`,
    `Device:  ${userAgent}`,
    "",
    "If this was you, no further action is needed.",
    "",
    "If this wasn't you, your account may be compromised:",
    "  1. Sign in and reset your password again.",
    "  2. Enable two-factor authentication if it isn't on already.",
    `  3. Contact support: ${supportUrl}`,
    "",
    "— Mailler"
  ].join("\n");

  const html = `
    <div style="font-family:Inter,Segoe UI,Arial,sans-serif;background:#f5f7fb;padding:32px 16px;color:#0e1726">
      <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #e2e8f1;border-radius:18px;padding:28px;box-shadow:0 14px 32px rgba(15,23,42,.08)">
        <div style="display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(20,184,130,.10);border:1px solid rgba(10,127,81,.25);color:#055f3c;font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;margin-bottom:14px">
          Security alert
        </div>
        <h1 style="margin:0 0 8px;font-size:20px">Password changed</h1>
        <p style="color:#5a6577;margin:0 0 20px;font-size:14px;line-height:1.55">
          Your Mailler account password was just changed <strong>${escapeHtml(opts.method)}</strong>.
        </p>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin:0 0 20px">
          <tr>
            <td style="padding:8px 12px;background:#f7f9fc;border:1px solid #ecf0f7;border-radius:8px 0 0 8px;color:#5a6577;width:120px">When</td>
            <td style="padding:8px 12px;background:#fff;border:1px solid #ecf0f7;border-left:0;border-radius:0 8px 8px 0;font-family:ui-monospace,SFMono-Regular,monospace">${escapeHtml(formattedTime)}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;background:#f7f9fc;border:1px solid #ecf0f7;border-radius:8px 0 0 8px;color:#5a6577">Device</td>
            <td style="padding:8px 12px;background:#fff;border:1px solid #ecf0f7;border-left:0;border-radius:0 8px 8px 0;font-size:12px;word-break:break-word">${escapeHtml(userAgent)}</td>
          </tr>
        </table>
        <div style="padding:12px 14px;border-radius:10px;background:rgba(239,68,68,.06);border:1px solid rgba(179,38,30,.18);font-size:13px;line-height:1.55;color:#0e1726">
          <strong>Wasn't you?</strong> Your account may be compromised.
          <a href="${supportUrl}" style="color:#055f3c;font-weight:600;text-decoration:none">Contact support</a>
          and reset your password again immediately.
        </div>
        <hr style="border:0;border-top:1px solid #ecf0f7;margin:20px 0">
        <p style="color:#94a3b8;margin:0;font-size:12px">
          This is an automated security notification from Mailler. You can't reply to this email.
        </p>
      </div>
    </div>
  `;

  return sendSystemMail({ to: opts.to, subject, text, html });
}
