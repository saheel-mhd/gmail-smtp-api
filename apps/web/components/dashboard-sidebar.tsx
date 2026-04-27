"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { browserApi } from "../lib/browser-api";
import { useMobileDrawer } from "./mobile-drawer";

const HELP_CARD_DISMISS_KEY = "sidebar:helpCard:dismissed";

function Icon({ path, size = 16 }: { path: string; size?: number }) {
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

const navItems = [
  { href: "/dashboard/templates", label: "Template", iconPath: "M4 4h16v4H4zM4 10h16v10H4z" },
  { href: "/dashboard/senders", label: "Sender Config", iconPath: "M3 6h18M3 12h18M3 18h18" },
  { href: "/dashboard/api-keys", label: "API Keys", iconPath: "M7 11h10m-7-4h7m-7 8h7M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2" },
  { href: "/dashboard/logs", label: "Audit Logs", iconPath: "M4 4h12v4H4zM4 10h12v4H4zM4 16h12v4H4zM18 6h2M18 12h2M18 18h2" },
  { href: "/dashboard/test-api", label: "Test API", iconPath: "M4 7h16M4 12h10M4 17h7" }
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const drawer = useMobileDrawer();
  const [helpDismissed, setHelpDismissed] = useState(true);

  useEffect(() => {
    try {
      setHelpDismissed(localStorage.getItem(HELP_CARD_DISMISS_KEY) === "1");
    } catch {
      setHelpDismissed(false);
    }
  }, []);

  function dismissHelp() {
    setHelpDismissed(true);
    try {
      localStorage.setItem(HELP_CARD_DISMISS_KEY, "1");
    } catch {
      // Ignore storage failures (private mode, disabled storage).
    }
  }

  useEffect(() => {
    const prefetch = [
      "/admin/v1/senders",
      "/admin/v1/api-keys",
      "/admin/v1/templates",
      "/admin/v1/logs",
      "/admin/v1/email-logs",
      "/admin/v1/system-logs"
    ];
    void Promise.allSettled(
      prefetch.map((path) => browserApi(path, { cacheTtlMs: 120_000 }))
    );
  }, []);

  return (
    <aside className={`dashboard-sidebar${drawer.open ? " mobile-open" : ""}`}>
      <div>
        <div className="sidebar-title">Mailer SMTP</div>
        <div className="sidebar-subtitle">Manage senders, templates, and access.</div>
      </div>
      <div className="sidebar-section-label">Workspace</div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link${active ? " active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <span className="sidebar-link-left">
                <span className="sidebar-link-icon">
                  <Icon path={item.iconPath} />
                </span>
                <span>{item.label}</span>
              </span>
              <span className="sidebar-link-arrow" aria-hidden="true">
                <Icon path="M9 18l6-6-6-6" size={14} />
              </span>
            </Link>
          );
        })}
      </nav>
      {helpDismissed ? null : (
        <div className="sidebar-card">
          <button
            type="button"
            onClick={dismissHelp}
            aria-label="Dismiss help card"
            title="Dismiss"
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 26,
              height: 26,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.08)",
              color: "rgba(241, 245, 251, 0.85)",
              cursor: "pointer",
              padding: 0,
              zIndex: 1,
              transition: "background 0.15s ease, color 0.15s ease, border-color 0.15s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.16)";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "rgba(241, 245, 251, 0.85)";
            }}
          >
            <Icon path="M6 6l12 12M6 18L18 6" size={14} />
          </button>
          <div className="sidebar-card-title">Need a hand?</div>
          <div className="sidebar-card-text">
            Read the API docs or reach support — we usually reply within an hour.
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <Link
              href="/docs"
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.14)",
                color: "#f1f5fb",
                border: "1px solid rgba(255,255,255,0.18)"
              }}
            >
              Docs
            </Link>
            <Link
              href="/support"
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: 999,
                background: "rgba(20, 184, 130, 0.95)",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.18)",
                boxShadow: "0 6px 14px rgba(20, 184, 130, 0.45)"
              }}
            >
              Support
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}
