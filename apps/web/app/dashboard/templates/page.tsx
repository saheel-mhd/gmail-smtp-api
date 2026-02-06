"use client";

import { useEffect, useMemo, useState } from "react";
import { TemplateDialog } from "../../../components/template-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../../../components/ui/table";
import { useToast } from "../../../components/ui/toast";
import { browserApi, invalidateBrowserCache } from "../../../lib/browser-api";

type TemplateRow = {
  id: string;
  name: string;
  subject: string;
  html: string;
  text: string | null;
  status: "active" | "disabled";
  updatedAt: string;
};

export default function DashboardTemplatesPage() {
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TemplateRow | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const { toast } = useToast();

  async function loadTemplates() {
    setLoading(true);
    try {
      const res = await browserApi<{ data: TemplateRow[] }>("/admin/v1/templates");
      setTemplates(res.data);
    } catch (err) {
      toast({
        variant: "error",
        title: "Templates load unsuccessful",
        description: (err as Error).message || "Failed to load templates"
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTemplates();
  }, []);

  const rows = useMemo(() => templates, [templates]);

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
                      <TableCell colSpan={5}>No templates found.</TableCell>
                    </TableRow>
                  )
                : rows.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>{template.name}</TableCell>
                      <TableCell>{template.subject}</TableCell>
                      <TableCell>
                        <span
                          className={`badge ${
                            template.status === "active" ? "green" : "red"
                          }`}
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
