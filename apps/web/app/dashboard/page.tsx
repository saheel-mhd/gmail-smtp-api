import { LoginSuccessToast } from "../../components/login-success-toast";

import { FeatureTile } from "../../components/dashboard/feature-tile";

export default function DashboardHomePage() {
  return (
    <main className="container">
      <LoginSuccessToast />
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
      <section
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12
        }}
      >
        <FeatureTile
          title="Bulk Mail"
          description="Queue large batches."
          icon={
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 7h12a2 2 0 0 1 2 2v8H4a2 2 0 0 1-2-2V7Z" />
              <path d="m2 7 7 5 7-5" />
              <path d="M16 5h4a2 2 0 0 1 2 2v8h-4" />
            </svg>
          }
        />
      </section>
    </main>
  );
}
