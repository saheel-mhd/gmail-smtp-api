"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { browserApi } from "../lib/browser-api";

function Icon({
  path,
  size = 16
}: {
  path: string;
  size?: number;
}) {
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

type MenuItem = {
  href?: string;
  label: string;
  iconPath: string;
  action?: () => Promise<void>;
};

export function AppHeader() {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION ?? "dev";

  useEffect(() => {
    let isMounted = true;
    browserApi("/admin/v1/me")
      .then(() => {
        if (isMounted) setIsAuthed(true);
      })
      .catch(() => {
        if (isMounted) setIsAuthed(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  async function onLogout() {
    setLoggingOut(true);
    setOpen(false);

    // Fire-and-forget logout request so UX is instant.
    void browserApi<{ ok: boolean }>("/admin/v1/auth/logout", {
      method: "POST",
      csrf: true
    }).catch(() => {
      // Ignore network/auth errors; we still force a client logout navigation.
    });

    // Force a full reload to avoid stale Next chunk runtime issues on client navigation.
    window.location.replace("/login");
  }

  const menuItems = useMemo<MenuItem[]>(
    () => [
      { href: "/dashboard/company", label: "Create Company", iconPath: "M3 21h18M5 21V7l7-4 7 4v14" },
      { href: "/dashboard/members", label: "Manage Members", iconPath: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.13a4 4 0 0 1 0 7.75M22 21v-2a4 4 0 0 0-3-3.87M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8" },
      { href: "/dashboard/transactions", label: "Transaction Logs", iconPath: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2" },
      { href: "/dashboard/account", label: "Account", iconPath: "M20 21a8 8 0 1 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8" },
      { label: loggingOut ? "Logging out..." : "Logout", iconPath: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9", action: onLogout }
    ],
    [loggingOut]
  );

  return (
    <header className="app-header-wrap">
      <div className="app-header">
        <div className="left">
          <div className="account-menu">
            <button
              type="button"
              className="icon-btn"
              onClick={() => setOpen((v) => !v)}
              aria-label="Open account menu"
              aria-expanded={open}
            >
              <Icon path="M20 21a8 8 0 1 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8" size={18} />
            </button>
            {open ? (
              <div className="dropdown">
                {menuItems.map((item) =>
                  item.href ? (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="dropdown-item"
                      onClick={() => setOpen(false)}
                    >
                      <Icon path={item.iconPath} />
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <button
                      key={item.label}
                      className="dropdown-item"
                      type="button"
                      onClick={() => {
                        if (item.action) void item.action();
                      }}
                    >
                      <Icon path={item.iconPath} />
                      <span>{item.label}</span>
                    </button>
                  )
                )}
              </div>
            ) : null}
          </div>
          <Link href="/dashboard" className="brand">
            GMAIL SMTP API GENERATOR
          </Link>
          <span className="badge version-pill" title={`Build ${appVersion}`}>
            v{appVersion}
          </span>
        </div>

        <nav className="right">
          <Link href="/docs" className="nav-link">
            <Icon path="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 7H20M6.5 7v12" />
            API Docs
          </Link>
          <Link href="/support" className="nav-link">
            <Icon path="M22 12a10 10 0 1 1-4-8M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" />
            Support
          </Link>
          {isAuthed === false ? (
            <Link href="/login" className="nav-link">
              <Icon path="M15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10M10 17l5-5-5-5M15 12H3" />
              Login
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
