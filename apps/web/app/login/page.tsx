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
    <main
      className="container"
      style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}
    >
      <div className="panel" style={{ width: "100%", maxWidth: 540 }}>
        <h1>GMAIL SMTP API GENERATOR</h1>
        <p className="muted">Sign in to continue.</p>
        <form onSubmit={onSubmit} className="grid" style={{ marginTop: 12 }}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <label>
            MFA Code (optional unless owner requires it)
            <input value={mfaCode} onChange={(e) => setMfaCode(e.target.value)} />
          </label>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <Link href="/register" className="btn ghost">
              Create account
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
