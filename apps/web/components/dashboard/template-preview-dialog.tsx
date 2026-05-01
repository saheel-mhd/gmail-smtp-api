"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";
import { useToast } from "../ui/toast";
import { browserApi } from "../../lib/browser-api";
import { parseApiError } from "../../lib/api-errors";

type Sender = {
  id: string;
  label: string;
  emailAddress: string;
  type: "gmail" | "domain";
  status: "active" | "disabled" | "needs_attention";
};

type Me = {
  id: string;
  email: string;
};

type PreviewResponse = {
  data: {
    subject: string;
    html: string;
    text: string;
    detectedVariables: string[];
    missingVariables: string[];
  };
};

type TestSendResponse = {
  data: {
    messageId: string;
    status: string;
    to: string;
  };
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: {
    id?: string;
    name?: string;
    subject: string;
    html: string;
    text: string | null;
  };
};

const SMART_DEFAULTS: Record<string, string> = {
  firstname: "Jane",
  first_name: "Jane",
  lastname: "Doe",
  last_name: "Doe",
  name: "Jane Doe",
  fullname: "Jane Doe",
  full_name: "Jane Doe",
  email: "jane@example.com",
  phone: "+1 555 123 4567",
  company: "Acme Inc.",
  companyname: "Acme Inc.",
  company_name: "Acme Inc.",
  tenantname: "Acme Inc.",
  tenant_name: "Acme Inc.",
  url: "https://example.com/path",
  link: "https://example.com/path",
  ctaurl: "https://example.com/cta",
  cta_url: "https://example.com/cta",
  reseturl: "https://example.com/reset",
  reset_url: "https://example.com/reset",
  ordernumber: "ORD-12345",
  order_number: "ORD-12345",
  orderid: "ORD-12345",
  order_id: "ORD-12345",
  amount: "99.99",
  total: "99.99",
  price: "99.99",
  year: String(new Date().getFullYear())
};

function defaultFor(varName: string): string {
  const k = varName.toLowerCase();
  if (SMART_DEFAULTS[k]) return SMART_DEFAULTS[k];
  if (k === "date") return new Date().toLocaleDateString();
  // Fallback: the variable name itself, so the preview is never blank.
  return varName;
}

function extractVariablesLocal(parts: Array<string | null | undefined>): string[] {
  const re = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;
  const set = new Set<string>();
  for (const part of parts) {
    if (!part) continue;
    for (const m of part.matchAll(re)) set.add(m[1]);
  }
  return Array.from(set).sort();
}

