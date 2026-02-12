"use client";

import { useMemo, useState } from "react";
import { AddApiKeyDialog } from "../add-api-key-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Switch } from "../ui/switch";
import { useToast } from "../ui/toast";
import { browserApi, invalidateBrowserCache } from "../../lib/browser-api";

export type Sender = {
  id: string;
  label: string;
  emailAddress: string;
  type: "gmail" | "domain";
};

export type ApiKeyRow = {
  id: string;
  name: string;
  prefix: string;
  status: "active" | "revoked";
  rateLimitPerMinute: number;
  smtpAccountIds: string[];
  domainSenderIds: string[];
};

export function ApiKeysClient({
  initialKeys,
  initialSenders,
  initialError
}: {
  initialKeys: ApiKeyRow[];
  initialSenders: Sender[];
  initialError?: string;
}) {
  const [keys, setKeys] = useState<ApiKeyRow[]>(initialKeys);
  const [senders, setSenders] = useState<Sender[]>(initialSenders);
  const [newKey, setNewKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hideRevoked, setHideRevoked] = useState(true);
  const [error, setError] = useState(initialError ?? "");
  const { toast } = useToast();

  const senderEmailById = useMemo(() => {
    return new Map(senders.map((sender) => [sender.id, sender.emailAddress]));
  }, [senders]);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [keyResponse, senderResponse] = await Promise.all([
        browserApi<{ data: ApiKeyRow[] }>("/admin/v1/api-keys"),
        browserApi<{ data: Sender[] }>("/admin/v1/senders")
      ]);
      setKeys(keyResponse.data);
      setSenders(senderResponse.data);
    } catch (err) {
      const message = (err as Error).message || "Failed to load data";
      setError(message);
      toast({
        variant: "error",
        title: "API keys load unsuccessful",
        description: message
      });
    } finally {
      setLoading(false);
    }
  }

  async function onRevoke(id: string) {
    try {
      await browserApi<{ ok: true }>(`/admin/v1/api-keys/${id}`, {
        method: "DELETE",
        csrf: true
      });
      invalidateBrowserCache("/admin/v1/api-keys");
      toast({
        variant: "success",
        title: "API key revoked successfully",
        description: "The key is now inactive."
      });
      await loadData();
    } catch (err) {
      toast({
        variant: "error",
        title: "API key revoke unsuccessful",
        description: (err as Error).message || "Failed to revoke API key"
      });
    }
  }

  async function onRotate(id: string) {
    setNewKey("");
    try {
      const response = await browserApi<{ data: { key: string } }>(
        `/admin/v1/api-keys/${id}/rotate`,
        {
          method: "POST",
          csrf: true
        }
      );
      invalidateBrowserCache("/admin/v1/api-keys");
      toast({
        variant: "success",
        title: "API key rotated successfully",
        description: "A new key has been issued."
      });
      setNewKey(response.data.key);
      await loadData();
    } catch (err) {
      toast({
        variant: "error",
        title: "API key rotate unsuccessful",
        description: (err as Error).message || "Failed to rotate API key"
      });
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
            <h1>API Keys</h1>
            <p className="muted">
              Create scoped keys and copy the key value now; it is shown only once.
            </p>
          </div>
          <button
            className="btn"
            type="button"
            onClick={() => {
              setNewKey("");
              setDialogOpen(true);
            }}
          >
            Create API Key
          </button>
        </div>
        {newKey ? (
          <p className="key-highlight" style={{ marginTop: 12 }}>
            New key: <code>{newKey}</code>
          </p>
        ) : null}
        {error ? (
          <p className="muted" style={{ marginTop: 10, color: "#9f1a1a" }}>
            {error}
          </p>
        ) : null}
      </section>
      <AddApiKeyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        senders={senders}
        onCreated={loadData}
        onNewKey={setNewKey}
      />

      <section className="panel" style={{ marginTop: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap"
          }}
        >
          <h2>API Key Overview</h2>
          <Switch
            checked={hideRevoked}
            onChange={(event) => setHideRevoked(event.target.checked)}
            label="Exclude revoked"
          />
        </div>
        <div className="table-wrap">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Prefix</TableHead>
                <TableHead>Rate Limit</TableHead>
                <TableHead>Scoped Sender</TableHead>
                <TableHead>Health</TableHead>
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
                        <div className="skeleton" style={{ height: 14, width: 80 }} />
                      </TableCell>
                      <TableCell>
                        <div className="skeleton" style={{ height: 14, width: 80 }} />
                      </TableCell>
                      <TableCell>
                        <div className="skeleton" style={{ height: 14, width: 200 }} />
                      </TableCell>
                      <TableCell>
                        <div className="skeleton" style={{ height: 18, width: 90 }} />
                      </TableCell>
                      <TableCell>
                        <div className="skeleton" style={{ height: 28, width: 120 }} />
                      </TableCell>
                    </TableRow>
                  ))
                : keys.length === 0
                ? (
                    <TableRow>
                      <TableCell colSpan={6}>No API keys found.</TableCell>
                    </TableRow>
                  )
                : keys
                    .filter((key) => (hideRevoked ? key.status !== "revoked" : true))
                    .map((key) => {
                      const scopedSenders = [...key.smtpAccountIds, ...key.domainSenderIds]
                        .map((id) => senderEmailById.get(id))
                        .filter(Boolean)
                        .join(", ");
                      return (
                        <TableRow key={key.id}>
                          <TableCell>{key.name}</TableCell>
                          <TableCell>
                            <code>{key.prefix}</code>
                          </TableCell>
                          <TableCell>{key.rateLimitPerMinute}/min</TableCell>
                          <TableCell>{scopedSenders || "none"}</TableCell>
                          <TableCell>
                            <span className={`badge ${key.status === "active" ? "green" : "red"}`}>
                              {key.status === "active" ? "Healthy" : "Revoked"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="table-actions" style={{ flexDirection: "column" }}>
                              <button
                                className="btn small secondary"
                                onClick={() => void onRotate(key.id)}
                                type="button"
                              >
                                Rotate
                              </button>
                              <button
                                className="btn small ghost"
                                onClick={() => void onRevoke(key.id)}
                                disabled={key.status !== "active"}
                                type="button"
                              >
                                Revoke
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  );
}
