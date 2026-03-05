import { z } from "zod";

export const headersSchema = z
  .record(z.string().min(1).max(100), z.string().max(500))
  .optional()
  .default({});

export const recipientSchema = z.string().email().max(320);

export const sendRequestSchema = z.object({
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

export const templateSendSchema = z.object({
  idempotencyKey: z.string().min(8).max(120),
  to: z.array(recipientSchema).min(1).max(10),
  cc: z.array(recipientSchema).max(10).optional().default([]),
  bcc: z.array(recipientSchema).max(10).optional().default([]),
  variables: z
    .record(z.string().min(1), z.union([z.string(), z.number(), z.boolean()]))
    .optional()
    .default({}),
  fromName: z.string().max(120).optional(),
  replyTo: recipientSchema.optional(),
  headers: headersSchema
});

const templateNameSchema = z
  .string()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9-]+$/, "Template name must be URL-safe (lowercase letters, numbers, hyphens).");

export const createTemplateSchema = z.object({
  name: templateNameSchema,
  subject: z.string().min(1).max(250),
  html: z.string().min(1).max(100000),
  text: z.string().max(100000).optional().nullable()
});

export const patchTemplateSchema = z.object({
  name: templateNameSchema.optional(),
  subject: z.string().min(1).max(250).optional(),
  html: z.string().min(1).max(100000).optional(),
  text: z.string().max(100000).optional().nullable(),
  status: z.enum(["active", "disabled"]).optional()
});

const gmailSenderSchema = z.object({
  type: z.literal("gmail"),
  label: z.string().min(1).max(80),
  gmailAddress: z.string().email(),
  appPassword: z.string().min(8).max(128),
  perDayLimit: z.number().int().positive().max(1000000).optional()
});

const domainSenderSchema = z.object({
  type: z.literal("domain"),
  label: z.string().min(1).max(80),
  domainId: z.string().min(1),
  emailAddress: z.string().email(),
  username: z.string().min(1).max(160),
  password: z.string().min(4).max(128),
  perDayLimit: z.number().int().positive().max(1000000).optional()
});

export const createSenderSchema = z.discriminatedUnion("type", [
  gmailSenderSchema,
  domainSenderSchema
]);

export const patchSenderSchema = z.object({
  label: z.string().min(1).max(80).optional(),
  status: z.enum(["active", "disabled", "needs_attention"]).optional(),
  perDayLimit: z.number().int().positive().max(1000000).optional(),
  password: z.string().min(4).max(128).optional()
});

export const createApiKeySchema = z
  .object({
    name: z.string().min(1).max(80),
    smtpAccountIds: z.array(z.string().min(1)).optional().default([]),
    domainSenderIds: z.array(z.string().min(1)).optional().default([]),
    rateLimitPerMinute: z.number().int().positive().max(10000).optional(),
    allowedIps: z.array(z.string().max(64)).optional().default([])
  })
  .refine(
    (data) => data.smtpAccountIds.length + data.domainSenderIds.length === 1,
    { message: "exactly one sender must be selected" }
  );

export const createCampaignSchema = z
  .object({
    name: z.string().min(1).max(120),
    senderType: z.enum(["gmail", "domain"]),
    senderId: z.string().min(1),
    templateId: z.string().min(1).optional(),
    subject: z.string().min(1).max(250).optional(),
    html: z.string().max(100000).optional(),
    text: z.string().max(100000).optional(),
    fromName: z.string().max(120).optional(),
    replyTo: recipientSchema.optional(),
    headers: headersSchema,
    perMinuteLimit: z.number().int().positive().max(10000).optional(),
    warmupEnabled: z.boolean().optional(),
    warmupStartPerMinute: z.number().int().positive().max(10000).optional(),
    warmupStep: z.number().int().positive().max(10000).optional(),
    warmupIntervalMinutes: z.number().int().positive().max(1440).optional(),
    warmupMaxPerMinute: z.number().int().positive().max(10000).optional(),
    trackOpens: z.boolean().optional(),
    trackClicks: z.boolean().optional(),
    trackReplies: z.boolean().optional()
  })
  .refine(
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

export const campaignRecipientsSchema = z.object({
  recipients: z
    .array(
      z.object({
        email: recipientSchema,
        name: z.string().max(120).optional(),
        variables: z
          .record(z.string().min(1), z.union([z.string(), z.number(), z.boolean()]))
          .optional()
          .default({})
      })
    )
    .min(1)
    .max(5000)
});

export type SendRequest = z.infer<typeof sendRequestSchema>;
export type TemplateSendRequest = z.infer<typeof templateSendSchema>;
export type CreateSenderInput = z.infer<typeof createSenderSchema>;
export type PatchSenderInput = z.infer<typeof patchSenderSchema>;
export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type PatchTemplateInput = z.infer<typeof patchTemplateSchema>;
export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type CampaignRecipientsInput = z.infer<typeof campaignRecipientsSchema>;