export function TemplatePreviewDialog({ open, onOpenChange, template }: Props) {
  const { toast } = useToast();
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [detected, setDetected] = useState<string[]>([]);
  const [missing, setMissing] = useState<string[]>([]);
  const [previewSubject, setPreviewSubject] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);

  const [senders, setSenders] = useState<Sender[]>([]);
  const [me, setMe] = useState<Me | null>(null);
  const [selectedSenderKey, setSelectedSenderKey] = useState(""); // "type:id"
  const [recipient, setRecipient] = useState("");
  const [sending, setSending] = useState(false);
  const [testSendOpen, setTestSendOpen] = useState(false);

  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize variables with smart defaults whenever the dialog opens or template changes.
  useEffect(() => {
    if (!open) return;
    const found = extractVariablesLocal([template.subject, template.html, template.text]);
    setDetected(found);
    setVariables((prev) => {
      const next: Record<string, string> = {};
      for (const v of found) {
        next[v] = prev[v] ?? defaultFor(v);
      }
      return next;
    });
  }, [open, template.subject, template.html, template.text]);

  // Load senders + current user when dialog opens.
  useEffect(() => {
    if (!open) return;
    void browserApi<{ data: Sender[] }>("/admin/v1/senders", { cacheTtlMs: 30_000 })
      .then((res) => {
        const active = res.data.filter((s) => s.status !== "disabled");
        setSenders(active);
        if (active.length > 0 && !selectedSenderKey) {
          setSelectedSenderKey(`${active[0].type}:${active[0].id}`);
        }
      })
      .catch(() => setSenders([]));
    void browserApi<{ data: Me }>("/admin/v1/me", { cache: "no-store" })
      .then((res) => {
        setMe(res.data);
        if (!recipient) setRecipient(res.data.email);
      })
      .catch(() => setMe(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Debounced preview call whenever variables or template content changes.
  useEffect(() => {
    if (!open) return;
    if (previewTimer.current) clearTimeout(previewTimer.current);
    setPreviewLoading(true);
    previewTimer.current = setTimeout(async () => {
      try {
        const res = await browserApi<PreviewResponse>("/admin/v1/templates/preview", {
          method: "POST",
          csrf: true,
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            subject: template.subject,
            html: template.html,
            text: template.text ?? "",
            variables
          })
        });
        setPreviewSubject(res.data.subject);
        setPreviewHtml(res.data.html);
        setPreviewText(res.data.text);
        setMissing(res.data.missingVariables);
      } catch (err) {
        const { message } = parseApiError(err);
        toast({ variant: "error", title: message || "Could not render preview" });
      } finally {
        setPreviewLoading(false);
      }
    }, 300);
    return () => {
      if (previewTimer.current) clearTimeout(previewTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, variables, template.subject, template.html, template.text]);

  const senderOptions = useMemo(() => {
    return senders.map((s) => ({
      key: `${s.type}:${s.id}`,
      label: `${s.label} — ${s.emailAddress}`,
      type: s.type,
      id: s.id
    }));
  }, [senders]);

  const selectedSender = useMemo(() => {
    return senderOptions.find((o) => o.key === selectedSenderKey);
  }, [senderOptions, selectedSenderKey]);

  async function onSendTest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedSender) {
      toast({ variant: "error", title: "Pick a sender" });
      return;
    }
    if (!recipient.trim()) {
      toast({ variant: "error", title: "Enter a recipient email" });
      return;
    }
    setSending(true);
    try {
      const res = await browserApi<TestSendResponse>("/admin/v1/templates/test-send", {
        method: "POST",
        csrf: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          senderType: selectedSender.type,
          senderId: selectedSender.id,
          to: recipient.trim(),
          subject: template.subject,
          html: template.html,
          text: template.text ?? "",
          variables,
          templateId: template.id ?? null
        })
      });
      toast({
        variant: "success",
        title: `Test email queued`,
        description: `Sent to ${res.data.to} · ID ${res.data.messageId.slice(0, 8)}…`
      });
    } catch (err) {
      const { message } = parseApiError(err);
      toast({ variant: "error", title: message || "Could not send test email" });
    } finally {
      setSending(false);
    }
  }

  function setVar(name: string, value: string) {
    setVariables((prev) => ({ ...prev, [name]: value }));
  }

  function resetToDefaults() {
    const next: Record<string, string> = {};
    for (const v of detected) next[v] = defaultFor(v);
    setVariables(next);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle>
            Preview & test send {template.name ? `· ${template.name}` : ""}
          </DialogTitle>
          <DialogDescription>
            Render the template with sample variables, then send a real test email through one of
            your senders.
          </DialogDescription>
        </DialogHeader>

        <div style={{ marginTop: 14, display: "grid", gap: 16 }}>
          {/* Variables */}
          <section>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
                marginBottom: 8
              }}
            >
              <h3 style={{ margin: 0, fontSize: 14 }}>
                Variables{" "}
                <span className="muted" style={{ fontWeight: 400, fontSize: 12 }}>
                  ({detected.length} detected)
                </span>
              </h3>
              {detected.length > 0 ? (
                <button
                  type="button"
                  className="btn ghost small"
                  onClick={resetToDefaults}
                  style={{ padding: "4px 10px" }}
                >
                  Reset to defaults
                </button>
              ) : null}
            </div>
            {detected.length === 0 ? (
              <p className="muted" style={{ fontSize: 13, margin: 0 }}>
                No <code>{`{{variable}}`}</code> tokens found in the template.
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 10
                }}
              >
                {detected.map((name) => (
                  <label key={name} style={{ fontSize: 12 }}>
                    <span style={{ fontFamily: "var(--font-mono, ui-monospace), monospace" }}>
                      {`{{${name}}}`}
                    </span>
                    <input
                      value={variables[name] ?? ""}
                      onChange={(e) => setVar(name, e.target.value)}
                      placeholder={defaultFor(name)}
                      style={{ fontSize: 13, padding: "8px 10px" }}
                    />
                  </label>
                ))}
              </div>
            )}
            {missing.length > 0 ? (
              <p
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  color: "#92400e",
                  background: "rgba(250, 204, 21, 0.12)",
                  border: "1px solid rgba(217, 119, 6, 0.32)",
                  padding: "8px 12px",
                  borderRadius: 8
                }}
              >
                Missing values for: {missing.map((m) => `{{${m}}}`).join(", ")}
              </p>
            ) : null}
          </section>

          {/* Preview */}
          <section>
            <h3 style={{ margin: "0 0 8px", fontSize: 14 }}>
              Preview{" "}
              {previewLoading ? (
                <span className="muted" style={{ fontSize: 11, fontWeight: 400 }}>
                  rendering…
                </span>
              ) : null}
            </h3>
            <div
              style={{
                border: "1px solid var(--line)",
                borderRadius: 12,
                overflow: "hidden",
                background: "#fff"
              }}
            >
              <div
                style={{
                  padding: "10px 14px",
                  borderBottom: "1px solid var(--line-soft)",
                  fontSize: 13,
                  background: "#f7f9fc"
                }}
              >
                <span className="muted" style={{ fontSize: 11, marginRight: 8 }}>
                  Subject:
                </span>
                <strong style={{ wordBreak: "break-word" }}>
                  {previewSubject || <span className="muted">(empty)</span>}
                </strong>
              </div>
              {template.html ? (
                <iframe
                  title="Email HTML preview"
                  sandbox=""
                  srcDoc={`<style>
                    html, body { margin: 0; scrollbar-width: none; -ms-overflow-style: none; }
                    html::-webkit-scrollbar, body::-webkit-scrollbar { width: 0; height: 0; display: none; }
                  </style>${previewHtml}`}
                  style={{
                    width: "100%",
                    minHeight: 280,
                    maxHeight: 420,
                    border: 0,
                    background: "#fff"
                  }}
                />
              ) : null}
              {previewText ? (
                <details
                  style={{
                    borderTop: template.html ? "1px solid var(--line-soft)" : "none",
                    padding: "10px 14px"
                  }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--muted-strong)"
                    }}
                  >
                    Plaintext fallback
                  </summary>
                  <pre
                    style={{
                      whiteSpace: "pre-wrap",
                      margin: "8px 0 0",
                      fontSize: 12,
                      fontFamily: "var(--font-mono, ui-monospace), monospace",
                      color: "var(--ink-soft)"
                    }}
                  >
                    {previewText}
                  </pre>
                </details>
              ) : null}
            </div>
          </section>

          {/* Test send — collapsible (FAQ-style) */}
          <section
            style={{
              borderRadius: 12,
              border: "1px solid var(--line)",
              background: testSendOpen ? "rgba(20, 184, 130, 0.04)" : "#fff",
              overflow: "hidden",
              transition: "background 0.18s ease"
            }}
          >
            <button
              type="button"
              onClick={() => setTestSendOpen((v) => !v)}
              aria-expanded={testSendOpen}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "14px 16px",
                background: "transparent",
                border: 0,
                cursor: "pointer",
                textAlign: "left",
                font: "inherit",
                color: "var(--ink)",
                fontWeight: 600
              }}
            >
              <span>
                Send a test email
                <span
                  className="muted"
                  style={{ fontWeight: 400, fontSize: 12, marginLeft: 8 }}
                >
                  Click to expand
                </span>
              </span>
              <span
                aria-hidden="true"
                style={{
                  color: "var(--brand-strong)",
                  transition: "transform 0.2s ease",
                  transform: testSendOpen ? "rotate(180deg)" : "rotate(0deg)",
                  flexShrink: 0,
                  display: "inline-flex"
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </button>
            {testSendOpen ? (
              <div
                className="doc-reveal"
                style={{
                  padding: "0 16px 16px",
                  color: "var(--muted-strong)"
                }}
              >
                <p className="muted" style={{ fontSize: 12, margin: "0 0 10px" }}>
                  Sends through one of your senders using the rendered values above. The message
                  will appear in Email Logs tagged as a test.
                </p>
                <form onSubmit={onSendTest} style={{ display: "grid", gap: 10 }}>
                  <label style={{ fontSize: 12 }}>
                    From sender
                    <select
                      value={selectedSenderKey}
                      onChange={(e) => setSelectedSenderKey(e.target.value)}
                      required
                    >
                      {senderOptions.length === 0 ? (
                        <option value="">No active senders — add one first</option>
                      ) : null}
                      {senderOptions.map((o) => (
                        <option key={o.key} value={o.key}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label style={{ fontSize: 12 }}>
                    To
                    <input
                      type="email"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder={me?.email ?? "you@company.com"}
                      required
                    />
                  </label>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 8,
                      marginTop: 4
                    }}
                  >
                    <button
                      className="btn"
                      type="submit"
                      disabled={sending || senderOptions.length === 0 || !template.subject}
                    >
                      {sending ? "Sending…" : "Send test email"}
                    </button>
                  </div>
                </form>
              </div>
            ) : null}
          </section>
        </div>

        <DialogFooter>
          <button type="button" className="btn ghost" onClick={() => onOpenChange(false)}>
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
