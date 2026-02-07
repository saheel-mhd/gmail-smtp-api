"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { browserApi } from "../lib/browser-api";

const navItems = [
  { href: "/dashboard/templates", label: "Template" },
  { href: "/dashboard/senders", label: "Sender Config" },
  { href: "/dashboard/api-keys", label: "API Keys" },
  { href: "/dashboard/logs", label: "Audit Logs" },
  { href: "/dashboard/test-api", label: "Test API" }
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
        <div className="sidebar-title">Dashboard</div>
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
              <span>{item.label}</span>
              <span aria-hidden="true">→</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
