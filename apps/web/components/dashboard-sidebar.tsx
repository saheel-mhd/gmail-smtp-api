"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { browserApi } from "../lib/browser-api";

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
    <aside className="dashboard-sidebar">
      <div>
        <div className="sidebar-title">Mailer SMTP</div>
        <div className="sidebar-subtitle">Manage senders, templates, and access.</div>
      </div>
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
    </aside>
  );
}
