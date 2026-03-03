import {
  SystemLogsClient,
  type SystemLogRow
} from "../../../../components/dashboard/system-logs-client";
import { serverApi } from "../../../../lib/server-api";
import { parseApiError } from "../../../../lib/api-errors";

type SystemLogsResponse = { data: SystemLogRow[] };

export default async function SystemLogsPage() {
  let initialLogs: SystemLogRow[] = [];
  let initialError = "";
  try {
    const data = await serverApi<SystemLogsResponse>("/admin/v1/system-logs?limit=100", {
      cacheTtlMs: 5000
    });
    initialLogs = data.data;
  } catch (err) {
    const parsed = parseApiError(err);
    initialError = parsed.message;
  }

  return <SystemLogsClient initialLogs={initialLogs} initialError={initialError} />;
}
