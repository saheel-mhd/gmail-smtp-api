"use client";

import { useEffect, useMemo, useState } from "react";
import { TemplateDialog } from "../template-dialog";
import { TemplatePreviewDialog } from "./template-preview-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useToast } from "../ui/toast";
import { browserApi, invalidateBrowserCache } from "../../lib/browser-api";
import { parseApiError } from "../../lib/api-errors";

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
  const initialParsed = useMemo(
    () => (initialError ? parseApiError(initialError) : null),
    [initialError]
  );
  const [templates, setTemplates] = useState<TemplateRow[]>(initialTemplates);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    initialParsed && !initialParsed.isAuth ? initialParsed.message : ""
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TemplateRow | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewing, setPreviewing] = useState<TemplateRow | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [copyingId, setCopyingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TemplateRow | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialParsed?.isAuth) {
      toast({
        variant: "error",
        title: "Session expired",
        description: initialParsed.message
      });
    }
  }, [initialParsed, toast]);

  async function loadTemplates() {
    setLoading(true);
    setError("");
    try {
      const res = await browserApi<{ data: TemplateRow[] }>("/admin/v1/templates");
      setTemplates(res.data);
    } catch (err) {
      const { message, isAuth } = parseApiError(err);
      if (!isAuth) setError(message);
      toast({
        variant: "error",
        title: isAuth ? "Session expired" : "Templates load unsuccessful",
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
      const { message, isAuth } = parseApiError(err);
      toast({
        variant: "error",
        title: isAuth ? "Session expired" : "Template status update unsuccessful",
        description: message
      });
    } finally {
      setTogglingId(null);
    }
  }

  async function deleteTemplate(template: TemplateRow) {
    setDeletingId(template.id);
    try {
      await browserApi(`/admin/v1/templates/${template.id}`, {
        method: "DELETE",
        csrf: true
      });
      invalidateBrowserCache("/admin/v1/templates");
      toast({
        variant: "success",
        title: "Template deleted"
      });
      await loadTemplates();
    } catch (err) {
      const { message, isAuth } = parseApiError(err);
      toast({
        variant: "error",
        title: isAuth ? "Session expired" : "Template delete unsuccessful",
        description: message
      });
    } finally {
      setDeletingId(null);
    }
  }

  function openDeleteConfirm(template: TemplateRow) {
    setDeleteTarget(template);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await deleteTemplate(deleteTarget);
    setConfirmOpen(false);
    setDeleteTarget(null);
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

      {previewing ? (
        <TemplatePreviewDialog
          open={previewOpen}
          onOpenChange={(open) => {
            setPreviewOpen(open);
            if (!open) setPreviewing(null);
          }}
          template={{
            id: previewing.id,
            name: previewing.name,
            subject: previewing.subject,
            html: previewing.html,
            text: previewing.text
          }}
        />
      ) : null}

      <Dialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete template</DialogTitle>
            <DialogDescription>
              This will permanently delete the template. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              className="btn small ghost"
              type="button"
              onClick={() => setConfirmOpen(false)}
              disabled={!!(deleteTarget && deletingId === deleteTarget.id)}
            >
              Cancel
            </button>
            <button
              className="btn small danger"
              type="button"
              onClick={() => void confirmDelete()}
              disabled={!deleteTarget || deletingId === deleteTarget.id}
            >
              {deleteTarget && deletingId === deleteTarget.id ? "Deleting..." : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                            className="btn small ghost"
                            type="button"
                            onClick={() => {
                              setPreviewing(template);
                              setPreviewOpen(true);
                            }}
                            title="Preview & test send"
                          >
                            Preview
                          </button>
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
                          <button
                            className="btn small danger"
                            type="button"
                            onClick={() => openDeleteConfirm(template)}
                            disabled={deletingId === template.id}
                            title="Delete template"
                            aria-label="Delete template"
                            style={{
                              width: 34,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              paddingLeft: 0,
                              paddingRight: 0
                            }}
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
                              <path d="M3 6h18" />
                              <path d="M8 6V4h8v2" />
                              <path d="M6 6l1 14h10l1-14" />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />
                            </svg>
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
