"use client";

import { useMemo, useState } from "react";
import { TemplateDialog } from "../template-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useToast } from "../ui/toast";
import { browserApi, invalidateBrowserCache } from "../../lib/browser-api";

export type TemplateRow = {
  id: string;
  name: string;
  subject: string;
  html: string;
  text: string | null;
  status: "active" | "disabled";
  updatedAt: string;
};

export function TemplatesClient({
  initialTemplates,
  initialError
}: {
  initialTemplates: TemplateRow[];
  initialError?: string;
}) {
  const [templates, setTemplates] = useState<TemplateRow[]>(initialTemplates);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError ?? "");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TemplateRow | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [copyingId, setCopyingId] = useState<string | null>(null);
  const { toast } = useToast();

  async function loadTemplates() {
    setLoading(true);
    setError("");
    try {
      const res = await browserApi<{ data: TemplateRow[] }>("/admin/v1/templates");
      setTemplates(res.data);
    } catch (err) {
      const message = (err as Error).message || "Failed to load templates";
      setError(message);
      toast({
        variant: "error",
        title: "Templates load unsuccessful",
        description: message
      });
    } finally {
      setLoading(false);
    }
  }

  const rows = useMemo(() => templates, [templates]);

  function formatTemplateId(id: string) {
    const tail = id.length <= 10 ? id : id.slice(-10);
    return `...${tail}`;
  }

  async function copyTemplateId(id: string) {
    setCopyingId(id);
    try {
      await navigator.clipboard.writeText(id);
      toast({
        variant: "success",
        title: "Template ID copied",
        description: "The full template ID is now on your clipboard."
      });
    } catch (err) {
      toast({
        variant: "error",
        title: "Copy failed",
        description: (err as Error).message || "Failed to copy template ID"
      });
    } finally {
      setCopyingId((current) => (current === id ? null : current));
    }
  }

  async function toggleStatus(template: TemplateRow) {
    setTogglingId(template.id);
    try {
      const nextStatus = template.status === "active" ? "disabled" : "active";
      await browserApi(`/admin/v1/templates/${template.id}`, {
        method: "PATCH",
        csrf: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      invalidateBrowserCache("/admin/v1/templates");
      toast({
        variant: "success",
        title:
          nextStatus === "active"
            ? "Template activated successfully"
            : "Template deactivated successfully"
      });
      await loadTemplates();
    } catch (err) {
      toast({
        variant: "error",
        title: "Template status update unsuccessful",
        description: (err as Error).message || "Failed to update template"
      });
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <main className="container">
      <section className="panel">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap"
          }}
        >
          <div>
            <h1>Templates</h1>
            <p className="muted">
              Create reusable HTML templates using {"{{variable}}"} placeholders.
            </p>
          </div>
          <button
            className="btn"
            type="button"
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            Create Template
          </button>
        </div>
        {error ? (
          <p className="muted" style={{ marginTop: 10, color: "#9f1a1a" }}>
            {error}
          </p>
        ) : null}
      </section>

      <TemplateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        onSaved={loadTemplates}
      />

      <section className="panel" style={{ marginTop: 16 }}>
        <h2>Template Overview</h2>
        <div className="table-wrap">
          <Table>
            <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, idx) => (
                    <TableRow key={`skeleton-${idx}`}>
                      <TableCell>
                        <div className="skeleton" style={{ height: 14, width: 140 }} />
                      </TableCell>
                      <TableCell>
                        <div className="skeleton" style={{ height: 14, width: 120 }} />
                      </TableCell>
                      <TableCell>
                        <div className="skeleton" style={{ height: 14, width: 220 }} />
                      </TableCell>
                      <TableCell>
                        <div className="skeleton" style={{ height: 18, width: 80 }} />
                      </TableCell>
                      <TableCell>
                        <div className="skeleton" style={{ height: 12, width: 120 }} />
                      </TableCell>
                      <TableCell>
                        <div className="skeleton" style={{ height: 28, width: 120 }} />
                      </TableCell>
                    </TableRow>
                  ))
                : rows.length === 0
                ? (
                    <TableRow>
                      <TableCell colSpan={7}>No templates found.</TableCell>
                    </TableRow>
                  )
                : rows.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>{template.name}</TableCell>
                      <TableCell>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <code>{formatTemplateId(template.id)}</code>
                          <button
                            className="icon-btn"
                            type="button"
                            title="Copy template ID"
                            aria-label="Copy template ID"
                            onClick={() => void copyTemplateId(template.id)}
                            disabled={copyingId === template.id}
                            style={{ height: 26, width: 26 }}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                          </button>
                        </div>
                      </TableCell>
                      <TableCell>{template.subject}</TableCell>
                      <TableCell>
                        <span
                          className={`badge ${template.status === "active" ? "green" : "red"}`}
                        >
                          {template.status === "active" ? "Active" : "Disabled"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted whitespace-nowrap">
                          {new Date(template.updatedAt).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="table-actions">
                          <button
                            className="btn small secondary"
                            type="button"
                            onClick={() => {
                              setEditing(template);
                              setDialogOpen(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className={`btn small ${template.status === "active" ? "ghost" : ""}`}
                            type="button"
                            onClick={() => void toggleStatus(template)}
                            disabled={togglingId === template.id}
                          >
                            {togglingId === template.id
                              ? "Updating..."
                              : template.status === "active"
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  );
}
