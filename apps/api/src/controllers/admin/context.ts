import { authenticateUserSession } from "../../plugins/security";

export type AuthenticatedRequest = Parameters<typeof authenticateUserSession>[0];

export function getUserContext(request: AuthenticatedRequest) {
  if (!request.actor || request.actor.actorType !== "user") {
    throw new Error("missing user context");
  }
  return request.actor;
}
