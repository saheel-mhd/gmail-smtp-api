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
    <main className="container">
      <section className="panel" style={{ marginBottom: 16 }}>
        <h1>YeetMail</h1>
        <p className="muted">
          Direct send API with multi-tenant sender controls, API-key scopes, and audit logs.
        </p>
        <Link className="btn" href="/dashboard">
          Open Dashboard
        </Link>
        <Link className="btn secondary" href="/login" style={{ marginLeft: 10 }}>
          Login
        </Link>
      </section>

      <section className="grid cols-3">
        {steps.map((step) => (
          <article className="panel" key={step.title}>
            <h3>{step.title}</h3>
            <p className="muted">{step.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
