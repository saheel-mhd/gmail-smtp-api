export default function DashboardHomePage() {
  return (
    <main className="container">
      <section className="panel">
        <h1>Gmail SMTP Admin</h1>
        <p className="muted">
          This dashboard is where you configure trusted senders, generate API keys, and monitor delivery activity.
        </p>
        <div
          className="grid"
          style={{ marginTop: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
        >
          <div className="panel" style={{ borderRadius: 12 }}>
            <h2 style={{ marginTop: 0 }}>How it works</h2>
            <p className="muted">
              Your application calls the API with a valid key. We validate the request, queue it, and the worker
              sends through your approved Gmail SMTP sender.
            </p>
            <ul>
              <li>Create or confirm your company profile.</li>
              <li>Add sender credentials in Sender Config.</li>
              <li>Create API keys for each environment.</li>
              <li>Test requests, then monitor audit logs for visibility.</li>
            </ul>
          </div>
          <div className="panel" style={{ borderRadius: 12 }}>
            <h2 style={{ marginTop: 0 }}>What you can do here</h2>
            <p className="muted">
              Use the sidebar to move between setup, templates, and monitoring. Every action is logged for security.
            </p>
            <ul>
              <li>Manage templates and sender settings.</li>
              <li>Rotate API keys without downtime.</li>
              <li>Audit activity and test payloads before production.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
