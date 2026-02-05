"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { browserApi } from "../../../lib/browser-api";

type Sender = {
  id: string;
  label: string;
  gmailAddress: string;
  status: "active" | "disabled" | "needs_attention";
};

type ApiKeyRow = {
  id: string;
  name: string;
  status: "active" | "revoked";
  smtpAccountIds: string[];
};

export default function TestApiPage() {
  const [senders, setSenders] = useState<Sender[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  const [apiToTest, setApiToTest] = useState("POST /v1/send");
  const [apiKeyId, setApiKeyId] = useState("");
  const [senderId, setSenderId] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [subject, setSubject] = useState("Test Email from Gmail SMTP API");

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [senderRes, keyRes] = await Promise.all([
        browserApi<{ data: Sender[] }>("/admin/v1/senders"),
        browserApi<{ data: ApiKeyRow[] }>("/admin/v1/api-keys")
      ]);
      const activeSenders = senderRes.data.filter((s) => s.status === "active");
      const activeKeys = keyRes.data.filter((k) => k.status === "active");
      setSenders(activeSenders);
      setApiKeys(activeKeys);
      if (!apiKeyId && activeKeys[0]) setApiKeyId(activeKeys[0].id);
      if (!senderId && activeSenders[0]) setSenderId(activeSenders[0].id);
    } catch (err) {
      setError((err as Error).message || "Failed to load test data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const canSubmit = useMemo(() => {
    return (
      apiToTest === "POST /v1/send" &&
      apiKeyId.length > 0 &&
      senderId.length > 0 &&
      toEmail.length > 3
    );
  }, [apiToTest, apiKeyId, senderId, toEmail]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    setResult("");
    try {
      const res = await browserApi<{
        testedApi: string;
        messageId: string;
        status: string;
      }>("/admin/v1/test-api/send", {
        method: "POST",
        csrf: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          apiKeyId,
          senderId,
          toEmail,
          subject
        })
      });
      setResult(
        `Success: ${res.testedApi} queued message ${res.messageId} with status ${res.status}.`
      );
    } catch (err) {
      setError((err as Error).message || "API test failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container">
      <section className="panel">
        <h1>Test API</h1>
        <p className="muted">
          Send a mock test email by choosing the API key and sender to test.
        </p>
      </section>

      <section className="panel" style={{ marginTop: 16 }}>
        {loading ? (
          <p>Loading API keys and senders...</p>
        ) : (
          <form onSubmit={onSubmit} className="grid">
            <label>
              API To Test
              <select value={apiToTest} onChange={(e) => setApiToTest(e.target.value)}>
                <option value="POST /v1/send">POST /v1/send</option>
              </select>
            </label>

            <label>
              API Key
              <select value={apiKeyId} onChange={(e) => setApiKeyId(e.target.value)} required>
                <option value="">Select API key</option>
                {apiKeys.map((key) => (
                  <option value={key.id} key={key.id}>
                    {key.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Sender
              <select value={senderId} onChange={(e) => setSenderId(e.target.value)} required>
                <option value="">Select sender</option>
                {senders.map((sender) => (
                  <option value={sender.id} key={sender.id}>
                    {sender.label} ({sender.gmailAddress})
                  </option>
                ))}
              </select>
            </label>

            <label>
              Recipient Email
              <input
                type="email"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                placeholder="recipient@example.com"
                required
              />
            </label>

            <label>
              Subject
              <input value={subject} onChange={(e) => setSubject(e.target.value)} required />
            </label>

            <div>
              <button className="btn" type="submit" disabled={!canSubmit || submitting}>
                {submitting ? "Testing..." : "Run API Test & Send Email"}
              </button>
            </div>
          </form>
        )}
        {result ? <p style={{ color: "#0a7f51", marginTop: 12 }}>{result}</p> : null}
        {error ? <p style={{ color: "#9f1a1a", marginTop: 12 }}>{error}</p> : null}
      </section>
    </main>
  );
}
