import Link from "next/link";

export default function DashboardHomePage() {
  return (
    <main className="container">
      <section className="panel">
        <h1>Dashboard</h1>
        <p className="muted">Admin surfaces for senders, API keys, and audit logs.</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link className="btn" href="/dashboard/senders">
            Senders
          </Link>
          <Link className="btn secondary" href="/dashboard/api-keys">
            API Keys
          </Link>
          <Link className="btn secondary" href="/dashboard/logs">
            Audit Logs
          </Link>
          <Link className="btn secondary" href="/dashboard/test-api">
            Test API
          </Link>
        </div>
      </section>
    </main>
  );
}
