import Link from "next/link";

export default function LogsPage() {
  return (
    <main className="container">
      <section className="panel">
        <h1>Audit Logs</h1>
        <p className="muted">Choose which log stream you want to review.</p>
      </section>

      <section className="grid cols-3" style={{ marginTop: 16 }}>
        <Link className="panel" href="/dashboard/logs/actions">
          <h3>Action Logs</h3>
          <p className="muted">Track admin activity like sender changes and API key updates.</p>
        </Link>
        <Link className="panel" href="/dashboard/logs/email">
          <h3>Email Logs</h3>
          <p className="muted">Review sent, sending, and failed email delivery events.</p>
        </Link>
        <Link className="panel" href="/dashboard/logs/system">
          <h3>System Logs</h3>
          <p className="muted">API lifecycle events and system activity.</p>
        </Link>
      </section>
    </main>
  );
}
