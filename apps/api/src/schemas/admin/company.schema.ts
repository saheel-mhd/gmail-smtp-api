import { z } from "zod";

const blockedCompanyDomains = new Set([
  "gmail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "yahoo.in"
]);

export const companySchema = z.object({
  name: z.string().min(1).max(120),
  service: z.string().min(1).max(120),
  phone: z.string().min(3).max(40),
  email: z.string().email().max(160),
  address: z.string().min(3).max(240),
  website: z.string().max(200).optional()
});

export function isBlockedCompanyEmail(email: string) {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain ? blockedCompanyDomains.has(domain) : false;
}
