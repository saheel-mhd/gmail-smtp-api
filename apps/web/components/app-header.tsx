"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { browserApi } from "../lib/browser-api";
import { useMobileDrawer } from "./mobile-drawer";

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
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const drawer = useMobileDrawer();

  useEffect(() => {
    let isMounted = true;
    browserApi("/admin/v1/me", { cache: "no-store" })
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

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (buttonRef.current?.contains(target)) return;
      setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function onLogout() {
    setLoggingOut(true);
    setOpen(false);

    try {
      await browserApi<{ ok: boolean }>("/admin/v1/auth/logout", {
        method: "POST",
        csrf: true
      });
    } catch {
      // Ignore network/auth errors; we still force a client logout navigation.
    } finally {
      // Force a full reload to avoid stale Next chunk runtime issues on client navigation.
      window.location.replace("/login");
    }
  }

  const menuItems = useMemo<MenuItem[]>(
    () => [
      { href: "/dashboard/company", label: "Company", iconPath: "M3 21h18M5 21V7l7-4 7 4v14" },
      { href: "/dashboard/domains", label: "Domains", iconPath: "M3 7h18M3 12h18M3 17h18" },
      { href: "/dashboard/account", label: "Account", iconPath: "M20 21a8 8 0 1 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8" },
      { label: loggingOut ? "Logging out..." : "Logout", iconPath: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9", action: onLogout }
    ],
    [loggingOut]
  );

  return (
    <>
      <header className="app-header-wrap">
        <div className="app-header">
          <div className="left">
            {drawer.available ? (
              <button
                type="button"
                className="icon-btn hamburger-btn"
                onClick={drawer.toggle}
                aria-label={drawer.open ? "Close menu" : "Open menu"}
                aria-expanded={drawer.open}
              >
                <Icon
                  path={
                    drawer.open
                      ? "M6 6l12 12M6 18L18 6"
                      : "M3 6h18 M3 12h18 M3 18h18"
                  }
                  size={18}
                />
              </button>
            ) : null}
            <div className="account-menu">
            <button
              type="button"
              className="icon-btn"
              onClick={() => setOpen((v) => !v)}
              aria-label="Open account menu"
              aria-expanded={open}
              ref={buttonRef}
            >
              <Icon path="M20 21a8 8 0 1 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8" size={18} />
            </button>
            {open ? (
              <div className="dropdown" ref={menuRef}>
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
          <Link href="/dashboard" className="brand" aria-label="Mailler home">
            <span className="brand-dot" aria-hidden="true" />
            Mailler
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
      <div className="app-header-spacer" aria-hidden="true" />
    </>
  );
}
