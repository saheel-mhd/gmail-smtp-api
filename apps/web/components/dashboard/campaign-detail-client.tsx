"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { browserApi } from "../../lib/browser-api";
import { parseApiError } from "../../lib/api-errors";
import { useToast } from "../ui/toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

type CampaignSummary = {
  id: string;
  name: string;
  status: "draft" | "running" | "paused" | "completed" | "failed" | "cancelled";
  senderType: "gmail" | "domain";
  senderLabel: string;
  fromName: string | null;
  replyTo: string | null;
  template: { id: string; name: string } | null;
  perMinuteLimit: number | null;
  warmupEnabled: boolean;
  warmupStartPerMinute: number;
  warmupStep: number;
  warmupIntervalMinutes: number;
  warmupMaxPerMinute: number;
  trackOpens: boolean;
  trackClicks: boolean;
  trackReplies: boolean;
  totalRecipients: number;
  queuedCount: number;
  sentCount: number;
  failedCount: number;
  openedCount: number;
  clickedCount: number;
  repliedCount: number;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
};

type CampaignRecipientRow = {
  id: string;
  email: string;
  name: string | null;
  status: "pending" | "queued" | "sending" | "sent" | "failed" | "skipped";
  lastError: string | null;
  sentAt: string | null;
  openedAt: string | null;
  openCount: number;
  clickedAt: string | null;
  clickCount: number;
  repliedAt: string | null;
  replyCount: number;
};

type CampaignAttachmentRow = {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  createdAt: string;
};

