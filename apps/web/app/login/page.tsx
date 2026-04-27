"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { browserApi } from "../../lib/browser-api";
import { useToast } from "../../components/ui/toast";

type LoginResponse = {
  csrfToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    tenantId: string;
  };
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      await browserApi<LoginResponse>("/admin/v1/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password, mfaCode: mfaCode || undefined })
      });

      try {
        sessionStorage.setItem("login_success_toast", "1");
      } catch {
        // Ignore storage failures (private mode, disabled storage).
      }

      const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
      router.push(callbackUrl || "/dashboard");
      router.refresh();
    } catch (err) {
      const rawMessage = (err as Error)?.message || "";
      let isUnauthorized = false;
      if (rawMessage) {
        try {
          const parsed = JSON.parse(rawMessage);
          isUnauthorized = parsed?.statusCode === 401;
        } catch {
          isUnauthorized = rawMessage.toLowerCase().includes("unauthorized") ||
            rawMessage.includes("401");
        }
      }
      toast({
        variant: "error",
        title: isUnauthorized ? "Incorrect username or password" : "Login failed"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-mark" aria-hidden="true">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 6 12 13 2 6" />
              <path d="M2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6" />
              <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2" />
            </svg>
          </span>
          Mailler Console
        </div>
        <h1>Welcome back</h1>
        <p className="muted" style={{ marginTop: 0, fontSize: 14 }}>
          Sign in to manage senders, keys, and delivery activity.
        </p>
        <form onSubmit={onSubmit} className="grid" style={{ marginTop: 22, gap: 14 }}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>
          <label>
            MFA Code <span className="muted" style={{ fontWeight: 400 }}>(optional unless required)</span>
            <input
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              placeholder="123 456"
              inputMode="numeric"
            />
          </label>
          <button
            className="btn"
            type="submit"
            disabled={loading}
            style={{ marginTop: 6, width: "100%", padding: "12px 18px", fontSize: 15 }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div
          style={{
            marginTop: 20,
            paddingTop: 18,
            borderTop: "1px solid var(--line-soft)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 13,
            color: "var(--muted)"
          }}
        >
          <span>New to Mailler?</span>
          <Link
            href="/register"
            style={{ color: "var(--brand-strong)", fontWeight: 600 }}
          >
            Create an account →
          </Link>
        </div>
      </div>
    </main>
  );
}
