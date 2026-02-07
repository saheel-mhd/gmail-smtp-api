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
  subject: z.string().min(1).max(250).optional(),
  text: z.string().max(100000).optional(),
  html: z.string().max(100000).optional(),
  templateId: z.string().min(1).optional(),
  variables: z
    .record(z.string().min(1), z.union([z.string(), z.number(), z.boolean()]))
    .optional()
    .default({}),
  fromName: z.string().max(120).optional(),
  replyTo: recipientSchema.optional(),
  headers: headersSchema
}).refine(
  (data) => {
    if (data.templateId) {
      return !data.subject && !data.text && !data.html;
    }
    return Boolean(data.subject) && Boolean(data.text || data.html);
  },
  {
    message:
      "When templateId is provided, omit subject/text/html. Otherwise subject and one of text or html are required."
  }
);

export const createTemplateSchema = z.object({
  name: z.string().min(1).max(80),
  subject: z.string().min(1).max(250),
  html: z.string().min(1).max(100000),
  text: z.string().max(100000).optional().nullable()
});

export const patchTemplateSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  subject: z.string().min(1).max(250).optional(),
  html: z.string().min(1).max(100000).optional(),
  text: z.string().max(100000).optional().nullable(),
  status: z.enum(["active", "disabled"]).optional()
});

export const createSenderSchema = z.object({
  label: z.string().min(1).max(80),
  gmailAddress: z.string().email(),
  appPassword: z.string().min(8).max(128),
  perDayLimit: z.number().int().positive().max(1000000).optional()
});

export const patchSenderSchema = z.object({
  label: z.string().min(1).max(80).optional(),
  status: z.enum(["active", "disabled", "needs_attention"]).optional(),
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
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type PatchTemplateInput = z.infer<typeof patchTemplateSchema>;
