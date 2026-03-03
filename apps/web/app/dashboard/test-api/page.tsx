import {
  TestApiClient,
  type ApiKeyRow,
  type Sender,
  type TemplateRow
} from "../../../components/dashboard/test-api-client";
import { serverApi } from "../../../lib/server-api";
import { parseApiError } from "../../../lib/api-errors";

type SenderResponse = { data: Sender[] };
type ApiKeyResponse = { data: ApiKeyRow[] };
type TemplateResponse = { data: TemplateRow[] };

export default async function TestApiPage() {
  let initialSenders: Sender[] = [];
  let initialApiKeys: ApiKeyRow[] = [];
  let initialTemplates: TemplateRow[] = [];
  let initialError = "";

  try {
    const [senderRes, keyRes, templateRes] = await Promise.all([
      serverApi<SenderResponse>("/admin/v1/senders", { cacheTtlMs: 8000 }),
      serverApi<ApiKeyResponse>("/admin/v1/api-keys", { cacheTtlMs: 8000 }),
      serverApi<TemplateResponse>("/admin/v1/templates", { cacheTtlMs: 8000 })
    ]);
    initialSenders = senderRes.data.filter((sender) => sender.status === "active");
    initialApiKeys = keyRes.data.filter((key) => key.status === "active");
    initialTemplates = templateRes.data.filter((template) => template.status === "active");
  } catch (err) {
    const parsed = parseApiError(err);
    initialError = parsed.message;
  }

  return (
    <TestApiClient
      initialSenders={initialSenders}
      initialApiKeys={initialApiKeys}
      initialTemplates={initialTemplates}
      initialError={initialError}
    />
  );
}
