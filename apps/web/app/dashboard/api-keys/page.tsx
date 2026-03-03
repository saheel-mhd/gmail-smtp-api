import {
  ApiKeysClient,
  type ApiKeyRow,
  type Sender
} from "../../../components/dashboard/api-keys-client";
import { serverApi } from "../../../lib/server-api";
import { parseApiError } from "../../../lib/api-errors";

type ApiKeyResponse = { data: ApiKeyRow[] };
type SenderResponse = { data: Sender[] };

export default async function ApiKeysPage() {
  let initialKeys: ApiKeyRow[] = [];
  let initialSenders: Sender[] = [];
  let initialError = "";

  try {
    const [keyResponse, senderResponse] = await Promise.all([
      serverApi<ApiKeyResponse>("/admin/v1/api-keys", { cacheTtlMs: 8000 }),
      serverApi<SenderResponse>("/admin/v1/senders", { cacheTtlMs: 8000 })
    ]);
    initialKeys = keyResponse.data;
    initialSenders = senderResponse.data;
  } catch (err) {
    const parsed = parseApiError(err);
    initialError = parsed.message;
  }

  return (
    <ApiKeysClient
      initialKeys={initialKeys}
      initialSenders={initialSenders}
      initialError={initialError}
    />
  );
}
