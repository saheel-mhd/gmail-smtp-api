"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AppHeader } from "../../components/app-header";
import { browserApi } from "../../lib/browser-api";
import { useToast } from "../../components/ui/toast";

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@mailler.app";

type MeResponse = {
  data: {
    id: string;
    email: string;
    role: string;
    tenant: { id: string; name: string; plan: string; status: string };
  };
};

type SystemStatus = "checking" | "operational" | "degraded" | "down";

type Category = "general" | "delivery" | "billing" | "security" | "bug";

const CATEGORIES: { value: Category; label: string; description: string }[] = [
  { value: "general", label: "General", description: "Account, setup, or product questions" },
  { value: "delivery", label: "Delivery issue", description: "Bounces, throttling, or delays" },
  { value: "billing", label: "Billing", description: "Plans, invoices, payments" },
  { value: "security", label: "Security", description: "Compromised keys, abuse, vulnerability" },
  { value: "bug", label: "Bug report", description: "Something isn't working as expected" }
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Why is my email going to spam?",
    a: "Use a verified custom domain with SPF + DKIM + DMARC. Sending from a fresh Gmail account or unverified domain often triggers spam filters. Configure DNS in Dashboard → Domains."
  },
  {
    q: "How do I rotate an API key without downtime?",
    a: "Open Dashboard → API Keys, click Rotate on the key. The old key keeps working for a short overlap period — switch your service to the new key, then revoke the old one."
  },
  {
    q: "What rate limits apply?",
    a: "Each API key has a per-minute limit (default 120/min). Each sender has a per-day quota (default 2000/day). Bulk campaigns add a warmup ramp. You can override these per key/sender."
  },
  {
    q: "Why are my Gmail sends failing?",
    a: "Gmail requires an App Password (not your account password) and 2-Step Verification enabled. If sends still fail, check the sender Health Score in Dashboard → Sender Config — frequent errors will mark the sender as needing attention."
  },
  {
    q: "How do I track opens and clicks?",
    a: "Open and click tracking is automatic for emails sent through campaigns. Pixel and tracking URLs are injected by the worker. View results per recipient in Dashboard → Bulk Mail → [campaign]."
  },
  {
    q: "Can I send transactional emails (not bulk)?",
    a: "Yes — POST to /v1/send with a Bearer API key. The request is queued and dispatched immediately. Poll /v1/messages/:id for delivery state."
  },
  {
    q: "How is sender data stored?",
    a: "App passwords and domain SMTP credentials are encrypted at rest using AES-GCM with a master key + version. The plaintext is never logged or returned via the API."
  }
];

const TROUBLESHOOTING: {
  title: string;
  description: string;
  href: string;
  iconPath: string;
}[] = [
  {
    title: "Test a send",
    description: "Run real requests against your live keys to verify delivery.",
    href: "/dashboard/test-api",
    iconPath: "M9 12l2 2 4-4 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
  },
  {
    title: "Check sender health",
    description: "Inspect health scores, error streaks, and per-day quotas.",
    href: "/dashboard/senders",
    iconPath: "M22 12h-4l-3 9L9 3l-3 9H2"
  },
  {
    title: "Verify a domain",
    description: "Add SPF/DKIM/DMARC records and trigger DNS verification.",
    href: "/dashboard/domains",
    iconPath: "M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z M3 12h18 M12 3a14 14 0 0 1 0 18"
  },
  {
    title: "Audit recent activity",
    description: "Review every send, action, and system event from one place.",
    href: "/dashboard/logs",
    iconPath: "M4 4h12v4H4z M4 10h12v4H4z M4 16h12v4H4z M18 6h2 M18 12h2 M18 18h2"
  }
];

