"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { browserApi } from "../../../lib/browser-api";
import { parseApiError } from "../../../lib/api-errors";
import { useToast } from "../../../components/ui/toast";

type MeResponse = {
  data: {
    id: string;
    email: string;
    role: string;
    mfaEnabled: boolean;
    lastLogin: string | null;
    createdAt: string;
    tenant: {
      id: string;
      name: string;
      plan: string;
      status: string;
      createdAt: string;
    };
  };
};

type MfaInitResponse = { data: { secret: string; otpauthUri: string } };

function Icon({ path, size = 18 }: { path: string; size?: number }) {
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

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function passwordStrength(pw: string): { label: string; score: number; color: string } {
  if (!pw) return { label: "—", score: 0, color: "#94a3b8" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const tiers = [
    { label: "Too short", color: "#b3261e" },
    { label: "Weak", color: "#d97706" },
    { label: "Fair", color: "#d97706" },
    { label: "Good", color: "#0ea5e9" },
    { label: "Strong", color: "#14b882" },
    { label: "Excellent", color: "#057a55" }
  ];
  return { ...tiers[Math.min(score, tiers.length - 1)], score };
}

export default function AccountPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [me, setMe] = useState<MeResponse["data"] | null>(null);
  const [meLoading, setMeLoading] = useState(true);
  const [meError, setMeError] = useState("");

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  // MFA state
  const [mfaSetup, setMfaSetup] = useState<{ secret: string; otpauthUri: string } | null>(null);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaInitLoading, setMfaInitLoading] = useState(false);
  const [mfaEnableLoading, setMfaEnableLoading] = useState(false);
  const [mfaDisableOpen, setMfaDisableOpen] = useState(false);
  const [mfaDisablePw, setMfaDisablePw] = useState("");
  const [mfaDisableCode, setMfaDisableCode] = useState("");
  const [mfaDisableLoading, setMfaDisableLoading] = useState(false);

  // Sign-out state
  const [signingOut, setSigningOut] = useState(false);

  const strength = useMemo(() => passwordStrength(newPassword), [newPassword]);

  async function loadMe() {
    setMeLoading(true);
    setMeError("");
    try {
      const res = await browserApi<MeResponse>("/admin/v1/me", { cache: "no-store" });
      setMe(res.data);
    } catch (err) {
      const { message } = parseApiError(err);
      setMeError(message || "Failed to load account");
    } finally {
      setMeLoading(false);
    }
  }

  useEffect(() => {
    void loadMe();
  }, []);

  async function onChangePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ variant: "error", title: "Passwords do not match" });
      return;
    }
    if (newPassword.length < 8) {
      toast({ variant: "error", title: "Password must be at least 8 characters" });
      return;
    }
    setPwLoading(true);
    try {
      await browserApi("/admin/v1/account/password", {
        method: "POST",
        csrf: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      toast({ variant: "success", title: "Password updated" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const { message } = parseApiError(err);
      toast({ variant: "error", title: message || "Could not update password" });
    } finally {
      setPwLoading(false);
    }
  }

  async function startMfaSetup() {
    setMfaInitLoading(true);
    try {
      const res = await browserApi<MfaInitResponse>("/admin/v1/account/mfa/init", {
        method: "POST",
        csrf: true
      });
      setMfaSetup(res.data);
      setMfaCode("");
    } catch (err) {
      const { message } = parseApiError(err);
      toast({ variant: "error", title: message || "Could not start MFA setup" });
    } finally {
      setMfaInitLoading(false);
    }
  }

  async function confirmMfa(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMfaEnableLoading(true);
    try {
      await browserApi("/admin/v1/account/mfa/enable", {
        method: "POST",
        csrf: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: mfaCode })
      });
      toast({ variant: "success", title: "Two-factor authentication enabled" });
      setMfaSetup(null);
      setMfaCode("");
      await loadMe();
    } catch (err) {
      const { message } = parseApiError(err);
      toast({ variant: "error", title: message || "Invalid code" });
    } finally {
      setMfaEnableLoading(false);
    }
  }

  async function disableMfa(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMfaDisableLoading(true);
    try {
      await browserApi("/admin/v1/account/mfa/disable", {
        method: "POST",
        csrf: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ currentPassword: mfaDisablePw, code: mfaDisableCode })
      });
      toast({ variant: "success", title: "Two-factor authentication disabled" });
      setMfaDisableOpen(false);
      setMfaDisablePw("");
      setMfaDisableCode("");
      await loadMe();
    } catch (err) {
      const { message } = parseApiError(err);
      toast({ variant: "error", title: message || "Could not disable MFA" });
    } finally {
      setMfaDisableLoading(false);
    }
  }

  async function copyText(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast({ variant: "success", title: `${label} copied` });
    } catch {
      toast({ variant: "error", title: "Copy failed" });
    }
  }

  async function signOut() {
    setSigningOut(true);
    try {
      await browserApi("/admin/v1/auth/logout", { method: "POST", csrf: true });
    } catch {
      // proceed regardless
    } finally {
      window.location.replace("/login");
    }
  }

  return (
    <main className="container">
      <section className="panel hero-panel" style={{ padding: 28, marginBottom: 18 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 12px",
            borderRadius: 999,
            background: "rgba(20, 184, 130, 0.10)",
            border: "1px solid rgba(10, 127, 81, 0.25)",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--brand-strong)",
            letterSpacing: "0.04em",
            textTransform: "uppercase"
          }}
        >
          Account &amp; Security
        </div>
        <h1 style={{ margin: "12px 0 6px" }}>Your account</h1>
        <p className="muted" style={{ maxWidth: 640, fontSize: 14 }}>
          Manage your profile, password, two-factor authentication, and sign-out preferences.
        </p>
      </section>

      {meLoading ? (
        <div className="panel">
          <div className="skeleton" style={{ height: 18, width: 160, marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 14, width: "70%", marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 14, width: "55%" }} />
        </div>
      ) : meError ? (
        <div className="panel" role="alert">
          <strong style={{ color: "var(--danger)" }}>{meError}</strong>
          <div style={{ marginTop: 12 }}>
            <button className="btn ghost small" type="button" onClick={() => loadMe()}>
              Retry
            </button>
          </div>
        </div>
      ) : me ? (
        <div style={{ display: "grid", gap: 18 }}>
          {/* Profile */}
          <section className="panel">
            <SectionHeader
              title="Profile"
              description="Read-only details from your tenant. Email and role are controlled by your owner."
              icon="M20 21a8 8 0 1 0-16 0 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8"
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
                marginTop: 14
              }}
            >
              <KeyVal label="Email" value={me.email} />
              <KeyVal label="Role" value={me.role} accent />
              <KeyVal label="MFA" value={me.mfaEnabled ? "Enabled" : "Disabled"} accent />
              <KeyVal label="Last login" value={formatDate(me.lastLogin)} />
              <KeyVal label="Member since" value={formatDate(me.createdAt)} />
              <KeyVal label="User ID" value={me.id} mono />
            </div>

            <div
              style={{
                marginTop: 16,
                padding: 16,
                borderRadius: 14,
                background: "linear-gradient(135deg, rgba(20, 184, 130, 0.08), rgba(124, 92, 255, 0.06))",
                border: "1px solid rgba(10, 127, 81, 0.18)"
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Tenant {me.tenant.name}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: 8,
                  fontSize: 13
                }}
              >
                <KeyVal label="Plan" value={me.tenant.plan} compact />
                <KeyVal label="Status" value={me.tenant.status} compact />
                <KeyVal label="Tenant ID" value={me.tenant.id} compact mono />
                <KeyVal label="Created" value={formatDate(me.tenant.createdAt)} compact />
              </div>
            </div>
          </section>

          {/* Password change */}
          <section className="panel">
            <SectionHeader
              title="Change password"
              description="Use a unique passphrase you don't use anywhere else."
              icon="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"
            />
            <form onSubmit={onChangePassword} className="grid" style={{ marginTop: 14, gap: 12 }}>
              <label>
                Current password
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 12
                }}
              >
                <label>
                  New password
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                </label>
                <label>
                  Confirm new password
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                </label>
              </div>

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

              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <button className="btn" type="submit" disabled={pwLoading}>
                  {pwLoading ? "Updating…" : "Update password"}
                </button>
                <span className="muted" style={{ fontSize: 12 }}>
                  You'll stay signed in on this device.
                </span>
              </div>
            </form>
          </section>

          {/* Two-factor */}
          <section className="panel">
            <SectionHeader
              title="Two-factor authentication"
              description={
                me.mfaEnabled
                  ? "Active. Codes are required at sign-in."
                  : "Add a one-time code from your authenticator app at every sign-in."
              }
              icon="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              accessory={
                <span
                  className={`badge ${me.mfaEnabled ? "green" : ""}`}
                  style={{ fontSize: 11 }}
                >
                  {me.mfaEnabled ? "Enabled" : "Disabled"}
                </span>
              }
            />

            {me.mfaEnabled ? (
              <div style={{ marginTop: 14 }}>
                {mfaDisableOpen ? (
                  <form onSubmit={disableMfa} className="grid" style={{ gap: 12 }}>
                    <p className="muted" style={{ fontSize: 13, margin: 0 }}>
                      To disable, confirm with your password and a current 6-digit code.
                    </p>
                    <label>
                      Current password
                      <input
                        type="password"
                        value={mfaDisablePw}
                        onChange={(e) => setMfaDisablePw(e.target.value)}
                        required
                        autoComplete="current-password"
                      />
                    </label>
                    <label>
                      6-digit code
                      <input
                        value={mfaDisableCode}
                        onChange={(e) => setMfaDisableCode(e.target.value.replace(/\D/g, ""))}
                        inputMode="numeric"
                        pattern="\d{6,8}"
                        maxLength={8}
                        required
                        placeholder="123 456"
                      />
                    </label>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button className="btn danger" type="submit" disabled={mfaDisableLoading}>
                        {mfaDisableLoading ? "Disabling…" : "Disable MFA"}
                      </button>
                      <button
                        type="button"
                        className="btn ghost"
                        onClick={() => {
                          setMfaDisableOpen(false);
                          setMfaDisablePw("");
                          setMfaDisableCode("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    type="button"
                    className="btn ghost"
                    onClick={() => setMfaDisableOpen(true)}
                  >
                    Disable two-factor
                  </button>
                )}
              </div>
            ) : mfaSetup ? (
              <div style={{ marginTop: 14 }}>
                <ol style={{ paddingLeft: 18, display: "grid", gap: 8, fontSize: 14 }}>
                  <li>Open your authenticator app (Google Authenticator, 1Password, Authy…).</li>
                  <li>
                    Scan the QR or paste the secret below into a new entry for &quot;Mailler ({me.email})&quot;.
                  </li>
                  <li>Enter the 6-digit code your app generates to confirm.</li>
                </ol>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: 12,
                    marginTop: 14
                  }}
                >
                  <div className="key-highlight" style={{ display: "grid", gap: 6, alignItems: "start" }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>Secret</div>
                    <code style={{ wordBreak: "break-all" }}>{mfaSetup.secret}</code>
                    <button
                      type="button"
                      className="btn small ghost"
                      onClick={() => copyText(mfaSetup.secret, "Secret")}
                      style={{ width: "max-content" }}
                    >
                      Copy secret
                    </button>
                  </div>
                  <div className="key-highlight" style={{ display: "grid", gap: 6, alignItems: "start" }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>otpauth URI</div>
                    <a
                      href={mfaSetup.otpauthUri}
                      style={{ color: "var(--brand-strong)", fontSize: 12, wordBreak: "break-all" }}
                    >
                      Open in authenticator app ↗
                    </a>
                    <button
                      type="button"
                      className="btn small ghost"
                      onClick={() => copyText(mfaSetup.otpauthUri, "URI")}
                      style={{ width: "max-content" }}
                    >
                      Copy URI
                    </button>
                  </div>
                </div>

                <form onSubmit={confirmMfa} className="grid" style={{ marginTop: 16, gap: 12 }}>
                  <label>
                    Confirmation code
                    <input
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
                      inputMode="numeric"
                      pattern="\d{6,8}"
                      maxLength={8}
                      required
                      placeholder="123 456"
                    />
                  </label>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn" type="submit" disabled={mfaEnableLoading}>
                      {mfaEnableLoading ? "Verifying…" : "Confirm and enable"}
                    </button>
                    <button
                      type="button"
                      className="btn ghost"
                      onClick={() => {
                        setMfaSetup(null);
                        setMfaCode("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div style={{ marginTop: 14, display: "flex", gap: 12, alignItems: "center" }}>
                <button
                  type="button"
                  className="btn"
                  onClick={startMfaSetup}
                  disabled={mfaInitLoading}
                >
                  {mfaInitLoading ? "Starting…" : "Set up two-factor"}
                </button>
                <span className="muted" style={{ fontSize: 12 }}>
                  Owners are required to enable MFA — strongly recommended for all roles.
                </span>
              </div>
            )}
          </section>

          {/* Sessions / sign out */}
          <section className="panel">
            <SectionHeader
              title="Session"
              description="Your current browser session. Signing out clears the session and CSRF cookies."
              icon="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9"
            />
            <div
              style={{
                marginTop: 14,
                padding: 14,
                borderRadius: 12,
                border: "1px solid var(--line)",
                background: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap"
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>This browser</div>
                <div className="muted" style={{ fontSize: 12 }}>
                  Last login {formatDate(me.lastLogin)}
                </div>
              </div>
              <button
                type="button"
                className="btn ghost"
                onClick={signOut}
                disabled={signingOut}
              >
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </section>

          {/* Helpful links */}
          <section
            className="panel"
            style={{
              background: "linear-gradient(135deg, rgba(124, 92, 255, 0.06) 0%, rgba(20, 184, 130, 0.06) 100%)"
            }}
          >
            <SectionHeader
              title="Related settings"
              description="Manage what affects your tenant."
              icon="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 10,
                marginTop: 14
              }}
            >
              <Link href="/dashboard/company" className="docs-card" style={{ display: "block" }}>
                <strong>Company profile</strong>
                <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                  Service, address, contact details.
                </div>
              </Link>
              <Link href="/dashboard/api-keys" className="docs-card" style={{ display: "block" }}>
                <strong>API keys</strong>
                <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                  Issue, rotate, and revoke keys.
                </div>
              </Link>
              <Link href="/dashboard/members" className="docs-card" style={{ display: "block" }}>
                <strong>Members</strong>
                <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                  Invite teammates with role scopes.
                </div>
              </Link>
              <Link href="/dashboard/logs/actions" className="docs-card" style={{ display: "block" }}>
                <strong>Activity log</strong>
                <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                  Audit account and tenant actions.
                </div>
              </Link>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}

function SectionHeader({
  title,
  description,
  icon,
  accessory
}: {
  title: string;
  description?: string;
  icon: string;
  accessory?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        justifyContent: "space-between",
        flexWrap: "wrap"
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, minWidth: 0, flex: 1 }}>
        <div
          aria-hidden="true"
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "var(--grad-brand-soft)",
            color: "var(--brand-strong)",
            border: "1px solid rgba(10, 127, 81, 0.18)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}
        >
          <Icon path={icon} />
        </div>
        <div style={{ minWidth: 0 }}>
          <h2 style={{ margin: 0 }}>{title}</h2>
          {description ? (
            <p className="muted" style={{ marginTop: 4, fontSize: 13.5 }}>
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {accessory ? <div style={{ flexShrink: 0 }}>{accessory}</div> : null}
    </div>
  );
}

function KeyVal({
  label,
  value,
  mono,
  accent,
  compact
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: 4,
        padding: compact ? "8px 10px" : "10px 12px",
        borderRadius: 10,
        background: "rgba(247, 249, 252, 0.7)",
        border: "1px solid var(--line-soft)"
      }}
    >
      <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </div>
      <div
        style={{
          fontSize: compact ? 13 : 14,
          fontWeight: 600,
          color: accent ? "var(--brand-strong)" : "var(--ink)",
          fontFamily: mono ? "var(--font-mono, ui-monospace), monospace" : undefined,
          overflowWrap: "anywhere",
          wordBreak: "break-word"
        }}
      >
        {value}
      </div>
    </div>
  );
}
