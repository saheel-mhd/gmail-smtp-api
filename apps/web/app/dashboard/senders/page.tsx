"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { browserApi } from "../../../lib/browser-api";

type Sender = {
  id: string;
  label: string;
  gmailAddress: string;
  status: "active" | "disabled" | "needs_attention";
  perMinuteLimit: number;
  perDayLimit: number;
  errorStreak: number;
  healthScore: number;
};

type SenderResponse = { data: Sender[] };

type CreateSenderPayload = {
  label: string;
  gmailAddress: string;
  appPassword: string;
  perMinuteLimit: number;
  perDayLimit: number;
};

function healthBadge(status: Sender["status"], healthScore: number) {
  if (status === "needs_attention" || healthScore < 40) {
    return <span className="badge red">Needs attention</span>;
  }
  if (healthScore < 70) return <span className="badge yellow">Degraded</span>;
  return <span className="badge green">Healthy</span>;
}

const DEFAULT_FORM: CreateSenderPayload = {
  label: "",
  gmailAddress: "",
  appPassword: "",
  perMinuteLimit: 60,
  perDayLimit: 2000
};

export default function SendersPage() {
  const [senders, setSenders] = useState<Sender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CreateSenderPayload>(DEFAULT_FORM);

  async function loadSenders() {
    setLoading(true);
    setError("");
    try {
      const response = await browserApi<SenderResponse>("/admin/v1/senders");
      setSenders(response.data);
    } catch (err) {
      setError((err as Error).message || "Failed to load senders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSenders();
  }, []);

  const canSubmit = useMemo(() => {
    return (
      form.label.trim().length > 0 &&
      form.gmailAddress.trim().length > 0 &&
      form.appPassword.trim().length > 0 &&
      form.perMinuteLimit > 0 &&
      form.perDayLimit > 0
    );
  }, [form]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      await browserApi<{ data: Sender }>("/admin/v1/senders", {
        method: "POST",
        csrf: true,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(form)
      });
      setMessage("Sender added successfully.");
      setForm(DEFAULT_FORM);
      await loadSenders();
    } catch (err) {
      setError((err as Error).message || "Failed to add sender.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container">
      <section className="panel">
        <h1>Senders</h1>
        <p className="muted">
          Add your Gmail sender account here. From address is always the configured Gmail account.
        </p>
      </section>

      <section className="panel" style={{ marginTop: 16 }}>
        <h2>Add Gmail Sender</h2>
        <form onSubmit={onSubmit} className="grid" style={{ marginTop: 12 }}>
          <label>
            Label
            <input
              value={form.label}
              onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
              placeholder="Primary Sender"
              required
            />
          </label>
          <label>
            Gmail Address
            <input
              type="email"
              value={form.gmailAddress}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, gmailAddress: e.target.value }))
              }
              placeholder="you@gmail.com"
              required
            />
          </label>
          <label>
            App Password
            <input
              type="password"
              value={form.appPassword}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, appPassword: e.target.value }))
              }
              placeholder="Gmail app password"
              required
            />
          </label>
          <label>
            Per-Minute Limit
            <input
              type="number"
              min={1}
              value={form.perMinuteLimit}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, perMinuteLimit: Number(e.target.value) }))
              }
              required
            />
          </label>
          <label>
            Per-Day Limit
            <input
              type="number"
              min={1}
              value={form.perDayLimit}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, perDayLimit: Number(e.target.value) }))
              }
              required
            />
          </label>
          <div>
            <button className="btn" type="submit" disabled={submitting || !canSubmit}>
              {submitting ? "Adding..." : "Add Sender"}
            </button>
          </div>
        </form>
        {message ? (
          <p style={{ color: "#0a7f51", marginTop: 12 }}>{message}</p>
        ) : null}
        {error ? (
          <p style={{ color: "#9f1a1a", marginTop: 12 }}>{error}</p>
        ) : null}
      </section>

      <section className="grid" style={{ marginTop: 16 }}>
        {loading ? (
          <article className="panel">
            <p>Loading senders...</p>
          </article>
        ) : senders.length === 0 ? (
          <article className="panel">
            <p>No senders found yet.</p>
          </article>
        ) : (
          senders.map((sender) => (
            <article className="panel" key={sender.id}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <h3>{sender.label}</h3>
                  <p className="muted">{sender.gmailAddress}</p>
                </div>
                {healthBadge(sender.status, sender.healthScore)}
              </div>
              <p className="muted">
                Limits: {sender.perMinuteLimit}/min, {sender.perDayLimit}/day | Error streak:{" "}
                {sender.errorStreak}
              </p>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
