"use client";

import { useEffect, useState } from "react";
import { browserApi } from "../../../lib/browser-api";

type AuditRow = {
  id: string;
  action: string;
  actorType: "user" | "api_key" | "system";
  actorId: string;
  ip: string | null;
  createdAt: string;
};

export default function LogsPage() {
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
        <h1>Audit Logs</h1>
        <p className="muted">Sensitive operations are tracked with actor, timestamp, and IP.</p>
      </section>
      <section style={{ marginTop: 12 }}>
        <button className="btn secondary" type="button" onClick={() => void load()}>
          Refresh
        </button>
      </section>
      <section className="grid" style={{ marginTop: 16 }}>
        {loading ? (
          <article className="panel">
            <p>Loading logs...</p>
          </article>
        ) : error ? (
          <article className="panel">
            <p style={{ color: "#9f1a1a" }}>{error}</p>
          </article>
        ) : logs.length === 0 ? (
          <article className="panel">
            <p>No logs found.</p>
          </article>
        ) : (
          logs.map((entry) => (
            <article className="panel" key={entry.id}>
              <h3>{entry.action}</h3>
              <p className="muted">
                {entry.actorType}:{entry.actorId} | {entry.ip ?? "n/a"} |{" "}
                {new Date(entry.createdAt).toLocaleString()}
              </p>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
