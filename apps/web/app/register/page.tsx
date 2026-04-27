"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { browserApi } from "../../lib/browser-api";
import { parseApiError } from "../../lib/api-errors";

type RegisterResponse = {
  csrfToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    tenantId: string;
  };
};

export default function RegisterPage() {
  const router = useRouter();
  const [tenantName, setTenantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await browserApi<RegisterResponse>("/admin/v1/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tenantName, email, password })
      });

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      const { message } = parseApiError(err);
      setError(message || "Registration failed");
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
        <h1>Create your workspace</h1>
        <p className="muted" style={{ marginTop: 0, fontSize: 14 }}>
          Spin up a tenant and start sending in minutes.
        </p>
        <form onSubmit={onSubmit} className="grid" style={{ marginTop: 22, gap: 14 }}>
          <label>
            Company name
            <input
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              placeholder="Acme Inc."
              required
            />
          </label>
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 12
            }}
          >
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 chars"
                required
                minLength={8}
              />
            </label>
            <label>
              Confirm
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat password"
                required
                minLength={8}
              />
            </label>
          </div>
          <button
            className="btn"
            type="submit"
            disabled={loading}
            style={{ marginTop: 6, width: "100%", padding: "12px 18px", fontSize: 15 }}
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        {error ? (
          <p
            role="alert"
            style={{
              marginTop: 14,
              padding: "10px 12px",
              borderRadius: 10,
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(179, 38, 30, 0.25)",
              color: "var(--danger)",
              fontSize: 13
            }}
          >
            {error}
          </p>
        ) : null}
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
          <span>Already have an account?</span>
          <Link href="/login" style={{ color: "var(--brand-strong)", fontWeight: 600 }}>
            ← Sign in instead
          </Link>
        </div>
      </div>
    </main>
  );
}
