"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { browserApi, invalidateBrowserCache } from "../../../lib/browser-api";
import { useToast } from "../../../components/ui/toast";
import { parseApiError } from "../../../lib/api-errors";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../../../components/ui/dialog";

type Role = "owner" | "admin" | "readonly";

type Member = {
  id: string;
  email: string;
  role: Role;
  mfaEnabled: boolean;
  lastLogin: string | null;
  createdAt: string;
};

type MeResponse = {
  data: {
    id: string;
    email: string;
    role: Role;
  };
};

const ROLE_LABEL: Record<Role, string> = {
  owner: "Owner",
  admin: "Admin",
  readonly: "Read-only"
};

const ROLE_DESCRIPTION: Record<Role, string> = {
  owner: "Full access — billing, members, security, MFA enforced.",
  admin: "Manage senders, keys, templates, campaigns. Cannot manage owners.",
  readonly: "View-only access to dashboards and logs."
};

const ROLE_BADGE: Record<Role, { className: string }> = {
  owner: { className: "badge green" },
  admin: { className: "badge" },
  readonly: { className: "badge" }
};

function Icon({ path, size = 16 }: { path: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

function getInitials(email: string): string {
  const local = email.split("@")[0] ?? email;
  const parts = local.split(/[._-]+/).slice(0, 2);
  return parts
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || email[0]?.toUpperCase() || "?";
}

function formatDate(value: string | null) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function generatePassword(length = 16): string {
  const charset =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(length);
    crypto.getRandomValues(buf);
    return Array.from(buf, (n) => charset[n % charset.length]).join("");
  }
  let out = "";
  for (let i = 0; i < length; i++) {
    out += charset[Math.floor(Math.random() * charset.length)];
  }
  return out;
}

export default function MembersPage() {
  const { toast } = useToast();
  const [me, setMe] = useState<MeResponse["data"] | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add member dialog
  const [addOpen, setAddOpen] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addRole, setAddRole] = useState<Role>("admin");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  // Role edit dialog
  const [roleEditMember, setRoleEditMember] = useState<Member | null>(null);
  const [roleNew, setRoleNew] = useState<Role>("admin");
  const [roleLoading, setRoleLoading] = useState(false);

  // Reset password dialog
  const [resetMember, setResetMember] = useState<Member | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // Remove dialog
  const [removeMember, setRemoveMember] = useState<Member | null>(null);
  const [removeLoading, setRemoveLoading] = useState(false);

  async function loadMe() {
    try {
      const res = await browserApi<MeResponse>("/admin/v1/me", { cache: "no-store" });
      setMe(res.data);
    } catch {
      setMe(null);
    }
  }

  async function loadMembers() {
    setLoading(true);
    setError("");
    try {
      const res = await browserApi<{ data: Member[] }>("/admin/v1/members", {
        cache: "no-store"
      });
      setMembers(res.data);
    } catch (err) {
      const { message } = parseApiError(err);
      setError(message || "Failed to load members");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadMe();
    void loadMembers();
  }, []);

  const stats = useMemo(() => {
    const total = members.length;
    const owners = members.filter((m) => m.role === "owner").length;
    const admins = members.filter((m) => m.role === "admin").length;
    const readonly = members.filter((m) => m.role === "readonly").length;
    const mfaEnabled = members.filter((m) => m.mfaEnabled).length;
    return { total, owners, admins, readonly, mfaEnabled };
  }, [members]);

  const sortedMembers = useMemo(() => {
    const order: Record<Role, number> = { owner: 0, admin: 1, readonly: 2 };
    return [...members].sort((a, b) => {
      if (a.role !== b.role) return order[a.role] - order[b.role];
      return a.email.localeCompare(b.email);
    });
  }, [members]);

  const isOwner = me?.role === "owner";
  const isAdmin = me?.role === "admin";
  const canInvite = isOwner || isAdmin;

  function canChangeRole(target: Member): boolean {
    if (!isOwner) return false;
    if (target.id === me?.id && target.role === "owner") {
      // owner can demote themselves, but the API will block if last owner
      return stats.owners > 1;
    }
    return true;
  }

  function canRemove(target: Member): boolean {
    if (target.id === me?.id) return false;
    if (isOwner) return target.role !== "owner" || stats.owners > 1;
    if (isAdmin) return target.role === "readonly";
    return false;
  }

  function canResetPassword(target: Member): boolean {
    return Boolean(isOwner) && target.id !== me?.id;
  }

  function openAddMember() {
    setAddEmail("");
    setAddPassword(generatePassword());
    setAddRole(isOwner ? "admin" : "readonly");
    setAddError("");
    setAddOpen(true);
  }

  async function submitAddMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAddError("");
    if (!addEmail.trim() || addPassword.length < 8) {
      setAddError("Email and a password (min 8 chars) are required.");
      return;
    }
    setAddLoading(true);
    try {
      await browserApi("/admin/v1/members", {
        method: "POST",
        csrf: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: addEmail.trim(),
          password: addPassword,
          role: addRole
        })
      });
      invalidateBrowserCache("/admin/v1/members");
      toast({
        variant: "success",
        title: `Added ${addEmail.trim()}`,
        description: "Share their temporary password securely."
      });
      setAddOpen(false);
      await loadMembers();
    } catch (err) {
      const { message } = parseApiError(err);
      setAddError(message || "Could not add member");
    } finally {
      setAddLoading(false);
    }
  }

  function openRoleEdit(member: Member) {
    setRoleEditMember(member);
    setRoleNew(member.role);
  }

  async function submitRoleEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!roleEditMember) return;
    if (roleNew === roleEditMember.role) {
      setRoleEditMember(null);
      return;
    }
    setRoleLoading(true);
    try {
      await browserApi(`/admin/v1/members/${roleEditMember.id}/role`, {
        method: "PATCH",
        csrf: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role: roleNew })
      });
      invalidateBrowserCache("/admin/v1/members");
      toast({
        variant: "success",
        title: `Role updated to ${ROLE_LABEL[roleNew]}`
      });
      setRoleEditMember(null);
      await loadMembers();
    } catch (err) {
      const { message } = parseApiError(err);
      toast({ variant: "error", title: message || "Could not change role" });
    } finally {
      setRoleLoading(false);
    }
  }

  function openResetPassword(member: Member) {
    setResetMember(member);
    setResetPassword(generatePassword());
  }

  async function submitResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!resetMember) return;
    if (resetPassword.length < 8) {
      toast({ variant: "error", title: "Password must be at least 8 characters" });
      return;
    }
    setResetLoading(true);
    try {
      await browserApi(`/admin/v1/members/${resetMember.id}/reset-password`, {
        method: "POST",
        csrf: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ newPassword: resetPassword })
      });
      toast({
        variant: "success",
        title: "Password reset",
        description: "Share the new password with the user securely."
      });
      setResetMember(null);
    } catch (err) {
      const { message } = parseApiError(err);
      toast({ variant: "error", title: message || "Could not reset password" });
    } finally {
      setResetLoading(false);
    }
  }

  async function submitRemove() {
    if (!removeMember) return;
    setRemoveLoading(true);
    try {
      await browserApi(`/admin/v1/members/${removeMember.id}`, {
        method: "DELETE",
        csrf: true
      });
      invalidateBrowserCache("/admin/v1/members");
      toast({ variant: "success", title: `Removed ${removeMember.email}` });
      setRemoveMember(null);
      await loadMembers();
    } catch (err) {
      const { message } = parseApiError(err);
      toast({ variant: "error", title: message || "Could not remove member" });
    } finally {
      setRemoveLoading(false);
    }
  }

  async function copyText(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast({ variant: "success", title: `${label} copied` });
    } catch {
      toast({ variant: "error", title: "Copy failed" });
    }
  }

  return (
    <main className="container">
      <section className="panel hero-panel" style={{ padding: 28, marginBottom: 18 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
            flexWrap: "wrap"
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 12px",
                borderRadius: 999,
                background: "rgba(20, 184, 130, 0.10)",
                border: "1px solid rgba(10, 127, 81, 0.25)",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--brand-strong)",
                letterSpacing: "0.04em",
                textTransform: "uppercase"
              }}
            >
              Team &amp; Access
            </div>
            <h1 style={{ margin: "12px 0 6px" }}>Manage members</h1>
            <p className="muted" style={{ maxWidth: 640, fontSize: 14 }}>
              Add teammates, change roles, reset passwords, and remove access. Every change is logged
              to the audit trail.
            </p>
          </div>
          {canInvite ? (
            <button className="btn" type="button" onClick={openAddMember}>
              <Icon path="M12 5v14 M5 12h14" size={14} />
              Add member
            </button>
          ) : null}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
            marginTop: 22
          }}
        >
          <StatCard label="Total members" value={String(stats.total)} icon="M20 21a8 8 0 1 0-16 0 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8" />
          <StatCard label="Owners" value={String(stats.owners)} icon="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <StatCard label="Admins" value={String(stats.admins)} icon="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <StatCard label="Read-only" value={String(stats.readonly)} icon="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
          <StatCard
            label="MFA enabled"
            value={`${stats.mfaEnabled} / ${stats.total}`}
            icon="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            accent={stats.total > 0 && stats.mfaEnabled === stats.total}
          />
        </div>
      </section>

      <section className="panel">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginBottom: 14,
            flexWrap: "wrap"
          }}
        >
          <h2 style={{ margin: 0 }}>Team</h2>
          <button
            type="button"
            className="btn ghost small"
            onClick={() => loadMembers()}
            disabled={loading}
          >
            <Icon path="M21 12a9 9 0 1 1-9-9c2.5 0 4.79.96 6.5 2.5L21 3 M21 3v6h-6" size={12} />
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {error ? (
          <div role="alert" style={{ color: "var(--danger)", marginBottom: 14, fontSize: 13 }}>
            {error}
          </div>
        ) : null}

        {loading && members.length === 0 ? (
          <div style={{ display: "grid", gap: 8 }}>
            <div className="skeleton" style={{ height: 48 }} />
            <div className="skeleton" style={{ height: 48 }} />
            <div className="skeleton" style={{ height: 48 }} />
          </div>
        ) : members.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 12px" }}>
            <p className="muted">No members yet — add the first teammate to get started.</p>
            {canInvite ? (
              <button
                className="btn"
                type="button"
                onClick={openAddMember}
                style={{ marginTop: 12 }}
              >
                Add member
              </button>
            ) : null}
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-head">Member</th>
                  <th className="table-head">Role</th>
                  <th className="table-head">MFA</th>
                  <th className="table-head">Last login</th>
                  <th className="table-head">Joined</th>
                  <th className="table-head" style={{ textAlign: "right" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedMembers.map((m) => {
                  const isMe = m.id === me?.id;
                  return (
                    <tr key={m.id} className="table-row">
                      <td className="table-cell">
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div
                            aria-hidden="true"
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 999,
                              background:
                                m.role === "owner"
                                  ? "var(--grad-brand)"
                                  : "linear-gradient(135deg, #4f7bff 0%, #7c5cff 100%)",
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: 13,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.12)"
                            }}
                          >
                            {getInitials(m.email)}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontWeight: 600,
                                overflowWrap: "anywhere",
                                wordBreak: "break-word"
                              }}
                            >
                              {m.email}
                              {isMe ? (
                                <span
                                  className="badge"
                                  style={{ marginLeft: 8, fontSize: 10 }}
                                >
                                  You
                                </span>
                              ) : null}
                            </div>
                            <div className="muted" style={{ fontSize: 11 }}>
                              {ROLE_DESCRIPTION[m.role]}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className={ROLE_BADGE[m.role].className}>{ROLE_LABEL[m.role]}</span>
                      </td>
                      <td className="table-cell">
                        {m.mfaEnabled ? (
                          <span className="badge green">On</span>
                        ) : (
                          <span className="badge" style={{ color: "var(--muted)" }}>Off</span>
                        )}
                      </td>
                      <td className="table-cell" style={{ fontSize: 13, color: "var(--muted-strong)" }}>
                        {formatDate(m.lastLogin)}
                      </td>
                      <td className="table-cell" style={{ fontSize: 13, color: "var(--muted-strong)" }}>
                        {formatDate(m.createdAt)}
                      </td>
                      <td className="table-cell" style={{ textAlign: "right" }}>
                        <div className="table-actions" style={{ justifyContent: "flex-end" }}>
                          {canChangeRole(m) ? (
                            <button
                              className="btn ghost small"
                              type="button"
                              onClick={() => openRoleEdit(m)}
                            >
                              Change role
                            </button>
                          ) : null}
                          {canResetPassword(m) ? (
                            <button
                              className="btn ghost small"
                              type="button"
                              onClick={() => openResetPassword(m)}
                            >
                              Reset password
                            </button>
                          ) : null}
                          {canRemove(m) ? (
                            <button
                              className="btn danger small"
                              type="button"
                              onClick={() => setRemoveMember(m)}
                            >
                              Remove
                            </button>
                          ) : null}
                          {!canChangeRole(m) && !canResetPassword(m) && !canRemove(m) ? (
                            <span className="muted" style={{ fontSize: 11 }}>
                              {isMe ? "Manage in Account" : "—"}
                            </span>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Role legend */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
          marginTop: 18
        }}
      >
        {(Object.keys(ROLE_LABEL) as Role[]).map((role) => (
          <div className="docs-card" key={role}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span className={ROLE_BADGE[role].className}>{ROLE_LABEL[role]}</span>
            </div>
            <div className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>
              {ROLE_DESCRIPTION[role]}
            </div>
          </div>
        ))}
      </section>

      {/* Add member dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a member</DialogTitle>
            <DialogDescription>
              We'll create their account immediately. Share the temporary password with them
              securely so they can sign in and change it.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitAddMember} style={{ display: "grid", gap: 12, marginTop: 12 }}>
            <label>
              Email
              <input
                type="email"
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
                placeholder="teammate@company.com"
                required
                autoFocus
              />
            </label>

            <label>
              Role
              <select value={addRole} onChange={(e) => setAddRole(e.target.value as Role)}>
                {isOwner ? <option value="owner">Owner — full access</option> : null}
                <option value="admin">Admin — manage senders, keys, templates</option>
                <option value="readonly">Read-only — view-only</option>
              </select>
            </label>

            <label>
              Temporary password
              <input
                value={addPassword}
                onChange={(e) => setAddPassword(e.target.value)}
                minLength={8}
                required
                style={{ fontFamily: "var(--font-mono, ui-monospace), monospace" }}
              />
            </label>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn ghost small"
                onClick={() => setAddPassword(generatePassword())}
              >
                <Icon path="M21 12a9 9 0 1 1-9-9c2.5 0 4.79.96 6.5 2.5L21 3 M21 3v6h-6" size={12} />
                Regenerate
              </button>
              <button
                type="button"
                className="btn ghost small"
                onClick={() => copyText(addPassword, "Password")}
              >
                <Icon path="M9 9h10v10H9z M5 5h10v10H5z" size={12} />
                Copy
              </button>
            </div>

            {addError ? (
              <p
                role="alert"
                style={{
                  color: "var(--danger)",
                  background: "rgba(239, 68, 68, 0.08)",
                  border: "1px solid rgba(179, 38, 30, 0.25)",
                  padding: "8px 10px",
                  borderRadius: 8,
                  fontSize: 13,
                  margin: 0
                }}
              >
                {addError}
              </p>
            ) : null}

            <DialogFooter>
              <button
                type="button"
                className="btn ghost"
                onClick={() => setAddOpen(false)}
                disabled={addLoading}
              >
                Cancel
              </button>
              <button type="submit" className="btn" disabled={addLoading}>
                {addLoading ? "Adding…" : "Add member"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Role edit dialog */}
      <Dialog open={Boolean(roleEditMember)} onOpenChange={(o) => !o && setRoleEditMember(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change role</DialogTitle>
            <DialogDescription>
              {roleEditMember ? `Update the role for ${roleEditMember.email}.` : null}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitRoleEdit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
            <label>
              New role
              <select value={roleNew} onChange={(e) => setRoleNew(e.target.value as Role)}>
                <option value="owner">Owner — full access</option>
                <option value="admin">Admin — manage senders, keys, templates</option>
                <option value="readonly">Read-only — view-only</option>
              </select>
            </label>
            <p className="muted" style={{ fontSize: 12, margin: 0 }}>
              {ROLE_DESCRIPTION[roleNew]}
            </p>
            <DialogFooter>
              <button
                type="button"
                className="btn ghost"
                onClick={() => setRoleEditMember(null)}
                disabled={roleLoading}
              >
                Cancel
              </button>
              <button type="submit" className="btn" disabled={roleLoading}>
                {roleLoading ? "Updating…" : "Save"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset password dialog */}
      <Dialog open={Boolean(resetMember)} onOpenChange={(o) => !o && setResetMember(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset password</DialogTitle>
            <DialogDescription>
              {resetMember
                ? `Generate a new password for ${resetMember.email} and share it with them securely. They'll use it to sign in once.`
                : null}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitResetPassword} style={{ display: "grid", gap: 12, marginTop: 12 }}>
            <label>
              New password
              <input
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                minLength={8}
                required
                style={{ fontFamily: "var(--font-mono, ui-monospace), monospace" }}
              />
            </label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn ghost small"
                onClick={() => setResetPassword(generatePassword())}
              >
                Regenerate
              </button>
              <button
                type="button"
                className="btn ghost small"
                onClick={() => copyText(resetPassword, "Password")}
              >
                Copy
              </button>
            </div>
            <DialogFooter>
              <button
                type="button"
                className="btn ghost"
                onClick={() => setResetMember(null)}
                disabled={resetLoading}
              >
                Cancel
              </button>
              <button type="submit" className="btn" disabled={resetLoading}>
                {resetLoading ? "Resetting…" : "Reset password"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Remove confirmation */}
      <Dialog open={Boolean(removeMember)} onOpenChange={(o) => !o && setRemoveMember(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove member</DialogTitle>
            <DialogDescription>
              {removeMember
                ? `Remove ${removeMember.email} from the tenant? They'll lose access immediately. This cannot be undone.`
                : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              className="btn ghost"
              onClick={() => setRemoveMember(null)}
              disabled={removeLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn danger"
              onClick={() => void submitRemove()}
              disabled={removeLoading}
            >
              {removeLoading ? "Removing…" : "Remove member"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent
}: {
  label: string;
  value: string;
  icon: string;
  accent?: boolean;
}) {
  return (
    <div className="stat-card" style={accent ? { borderColor: "rgba(10, 127, 81, 0.32)" } : undefined}>
      <div className="stat-card-icon">
        <Icon path={icon} />
      </div>
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value" style={{ color: accent ? "var(--brand-strong)" : undefined }}>
        {value}
      </div>
    </div>
  );
}
