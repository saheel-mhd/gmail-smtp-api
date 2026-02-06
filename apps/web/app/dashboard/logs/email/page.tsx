"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../../../../components/ui/table";
import { browserApi } from "../../../../lib/browser-api";

type EmailLogRow = {
  status: "queued" | "sending" | "sent" | "failed";
  senderLabel: string;
  to: string[];
  subject: string;
  createdAt: string;
  sentAt: string | null;
};

function statusBadge(status: EmailLogRow["status"]) {
  if (status === "sent") return <span className="badge green">Sent</span>;
  if (status === "failed") return <span className="badge red">Failed</span>;
  return <span className="badge yellow">{status === "sending" ? "Sending" : "Queued"}</span>;
}

export default function EmailLogsPage() {
  const [logs, setLogs] = useState<EmailLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await browserApi<{ data: EmailLogRow[] }>("/admin/v1/email-logs?limit=100");
      setLogs(data.data);
    } catch (err) {
      setError((err as Error).message || "Failed to load email logs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const rows = useMemo(() => logs, [logs]);

  return (
    <main className="container">
      <section className="panel">
        <h1>Email Logs</h1>
        <p className="muted">Status report for sent, queued, and failed messages.</p>
      </section>
      <section style={{ marginTop: 12 }}>
        <button className="btn secondary" type="button" onClick={() => void load()}>
          Refresh
        </button>
      </section>
      <section className="panel" style={{ marginTop: 16 }}>
        {loading ? (
          <p>Loading email logs...</p>
        ) : error ? (
          <p style={{ color: "#9f1a1a" }}>{error}</p>
        ) : rows.length === 0 ? (
          <p>No email logs found.</p>
        ) : (
          <div className="table-wrap">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, index) => {
                  const recipient =
                    row.to.length > 1 ? `${row.to[0]} +${row.to.length - 1}` : row.to[0];
                  const timestamp = row.sentAt ?? row.createdAt;
                  return (
                    <TableRow key={`${timestamp}-${index}`}>
                      <TableCell>{statusBadge(row.status)}</TableCell>
                      <TableCell>{row.senderLabel}</TableCell>
                      <TableCell>{recipient || "n/a"}</TableCell>
                      <TableCell>{row.subject}</TableCell>
                      <TableCell>
                        <span className="text-xs text-muted whitespace-nowrap">
                          {new Date(timestamp).toLocaleString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </main>
  );
}
