import { SendersClient, type Sender } from "../../../components/dashboard/senders-client";
import { serverApi } from "../../../lib/server-api";
import { parseApiError } from "../../../lib/api-errors";

type SenderResponse = { data: Sender[] };

export default async function SendersPage() {
  let initialSenders: Sender[] = [];
  let initialError = "";
  try {
    const response = await serverApi<SenderResponse>("/admin/v1/senders", {
      cacheTtlMs: 8000
    });
    initialSenders = response.data;
  } catch (err) {
    const parsed = parseApiError(err);
    initialError = parsed.message;
  }

  return <SendersClient initialSenders={initialSenders} initialError={initialError} />;
}
