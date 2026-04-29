import Link from "next/link";

const SECTIONS: { id: string; label: string }[] = [
  { id: "intro", label: "1. Introduction" },
  { id: "data-collected", label: "2. Information we collect" },
  { id: "use", label: "3. How we use information" },
  { id: "security", label: "4. How we protect information" },
  { id: "sharing", label: "5. Sharing with third parties" },
  { id: "retention", label: "6. Data retention" },
  { id: "rights", label: "7. Your rights" },
  { id: "cookies", label: "8. Cookies and similar technologies" },
  { id: "transfers", label: "9. International transfers" },
  { id: "children", label: "10. Children's privacy" },
  { id: "changes", label: "11. Changes to this policy" },
  { id: "contact", label: "12. Contact" }
];

export const metadata = {
  title: "Privacy Policy — Mailler"
};

export default function PrivacyPage() {
  return (
    <main className="container" style={{ maxWidth: 820, paddingTop: 32 }}>
      <Link
        href="/register"
        style={{ color: "var(--brand-strong)", fontWeight: 600, fontSize: 13 }}
      >
        ← Back to register
      </Link>

      <section className="panel hero-panel" style={{ marginTop: 14, padding: 28 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 12px",
            borderRadius: 999,
            background: "rgba(20, 184, 130, 0.10)",
            border: "1px solid rgba(10, 127, 81, 0.25)",
            fontSize: 11,
            fontWeight: 600,
            color: "var(--brand-strong)",
            letterSpacing: "0.06em",
            textTransform: "uppercase"
          }}
        >
          Legal
        </div>
        <h1 style={{ margin: "12px 0 6px" }}>Privacy Policy</h1>
        <p className="muted" style={{ marginTop: 0, fontSize: 13 }}>
          Effective date: 29 April 2026 · Last updated: 29 April 2026
        </p>
        <p style={{ marginTop: 14, fontSize: 14, lineHeight: 1.65, maxWidth: 680 }}>
          This Privacy Policy explains what information Mailler collects, why we collect it, how we
          protect it, and the choices you have about your data. We aim to keep this document plain
          and short. Where the wording becomes technical, it is because the underlying control
          really is technical.
        </p>
      </section>

      <aside
        className="panel"
        style={{
          marginTop: 18,
          padding: "14px 18px",
          background: "rgba(250, 204, 21, 0.10)",
          border: "1px solid rgba(217, 119, 6, 0.32)"
        }}
      >
        <strong style={{ fontSize: 13 }}>Heads up</strong>
        <p className="muted" style={{ margin: "4px 0 0", fontSize: 13, lineHeight: 1.55 }}>
          This document is a template provided as a starting point. It is not legal advice. Review
          and adapt it with qualified counsel and align it with your actual data-processing
          practices before publishing to real users.
        </p>
      </aside>

      <section className="panel" style={{ marginTop: 18, padding: "18px 22px" }}>
        <div
          className="muted"
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontWeight: 600,
            marginBottom: 10
          }}
        >
          Contents
        </div>
        <nav
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "6px 18px"
          }}
        >
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              style={{
                color: "var(--brand-strong)",
                fontSize: 13,
                fontWeight: 500,
                padding: "4px 0"
              }}
            >
              {s.label}
            </a>
          ))}
        </nav>
      </section>

      <article
        className="panel"
        style={{ marginTop: 18, padding: "28px 32px", lineHeight: 1.7, fontSize: 14.5 }}
      >
        <Section id="intro" title="1. Introduction">
          <p>
            Mailler is a multi-tenant transactional and bulk email platform operated by us
            (&quot;we&quot;, &quot;our&quot;, or &quot;the service&quot;). This policy applies to
            personal data we process in connection with your use of the dashboard at this domain
            and the API at <code>/v1</code>.
          </p>
          <p>
            For the purposes of GDPR / UK-GDPR you are typically the <em>controller</em> of the
            recipient data you upload, and we act as a <em>processor</em>. For account-level data
            (your email, password hash, audit logs of your actions), we act as controller.
          </p>
        </Section>

        <Section id="data-collected" title="2. Information we collect">
          <h3 style={subHeading}>Account data</h3>
          <ul>
            <li>Your email address, hashed password (bcrypt, cost 12), and role within your tenant.</li>
            <li>Optional company profile fields you choose to provide (name, address, phone, industry, country, timezone, logo URL, etc.).</li>
            <li>Two-factor authentication secret, encrypted with AES-256-GCM and a versioned master key.</li>
          </ul>

          <h3 style={subHeading}>Tenant configuration</h3>
          <ul>
            <li>Sender credentials (Gmail App Passwords or custom-domain SMTP passwords) you choose to register, encrypted with AES-256-GCM at rest.</li>
            <li>API keys (only their hashes and a short non-secret prefix; the secret half is never stored or returned again after creation).</li>
            <li>Templates, campaigns, recipient lists, and attachments you upload.</li>
            <li>Domain DNS verification metadata (SPF, DKIM, DMARC tokens).</li>
          </ul>

          <h3 style={subHeading}>Email metadata and audit logs</h3>
          <ul>
            <li>Per-message records: queue ID, sender, recipient, subject, status, error reason, retry counts.</li>
            <li>Per-action audit records: actor, action name, IP address, user-agent, timestamp.</li>
          </ul>

          <h3 style={subHeading}>Cookies, IP, device</h3>
          <ul>
            <li>A session cookie (HTTP-only) and a CSRF cookie used to identify your authenticated browser.</li>
            <li>Your IP address and user-agent string for security-sensitive actions (login, password change, MFA toggle, member changes).</li>
          </ul>
        </Section>

        <Section id="use" title="3. How we use information">
          <ul>
            <li>To operate, secure, and improve the service.</li>
            <li>To authenticate you, enforce rate limits, and protect against abuse.</li>
            <li>To deliver email on your behalf to recipients you specify.</li>
            <li>To send transactional notifications about your account (verification codes, password resets, password-changed alerts, welcome emails).</li>
            <li>To investigate suspected fraud, abuse, or breach of these Terms or applicable law.</li>
            <li>To comply with legal obligations and respond to lawful requests from authorities.</li>
          </ul>
          <p>
            We do <strong>not</strong> sell your personal data, and we do not use the content of
            mail you send to train AI models or for advertising.
          </p>
        </Section>

        <Section id="security" title="4. How we protect information">
          <ul>
            <li>Passwords are stored as bcrypt hashes (cost 12). Plaintext passwords are never logged.</li>
            <li>Sender credentials and TOTP secrets are encrypted at rest using AES-256-GCM with a versioned master key (<code>ENCRYPTION_KEY_VERSION</code>).</li>
            <li>API keys are stored as hashes plus a short prefix; the secret half is shown once at creation.</li>
            <li>Session and CSRF cookies use the <code>HttpOnly</code> and <code>SameSite</code> attributes; <code>Secure</code> is set in production.</li>
            <li>Mutating endpoints require a CSRF token in the <code>x-csrf-token</code> header.</li>
            <li>Every administrative action is captured in an audit log with actor, IP, and user-agent.</li>
            <li>Background workers run in an isolated process with the minimum credentials needed to send mail.</li>
          </ul>
        </Section>

        <Section id="sharing" title="5. Sharing with third parties">
          <p>We share personal data only with the following categories of recipients:</p>
          <ul>
            <li>
              <strong>SMTP providers</strong> you choose to connect (Gmail, your custom-domain
              host, etc.) — we send mail through them on your behalf using credentials you provide.
            </li>
            <li>
              <strong>Cloud hosting and database providers</strong> that we use to operate the
              service.
            </li>
            <li>
              <strong>Email service providers</strong> we use to send transactional account emails
              (verification codes, password resets) — currently Zoho Mail.
            </li>
            <li>
              <strong>Authorities</strong> when required by valid legal process.
            </li>
          </ul>
          <p>We do not sell or rent personal data, ever.</p>
        </Section>

        <Section id="retention" title="6. Data retention">
          <ul>
            <li>Account data: retained while your account is active and for up to 90 days after closure, then deleted or anonymized.</li>
            <li>Sender credentials and TOTP secrets: retained until you delete them, plus a short backup window.</li>
            <li>Audit logs: retained for at least 12 months for security and compliance reasons.</li>
            <li>Email-content payloads: retained only as long as the message is in queue or recently delivered. Long-term content is not retained server-side.</li>
            <li>Backups containing the above are rotated on a fixed schedule.</li>
          </ul>
          <p>
            You may request earlier deletion. Some logs may be retained beyond the period above
            where required by law.
          </p>
        </Section>

        <Section id="rights" title="7. Your rights">
          <p>Depending on where you live you may have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you;</li>
            <li>Correct inaccurate data;</li>
            <li>Delete data we hold about you (subject to legal retention exceptions);</li>
            <li>Export a portable copy of your data;</li>
            <li>Object to certain processing or withdraw consent;</li>
            <li>Lodge a complaint with your local data-protection authority.</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at the address in section 12. We will
            respond within the timelines required by applicable law (typically 30 days under GDPR).
          </p>
        </Section>

        <Section id="cookies" title="8. Cookies and similar technologies">
          <p>We use a small number of strictly necessary cookies:</p>
          <ul>
            <li>
              <strong>Session cookie</strong> (<code>gmail_smtp_session</code>) — identifies your
              authenticated browser. HttpOnly. Expires on logout or after a fixed period.
            </li>
            <li>
              <strong>CSRF cookie</strong> (<code>gmail_smtp_csrf</code>) — used to validate
              cross-site request forgery tokens. Expires with the session.
            </li>
          </ul>
          <p>
            We do not use third-party analytics or advertising cookies. Browser{" "}
            <code>localStorage</code> may store small UI preferences (e.g. dismissing the help
            card) — these are local to your device and never transmitted.
          </p>
        </Section>

        <Section id="transfers" title="9. International transfers">
          <p>
            We may process data in jurisdictions outside the country where you reside. Where this
            occurs, we rely on appropriate safeguards (such as Standard Contractual Clauses)
            consistent with applicable data-protection law.
          </p>
        </Section>

        <Section id="children" title="10. Children's privacy">
          <p>
            The service is not directed at children under 16. We do not knowingly collect personal
            data from children. If you believe a child has provided us personal data, please
            contact us so we can delete it.
          </p>
        </Section>

        <Section id="changes" title="11. Changes to this policy">
          <p>
            We may update this Privacy Policy from time to time. Material changes will be
            announced by email or in-app banner at least 14 days before they take effect. The
            &quot;Last updated&quot; date at the top of this page reflects the latest revision.
          </p>
        </Section>

        <Section id="contact" title="12. Contact">
          <p>
            For privacy questions, data-rights requests, or to report a suspected breach, contact
            us at{" "}
            <a href="mailto:privacy@zmail.work.gd" style={linkStyle}>
              privacy@zmail.work.gd
            </a>{" "}
            or through the in-app{" "}
            <Link href="/support" style={linkStyle}>
              support page
            </Link>
            .
          </p>
        </Section>
      </article>

      <footer
        style={{
          marginTop: 18,
          padding: "16px 18px",
          textAlign: "center",
          color: "var(--muted)",
          fontSize: 12
        }}
      >
        <Link href="/terms" style={{ color: "var(--brand-strong)", fontWeight: 600 }}>
          Terms of Service
        </Link>
        {" · "}
        <Link href="/login" style={{ color: "var(--brand-strong)", fontWeight: 600 }}>
          Login
        </Link>
        {" · "}
        <Link href="/register" style={{ color: "var(--brand-strong)", fontWeight: 600 }}>
          Register
        </Link>
      </footer>
    </main>
  );
}

const linkStyle = { color: "var(--brand-strong)", fontWeight: 600 } as const;

const subHeading: React.CSSProperties = {
  margin: "16px 0 4px",
  fontSize: 14,
  fontWeight: 600,
  color: "var(--ink)"
};

function Section({
  id,
  title,
  children
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} style={{ scrollMarginTop: 80, marginBottom: 26 }}>
      <h2 style={{ margin: "0 0 10px", fontSize: 18 }}>{title}</h2>
      <div style={{ color: "var(--ink-soft)" }}>{children}</div>
    </section>
  );
}
