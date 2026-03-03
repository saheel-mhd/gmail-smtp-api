"use client";

import { useEffect, useMemo, useState } from "react";
import { browserApi } from "../../lib/browser-api";
import { Pagination } from "../ui/pagination";
import { useToast } from "../ui/toast";
import { parseApiError } from "../../lib/api-errors";

export type AuditRow = {
  id: string;
  summary: string;
  ip: string | null;
  createdAt: string;
};

export function ActionLogsClient({
  initialLogs,
  initialError
}: {
  initialLogs: AuditRow[];
  initialError?: string;
}) {
  const pageSize = 8;
  const initialParsed = useMemo(
    () => (initialError ? parseApiError(initialError) : null),
    [initialError]
  );
  const [logs, setLogs] = useState<AuditRow[]>(initialLogs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    initialParsed && !initialParsed.isAuth ? initialParsed.message : ""
  );
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  const totalPages = Math.max(1, Math.ceil(logs.length / pageSize));
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    if (initialParsed?.isAuth) {
      toast({
        variant: "error",
        title: "Session expired",
        description: initialParsed.message
      });
    }
  }, [initialParsed, toast]);

  const pagedLogs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return logs.slice(start, start + pageSize);
  }, [logs, page, pageSize]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await browserApi<{ data: AuditRow[] }>("/admin/v1/logs?limit=100");
      setLogs(data.data);
    } catch (err) {
      const { message, isAuth } = parseApiError(err);
      if (!isAuth) setError(message);
      toast({
        variant: "error",
        title: isAuth ? "Session expired" : "Logs load unsuccessful",
        description: message
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <section className="flex items-center justify-between" style={{ marginBottom: 12 }}>
        <div>
          <h1>Action Logs</h1>
          <p className="muted">Every sensitive action is recorded for accountability.</p>
        </div>
        <button className="btn secondary" type="button" onClick={() => void load()}>
          Refresh
        </button>
      </section>
      <section className="panel log-panel" style={{ marginTop: 16 }}>
        {loading ? (
          <p className="log-scroll">Loading logs...</p>
        ) : error ? (
          <p className="log-scroll" style={{ color: "#9f1a1a" }}>
            {error}
          </p>
        ) : logs.length === 0 ? (
          <p className="log-scroll">No logs found.</p>
        ) : (
          <>
            <div className="grid log-scroll" style={{ gap: 12 }}>
              {pagedLogs.map((entry) => (
                <article className="panel" key={entry.id} style={{ padding: 16, boxShadow: "none" }}>
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
            <Pagination
              page={page}
              totalItems={logs.length}
              pageSize={pageSize}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </main>
  );
}
