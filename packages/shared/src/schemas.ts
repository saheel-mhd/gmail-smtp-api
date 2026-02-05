import { z } from "zod";

export const headersSchema = z
  .record(z.string().min(1).max(100), z.string().max(500))
  .optional()
  .default({});

export const recipientSchema = z.string().email().max(320);

export const sendRequestSchema = z.object({
  senderId: z.string().min(1),
  idempotencyKey: z.string().min(8).max(120),
  to: z.array(recipientSchema).min(1).max(10),
  cc: z.array(recipientSchema).max(10).optional().default([]),
  bcc: z.array(recipientSchema).max(10).optional().default([]),
  subject: z.string().min(1).max(250),
  text: z.string().max(100000).optional(),
  html: z.string().max(100000).optional(),
  fromName: z.string().max(120).optional(),
  replyTo: recipientSchema.optional(),
  headers: headersSchema
});

export const createSenderSchema = z.object({
  label: z.string().min(1).max(80),
  gmailAddress: z.string().email(),
  appPassword: z.string().min(8).max(128),
  perMinuteLimit: z.number().int().positive().max(10000).optional(),
  perDayLimit: z.number().int().positive().max(1000000).optional()
});

export const patchSenderSchema = z.object({
  label: z.string().min(1).max(80).optional(),
  status: z.enum(["active", "disabled", "needs_attention"]).optional(),
  perMinuteLimit: z.number().int().positive().max(10000).optional(),
  perDayLimit: z.number().int().positive().max(1000000).optional()
});

export const createApiKeySchema = z.object({
  name: z.string().min(1).max(80),
  smtpAccountIds: z.array(z.string().min(1)).min(1),
  rateLimitPerMinute: z.number().int().positive().max(10000).optional(),
  allowedIps: z.array(z.string().max(64)).optional().default([])
});

export type SendRequest = z.infer<typeof sendRequestSchema>;
export type CreateSenderInput = z.infer<typeof createSenderSchema>;
export type PatchSenderInput = z.infer<typeof patchSenderSchema>;
export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
