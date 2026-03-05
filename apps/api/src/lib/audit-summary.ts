type AuditMetadata = Record<string, unknown> | null;

function isPrivateIp(ip: string): boolean {
  const cleaned = ip.trim();
  if (!cleaned) return true;
  if (cleaned === "::1") return true;
  const lower = cleaned.toLowerCase();
  if (lower.startsWith("fc") || lower.startsWith("fd") || lower.startsWith("fe80")) {
    return true;
  }
  if (cleaned.includes(".")) {
    const parts = cleaned.split(".").map((part) => Number(part));
    if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) return true;
    const [a, b] = parts;
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 192 && b === 168) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 169 && b === 254) return true;
  }
  return false;
}

function getString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function buildSummary(action: string, actorName: string, metadata: AuditMetadata) {
  const senderLabel = getString(metadata?.senderLabel);
  const apiKeyName = getString(metadata?.apiKeyName);
  const templateName = getString(metadata?.templateName);
  const status = getString(metadata?.status);
  const reason = getString(metadata?.reason);
  const path = getString(metadata?.path);
  const apiKeyPrefix = getString(metadata?.apiKeyPrefix);
  const fields = Array.isArray(metadata?.fields)
    ? metadata?.fields.filter((field) => typeof field === "string")
    : null;
  const statusChanged = fields ? fields.includes("status") : false;
  const senderText = senderLabel ? `Sender ${senderLabel}` : "Sender";
  const apiKeyText = apiKeyName ? `API key ${apiKeyName}` : "API key";
  const templateText = templateName ? `Template ${templateName}` : "Template";
  const fieldLabels: Record<string, string> = {
    label: "name",
    perDayLimit: "per-day limit",
    status: "status",
    name: "name",
    subject: "subject",
    html: "html",
    text: "text"
  };
  const changeDetails =
    fields && fields.length
      ? fields
          .map((field) => fieldLabels[field] ?? field)
          .filter((field) => field !== "status")
          .join(", ")
      : "";

  switch (action) {
    case "system.worker.started":
      return "Worker started by System";
    case "system.worker.stopped":
      return "Worker stopped by System";
    case "system.api.started":
      return "API started by System";
    case "system.api.stopped":
      return "API stopped by System";
    case "security.api_key.rejected": {
      const reasonText = reason ? ` (${reason})` : "";
      const pathText = path ? ` on ${path}` : "";
      const prefixText = apiKeyPrefix ? ` [${apiKeyPrefix}]` : "";
      return `API key rejected${reasonText}${pathText}${prefixText}`;
    }
    case "admin.auth.login":
      return `${actorName} signed in`;
    case "admin.auth.logout":
      return `${actorName} signed out`;
    case "admin.auth.register":
      return `${actorName} registered`;
    case "admin.sender.create":
      return `${senderText} created by ${actorName}`;
    case "admin.sender.update":
      if (statusChanged && status === "active") {
        return `${senderText} activated by ${actorName}`;
      }
      if (statusChanged && status === "disabled") {
        return `${senderText} deactivated by ${actorName}`;
      }
      if (changeDetails) {
        return `${senderText} updated (${changeDetails}) by ${actorName}`;
      }
      return `${senderText} updated by ${actorName}`;
    case "admin.sender.disable":
      return `${senderText} deactivated by ${actorName}`;
    case "admin.sender.test_send":
      return `${senderText} test email sent by ${actorName}`;
    case "admin.api_key.create":
      return `${apiKeyText} created by ${actorName}`;
    case "admin.api_key.rotate":
      return `${apiKeyText} rotated by ${actorName}`;
    case "admin.api_key.revoke":
      return `${apiKeyText} revoked by ${actorName}`;
    case "admin.template.create":
      return `${templateText} created by ${actorName}`;
    case "admin.template.update":
      if (statusChanged && status === "active") {
        return `${templateText} activated by ${actorName}`;
      }
      if (statusChanged && status === "disabled") {
        return `${templateText} deactivated by ${actorName}`;
      }
      if (changeDetails) {
        return `${templateText} updated (${changeDetails}) by ${actorName}`;
      }
      return `${templateText} updated by ${actorName}`;
    case "admin.template.disable":
      return `${templateText} deactivated by ${actorName}`;
    case "admin.test_api.send":
      return senderLabel
        ? `Test email queued by ${actorName} using ${senderLabel}`
        : `Test email queued by ${actorName}`;
    default:
      return `Audit event recorded by ${actorName}`;
  }
}

export function formatAuditLogs(
  logs: Array<{
    id: string;
    action: string;
    actorType: "user" | "api_key" | "system";
    actorId: string;
    ip: string | null;
    createdAt: Date;
    metadata: unknown;
  }>,
  userNameById: Map<string, string>,
  apiKeyNameById: Map<string, string>
) {
  return logs.map((entry) => {
    const actorName =
      entry.actorType === "system"
        ? "System"
        : entry.actorType === "api_key"
        ? apiKeyNameById.get(entry.actorId) ?? "API Key"
        : userNameById.get(entry.actorId) ?? "User";

    const ip = entry.ip && !isPrivateIp(entry.ip) ? entry.ip : null;
    const metadata =
      entry.metadata && typeof entry.metadata === "object"
        ? (entry.metadata as Record<string, unknown>)
        : null;

    return {
      id: entry.id,
      action: entry.action,
      actorType: entry.actorType,
      actorName,
      ip,
      createdAt: entry.createdAt,
      summary: buildSummary(entry.action, actorName, metadata)
    };
  });
}
