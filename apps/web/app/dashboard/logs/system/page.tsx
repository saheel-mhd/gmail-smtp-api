"use client";

import { useEffect, useState } from "react";
import { browserApi } from "../../../../lib/browser-api";

type SystemLogRow = {
  id: string;
  summary: string;
  ip: string | null;
  createdAt: string;
};

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<SystemLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await browserApi<{ data: SystemLogRow[] }>("/admin/v1/system-logs?limit=100");
      setLogs(data.data);
    } catch (err) {
      setError((err as Error).message || "Failed to load system logs");
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
        <h1>System Logs</h1>
        <p className="muted">System-level events like background jobs and queue activity.</p>
      </section>
      <section style={{ marginTop: 12 }}>
        <button className="btn secondary" type="button" onClick={() => void load()}>
          Refresh
        </button>
      </section>
      <section className="panel" style={{ marginTop: 16 }}>
        {loading ? (
          <p>Loading system logs...</p>
        ) : error ? (
          <p style={{ color: "#9f1a1a" }}>{error}</p>
        ) : logs.length === 0 ? (
          <p>No system logs found.</p>
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
