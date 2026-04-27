import Link from "next/link";

const steps = [
  {
    title: "1. Add Gmail account",
    description: "Label + Gmail + app password. Verify with a test send."
  },
  {
    title: "2. Create API key",
    description: "Choose allowed sender accounts, set key-level rate limit, optional IP allowlist."
  },
  {
    title: "3. Send and track",
    description: "Use /v1/send and poll /v1/messages/:id for delivery state."
  }
];

export default function HomePage() {
  return (
    <main className="container" style={{ paddingTop: 48 }}>
      <section className="panel hero-panel" style={{ padding: "40px 32px", marginBottom: 18 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 14px",
            borderRadius: 999,
            background: "rgba(20, 184, 130, 0.10)",
            border: "1px solid rgba(10, 127, 81, 0.25)",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--brand-strong)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 18
          }}
        >
          Queue-backed delivery
        </div>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", margin: 0 }}>
          Gmail SMTP{" "}
          <span
            style={{
              background: "var(--grad-brand)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            API
          </span>
        </h1>
        <p className="muted" style={{ marginTop: 12, fontSize: 16, maxWidth: 640 }}>
          Multi-tenant sender controls, scoped API keys, and audit logs — wrapped around a fast,
          retry-aware SMTP worker.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
          <Link className="btn" href="/dashboard">
            Open Dashboard
          </Link>
          <Link className="btn ghost" href="/login">
            Login
          </Link>
          <Link className="btn secondary" href="/docs">
            Read the docs
          </Link>
        </div>
      </section>

      <section className="grid cols-3">
        {steps.map((step) => (
          <article className="panel" key={step.title}>
            <h3 style={{ marginTop: 0 }}>{step.title}</h3>
            <p className="muted" style={{ marginBottom: 0 }}>
              {step.description}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
