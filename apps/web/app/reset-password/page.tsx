"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { passwordStrength } from "../../lib/password-strength";

function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const strength = useMemo(() => passwordStrength(newPassword), [newPassword]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!token) {
      setError("Reset link is missing or invalid.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/admin/v1/auth/reset-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
        credentials: "include"
      });
      if (!res.ok) {
        let message = "Reset link is invalid or has expired.";
        try {
          const body = await res.json();
          if (body?.message) message = body.message;
        } catch {
          // ignore
        }
        setError(message);
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/login"), 1800);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <main className="auth-shell">
        <div className="auth-card">
          <h1>Reset link missing</h1>
          <p className="muted" style={{ marginTop: 0, fontSize: 14 }}>
            This URL doesn't include a valid reset token. Open the link from your reset email,
            or request a new one.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" }}>
            <Link href="/forgot-password" className="btn">
              Request new link
            </Link>
            <Link href="/login" className="btn ghost">
              Back to login
            </Link>
          </div>
        </div>
      </main>
    );
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
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </span>
          Mailler Console
        </div>

        {done ? (
          <>
            <h1>Password updated</h1>
            <p className="muted" style={{ marginTop: 0, fontSize: 14 }}>
              You can now sign in with your new password. Redirecting you to the login page…
            </p>
            <div style={{ marginTop: 20 }}>
              <Link href="/login" className="btn">
                Go to login
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1>Set a new password</h1>
            <p className="muted" style={{ marginTop: 0, fontSize: 14 }}>
              Pick a strong password you don't use anywhere else.
            </p>
            <form onSubmit={onSubmit} className="grid" style={{ marginTop: 22, gap: 14 }}>
              <label>
                New password
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  autoFocus
                />
              </label>
              <label>
                Confirm password
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </label>

              {newPassword ? (
                <div style={{ display: "grid", gap: 6 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: 12,
                      color: "var(--muted)"
                    }}
                  >
                    <span>Strength</span>
                    <span style={{ color: strength.color, fontWeight: 600 }}>
                      {strength.label}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      borderRadius: 999,
                      background: "var(--line-soft)",
                      overflow: "hidden"
                    }}
                  >
                    <div
                      style={{
                        width: `${(strength.score / 5) * 100}%`,
                        height: "100%",
                        background: strength.color,
                        transition: "width 0.18s ease, background 0.18s ease"
                      }}
                    />
                  </div>
                  <div className="muted" style={{ fontSize: 12 }}>
                    Use 12+ characters with a mix of cases, digits, and symbols.
                  </div>
                </div>
              ) : null}

              {error ? (
                <p
                  role="alert"
                  style={{
                    margin: 0,
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

              <button
                className="btn"
                type="submit"
                disabled={submitting}
                style={{ width: "100%", padding: "12px 18px", fontSize: 15 }}
              >
                {submitting ? "Updating…" : "Update password"}
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
              <span>Need a new link?</span>
              <Link
                href="/forgot-password"
                style={{ color: "var(--brand-strong)", fontWeight: 600 }}
              >
                Request another →
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordInner />
    </Suspense>
  );
}
