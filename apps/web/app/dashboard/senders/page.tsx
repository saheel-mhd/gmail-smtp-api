import { SendersClient, type Sender } from "../../../components/dashboard/senders-client";
import { serverApi } from "../../../lib/server-api";

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
    initialError = (err as Error).message || "Failed to load senders.";
  }

  return <SendersClient initialSenders={initialSenders} initialError={initialError} />;
}
