"use client";

import { FormEvent, useMemo, useState } from "react";
import { useToast } from "../ui/toast";
import { browserApi } from "../../lib/browser-api";

export type Sender = {
  id: string;
  label: string;
  emailAddress: string;
  type: "gmail" | "domain";
  status: "active" | "disabled" | "needs_attention";
};

export type ApiKeyRow = {
  id: string;
  name: string;
  status: "active" | "revoked";
  smtpAccountIds: string[];
  domainSenderIds: string[];
};

export type TemplateRow = {
  id: string;
  name: string;
  status: "active" | "disabled";
};

export function TestApiClient({
  initialSenders,
  initialApiKeys,
  initialTemplates,
  initialError
}: {
  initialSenders: Sender[];
  initialApiKeys: ApiKeyRow[];
  initialTemplates: TemplateRow[];
  initialError?: string;
}) {
  const [senders, setSenders] = useState<Sender[]>(initialSenders);
  const [apiKeys, setApiKeys] = useState<ApiKeyRow[]>(initialApiKeys);
  const [templates, setTemplates] = useState<TemplateRow[]>(initialTemplates);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(initialError ?? "");
  const { toast } = useToast();

  const [apiToTest, setApiToTest] = useState("POST /v1/send");
  const [apiKeyId, setApiKeyId] = useState(initialApiKeys[0]?.id ?? "");
  const [toEmail, setToEmail] = useState("");
  const [subject, setSubject] = useState("Test Email from Gmail SMTP API");
  const [templateName, setTemplateName] = useState(initialTemplates[0]?.name ?? "");

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [senderRes, keyRes, templateRes] = await Promise.all([
        browserApi<{ data: Sender[] }>("/admin/v1/senders"),
        browserApi<{ data: ApiKeyRow[] }>("/admin/v1/api-keys"),
        browserApi<{ data: TemplateRow[] }>("/admin/v1/templates")
      ]);
      const activeSenders = senderRes.data.filter((s) => s.status === "active");
      const activeKeys = keyRes.data.filter((k) => k.status === "active");
      const activeTemplates = templateRes.data.filter((t) => t.status === "active");
      setSenders(activeSenders);
      setApiKeys(activeKeys);
      setTemplates(activeTemplates);
      if (!apiKeyId && activeKeys[0]) setApiKeyId(activeKeys[0].id);
      if (!templateName && activeTemplates[0]) setTemplateName(activeTemplates[0].name);
    } catch (err) {
      const message = (err as Error).message || "Failed to load test data";
      setError(message);
      toast({
        variant: "error",
        title: "Test data load unsuccessful",
        description: message
      });
    } finally {
      setLoading(false);
    }
  }

  const senderById = useMemo(() => {
    return new Map(senders.map((sender) => [sender.id, sender]));
  }, [senders]);

  const selectedKey = useMemo(() => {
    return apiKeys.find((key) => key.id === apiKeyId) ?? null;
  }, [apiKeys, apiKeyId]);

  const selectedSenderIds = selectedKey
    ? [...selectedKey.smtpAccountIds, ...selectedKey.domainSenderIds]
    : [];
  const selectedSender =
    selectedSenderIds.length === 1 ? senderById.get(selectedSenderIds[0]) ?? null : null;
  const senderError = selectedKey
    ? selectedSenderIds.length !== 1
      ? "API key must be scoped to exactly one sender."
      : !selectedSender
      ? "Sender is unavailable or inactive."
      : ""
    : "";
  const isTemplateSend = apiToTest === "POST /v1/send/:templateName";
  const templateError = isTemplateSend && !templateName ? "Select a template." : "";

  const canSubmit = useMemo(() => {
    return (
      apiKeyId.length > 0 &&
      toEmail.length > 3 &&
      Boolean(selectedSender) &&
      !templateError
    );
  }, [apiKeyId, toEmail, selectedSender, templateError]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
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
          toEmail,
          subject: isTemplateSend ? undefined : subject,
          templateName: isTemplateSend ? templateName : undefined
        })
      });
      toast({
        variant: "success",
        title: "Email sent successfully",
        description: `${res.testedApi} queued message ${res.messageId}.`
      });
    } catch (err) {
      toast({
        variant: "error",
        title: "Email send unsuccessful",
        description: (err as Error).message || "API test failed"
      });
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
        {error ? (
          <p className="muted" style={{ marginTop: 10, color: "#9f1a1a" }}>
            {error}
          </p>
        ) : null}
      </section>

      <section className="panel" style={{ marginTop: 16 }}>
        {loading ? (
          <p>Loading API keys, senders, and templates...</p>
        ) : (
          <form onSubmit={onSubmit} className="grid">
            <label>
              API To Test
              <select value={apiToTest} onChange={(e) => setApiToTest(e.target.value)}>
                <option value="POST /v1/send">POST /v1/send</option>
                <option value="POST /v1/send/:templateName">POST /v1/send/:templateName</option>
              </select>
            </label>

            <label>
              Sender (from API key)
              <input
                value={
                  selectedSender
                    ? `${selectedSender.label} (${selectedSender.emailAddress})`
                    : selectedKey
                    ? "Sender unavailable for this API key"
                    : "Select an API key"
                }
                readOnly
              />
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

            {isTemplateSend ? (
              <label>
                Template
                <select
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  required
                >
                  <option value="">Select template</option>
                  {templates.map((template) => (
                    <option value={template.name} key={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

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

            {apiToTest === "POST /v1/send" ? (
              <label>
                Subject
                <input value={subject} onChange={(e) => setSubject(e.target.value)} required />
              </label>
            ) : null}

            <div>
              <button className="btn" type="submit" disabled={!canSubmit || submitting}>
                {submitting ? "Testing..." : "Run API Test & Send Email"}
              </button>
              <button
                className="btn secondary"
                type="button"
                style={{ marginLeft: 8 }}
                onClick={() => void loadData()}
              >
                Refresh Data
              </button>
            </div>
            {senderError || templateError ? (
              <p className="muted" style={{ marginTop: 6, color: "#9f1a1a" }}>
                {senderError || templateError}
              </p>
            ) : null}
          </form>
        )}
      </section>
    </main>
  );
}
