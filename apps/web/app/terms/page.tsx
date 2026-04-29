import Link from "next/link";

const SECTIONS: { id: string; label: string }[] = [
  { id: "acceptance", label: "1. Acceptance of terms" },
  { id: "service", label: "2. The service" },
  { id: "eligibility", label: "3. Eligibility" },
  { id: "account", label: "4. Account registration" },
  { id: "acceptable-use", label: "5. Acceptable use" },
  { id: "prohibited", label: "6. Prohibited content" },
  { id: "customer-responsibilities", label: "7. Customer responsibilities" },
  { id: "fees", label: "8. Fees and billing" },
  { id: "termination", label: "9. Suspension and termination" },
  { id: "warranty", label: "10. Disclaimers" },
  { id: "liability", label: "11. Limitation of liability" },
  { id: "indemnification", label: "12. Indemnification" },
  { id: "changes", label: "13. Changes to the service or terms" },
  { id: "law", label: "14. Governing law" },
  { id: "contact", label: "15. Contact" }
];

export const metadata = {
  title: "Terms of Service — Mailler"
};

export default function TermsPage() {
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
        <h1 style={{ margin: "12px 0 6px" }}>Terms of Service</h1>
        <p className="muted" style={{ marginTop: 0, fontSize: 13 }}>
          Effective date: 29 April 2026 · Last updated: 29 April 2026
        </p>
        <p style={{ marginTop: 14, fontSize: 14, lineHeight: 1.65, maxWidth: 680 }}>
          These Terms govern your access to and use of Mailler, a multi-tenant transactional and
          bulk email platform. By creating an account or using the service you agree to be bound by
          these Terms.
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
          and adapt it with qualified legal counsel before relying on it as a binding agreement.
        </p>
      </aside>

      <section
        className="panel"
        style={{ marginTop: 18, padding: "18px 22px" }}
      >
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
        <Section id="acceptance" title="1. Acceptance of terms">
          <p>
            By creating an account, accessing the dashboard, or sending mail through the API, you
            (&quot;Customer&quot;) agree to these Terms of Service (&quot;Terms&quot;) and our{" "}
            <Link href="/privacy" style={linkStyle}>
              Privacy Policy
            </Link>
            . If you are accepting these Terms on behalf of an organization, you represent that you
            have authority to bind that organization to these Terms.
          </p>
        </Section>

        <Section id="service" title="2. The service">
          <p>
            Mailler (&quot;we&quot;, &quot;our&quot;, or &quot;the service&quot;) provides a
            queue-backed email delivery platform with multi-tenant isolation, scoped API keys,
            sender management, deliverability tooling, and audit logging. Features may evolve over
            time.
          </p>
        </Section>

        <Section id="eligibility" title="3. Eligibility">
          <p>
            You must be at least 18 years old, or the age of majority in your jurisdiction, to use
            the service. You may not use the service if you are barred from receiving services
            under applicable law.
          </p>
        </Section>

        <Section id="account" title="4. Account registration">
          <p>
            To create an account you must provide a valid email address, choose a strong password,
            and verify ownership of the email by entering a one-time code we send to it. You are
            responsible for maintaining the confidentiality of your credentials and for all
            activity that occurs under your account.
          </p>
          <p>
            We strongly encourage enabling two-factor authentication. Owners of a tenant may be
            required to enable it.
          </p>
        </Section>

        <Section id="acceptable-use" title="5. Acceptable use">
          <p>
            You may use the service only for lawful purposes and in compliance with all applicable
            anti-spam laws, including but not limited to the CAN-SPAM Act (US), CASL (Canada),
            GDPR / ePrivacy (EU/UK), and similar regulations in your jurisdiction.
          </p>
          <p>You agree to:</p>
          <ul>
            <li>Send mail only to recipients who have opted in or with whom you have a legitimate prior business relationship;</li>
            <li>Honor unsubscribe requests promptly;</li>
            <li>Configure SPF, DKIM, and DMARC records on any sending domain you connect;</li>
            <li>Keep API keys, sender credentials, and session cookies confidential;</li>
            <li>Not exceed rate limits, quotas, or other technical restrictions of the service.</li>
          </ul>
        </Section>

        <Section id="prohibited" title="6. Prohibited content">
          <p>You may not use the service to send, store, or transmit:</p>
          <ul>
            <li>Spam, unsolicited bulk email, or chain mail;</li>
            <li>Phishing emails, fraudulent invoices, malware, or links to such content;</li>
            <li>Content that infringes intellectual property rights;</li>
            <li>Content that is unlawful, defamatory, harassing, or that promotes violence;</li>
            <li>Adult content directed at minors, or content that exploits minors in any way;</li>
            <li>Content related to illegal goods, weapons, or controlled substances where prohibited.</li>
          </ul>
          <p>
            We may, at our sole discretion, suspend or terminate accounts that violate this policy
            or that generate excessive deliverability complaints (bounces, abuse reports, blocklist
            entries).
          </p>
        </Section>

        <Section id="customer-responsibilities" title="7. Customer responsibilities">
          <p>You are responsible for:</p>
          <ul>
            <li>The accuracy of company information you provide and keep updated;</li>
            <li>Securing the systems that hold your API keys and using them only over HTTPS;</li>
            <li>Monitoring delivery health and pausing sends if bounce / complaint rates spike;</li>
            <li>Maintaining lawful consent records for every recipient address you import;</li>
            <li>Complying with the Terms of Service of any upstream SMTP provider you connect (e.g. Gmail&apos;s sending policies).</li>
          </ul>
        </Section>

        <Section id="fees" title="8. Fees and billing">
          <p>
            If a paid plan is in effect, fees are billed in advance for the subscription period
            selected, are non-refundable except where required by law, and may be adjusted on at
            least 30 days&apos; notice. Late or unpaid invoices may result in suspension after a
            reasonable cure period.
          </p>
        </Section>

        <Section id="termination" title="9. Suspension and termination">
          <p>
            You may close your account at any time. We may suspend or terminate access immediately
            and without refund if you materially breach these Terms, if your usage poses a security
            or deliverability risk, or if continued service would expose us to legal liability.
          </p>
          <p>
            On termination, we will delete or anonymize your tenant data within a commercially
            reasonable period, subject to retention obligations described in our Privacy Policy.
          </p>
        </Section>

        <Section id="warranty" title="10. Disclaimers">
          <p>
            The service is provided <strong>&quot;as is&quot;</strong> and{" "}
            <strong>&quot;as available&quot;</strong> without warranties of any kind, whether
            express or implied, including warranties of merchantability, fitness for a particular
            purpose, and non-infringement. We do not warrant that mail will reach its intended
            recipient, that delivery will be free of delay or filtering by third-party providers,
            or that the service will be uninterrupted or error-free.
          </p>
        </Section>

        <Section id="liability" title="11. Limitation of liability">
          <p>
            To the maximum extent permitted by law, our aggregate liability for any claim arising
            out of or relating to the service shall not exceed the amount you paid us in the
            twelve (12) months preceding the event giving rise to the claim. We shall not be
            liable for indirect, incidental, special, consequential, or punitive damages, including
            lost profits, lost goodwill, or business interruption.
          </p>
        </Section>

        <Section id="indemnification" title="12. Indemnification">
          <p>
            You agree to defend, indemnify, and hold us harmless from claims arising out of (a)
            content you send through the service; (b) your violation of these Terms or applicable
            law; or (c) your infringement of any third-party right.
          </p>
        </Section>

        <Section id="changes" title="13. Changes to the service or terms">
          <p>
            We may modify the service or these Terms at any time. Material changes to these Terms
            will be notified by email or through an in-app banner at least 14 days before they take
            effect. Continued use after the effective date constitutes acceptance.
          </p>
        </Section>

        <Section id="law" title="14. Governing law">
          <p>
            These Terms are governed by the laws of the jurisdiction in which we are
            headquartered, without regard to conflict-of-laws principles. Disputes shall be
            resolved exclusively in the competent courts of that jurisdiction, except where
            mandatory consumer-protection laws require otherwise.
          </p>
        </Section>

        <Section id="contact" title="15. Contact">
          <p>
            Questions about these Terms? Reach us at{" "}
            <a
              href="mailto:legal@zmail.work.gd"
              style={linkStyle}
            >
              legal@zmail.work.gd
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
        <Link href="/privacy" style={{ color: "var(--brand-strong)", fontWeight: 600 }}>
          Privacy Policy
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
