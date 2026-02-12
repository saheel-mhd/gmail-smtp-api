import {
  TestApiClient,
  type ApiKeyRow,
  type Sender
} from "../../../components/dashboard/test-api-client";
import { serverApi } from "../../../lib/server-api";

type SenderResponse = { data: Sender[] };
type ApiKeyResponse = { data: ApiKeyRow[] };

export default async function TestApiPage() {
  let initialSenders: Sender[] = [];
  let initialApiKeys: ApiKeyRow[] = [];
  let initialError = "";

  try {
    const [senderRes, keyRes] = await Promise.all([
      serverApi<SenderResponse>("/admin/v1/senders", { cacheTtlMs: 8000 }),
      serverApi<ApiKeyResponse>("/admin/v1/api-keys", { cacheTtlMs: 8000 })
    ]);
    initialSenders = senderRes.data.filter(
      (sender) => sender.status === "active" && sender.type === "gmail"
    );
    initialApiKeys = keyRes.data.filter((key) => key.status === "active");
  } catch (err) {
    initialError = (err as Error).message || "Failed to load test data.";
  }

  return (
    <TestApiClient
      initialSenders={initialSenders}
      initialApiKeys={initialApiKeys}
      initialError={initialError}
    />
  );
}