const RESOURCES: { title: string; description: string; href: string; external?: boolean }[] = [
  {
    title: "API Docs",
    description: "Endpoints, auth, payloads, and code samples.",
    href: "/docs"
  },
  {
    title: "Status checks",
    description: "Live health probe used by this dashboard.",
    href: "/v1/health/live",
    external: true
  },
  {
    title: "Dashboard home",
    description: "Quick actions for senders, keys, and campaigns.",
    href: "/dashboard"
  }
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

function StatusDot({ status }: { status: SystemStatus }) {
  const color =
    status === "operational"
      ? "#14b882"
      : status === "checking"
        ? "#94a3b8"
        : status === "degraded"
          ? "#d97706"
          : "#b3261e";
  return (
    <span
      aria-hidden="true"
      style={{
        width: 10,
        height: 10,
        borderRadius: 999,
        background: color,
        boxShadow: `0 0 0 4px ${color}33, 0 0 12px ${color}80`,
        display: "inline-block"
      }}
    />
  );
}

function statusLabel(status: SystemStatus) {
  switch (status) {
    case "operational":
      return "All systems operational";
    case "checking":
      return "Checking status…";
    case "degraded":
      return "Degraded performance";
    case "down":
      return "Service unavailable";
  }
}

export default function SupportPage() {
  const { toast } = useToast();
  const [me, setMe] = useState<MeResponse["data"] | null>(null);
  const [status, setStatus] = useState<SystemStatus>("checking");
  const [statusCheckedAt, setStatusCheckedAt] = useState<Date | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<Category>("general");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [includeContext, setIncludeContext] = useState(true);

  useEffect(() => {
    let mounted = true;
    browserApi<MeResponse>("/admin/v1/me", { cache: "no-store" })
      .then((res) => {
        if (!mounted) return;
        setMe(res.data);
        if (!email) setEmail(res.data.email);
        if (!name) setName(res.data.email.split("@")[0] || "");
      })
      .catch(() => {
        if (mounted) setMe(null);
      });
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkStatus = useMemo(
    () => async () => {
      setStatus("checking");
      try {
        const res = await fetch("/v1/health/live", { cache: "no-store" });
        setStatusCheckedAt(new Date());
        if (res.ok) {
          setStatus("operational");
        } else if (res.status >= 500) {
          setStatus("down");
        } else {
          setStatus("degraded");
        }
      } catch {
        setStatusCheckedAt(new Date());
        setStatus("down");
      }
    },
    []
  );

  useEffect(() => {
    void checkStatus();
    const id = window.setInterval(() => {
      void checkStatus();
    }, 30_000);
    return () => window.clearInterval(id);
  }, [checkStatus]);

  function buildMailto(): string {
    const cat = CATEGORIES.find((c) => c.value === category)?.label ?? "General";
    const subj = subject.trim() || `[${cat}] Support request`;
    const lines: string[] = [];
    lines.push(message.trim());
    lines.push("");
    lines.push("---");
    lines.push(`From: ${name || "(unspecified)"} <${email}>`);
    lines.push(`Category: ${cat}`);
    if (includeContext && me) {
      lines.push(`Tenant: ${me.tenant.name} (${me.tenant.id})`);
      lines.push(`Plan: ${me.tenant.plan}`);
      lines.push(`Role: ${me.role}`);
      lines.push(`User ID: ${me.id}`);
    }
    if (typeof window !== "undefined") {
      lines.push(`URL: ${window.location.origin}`);
      lines.push(`User-Agent: ${navigator.userAgent}`);
    }
    const body = lines.join("\n");
    return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !message.trim()) {
      toast({ variant: "error", title: "Email and message are required" });
      return;
    }
    const url = buildMailto();
    window.location.href = url;
    toast({ variant: "success", title: "Opening your email client…" });
  }

  function copyEmail() {
    navigator.clipboard
      .writeText(SUPPORT_EMAIL)
      .then(() => toast({ variant: "success", title: "Email copied" }))
      .catch(() => toast({ variant: "error", title: "Copy failed" }));
  }

  return (
    <>
      <AppHeader />
      <main className="container">
        <section className="panel hero-panel" style={{ padding: "32px", marginBottom: 18 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "5px 14px 5px 10px",
              borderRadius: 999,
              background: "rgba(20, 184, 130, 0.10)",
              border: "1px solid rgba(10, 127, 81, 0.25)",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--brand-strong)",
              letterSpacing: "0.04em",
              textTransform: "uppercase"
            }}
          >
            <StatusDot status={status} />
            {statusLabel(status)}
          </div>

          <h1 style={{ margin: "14px 0 6px", fontSize: "clamp(26px, 3vw, 34px)" }}>
            How can we{" "}
            <span
              style={{
                background: "var(--grad-brand)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              help
            </span>
            ?
          </h1>
          <p className="muted" style={{ maxWidth: 640, fontSize: 15 }}>
            Browse common questions, jump to a relevant troubleshooting tool, or send the team a
            message — we usually reply within an hour during business hours.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
              marginTop: 22
            }}
          >
            <button
              type="button"
              onClick={copyEmail}
              className="stat-card"
              style={{ textAlign: "left", cursor: "pointer", border: "1px solid var(--line)" }}
            >
              <div className="stat-card-icon">
                <Icon path="M22 6 12 13 2 6 M2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6 M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2" />
              </div>
              <div className="stat-card-label">Email us</div>
              <div className="stat-card-value" style={{ fontSize: 16 }}>
                {SUPPORT_EMAIL}
              </div>
              <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                Click to copy
              </div>
            </button>

            <Link
              href="/docs"
              className="stat-card"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="stat-card-icon">
                <Icon path="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M4 4.5A2.5 2.5 0 0 1 6.5 7H20 M6.5 7v12" />
              </div>
              <div className="stat-card-label">Read the docs</div>
              <div className="stat-card-value" style={{ fontSize: 16 }}>
                API reference
              </div>
              <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                Endpoints, auth, samples
              </div>
            </Link>

            <div className="stat-card">
              <div className="stat-card-icon">
                <Icon path="M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4 12 14.01l-3-3" />
              </div>
              <div className="stat-card-label">System status</div>
              <div className="stat-card-value" style={{ fontSize: 16 }}>
                {statusLabel(status)}
              </div>
              <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                {statusCheckedAt
                  ? `Last checked ${statusCheckedAt.toLocaleTimeString()}`
                  : "Checking…"}
              </div>
            </div>
          </div>
        </section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18
          }}
        >
          <section className="panel" id="contact">
            <h2 style={{ marginTop: 0 }}>Send us a message</h2>
            <p className="muted" style={{ marginTop: 4, fontSize: 14 }}>
              Fill in the form and we'll open your email client with the message pre-composed —
              just hit send.
            </p>

            <form onSubmit={onSubmit} className="grid" style={{ marginTop: 18, gap: 14 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 12
                }}
              >
                <label>
                  Your name
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                  />
                </label>
                <label>
                  Reply-to email
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                  />
                </label>
              </div>

              <label>
                Category
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label} — {c.description}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Subject
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Short summary of your question"
                />
              </label>

              <label>
                Message
                <textarea
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What's happening? Include error messages, sender IDs, or steps to reproduce."
                  required
                />
              </label>

              <label
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 13,
                  color: "var(--muted-strong)"
                }}
              >
                <input
                  type="checkbox"
                  checked={includeContext}
                  onChange={(e) => setIncludeContext(e.target.checked)}
                  style={{ width: "auto" }}
                />
                Attach my tenant context (helps us locate your account)
              </label>

              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <button className="btn" type="submit">
                  <Icon path="M22 2 11 13 M22 2l-7 20-4-9-9-4z" size={14} />
                  Open in email client
                </button>
                <a className="btn ghost" href={`mailto:${SUPPORT_EMAIL}`}>
                  Email directly
                </a>
                <span className="muted" style={{ fontSize: 12 }}>
                  Replies go to {email || "your email"}
                </span>
              </div>
            </form>
          </section>

          <section className="panel">
            <h2 style={{ marginTop: 0 }}>Account snapshot</h2>
            <p className="muted" style={{ marginTop: 4, fontSize: 14 }}>
              We'll attach this when you submit so support can find you fast.
            </p>
            {me ? (
              <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
                <KeyVal label="Tenant" value={me.tenant.name} />
                <KeyVal label="Plan" value={me.tenant.plan} />
                <KeyVal label="Status" value={me.tenant.status} />
                <KeyVal label="Email" value={me.email} />
                <KeyVal label="Role" value={me.role} />
                <KeyVal label="User ID" value={me.id} mono />
                <KeyVal label="Tenant ID" value={me.tenant.id} mono />
              </div>
            ) : (
              <div className="muted" style={{ marginTop: 14, fontSize: 13 }}>
                Sign in to attach your account context.
              </div>
            )}
          </section>
        </div>

        <section className="panel" style={{ marginTop: 18 }} id="troubleshooting">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 12,
              flexWrap: "wrap"
            }}
          >
            <div>
              <h2 style={{ margin: 0 }}>Self-serve troubleshooting</h2>
              <p className="muted" style={{ marginTop: 4, fontSize: 14 }}>
                Most issues can be diagnosed without contacting us — start here.
              </p>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
              marginTop: 16
            }}
          >
            {TROUBLESHOOTING.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="docs-card feature-tile-link"
                style={{ display: "block" }}
              >
                <div
                  className="feature-tile-icon"
                  style={{
                    height: 38,
                    width: 38,
                    borderRadius: 10,
                    background: "var(--grad-brand-soft)",
                    color: "var(--brand-strong)",
                    border: "1px solid rgba(10, 127, 81, 0.18)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 10
                  }}
                >
                  <Icon path={t.iconPath} />
                </div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{t.title}</div>
                <div className="muted" style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.5 }}>
                  {t.description}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
            marginTop: 18
          }}
          id="faq"
        >
          <div className="panel">
            <h2 style={{ marginTop: 0 }}>Frequently asked</h2>
            <p className="muted" style={{ marginTop: 4, fontSize: 14 }}>
              Quick answers to the questions we see most.
            </p>
            <div style={{ display: "grid", gap: 8, marginTop: 16 }}>
              {FAQ.map((item, i) => {
                const open = openFaq === i;
                return (
                  <div
                    key={item.q}
                    style={{
                      borderRadius: 12,
                      border: "1px solid var(--line)",
                      background: "#fff",
                      overflow: "hidden"
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: "14px 16px",
                        background: "transparent",
                        border: 0,
                        cursor: "pointer",
                        textAlign: "left",
                        font: "inherit",
                        color: "var(--ink)",
                        fontWeight: 600
                      }}
                    >
                      <span>{item.q}</span>
                      <span
                        style={{
                          color: "var(--brand-strong)",
                          transition: "transform 0.2s ease",
                          transform: open ? "rotate(180deg)" : "rotate(0deg)",
                          flexShrink: 0
                        }}
                        aria-hidden="true"
                      >
                        <Icon path="M6 9l6 6 6-6" size={16} />
                      </span>
                    </button>
                    {open ? (
                      <div
                        style={{
                          padding: "0 16px 16px",
                          color: "var(--muted-strong)",
                          fontSize: 14,
                          lineHeight: 1.6
                        }}
                      >
                        {item.a}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="panel" id="resources">
            <h2 style={{ marginTop: 0 }}>Resources</h2>
            <p className="muted" style={{ marginTop: 4, fontSize: 14 }}>
              Helpful links to keep close.
            </p>
            <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
              {RESOURCES.map((r) =>
                r.external ? (
                  <a
                    key={r.href}
                    href={r.href}
                    target="_blank"
                    rel="noreferrer"
                    className="docs-card"
                    style={{ display: "block" }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 14 }}>
                      {r.title}{" "}
                      <span aria-hidden="true" style={{ fontSize: 11, color: "var(--muted)" }}>
                        ↗
                      </span>
                    </div>
                    <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>
                      {r.description}
                    </div>
                  </a>
                ) : (
                  <Link key={r.href} href={r.href} className="docs-card" style={{ display: "block" }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{r.title}</div>
                    <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>
                      {r.description}
                    </div>
                  </Link>
                )
              )}
            </div>

            <div
              style={{
                marginTop: 18,
                padding: 14,
                borderRadius: 12,
                background: "linear-gradient(135deg, rgba(20, 184, 130, 0.08), rgba(124, 92, 255, 0.06))",
                border: "1px solid rgba(10, 127, 81, 0.18)",
                fontSize: 13
              }}
            >
              <strong>Response times</strong>
              <ul style={{ margin: "8px 0 0", paddingLeft: 18, color: "var(--muted-strong)" }}>
                <li>Bug / security: within 1 hour</li>
                <li>Delivery / billing: within 4 hours</li>
                <li>General questions: within 1 business day</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function KeyVal({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 10,
        background: "rgba(247, 249, 252, 0.7)",
        border: "1px solid var(--line-soft)",
        fontSize: 13
      }}
    >
      <span className="muted" style={{ fontSize: 12 }}>
        {label}
      </span>
      <span
        style={{
          fontWeight: 600,
          fontFamily: mono ? "var(--font-mono, ui-monospace), monospace" : undefined,
          fontSize: mono ? 12 : 13,
          textAlign: "right",
          overflowWrap: "anywhere",
          wordBreak: "break-word",
          maxWidth: "70%"
        }}
      >
        {value}
      </span>
    </div>
  );
}
