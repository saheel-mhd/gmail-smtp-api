"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { browserApi } from "../../../lib/browser-api";

type Sender = {
  id: string;
  label: string;
  gmailAddress: string;
};

type ApiKeyRow = {
  id: string;
  name: string;
  prefix: string;
  status: "active" | "revoked";
  rateLimitPerMinute: number;
  smtpAccountIds: string[];
};

type CreateApiKeyPayload = {
  name: string;
  smtpAccountIds: string[];
  rateLimitPerMinute: number;
  allowedIps: string[];
};

const DEFAULT_FORM: CreateApiKeyPayload = {
  name: "",
  smtpAccountIds: [],
  rateLimitPerMinute: 120,
  allowedIps: []
};

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyRow[]>([]);
  const [senders, setSenders] = useState<Sender[]>([]);
  const [form, setForm] = useState<CreateApiKeyPayload>(DEFAULT_FORM);
  const [newKey, setNewKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [keyResponse, senderResponse] = await Promise.all([
        browserApi<{ data: ApiKeyRow[] }>("/admin/v1/api-keys"),
        browserApi<{ data: Sender[] }>("/admin/v1/senders")
      ]);
      setKeys(keyResponse.data);
      setSenders(senderResponse.data);
    } catch (err) {
      setError((err as Error).message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length > 0 &&
      form.rateLimitPerMinute > 0 &&
      form.smtpAccountIds.length > 0
    );
  }, [form]);

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    setMessage("");
    setNewKey("");
    try {
      const response = await browserApi<{
        data: { key: string };
      }>("/admin/v1/api-keys", {
        method: "POST",
        csrf: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form)
      });
      setMessage("API key created.");
      setNewKey(response.data.key);
      setForm(DEFAULT_FORM);
      await loadData();
    } catch (err) {
      setError((err as Error).message || "Failed to create API key");
    } finally {
      setSubmitting(false);
    }
  }

  async function onRevoke(id: string) {
    setError("");
    setMessage("");
    try {
      await browserApi<{ ok: true }>(`/admin/v1/api-keys/${id}`, {
        method: "DELETE",
        csrf: true
      });
      setMessage("API key revoked.");
      await loadData();
    } catch (err) {
      setError((err as Error).message || "Failed to revoke API key");
    }
  }

  async function onRotate(id: string) {
    setError("");
    setMessage("");
    setNewKey("");
    try {
      const response = await browserApi<{ data: { key: string } }>(
        `/admin/v1/api-keys/${id}/rotate`,
        {
          method: "POST",
          csrf: true
        }
      );
      setMessage("API key rotated.");
      setNewKey(response.data.key);
      await loadData();
    } catch (err) {
      setError((err as Error).message || "Failed to rotate API key");
    }
  }

  return (
    <main className="container">
      <section className="panel">
        <h1>API Keys</h1>
        <p className="muted">
          Create scoped keys and copy the key value now; it is shown only once.
        </p>
      </section>

      <section className="panel" style={{ marginTop: 16 }}>
        <h2>Create API Key</h2>
        <form onSubmit={onCreate} className="grid" style={{ marginTop: 12 }}>
          <label>
            Key Name
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Production Key"
              required
            />
          </label>
          <label>
            Rate Limit Per Minute
            <input
              type="number"
              min={1}
              value={form.rateLimitPerMinute}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  rateLimitPerMinute: Number(e.target.value)
                }))
              }
              required
            />
          </label>
          <label>
            Allowed Sender Accounts
            <select
              multiple
              value={form.smtpAccountIds}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions).map((o) => o.value);
                setForm((prev) => ({ ...prev, smtpAccountIds: values }));
              }}
              required
              style={{ minHeight: 120 }}
            >
              {senders.map((sender) => (
                <option value={sender.id} key={sender.id}>
                  {sender.label} ({sender.gmailAddress})
                </option>
              ))}
            </select>
          </label>
          <div>
            <button className="btn" type="submit" disabled={!canSubmit || submitting}>
              {submitting ? "Creating..." : "Create API Key"}
            </button>
          </div>
        </form>
        {newKey ? (
          <p style={{ marginTop: 12 }}>
            New key: <code>{newKey}</code>
          </p>
        ) : null}
        {message ? <p style={{ color: "#0a7f51", marginTop: 12 }}>{message}</p> : null}
        {error ? <p style={{ color: "#9f1a1a", marginTop: 12 }}>{error}</p> : null}
      </section>

      <section className="grid" style={{ marginTop: 16 }}>
        {loading ? (
          <article className="panel">
            <p>Loading API keys...</p>
          </article>
        ) : keys.length === 0 ? (
          <article className="panel">
            <p>No API keys found.</p>
          </article>
        ) : (
          keys.map((key) => (
            <article className="panel" key={key.id}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <h3>{key.name}</h3>
                <span className={`badge ${key.status === "active" ? "green" : "red"}`}>
                  {key.status}
                </span>
              </div>
              <p className="muted">
                Prefix: <code>{key.prefix}</code> | Rate: {key.rateLimitPerMinute}/min
              </p>
              <p className="muted">Scoped senders: {key.smtpAccountIds.join(", ") || "none"}</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="btn secondary"
                  onClick={() => void onRotate(key.id)}
                  disabled={key.status !== "active"}
                  type="button"
                >
                  Rotate
                </button>
                <button
                  className="btn secondary"
                  onClick={() => void onRevoke(key.id)}
                  disabled={key.status !== "active"}
                  type="button"
                >
                  Revoke
                </button>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