type CampaignResponse = {
  data: CampaignSummary;
  recipients: CampaignRecipientRow[];
  attachments: CampaignAttachmentRow[];
  nextCursor: string | null;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function statusBadge(status: CampaignSummary["status"]) {
  const label = status.replace("_", " ");
  if (status === "completed") return { label, className: "badge green" };
  if (status === "running") return { label, className: "badge green" };
  if (status === "paused") return { label, className: "badge yellow" };
  if (status === "failed" || status === "cancelled") return { label, className: "badge red" };
  return { label, className: "badge" };
}

function recipientBadge(status: CampaignRecipientRow["status"]) {
  if (status === "sent") return { label: "Sent", className: "badge green" };
  if (status === "failed") return { label: "Failed", className: "badge red" };
  if (status === "sending") return { label: "Sending", className: "badge yellow" };
  if (status === "queued") return { label: "Queued", className: "badge" };
  if (status === "pending") return { label: "Pending", className: "badge" };
  return { label: status, className: "badge" };
}

export function CampaignDetailClient({ campaignId }: { campaignId: string }) {
  const [campaign, setCampaign] = useState<CampaignSummary | null>(null);
  const [recipients, setRecipients] = useState<CampaignRecipientRow[]>([]);
  const [attachments, setAttachments] = useState<CampaignAttachmentRow[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [actioning, setActioning] = useState(false);
  const [showTrackingWarning, setShowTrackingWarning] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  async function loadCampaign(cursor?: string) {
    if (cursor) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError("");
    try {
      const query = cursor ? `?limit=200&cursor=${cursor}` : "?limit=200";
      const res = await browserApi<CampaignResponse>(
        `/admin/v1/campaigns/${campaignId}${query}`,
        { cache: "no-store" }
      );
      setCampaign(res.data);
      setNextCursor(res.nextCursor);
      setRecipients((prev) => (cursor ? [...prev, ...res.recipients] : res.recipients));
      if (!cursor) {
        setAttachments(res.attachments ?? []);
      }
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
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    void loadCampaign();
  }, [campaignId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const host = window.location.hostname;
    const isLocal =
      host === "localhost" || host === "127.0.0.1" || host === "::1";
    setShowTrackingWarning(isLocal);
  }, []);

  const rows = useMemo(() => recipients, [recipients]);

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
            <Link className="nav-link" href="/dashboard/bulk-email">
              &lt;- Back to campaigns
            </Link>
            <h1 style={{ marginTop: 12 }}>{campaign?.name ?? "Campaign"}</h1>
            <p className="muted">
              View delivery progress, engagement tracking, and recipient status.
            </p>
          </div>
          {campaign ? (
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <span className={statusBadge(campaign.status).className}>
                {statusBadge(campaign.status).label}
              </span>
              {campaign.status === "running" ? (
                <button
                  className="btn small secondary"
                  type="button"
                  disabled={actioning}
                  onClick={async () => {
                    setActioning(true);
                    try {
                      await browserApi(`/admin/v1/campaigns/${campaign.id}/pause`, {
                        method: "POST",
                        csrf: true
                      });
                      await loadCampaign();
                      toast({
                        variant: "success",
                        title: "Campaign paused"
                      });
                    } catch (err) {
                      const { message, isAuth } = parseApiError(err);
                      toast({
                        variant: "error",
                        title: isAuth ? "Session expired" : "Campaign pause unsuccessful",
                        description: message
                      });
                    } finally {
                      setActioning(false);
                    }
                  }}
                >
                  {actioning ? "Pausing..." : "Pause"}
                </button>
              ) : (
                <button
                  className="btn small"
                  type="button"
                  disabled={actioning || campaign.totalRecipients === 0}
                  onClick={async () => {
                    setActioning(true);
                    try {
                      await browserApi(`/admin/v1/campaigns/${campaign.id}/start`, {
                        method: "POST",
                        csrf: true
                      });
                      await loadCampaign();
                      toast({
                        variant: "success",
                        title: "Campaign started"
                      });
                    } catch (err) {
                      const { message, isAuth } = parseApiError(err);
                      toast({
                        variant: "error",
                        title: isAuth ? "Session expired" : "Campaign start unsuccessful",
                        description: message
                      });
                    } finally {
                      setActioning(false);
                    }
                  }}
                >
                  {actioning ? "Starting..." : "Start"}
                </button>
              )}
            </div>
          ) : null}
        </div>
        {error ? (
          <p className="muted" style={{ marginTop: 10, color: "#9f1a1a" }}>
            {error}
          </p>
        ) : null}
        {showTrackingWarning ? (
          <p className="muted" style={{ marginTop: 10 }}>
            Tracking is disabled on localhost. To test opens/clicks in dev, set
            `APP_TRACKING_BASE_URL` to a public URL (ngrok/cloudflared) and
            restart the worker.
          </p>
        ) : null}
      </section>

      {campaign ? (
        <section className="panel" style={{ marginTop: 16 }}>
          <h2>Campaign Overview</h2>
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              marginTop: 12
            }}
          >
            <div>
              <div className="muted text-xs">Sender</div>
              <div>{campaign.senderLabel}</div>
            </div>
            <div>
              <div className="muted text-xs">Template</div>
              <div>{campaign.template?.name ?? "Custom content"}</div>
            </div>
            <div>
              <div className="muted text-xs">Per Minute Limit</div>
              <div>{campaign.perMinuteLimit ?? "Default"}</div>
            </div>
            <div>
              <div className="muted text-xs">Warmup</div>
              <div>{campaign.warmupEnabled ? "Enabled" : "Disabled"}</div>
            </div>
            <div>
              <div className="muted text-xs">Tracking</div>
              <div>
                Opens: {campaign.trackOpens ? "On" : "Off"} | Clicks:{" "}
                {campaign.trackClicks ? "On" : "Off"} | Replies:{" "}
                {campaign.trackReplies ? "On" : "Off"}
              </div>
            </div>
            <div>
              <div className="muted text-xs">Totals</div>
              <div>
                {campaign.totalRecipients} total | {campaign.sentCount} sent |{" "}
                {campaign.failedCount} failed
              </div>
            </div>
            <div>
              <div className="muted text-xs">Engagement</div>
              <div>
                {campaign.openedCount} opened | {campaign.clickedCount} clicked |{" "}
                {campaign.repliedCount} replied
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {attachments.length ? (
        <section className="panel" style={{ marginTop: 16 }}>
          <h2>Attachments</h2>
          <p className="muted">
            These files are attached to every email sent by this campaign.
          </p>
          <ul style={{ marginTop: 10, paddingLeft: 0, listStyle: "none" }}>
            {attachments.map((attachment) => (
              <li
                key={attachment.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "6px 0",
                  borderBottom: "1px solid rgba(0,0,0,0.08)"
                }}
              >
                <span style={{ flex: 1 }}>
                  {attachment.filename}{" "}
                  <span className="muted" style={{ fontSize: 12 }}>
                    ({formatBytes(attachment.size)} - {attachment.contentType})
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="panel" style={{ marginTop: 16 }}>
        <h2>Recipients</h2>
        <div className="table-wrap">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Opened</TableHead>
                <TableHead>Clicked</TableHead>
                <TableHead>Replied</TableHead>
                <TableHead>Last Error</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 6 }).map((_, idx) => (
                    <TableRow key={`recipient-skeleton-${idx}`}>
                      <TableCell>
                        <div className="skeleton" style={{ height: 12, width: 180 }} />
                      </TableCell>
                      <TableCell>
                        <div className="skeleton" style={{ height: 18, width: 70 }} />
                      </TableCell>
                      <TableCell>
                        <div className="skeleton" style={{ height: 12, width: 60 }} />
                      </TableCell>
                      <TableCell>
                        <div className="skeleton" style={{ height: 12, width: 60 }} />
                      </TableCell>
                      <TableCell>
                        <div className="skeleton" style={{ height: 12, width: 60 }} />
                      </TableCell>
                      <TableCell>
                        <div className="skeleton" style={{ height: 12, width: 180 }} />
                      </TableCell>
                    </TableRow>
                  ))
                : rows.length === 0
                ? (
                    <TableRow>
                      <TableCell colSpan={6}>No recipients yet.</TableCell>
                    </TableRow>
                  )
                : rows.map((recipient) => {
                    const badge = recipientBadge(recipient.status);
                    return (
                      <TableRow key={recipient.id}>
                        <TableCell>
                          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            <span>{recipient.email}</span>
                            {recipient.name ? (
                              <span className="muted text-xs">{recipient.name}</span>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={badge.className}>{badge.label}</span>
                        </TableCell>
                        <TableCell>
                          {recipient.openedAt ? `Yes (${recipient.openCount})` : "No"}
                        </TableCell>
                        <TableCell>
                          {recipient.clickedAt ? `Yes (${recipient.clickCount})` : "No"}
                        </TableCell>
                        <TableCell>
                          {recipient.repliedAt ? `Yes (${recipient.replyCount})` : "No"}
                        </TableCell>
                        <TableCell>{recipient.lastError ?? "-"}</TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </div>
        {nextCursor ? (
          <div style={{ marginTop: 12 }}>
            <button
              className="btn small secondary"
              type="button"
              onClick={() => void loadCampaign(nextCursor)}
              disabled={loadingMore}
            >
              {loadingMore ? "Loading..." : "Load more"}
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
