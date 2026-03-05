import { authenticateUserSession, enforceCsrf, requireRole } from "../../plugins/security";

export const mutatingPreHandlers = [
  authenticateUserSession,
  enforceCsrf,
  requireRole("owner", "admin")
] as const;
