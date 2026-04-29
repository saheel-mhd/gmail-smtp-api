"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { browserApi } from "../../lib/browser-api";
import { parseApiError } from "../../lib/api-errors";
import { passwordStrength } from "../../lib/password-strength";
import { OtpInput } from "../../components/ui/otp-input";

type RegisterResponse = {
  csrfToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    tenantId: string;
  };
};

type StartResponse = {
  ok: true;
  email: string;
  expiresInSeconds: number;
  maxAttempts: number;
};

type Stage = "form" | "otp";

export default function RegisterPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("form");

  // Form fields
  const [tenantName, setTenantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // OTP fields
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);

  // TOS
  const [acceptTerms, setAcceptTerms] = useState(false);

  const strength = useMemo(() => passwordStrength(password), [password]);

  // Tick down the OTP TTL countdown
  useEffect(() => {
    if (stage !== "otp" || secondsLeft <= 0) return;
    const id = window.setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [stage, secondsLeft]);

  // Tick down the resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = window.setInterval(() => setResendCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [resendCooldown]);

  async function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    if (!acceptTerms) {
      setFormError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
    if (password !== confirm) {
      setFormError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    setFormLoading(true);
    try {
      const res = await browserApi<StartResponse>("/admin/v1/auth/register/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tenantName, email, password })
      });
      setStage("otp");
      setOtp("");
      setOtpError("");
      setSecondsLeft(res.expiresInSeconds);
      setResendCooldown(60);
    } catch (err) {
      const { message } = parseApiError(err);
      setFormError(message || "Could not start registration");
    } finally {
      setFormLoading(false);
    }
  }

  async function onOtpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOtpError("");
    if (!/^\d{6}$/.test(otp)) {
      setOtpError("Enter the 6-digit code from your email.");
      return;
    }
    setOtpLoading(true);
    try {
      await browserApi<RegisterResponse>("/admin/v1/auth/register/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, otp })
      });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      const { message } = parseApiError(err);
      setOtpError(message || "Could not verify code");
    } finally {
      setOtpLoading(false);
    }
  }

  async function onResend() {
    if (resendCooldown > 0) return;
    setResendLoading(true);
    setOtpError("");
    try {
      const res = await browserApi<StartResponse>("/admin/v1/auth/register/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tenantName, email, password })
      });
      setSecondsLeft(res.expiresInSeconds);
      setResendCooldown(60);
      setOtp("");
    } catch (err) {
      const { message } = parseApiError(err);
      setOtpError(message || "Could not resend code");
    } finally {
      setResendLoading(false);
    }
  }

  function backToForm() {
    setStage("form");
    setOtp("");
    setOtpError("");
    setSecondsLeft(0);
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${String(r).padStart(2, "0")}`;
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

        {stage === "form" ? (
          <>
            <h1>Create your workspace</h1>
            <p className="muted" style={{ marginTop: 0, fontSize: 14 }}>
              We'll send a 6-digit code to your email to confirm it's really yours.
            </p>
            <form onSubmit={onFormSubmit} className="grid" style={{ marginTop: 22, gap: 14 }}>
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
                    autoComplete="new-password"
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
                    autoComplete="new-password"
                  />
                </label>
              </div>

              {password ? (
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

              <label
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 10,
                  fontSize: 13,
                  color: "var(--muted-strong)",
                  fontWeight: 400,
                  cursor: "pointer",
                  paddingTop: 4
                }}
              >
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  style={{
                    width: "auto",
                    marginTop: 3,
                    accentColor: "var(--brand)"
                  }}
                />
                <span>
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    target="_blank"
                    style={{ color: "var(--brand-strong)", fontWeight: 600 }}
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    target="_blank"
                    style={{ color: "var(--brand-strong)", fontWeight: 600 }}
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              <button
                className="btn"
                type="submit"
                disabled={formLoading || !acceptTerms}
                style={{ marginTop: 6, width: "100%", padding: "12px 18px", fontSize: 15 }}
              >
                {formLoading ? "Sending code..." : "Send verification code"}
              </button>
            </form>
            {formError ? (
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
                {formError}
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
          </>
        ) : (
          <>
            <h1>Confirm your email</h1>
            <p className="muted" style={{ marginTop: 0, fontSize: 14 }}>
              We sent a 6-digit code to <strong>{email}</strong>. Enter it below to finish creating
              your account.
            </p>

            <form onSubmit={onOtpSubmit} className="grid" style={{ marginTop: 22, gap: 14 }}>
              <div style={{ display: "grid", gap: 8 }}>
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--muted-strong)",
                    fontWeight: 500
                  }}
                >
                  Verification code
                </span>
                <OtpInput
                  value={otp}
                  onChange={(v) => {
                    setOtp(v);
                    if (otpError) setOtpError("");
                  }}
                  hasError={Boolean(otpError)}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 12,
                  color: "var(--muted)",
                  flexWrap: "wrap",
                  gap: 8
                }}
              >
                <span>
                  {secondsLeft > 0
                    ? `Code expires in ${formatTime(secondsLeft)}`
                    : "Code may have expired"}
                </span>
                <button
                  type="button"
                  onClick={onResend}
                  disabled={resendLoading || resendCooldown > 0}
                  style={{
                    border: 0,
                    background: "transparent",
                    color:
                      resendCooldown > 0 || resendLoading
                        ? "var(--muted)"
                        : "var(--brand-strong)",
                    fontWeight: 600,
                    cursor: resendCooldown > 0 || resendLoading ? "not-allowed" : "pointer",
                    padding: 0,
                    font: "inherit"
                  }}
                >
                  {resendLoading
                    ? "Sending…"
                    : resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : "Resend code"}
                </button>
              </div>

              <button
                className="btn"
                type="submit"
                disabled={otpLoading}
                style={{ marginTop: 6, width: "100%", padding: "12px 18px", fontSize: 15 }}
              >
                {otpLoading ? "Verifying..." : "Verify and create account"}
              </button>
            </form>

            {otpError ? (
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
                {otpError}
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
                color: "var(--muted)",
                gap: 12,
                flexWrap: "wrap"
              }}
            >
              <button
                type="button"
                onClick={backToForm}
                style={{
                  border: 0,
                  background: "transparent",
                  color: "var(--brand-strong)",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                  font: "inherit",
                  fontSize: 13
                }}
              >
                ← Use a different email
              </button>
              <span style={{ fontSize: 12 }}>Check spam if you don't see it.</span>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
