import { z } from "zod";

export const domainSchema = z.object({
  domain: z
    .string()
    .min(3)
    .max(255)
    .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  smtpHost: z.string().min(3).max(255).optional(),
  smtpPort: z.number().int().min(1).max(65535).optional(),
  smtpSecure: z.boolean().optional()
});

export const patchDomainSchema = z.object({
  smtpHost: z.string().min(3).max(255),
  smtpPort: z.number().int().min(1).max(65535),
  smtpSecure: z.boolean()
});
