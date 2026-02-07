"use client";

import { FormEvent, Fragment, useState } from "react";
import { AddGmailSenderDialog } from "../add-gmail-sender-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useToast } from "../ui/toast";
import { browserApi, invalidateBrowserCache } from "../../lib/browser-api";

export type Sender = {
  id: string;
  label: string;
  gmailAddress: string;
  status: "active" | "disabled" | "needs_attention";
  perDayLimit: number;
  sentTodayCount: number;
  errorStreak: number;
  healthScore: number;
};

type SenderResponse = { data: Sender[] };

type UpdateSenderPayload = {
  label: string;
  perDayLimit: number;
};

function healthBadge(status: Sender["status"], healthScore: number) {
  if (status === "needs_attention" || healthScore < 40) {
    return <span className="badge red">Needs attention</span>;
  }
  if (healthScore < 70) return <span className="badge yellow">Degraded</span>;
  return <span className="badge green">Healthy</span>;
}

const DEFAULT_EDIT_FORM: UpdateSenderPayload = {
  label: "",
  perDayLimit: 2000
};

export function SendersClient({
  initialSenders,
  initialError
}: {
  initialSenders: Sender[];
  initialError?: string;
}) {
  const [senders, setSenders] = useState<Sender[]>(initialSenders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError ?? "");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<UpdateSenderPayload>(DEFAULT_EDIT_FORM);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const { toast } = useToast();

  async function loadSenders() {
    setLoading(true);
    setError("");
    try {
      const response = await browserApi<SenderResponse>("/admin/v1/senders");
      setSenders(response.data);
    } catch (err) {
      const message = (err as Error).message || "Failed to load senders.";
      setError(message);
      toast({
        variant: "error",
        title: "Senders load unsuccessful",
        description: message
      });
    } finally {
      setLoading(false);
    }
  }

  async function onUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId) return;
    setUpdatingId(editingId);
    try {
      await browserApi(`/admin/v1/senders/${editingId}`, {
        method: "PATCH",
        csrf: true,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(editForm)
      });
      invalidateBrowserCache("/admin/v1/senders");
      toast({
        variant: "success",
        title: "Sender updated successfully",
        description: "Sender settings saved successfully."
      });
      setEditingId(null);
      setEditForm(DEFAULT_EDIT_FORM);
      await loadSenders();
    } catch (err) {
      toast({
        variant: "error",
        title: "Sender update unsuccessful",
        description: (err as Error).message || "Failed to update sender."
      });
    } finally {
      setUpdatingId(null);
    }
  }

  async function toggleStatus(sender: Sender) {
    setTogglingId(sender.id);
    try {
      const nextStatus = sender.status === "active" ? "disabled" : "active";
      await browserApi(`/admin/v1/senders/${sender.id}`, {
        method: "PATCH",
        csrf: true,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ status: nextStatus })
      });
      invalidateBrowserCache("/admin/v1/senders");
      toast({
        variant: "success",
        title:
          nextStatus === "active"
            ? "Sender activated successfully"
            : "Sender deactivated successfully",
        description:
          nextStatus === "active"
            ? "Sender is now active and ready to use."
            : "Sender is now disabled."
      });
      await loadSenders();
    } catch (err) {
      toast({
        variant: "error",
        title: "Sender status update unsuccessful",
        description: (err as Error).message || "Failed to update sender status."
      });
    } finally {
      setTogglingId(null);
    }
  }

  function startEditing(sender: Sender) {
    setEditingId(sender.id);
    setEditForm({
      label: sender.label,
      perDayLimit: sender.perDayLimit
    });
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
            <h1>Senders</h1>
            <p className="muted">
              Add your Gmail sender account here. From address is always the configured Gmail account.
            </p>
          </div>
          <button
            className="btn"
            type="button"
            onClick={() => {
              setDialogOpen(true);
            }}
          >
            Add Gmail Sender
          </button>
        </div>
        {error ? (
          <p className="muted" style={{ marginTop: 10, color: "#9f1a1a" }}>
            {error}
          </p>
        ) : null}
      </section>

      <AddGmailSenderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={loadSenders}
      />

      <section className="panel" style={{ marginTop: 16 }}>
        <h2>Sender Overview</h2>
        <div className="table-wrap">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sender Email</TableHead>
                <TableHead>Sent / Limit</TableHead>
                <TableHead>Error Streak</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, idx) => (
                    <TableRow key={`skeleton-${idx}`}>
                      <TableCell>
                        <div className="skeleton" style={{ height: 14, width: 160 }} />
                        <div className="skeleton" style={{ height: 12, width: 200, marginTop: 8 }} />
                      </TableCell>
                      <TableCell>
                        <div className="skeleton" style={{ height: 14, width: 90 }} />
                      </TableCell>
                      <TableCell>
                        <div className="skeleton" style={{ height: 14, width: 40 }} />
                      </TableCell>
                      <TableCell>
                        <div className="skeleton" style={{ height: 18, width: 90 }} />
                      </TableCell>
                      <TableCell>
                        <div className="skeleton" style={{ height: 28, width: 140 }} />
                      </TableCell>
                    </TableRow>
                  ))
                : senders.length === 0
                ? (
                    <TableRow>
                      <TableCell colSpan={5}>No senders found yet.</TableCell>
                    </TableRow>
                  )
                : senders.map((sender) => {
                    return (
                      <Fragment key={sender.id}>
                        <TableRow>
                          <TableCell>
                            <div style={{ fontWeight: 600 }}>{sender.label}</div>
                            <div className="muted">{sender.gmailAddress}</div>
                          </TableCell>
                          <TableCell>
                            {sender.sentTodayCount} / {sender.perDayLimit}
                            <div className="muted" style={{ fontSize: 12 }}>
                              today
                            </div>
                          </TableCell>
                          <TableCell>{sender.errorStreak}</TableCell>
                          <TableCell>{healthBadge(sender.status, sender.healthScore)}</TableCell>
                          <TableCell>
                            <div className="table-actions">
                              <button
                                className="btn small secondary"
                                type="button"
                                onClick={() => startEditing(sender)}
                              >
                                Edit
                              </button>
                              <button
                                className={`btn small ${sender.status === "active" ? "ghost" : ""}`}
                                type="button"
                                onClick={() => void toggleStatus(sender)}
                                disabled={togglingId === sender.id}
                              >
                                {togglingId === sender.id
                                  ? "Updating..."
                                  : sender.status === "active"
                                  ? "Deactivate"
                                  : "Activate"}
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                        {editingId === sender.id ? (
                          <TableRow>
                            <TableCell colSpan={6}>
                              <form onSubmit={onUpdate} className="table-edit">
                                <label>
                                  Label
                                  <input
                                    value={editForm.label}
                                    onChange={(e) =>
                                      setEditForm((prev) => ({
                                        ...prev,
                                        label: e.target.value
                                      }))
                                    }
                                    required
                                  />
                                </label>
                                <label>
                                  Per-Day Limit
                                  <input
                                    type="number"
                                    min={1}
                                    value={editForm.perDayLimit}
                                    onChange={(e) =>
                                      setEditForm((prev) => ({
                                        ...prev,
                                        perDayLimit: Number(e.target.value)
                                      }))
                                    }
                                    required
                                  />
                                </label>
                                <div className="actions">
                                  <button
                                    className="btn small"
                                    type="submit"
                                    disabled={updatingId === sender.id}
                                  >
                                    {updatingId === sender.id ? "Saving..." : "Save"}
                                  </button>
                                  <button
                                    className="btn small ghost"
                                    type="button"
                                    onClick={() => {
                                      setEditingId(null);
                                      setEditForm(DEFAULT_EDIT_FORM);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            </TableCell>
                          </TableRow>
                        ) : null}
                      </Fragment>
                    );
                  })}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  );
}
