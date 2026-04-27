import Link from "next/link";
import { LoginSuccessToast } from "../../components/login-success-toast";
import { FeatureTile } from "../../components/dashboard/feature-tile";

const quickActions = [
  {
    title: "Bulk Mail",
    description: "Queue and dispatch large batches with warmup-aware throttling.",
    href: "/dashboard/bulk-email",
    iconPath: "M2 7h12a2 2 0 0 1 2 2v8H4a2 2 0 0 1-2-2V7Z M2 7l7 5 7-5 M16 5h4a2 2 0 0 1 2 2v8h-4"
  },
  {
    title: "Senders",
    description: "Connect Gmail or domain SMTP with health monitoring.",
    href: "/dashboard/senders",
    iconPath: "M22 6 12 13 2 6 M2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6 M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2"
  },
  {
    title: "Templates",
    description: "Reusable Handlebars templates with variable substitution.",
    href: "/dashboard/templates",
    iconPath: "M4 4h16v4H4z M4 10h16v10H4z"
  },
  {
    title: "API Keys",
    description: "Scoped keys with per-key rate limits and IP allowlists.",
    href: "/dashboard/api-keys",
    iconPath: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"
  },
  {
    title: "Audit Logs",
    description: "Track every send, action, and system event.",
    href: "/dashboard/logs",
    iconPath: "M4 4h12v4H4z M4 10h12v4H4z M4 16h12v4H4z M18 6h2 M18 12h2 M18 18h2"
  },
  {
    title: "Test API",
    description: "Run real send requests against your live keys.",
    href: "/dashboard/test-api",
    iconPath: "M4 7h16 M4 12h10 M4 17h7"
  }
];

const stats = [
  { label: "Public endpoint", value: "/v1/send", icon: "M22 2 11 13 M22 2l-7 20-4-9-9-4z" },
  { label: "Auth", value: "Bearer + CSRF", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { label: "Queue", value: "BullMQ + Redis", icon: "M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z M3 12h18 M12 3a14 14 0 0 1 0 18" },
  { label: "Delivery", value: "SMTP retries", icon: "M21 12a9 9 0 1 1-9-9c2.5 0 4.79.96 6.5 2.5L21 3 M21 3v6h-6" }
];

function Icon({ path, size = 18 }: { path: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

export default function DashboardHomePage() {
  return (
    <main className="container">
      <LoginSuccessToast />

      <section
        className="panel hero-panel"
        style={{ padding: "32px 32px 28px", marginBottom: 18 }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 12px 5px 6px",
            borderRadius: 999,
            background: "linear-gradient(135deg, rgba(20, 184, 130, 0.14), rgba(124, 92, 255, 0.10))",
            border: "1px solid rgba(20, 184, 130, 0.25)",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--brand-strong)",
            letterSpacing: "0.04em",
            textTransform: "uppercase"
          }}
        >
          <span
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: "var(--grad-brand)",
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Icon path="M5 12l5 5L20 7" size={11} />
          </span>
          Console online
        </div>

        <h1 style={{ margin: "14px 0 6px", fontSize: "clamp(26px, 3vw, 34px)" }}>
          Gmail SMTP <span style={{ background: "var(--grad-brand)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>Admin</span>
        </h1>
        <p className="muted" style={{ maxWidth: 640, fontSize: 15 }}>
          Configure trusted senders, generate scoped API keys, and monitor delivery activity — all from one
          queue-backed control plane.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
            marginTop: 22
          }}
        >
          {stats.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <div className="stat-card-icon">
                <Icon path={stat.icon} size={18} />
              </div>
              <div className="stat-card-label">{stat.label}</div>
              <div className="stat-card-value" style={{ fontSize: 18 }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 12
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Quick actions</h2>
          <p className="muted" style={{ marginTop: 4, fontSize: 13 }}>
            Jump straight into the most common workflows.
          </p>
        </div>
        <Link href="/docs" className="nav-link">
          <Icon path="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M4 4.5A2.5 2.5 0 0 1 6.5 7H20 M6.5 7v12" size={14} />
          API Docs
        </Link>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 12
        }}
      >
        {quickActions.map((action) => (
          <FeatureTile
            key={action.href}
            title={action.title}
            description={action.description}
            href={action.href}
            icon={<Icon path={action.iconPath} size={22} />}
          />
        ))}
      </section>
    </main>
  );
}
