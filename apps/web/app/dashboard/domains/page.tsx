"use client";

import { FormEvent, useEffect, useState } from "react";
import { browserApi } from "../../../lib/browser-api";

type Domain = {
  id: string;
  domain: string;
  status: "pending" | "verified" | "failed";
  smtpHost: string | null;
  smtpPort: number;
  smtpSecure: boolean;
  senders: {
    id: string;
    label: string;
    emailAddress: string;
    status: string;
    sentCount: number;
  }[];
  sentCount: number;
  txtHost: string;
  txtValue: string;
  spfHost: string;
  spfValue: string;
  cnameHost: string;
  cnameValue: string;
  mxHost: string;
  mxPriority: number;
  verifiedAt: string | null;
};

type VerifyResult = {
  checks: {
    txtOk: boolean;
    spfOk: boolean;
    cnameOk: boolean;
    mxOk: boolean;
  };
};

const DEFAULT_SMTP_FORM = {
  smtpHost: "",
  smtpPort: 587,
  smtpSecure: false
};

function StatusIcon({ ok }: { ok: boolean }) {
  return ok ? (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ) : (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [domainInput, setDomainInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [verifyResult, setVerifyResult] = useState<Record<string, VerifyResult["checks"]>>({});
  const [activeDomain, setActiveDomain] = useState<Domain | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [smtpForm, setSmtpForm] = useState(DEFAULT_SMTP_FORM);

  function isRecordOk(domain: Domain, key: keyof VerifyResult["checks"]): boolean {
    const checks = verifyResult[domain.id];
    if (checks) return Boolean(checks[key]);
    return domain.status === "verified";
  }

  function hasVerification(domain: Domain): boolean {
    return Boolean(verifyResult[domain.id]);
  }

  async function loadDomains(): Promise<Domain[]> {
    setLoading(true);
    setError("");
    try {
      const res = await browserApi<{ data: Domain[] }>("/admin/v1/domains");
      setDomains(res.data);
      return res.data;
    } catch (err) {
      setError((err as Error).message || "Failed to load domains.");
      return [];
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDomains();
  }, []);

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (!smtpForm.smtpHost.trim()) {
        setError("SMTP host is required.");
        setSubmitting(false);
        return;
      }
      await browserApi<{ data: Domain }>("/admin/v1/domains", {
        method: "POST",
        csrf: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          domain: domainInput.trim(),
          smtpHost: smtpForm.smtpHost,
          smtpPort: smtpForm.smtpPort,
          smtpSecure: smtpForm.smtpSecure
        })
      });
      setDomainInput("");
      setSmtpForm({ ...DEFAULT_SMTP_FORM });
      await loadDomains();
    } catch (err) {
      setError((err as Error).message || "Failed to add domain.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onVerify(domainId: string) {
    setError("");
    setVerifyingId(domainId);
    try {
      const res = await browserApi<{ data: Domain; checks: VerifyResult["checks"] }>(
        `/admin/v1/domains/${domainId}/verify`,
        { method: "POST", csrf: true }
      );
      setVerifyResult((prev) => ({ ...prev, [domainId]: res.checks }));
      const updated = await loadDomains();
      if (activeDomain?.id === domainId) {
        const fresh = updated.find((item) => item.id === domainId) ?? null;
        setActiveDomain(fresh);
      }
    } catch (err) {
      setError((err as Error).message || "Verification failed.");
    } finally {
      setVerifyingId((current) => (current === domainId ? null : current));
    }
  }

  return (
    <main className="container">
      <section className="panel">
        <h1>Domains</h1>
        <p className="muted">
          Add your domain and verify SPF, TXT, CNAME, and MX records.
        </p>
        <form onSubmit={onCreate} className="grid" style={{ marginTop: 12 }}>
          <label>
            Domain Name
            <input
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="companyname.com"
              required
            />
          </label>
          <label>
            SMTP Host
            <input
              value={smtpForm.smtpHost}
              onChange={(e) =>
                setSmtpForm((prev) => ({ ...prev, smtpHost: e.target.value }))
              }
              placeholder="smtp.company.com"
              required
            />
          </label>
          <label>
            SMTP Port
            <input
              type="number"
              min={1}
              value={smtpForm.smtpPort}
              onChange={(e) =>
                setSmtpForm((prev) => ({
                  ...prev,
                  smtpPort: Number(e.target.value)
                }))
              }
              required
            />
          </label>
          <label className="switch" style={{ marginTop: 4 }}>
            <input
              type="checkbox"
              className="switch-input"
              checked={smtpForm.smtpSecure}
              onChange={(e) =>
                setSmtpForm((prev) => ({
                  ...prev,
                  smtpSecure: e.target.checked
                }))
              }
            />
            <span className="switch-track" aria-hidden="true" />
            <span className="switch-label">Use SSL/TLS</span>
          </label>
          <div>
            <button className="btn" type="submit" disabled={!domainInput || submitting}>
              {submitting ? "Adding..." : "Add Domain"}
            </button>
          </div>
        </form>
        {error ? <p style={{ color: "#9f1a1a", marginTop: 12 }}>{error}</p> : null}
      </section>

      <section className="grid" style={{ marginTop: 16 }}>
        {loading ? (
          <article className="panel">
            <p>Loading domains...</p>
          </article>
        ) : domains.length === 0 ? (
          <article className="panel">
            <p>No domains added yet.</p>
          </article>
        ) : (
          domains.map((domain) => (
            <article className="panel domain-card" key={domain.id}>
              <div className="domain-header">
                <div className="domain-title">
                  <h3>{domain.domain}</h3>
                  <div className="domain-meta">
                    <span className={`domain-pill ${domain.status}`}>
                      {domain.status === "verified" ? "Verified" : domain.status === "failed" ? "Needs Attention" : "Pending"}
                    </span>
                    <span className="domain-pill">Emails sent: {domain.sentCount}</span>
                    <span className="domain-pill">
                      SMTP: {domain.smtpHost ? `${domain.smtpHost}:${domain.smtpPort}` : "Not set"}
                    </span>
                    <span className="domain-pill">
                      {domain.smtpSecure ? "SSL/TLS" : "STARTTLS"}
                    </span>
                  </div>
                </div>
                <button
                  className="btn secondary"
                  type="button"
                  onClick={() => setActiveDomain(domain)}
                >
                  Records
                </button>
              </div>
              <div>
                <p className="muted">Sender emails in this domain</p>
                {domain.senders.length === 0 ? (
                  <p className="muted">No sender emails found for this domain.</p>
                ) : (
                  <div className="sender-list" style={{ marginTop: 8 }}>
                    {domain.senders.map((sender) => (
                      <div key={sender.id} className="sender-item">
                        <div>
                          <div style={{ fontWeight: 600 }}>{sender.emailAddress}</div>
                          <small>
                            {sender.label} - {sender.status}
                          </small>
                        </div>
                        <div className="badge">Sent {sender.sentCount}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))
        )}
      </section>

      {activeDomain ? (
        <div className="dialog-overlay" role="dialog" aria-modal="true">
          <div className="dialog-content">
            <div className="dialog-header">
              <h2 className="dialog-title">DNS Records</h2>
              <p className="dialog-description">
                Add these records for <strong>{activeDomain.domain}</strong>.
              </p>
            </div>
            <div className="record-grid" style={{ marginTop: 12 }}>
              <div className="record-row">
                <div className="record-info">
                  <strong>TXT Host</strong>
                  <div className="muted">{activeDomain.txtHost}</div>
                  <div>{activeDomain.txtValue}</div>
                </div>
                {hasVerification(activeDomain) ? (
                  <span className={`record-status ${isRecordOk(activeDomain, "txtOk") ? "ok" : "bad"}`}>
                    <StatusIcon ok={isRecordOk(activeDomain, "txtOk")} />
                  </span>
                ) : null}
              </div>
              <div className="record-row">
                <div className="record-info">
                  <strong>SPF (TXT)</strong>
                  <div className="muted">{activeDomain.spfHost}</div>
                  <div>{activeDomain.spfValue}</div>
                </div>
                {hasVerification(activeDomain) ? (
                  <span className={`record-status ${isRecordOk(activeDomain, "spfOk") ? "ok" : "bad"}`}>
                    <StatusIcon ok={isRecordOk(activeDomain, "spfOk")} />
                  </span>
                ) : null}
              </div>
              <div className="record-row">
                <div className="record-info">
                  <strong>CNAME</strong>
                  <div className="muted">{activeDomain.cnameHost}</div>
                  <div>{activeDomain.cnameValue}</div>
                </div>
                {hasVerification(activeDomain) ? (
                  <span className={`record-status ${isRecordOk(activeDomain, "cnameOk") ? "ok" : "bad"}`}>
                    <StatusIcon ok={isRecordOk(activeDomain, "cnameOk")} />
                  </span>
                ) : null}
              </div>
              <div className="record-row">
                <div className="record-info">
                  <strong>MX</strong>
                  <div className="muted">@ (priority {activeDomain.mxPriority})</div>
                  <div>{activeDomain.mxHost}</div>
                </div>
                {hasVerification(activeDomain) ? (
                  <span className={`record-status ${isRecordOk(activeDomain, "mxOk") ? "ok" : "bad"}`}>
                    <StatusIcon ok={isRecordOk(activeDomain, "mxOk")} />
                  </span>
                ) : null}
              </div>
            </div>
            <div className="dialog-footer">
              <button className="btn secondary" type="button" onClick={() => setActiveDomain(null)}>
                Close
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => void onVerify(activeDomain.id)}
                disabled={verifyingId === activeDomain.id}
              >
                {verifyingId === activeDomain.id ? "Verifying..." : "Verify DNS"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
