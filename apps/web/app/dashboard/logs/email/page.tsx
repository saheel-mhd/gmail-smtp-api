import {
  EmailLogsClient,
  type EmailLogRow
} from "../../../../components/dashboard/email-logs-client";
import { serverApi } from "../../../../lib/server-api";
import { parseApiError } from "../../../../lib/api-errors";

type EmailLogsResponse = { data: EmailLogRow[] };

export default async function EmailLogsPage() {
  let initialLogs: EmailLogRow[] = [];
  let initialError = "";
  try {
    const data = await serverApi<EmailLogsResponse>("/admin/v1/email-logs?limit=100", {
      cacheTtlMs: 5000
    });
    initialLogs = data.data;
  } catch (err) {
    const parsed = parseApiError(err);
    initialError = parsed.message;
  }

  return <EmailLogsClient initialLogs={initialLogs} initialError={initialError} />;
}
