"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { browserApi } from "../../lib/browser-api";
import { parseApiError } from "../../lib/api-errors";
import { useToast } from "../ui/toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

type CampaignRow = {
  id: string;
  name: string;
  status: "draft" | "running" | "paused" | "completed" | "failed" | "cancelled";
  senderLabel: string;
  totalRecipients: number;
  queuedCount: number;
  sentCount: number;
  failedCount: number;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
};

function statusBadge(status: CampaignRow["status"]) {
  const label = status.replace("_", " ");
  if (status === "completed") return { label, className: "badge green" };
  if (status === "running") return { label, className: "badge green" };
  if (status === "paused") return { label, className: "badge yellow" };
  if (status === "failed" || status === "cancelled") return { label, className: "badge red" };
  return { label, className: "badge" };
}

export function BulkEmailClient() {
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  async function loadCampaigns() {
    setLoading(true);
    setError("");
    try {
      const res = await browserApi<{ data: CampaignRow[] }>("/admin/v1/campaigns", {
        cache: "no-store"
      });
      setCampaigns(res.data);
    } catch (err) {
      const { message, isAuth } = parseApiError(err);
      if (!isAuth) setError(message);
      toast({
        variant: "error",
        title: isAuth ? "Session expired" : "Campaign load unsuccessful",
        description: message
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCampaigns();
  }, []);

  const rows = useMemo(() => campaigns, [campaigns]);

  return (
    <main className="container">
      <section className="panel">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap"
          }}
        >
          <div>
            <h1>Bulk Email</h1>
            <p className="muted">
              Build and schedule large email batches here. This page will host bulk send
              tools and import workflows.
            </p>
          </div>
          <button
            className="btn"
            type="button"
            onClick={() => router.push("/dashboard/bulk-email/new")}
          >
            New Campaign
          </button>
        </div>
        {error ? (
          <p className="muted" style={{ marginTop: 10, color: "#9f1a1a" }}>
            {error}
          </p>
        ) : null}
      </section>

      <section className="panel" style={{ marginTop: 16 }}>
        <h2>Campaigns</h2>
        <div className="table-wrap">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Total / Sent / Failed</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, idx) => (
                    <TableRow key={`campaign-skeleton-${idx}`}>
                      <TableCell>
                        <div className="skeleton" style={{ height: 12, width: 90 }} />
                      </TableCell>
                      <TableCell>
                        <div className="skeleton" style={{ height: 14, width: 160 }} />
                      </TableCell>
                      <TableCell>
                        <div className="skeleton" style={{ height: 12, width: 140 }} />
                      </TableCell>
                      <TableCell>
                        <div className="skeleton" style={{ height: 12, width: 140 }} />
                      </TableCell>
                      <TableCell>
                        <div className="skeleton" style={{ height: 18, width: 80 }} />
                      </TableCell>
                    </TableRow>
                  ))
                : rows.length === 0
                ? (
                    <TableRow>
                      <TableCell colSpan={5}>No campaigns yet.</TableCell>
                    </TableRow>
                  )
                : rows.map((campaign) => {
                    const badge = statusBadge(campaign.status);
                    return (
                      <TableRow
                        key={campaign.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => router.push(`/dashboard/bulk-email/${campaign.id}`)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            router.push(`/dashboard/bulk-email/${campaign.id}`);
                          }
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <TableCell>
                          {new Date(campaign.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{campaign.name}</TableCell>
                        <TableCell>{campaign.senderLabel}</TableCell>
                        <TableCell>
                          {campaign.totalRecipients} / {campaign.sentCount} / {campaign.failedCount}
                        </TableCell>
                        <TableCell>
                          <span className={badge.className}>{badge.label}</span>
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
