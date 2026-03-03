import {
  ActionLogsClient,
  type AuditRow
} from "../../../../components/dashboard/action-logs-client";
import { serverApi } from "../../../../lib/server-api";
import { parseApiError } from "../../../../lib/api-errors";

type LogsResponse = { data: AuditRow[] };

export default async function ActionLogsPage() {
  let initialLogs: AuditRow[] = [];
  let initialError = "";
  try {
    const data = await serverApi<LogsResponse>("/admin/v1/logs?limit=100", {
      cacheTtlMs: 5000
    });
    initialLogs = data.data;
  } catch (err) {
    const parsed = parseApiError(err);
    initialError = parsed.message;
  }

  return <ActionLogsClient initialLogs={initialLogs} initialError={initialError} />;
}
