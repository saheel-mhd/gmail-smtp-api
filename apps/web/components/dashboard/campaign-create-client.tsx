"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { browserApi } from "../../lib/browser-api";
import { parseApiError } from "../../lib/api-errors";
import { useToast } from "../ui/toast";
import { Switch } from "../ui/switch";

type SenderOption = {
  id: string;
  label: string;
  emailAddress: string;
  type: "gmail" | "domain";
  status: "active" | "disabled" | "needs_attention";
};

type TemplateOption = {
  id: string;
  name: string;
  status: "active" | "disabled";
};

type ColumnOption = {
  index: number;
  label: string;
};

type SheetPreview = {
  columns: ColumnOption[];
  rows: string[][];
};

function parseSheetUrl(url: string): { id: string; gid?: string } | null {
  const trimmed = url.trim();
  const idMatch = trimmed.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!idMatch) return null;
  const id = idMatch[1];
  const gidMatch = trimmed.match(/[?&#]gid=([0-9]+)/);
  const gid = gidMatch ? gidMatch[1] : undefined;
  return { id, gid };
}

function buildCsvExportUrl(id: string, gid?: string) {
  const base = `https://docs.google.com/spreadsheets/d/${id}/export?format=csv`;
  return gid ? `${base}&gid=${gid}` : base;
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentValue = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        currentValue += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(currentValue);
      currentValue = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }
      currentRow.push(currentValue);
      currentValue = "";
      if (currentRow.length > 1 || currentRow[0]?.trim()) {
        rows.push(currentRow);
      }
      currentRow = [];
      continue;
    }

    currentValue += char;
  }

  if (currentValue.length || currentRow.length) {
    currentRow.push(currentValue);
    if (currentRow.length > 1 || currentRow[0]?.trim()) {
      rows.push(currentRow);
    }
  }

  return rows;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function CampaignCreateClient() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [senders, setSenders] = useState<SenderOption[]>([]);
  const [templates, setTemplates] = useState<TemplateOption[]>([]);
  const [sheetUrl, setSheetUrl] = useState("");
  const [sheetPreview, setSheetPreview] = useState<SheetPreview | null>(null);
  const [sheetLoading, setSheetLoading] = useState(false);
  const [sheetError, setSheetError] = useState("");
  const [emailColumn, setEmailColumn] = useState<number | null>(null);
  const [nameColumn, setNameColumn] = useState<number | null>(null);
  const [variableColumns, setVariableColumns] = useState<number[]>([]);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ total: 0, uploaded: 0 });
  const [createdCampaignId, setCreatedCampaignId] = useState("");

  const [name, setName] = useState("");
  const [senderId, setSenderId] = useState("");
  const [useTemplate, setUseTemplate] = useState(false);
  const [templateId, setTemplateId] = useState("");
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [text, setText] = useState("");
  const [fromName, setFromName] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [perMessageDelaySeconds, setPerMessageDelaySeconds] = useState(0);
  const [trackOpens, setTrackOpens] = useState(true);
  const [trackClicks, setTrackClicks] = useState(true);
  const [trackReplies, setTrackReplies] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");
    Promise.all([
      browserApi<{ data: SenderOption[] }>("/admin/v1/senders", { cache: "no-store" }),
      browserApi<{ data: TemplateOption[] }>("/admin/v1/templates", { cache: "no-store" })
    ])
      .then(([senderRes, templateRes]) => {
        if (!isMounted) return;
        const activeSenders = senderRes.data.filter((s) => s.status === "active");
        const activeTemplates = templateRes.data.filter((t) => t.status === "active");
        setSenders(activeSenders);
        setTemplates(activeTemplates);
        if (!senderId && activeSenders[0]) setSenderId(activeSenders[0].id);
      })
      .catch((err) => {
        if (!isMounted) return;
        const { message, isAuth } = parseApiError(err);
        if (!isAuth) setError(message);
        toast({
          variant: "error",
          title: isAuth ? "Session expired" : "Failed to load campaign data",
          description: message
        });
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [senderId, toast]);

  useEffect(() => {
    if (!sheetPreview) return;
    const emailCandidates = sheetPreview.columns.filter((col) =>
      col.label.toLowerCase().includes("email")
    );
    const nameCandidates = sheetPreview.columns.filter((col) =>
      col.label.toLowerCase().includes("name")
    );
    const defaultEmail = emailCandidates[0]?.index ?? 0;
    setEmailColumn(defaultEmail);
    const defaultName =
      nameCandidates.find((col) => col.index !== defaultEmail)?.index ?? null;
    setNameColumn(defaultName);
    const variable = sheetPreview.columns
      .map((col) => col.index)
      .filter((idx) => idx !== defaultEmail && idx !== defaultName);
    setVariableColumns(variable);
  }, [sheetPreview]);

  const sender = useMemo(
    () => senders.find((item) => item.id === senderId) ?? null,
    [senders, senderId]
  );

  const recipientCount = useMemo(() => sheetPreview?.rows.length ?? 0, [sheetPreview]);

  const canSubmit = useMemo(() => {
    if (!name.trim() || !sender) return false;
    if (useTemplate) return Boolean(templateId);
    return Boolean(subject.trim()) && Boolean(html.trim() || text.trim());
  }, [name, sender, useTemplate, templateId, subject, html, text]);

  async function loadSheetPreview() {
    setSheetLoading(true);
    setSheetError("");
    try {
      const parsed = parseSheetUrl(sheetUrl);
      if (!parsed) {
        setSheetError("Enter a valid Google Sheet URL.");
        setSheetLoading(false);
        return;
      }
      const csvUrl = buildCsvExportUrl(parsed.id, parsed.gid);
      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch sheet (HTTP ${response.status}).`);
      }
      const csv = await response.text();
      const rows = parseCsv(csv);
      if (!rows.length) {
        setSheetError("Sheet is empty.");
        setSheetLoading(false);
        return;
      }
      const header = rows[0].map((value, index) => {
        const trimmed = value.trim();
        return trimmed ? trimmed : `Column ${index + 1}`;
      });
      const columns = header.map((label, index) => ({ index, label }));
      const dataRows = rows.slice(1).filter((row) =>
        row.some((value) => value && value.trim())
      );
      setSheetPreview({ columns, rows: dataRows });
      setSheetError("");
    } catch (err) {
      setSheetPreview(null);
      setSheetError(
        (err as Error).message ||
          "Unable to load the sheet. Ensure it is shared with anyone and try again."
      );
    } finally {
      setSheetLoading(false);
    }
  }

  function toggleVariableColumn(index: number) {
    setVariableColumns((prev) =>
      prev.includes(index) ? prev.filter((value) => value !== index) : [...prev, index]
    );
  }

  async function importRecipients(campaignId: string) {
    if (!sheetPreview || emailColumn === null) return;
    setImporting(true);
    setImportProgress({ total: 0, uploaded: 0 });

    const seen = new Set<string>();
    type RecipientRow = {
      email: string;
      name?: string;
      variables?: Record<string, string | number | boolean>;
    };
    const recipients = sheetPreview.rows.reduce<RecipientRow[]>((acc, row) => {
      const email = row[emailColumn]?.trim() ?? "";
      if (!email || !isValidEmail(email)) return acc;
      const normalized = email.toLowerCase();
      if (seen.has(normalized)) return acc;
      seen.add(normalized);
      const variables: Record<string, string | number | boolean> = {};
      for (const colIndex of variableColumns) {
        const header = sheetPreview.columns.find((col) => col.index === colIndex)?.label;
        if (!header) continue;
        const value = row[colIndex];
        if (value === undefined || value === null || value === "") continue;
        variables[header] = value;
      }
      const name =
        nameColumn !== null ? row[nameColumn]?.trim() || undefined : undefined;
      acc.push({
        email,
        name,
        variables: Object.keys(variables).length ? variables : undefined
      });
      return acc;
    }, []);

    if (!recipients.length) {
      setImporting(false);
      return;
    }

    setImportProgress({ total: recipients.length, uploaded: 0 });

    const chunkSize = 2000;
    let uploaded = 0;
    for (let i = 0; i < recipients.length; i += chunkSize) {
      const chunk = recipients.slice(i, i + chunkSize);
      await browserApi(`/admin/v1/campaigns/${campaignId}/recipients`, {
        method: "POST",
        csrf: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ recipients: chunk })
      });
      uploaded += chunk.length;
      setImportProgress({ total: recipients.length, uploaded });
    }

    setImporting(false);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!sender) {
      setError("Select a sender to continue.");
      return;
    }
    if (!canSubmit) return;

    setSaving(true);
    setError("");
    let newCampaignId = "";
    try {
      const payload: Record<string, unknown> = {
        name: name.trim(),
        senderType: sender.type,
        senderId: sender.id,
        fromName: fromName.trim() || undefined,
        replyTo: replyTo.trim() || undefined,
        trackOpens,
        trackClicks,
        trackReplies
      };
      if (perMessageDelaySeconds > 0) {
        payload.perMessageDelaySeconds = perMessageDelaySeconds;
      }

      if (useTemplate) {
        payload.templateId = templateId;
      } else {
        payload.subject = subject.trim();
        if (html.trim()) payload.html = html;
        if (text.trim()) payload.text = text;
      }

      const res = await browserApi<{ data: { id: string } }>("/admin/v1/campaigns", {
        method: "POST",
        csrf: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });

      newCampaignId = res.data.id;
      setCreatedCampaignId(res.data.id);

      if (sheetPreview && emailColumn !== null) {
        await importRecipients(res.data.id);
      }

      toast({
        variant: "success",
        title: "Campaign created",
        description: "Add recipients to start sending."
      });
      router.push(`/dashboard/bulk-email/${res.data.id}`);
    } catch (err) {
      const { message, isAuth } = parseApiError(err);
      if (!isAuth) setError(message);
      toast({
        variant: "error",
        title: isAuth
          ? "Session expired"
          : newCampaignId
          ? "Recipient import unsuccessful"
          : "Campaign create unsuccessful",
        description: message
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="container">
      <section className="panel">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <Link className="nav-link" href="/dashboard/bulk-email">
              &lt;- Back to campaigns
            </Link>
            <h1 style={{ marginTop: 12 }}>Create Campaign</h1>
            <p className="muted">Define sender, content, and tracking for your campaign.</p>
          </div>
        </div>
        {error ? (
          <p className="muted" style={{ marginTop: 10, color: "#9f1a1a" }}>
            {error}
          </p>
        ) : null}
      </section>

      <section className="panel" style={{ marginTop: 16 }}>
        {loading ? (
          <p className="muted">Loading senders and templates...</p>
        ) : (
          <form onSubmit={onSubmit} className="grid">
            <label>
              Campaign Name
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
              Sender
              <select value={senderId} onChange={(e) => setSenderId(e.target.value)} required>
                <option value="">Select sender</option>
                {senders.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.label} ({item.emailAddress})
                  </option>
                ))}
              </select>
            </label>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
              <Switch
                checked={useTemplate}
                onChange={(event) => setUseTemplate(event.target.checked)}
                label="Use template"
              />
              <Switch
                checked={trackOpens}
                onChange={(event) => setTrackOpens(event.target.checked)}
                label="Track opens"
              />
              <Switch
                checked={trackClicks}
                onChange={(event) => setTrackClicks(event.target.checked)}
                label="Track clicks"
              />
              <Switch
                checked={trackReplies}
                onChange={(event) => setTrackReplies(event.target.checked)}
                label="Track replies"
              />
            </div>

            {useTemplate ? (
              <label>
                Template
                <select
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                  required
                >
                  <option value="">Select template</option>
                  {templates.map((item) => (
                    <option value={item.id} key={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <>
                <label>
                  Subject
                  <input value={subject} onChange={(e) => setSubject(e.target.value)} required />
                </label>
                <label>
                  HTML
                  <textarea
                    rows={6}
                    value={html}
                    onChange={(e) => setHtml(e.target.value)}
                    placeholder="<h1>Welcome</h1>"
                    required={!text.trim()}
                  />
                </label>
                <label>
                  Text (optional)
                  <textarea
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Plain text fallback"
                  />
                </label>
              </>
            )}

            <label>
              From Name (optional)
              <input value={fromName} onChange={(e) => setFromName(e.target.value)} />
            </label>
            <label>
              Reply To (optional)
              <input value={replyTo} onChange={(e) => setReplyTo(e.target.value)} />
            </label>
            <label>
              Delay Between Emails (seconds)
              <input
                type="number"
                min={0}
                max={3600}
                value={perMessageDelaySeconds}
                onChange={(e) => setPerMessageDelaySeconds(Number(e.target.value))}
                placeholder="0"
              />
            </label>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn" type="submit" disabled={!canSubmit || saving}>
                {saving ? "Creating..." : "Create Campaign"}
              </button>
              <Link href="/dashboard/bulk-email" className="btn secondary">
                Cancel
              </Link>
            </div>
            {createdCampaignId ? (
              <p className="muted">
                Campaign created. You can{" "}
                <Link href={`/dashboard/bulk-email/${createdCampaignId}`}>open it here</Link>.
              </p>
            ) : null}
          </form>
        )}
      </section>

      <section className="panel" style={{ marginTop: 16 }}>
        <h2>Import Recipients (Google Sheet)</h2>
        <p className="muted">
          Paste a Google Sheet link shared to anyone with the link. The first row must be headers.
        </p>
        <div className="grid" style={{ marginTop: 12 }}>
          <label>
            Google Sheet URL
            <input
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
            />
          </label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              className="btn secondary"
              type="button"
              onClick={() => void loadSheetPreview()}
              disabled={!sheetUrl.trim() || sheetLoading}
            >
              {sheetLoading ? "Loading..." : "Load Sheet"}
            </button>
            {sheetPreview ? (
              <span className="muted">{recipientCount} rows detected.</span>
            ) : null}
          </div>
          {sheetError ? (
            <p className="muted" style={{ color: "#9f1a1a" }}>
              {sheetError}
            </p>
          ) : null}
        </div>

        {sheetPreview ? (
          <div style={{ marginTop: 16 }}>
            <div className="grid" style={{ gap: 12 }}>
              <label>
                Email Column
                <select
                  value={emailColumn ?? ""}
                  onChange={(e) =>
                    setEmailColumn(e.target.value ? Number(e.target.value) : null)
                  }
                  required
                >
                  <option value="">Select column</option>
                  {sheetPreview.columns.map((col) => (
                    <option value={col.index} key={col.index}>
                      {col.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Name Column (optional)
                <select
                  value={nameColumn ?? ""}
                  onChange={(e) =>
                    setNameColumn(e.target.value ? Number(e.target.value) : null)
                  }
                >
                  <option value="">None</option>
                  {sheetPreview.columns.map((col) => (
                    <option value={col.index} key={col.index}>
                      {col.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div style={{ marginTop: 12 }}>
              <div className="muted" style={{ marginBottom: 6 }}>
                Include columns as variables
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {sheetPreview.columns.map((col) => {
                  const disabled = col.index === emailColumn || col.index === nameColumn;
                  return (
                    <label
                      key={col.index}
                      style={{ display: "flex", gap: 6, alignItems: "center" }}
                    >
                      <input
                        type="checkbox"
                        checked={variableColumns.includes(col.index) && !disabled}
                        disabled={disabled}
                        onChange={() => toggleVariableColumn(col.index)}
                      />
                      <span>{col.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <div className="muted" style={{ marginBottom: 6 }}>
                Preview (first 5 rows)
              </div>
              <div className="table-wrap">
                <table className="table">
                  <thead className="table-header">
                    <tr className="table-row">
                      {sheetPreview.columns.map((col) => (
                        <th key={col.index} className="table-head">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {sheetPreview.rows.slice(0, 5).map((row, idx) => (
                      <tr className="table-row" key={`preview-${idx}`}>
                        {sheetPreview.columns.map((col) => (
                          <td className="table-cell" key={`${idx}-${col.index}`}>
                            {row[col.index] ?? ""}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {importing ? (
              <p className="muted" style={{ marginTop: 12 }}>
                Importing recipients... {importProgress.uploaded}/{importProgress.total}
              </p>
            ) : null}
          </div>
        ) : null}
      </section>
    </main>
  );
}
