"use client";

import { useEffect, useState } from "react";
import { browserApi } from "../../../../lib/browser-api";

type AuditRow = {
  id: string;
  summary: string;
  ip: string | null;
  createdAt: string;
};

export default function ActionLogsPage() {
  const [logs, setLogs] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await browserApi<{ data: AuditRow[] }>("/admin/v1/logs?limit=100");
      setLogs(data.data);
    } catch (err) {
      setError((err as Error).message || "Failed to load logs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <main className="container">
      <section className="panel">
        <h1>Action Logs</h1>
        <p className="muted">Every sensitive action is recorded for accountability.</p>
      </section>
      <section style={{ marginTop: 12 }}>
        <button className="btn secondary" type="button" onClick={() => void load()}>
          Refresh
        </button>
      </section>
      <section className="panel" style={{ marginTop: 16 }}>
        {loading ? (
          <p>Loading logs...</p>
        ) : error ? (
          <p style={{ color: "#9f1a1a" }}>{error}</p>
        ) : logs.length === 0 ? (
          <p>No logs found.</p>
        ) : (
          <div className="grid" style={{ gap: 12 }}>
            {logs.map((entry) => (
              <article
                className="panel"
                key={entry.id}
                style={{ padding: 16, boxShadow: "none" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-base font-semibold">{entry.summary}</div>
                    {entry.ip ? (
                      <div className="text-sm text-muted">Public IP {entry.ip}</div>
                    ) : null}
                  </div>
                  <div className="text-xs text-muted whitespace-nowrap">
                    {new Date(entry.createdAt).toLocaleString()}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
