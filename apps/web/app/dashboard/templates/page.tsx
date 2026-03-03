import {
  TemplatesClient,
  type TemplateRow
} from "../../../components/dashboard/templates-client";
import { serverApi } from "../../../lib/server-api";

type TemplateResponse = { data: TemplateRow[] };

export default async function DashboardTemplatesPage() {
  let initialTemplates: TemplateRow[] = [];
  let initialError = "";
  try {
    const res = await serverApi<TemplateResponse>("/admin/v1/templates", { cacheTtlMs: 8000 });
    initialTemplates = res.data;
  } catch (err) {
    initialError = (err as Error).message || "Failed to load templates.";
  }

  return (
    <TemplatesClient initialTemplates={initialTemplates} initialError={initialError} />
  );
}
