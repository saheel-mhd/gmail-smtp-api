import { z } from "zod";

export const testApiSendSchema = z.object({
  apiKeyId: z.string().min(1),
  toEmail: z.string().email(),
  subject: z.string().min(1).max(250).optional(),
  templateName: z.string().min(1).max(80).optional()
});
