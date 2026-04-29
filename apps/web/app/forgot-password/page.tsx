"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      // We don't import browserApi here because that helper auto-handles 401s
      // by redirecting to /login — and this endpoint is intentionally public.
      await fetch("/admin/v1/auth/forgot-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
        credentials: "include"
      });
    } catch {
      // Even on network errors, fall through to the same generic confirmation
      // — we never want to leak whether the email exists.
    } finally {
      setSubmitted(true);
      setSubmitting(false);
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
            >
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
          </span>
          Mailler Console
        </div>

        {submitted ? (
          <>
            <h1>Check your inbox</h1>
            <p className="muted" style={{ marginTop: 0, fontSize: 14 }}>
              If an account exists for <strong>{email.trim()}</strong>, we just sent a reset link.
              The link expires in 30 minutes and can only be used once.
            </p>
            <div
              style={{
                marginTop: 22,
                padding: "12px 14px",
                borderRadius: 12,
                background: "rgba(20, 184, 130, 0.08)",
                border: "1px solid rgba(10, 127, 81, 0.18)",
                fontSize: 13,
                color: "var(--brand-strong)",
                lineHeight: 1.55
              }}
            >
              Didn't get an email after a couple of minutes? Check your spam folder, or try
              again with the same address.
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn ghost"
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                }}
              >
                Try a different email
              </button>
              <Link href="/login" className="btn ghost">
                Back to login
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1>Forgot your password?</h1>
            <p className="muted" style={{ marginTop: 0, fontSize: 14 }}>
              Enter the email associated with your account and we'll send you a reset link.
            </p>
            <form onSubmit={onSubmit} className="grid" style={{ marginTop: 22, gap: 14 }}>
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  placeholder="you@company.com"
                />
              </label>
              <button
                className="btn"
                type="submit"
                disabled={submitting}
                style={{ width: "100%", padding: "12px 18px", fontSize: 15 }}
              >
                {submitting ? "Sending…" : "Send reset link"}
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
              <span>Remembered it?</span>
              <Link href="/login" style={{ color: "var(--brand-strong)", fontWeight: 600 }}>
                ← Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
