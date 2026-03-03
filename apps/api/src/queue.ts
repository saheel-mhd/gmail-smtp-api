import { Queue } from "bullmq";
import { redis } from "./lib/redis";

export const SEND_QUEUE_NAME = "send_email_jobs";
export const CAMPAIGN_QUEUE_NAME = "campaign_dispatch_jobs";

export type SendEmailJob = {
  messageId: string;
};

let queue: Queue<SendEmailJob> | null = null;
export type CampaignDispatchJob = {
  campaignId: string;
};
let campaignQueue: Queue<CampaignDispatchJob> | null = null;

export function getSendQueue(): Queue<SendEmailJob> {
  if (queue) return queue;
  queue = new Queue<SendEmailJob>(SEND_QUEUE_NAME, {
    connection: redis,
    defaultJobOptions: {
      attempts: 5,
      removeOnComplete: 1000,
      removeOnFail: 1000,
      backoff: { type: "custom" }
    }
  });
  return queue;
}

export function getCampaignQueue(): Queue<CampaignDispatchJob> {
  if (campaignQueue) return campaignQueue;
  campaignQueue = new Queue<CampaignDispatchJob>(CAMPAIGN_QUEUE_NAME, {
    connection: redis,
    defaultJobOptions: {
      attempts: 1,
      removeOnComplete: 1000,
      removeOnFail: 1000
    }
  });
  return campaignQueue;
}

export async function closeSendQueue(): Promise<void> {
  if (!queue) return;
  await queue.close();  
  queue = null;
}

export const retryDelaysMs = [30_000, 120_000, 600_000, 1_800_000, 7_200_000];
