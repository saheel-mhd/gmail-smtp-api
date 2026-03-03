import {
  EmailLogsClient,
  type EmailLogRow
} from "../../../../components/dashboard/email-logs-client";
import { serverApi } from "../../../../lib/server-api";

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
    initialError = (err as Error).message || "Failed to load email logs.";
  }

  return <EmailLogsClient initialLogs={initialLogs} initialError={initialError} />;
}
