import { CampaignDetailClient } from "../../../../components/dashboard/campaign-detail-client";

export default async function CampaignDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CampaignDetailClient campaignId={id} />;
}
