import { FastifyInstance } from "fastify";
import { authenticateUserSession } from "../../plugins/security";
import {
  createDomainController,
  listDomainsController,
  updateDomainController,
  verifyDomainController
} from "../../controllers/admin/domains.controller";
import { mutatingPreHandlers } from "./route-helpers";

export async function registerDomainRoutes(app: FastifyInstance): Promise<void> {
  app.get("/admin/v1/domains", { preHandler: [authenticateUserSession] }, listDomainsController);
  app.post(
    "/admin/v1/domains",
    { preHandler: [...mutatingPreHandlers] },
    createDomainController
  );
  app.patch(
    "/admin/v1/domains/:id",
    { preHandler: [...mutatingPreHandlers] },
    updateDomainController
  );
  app.post(
    "/admin/v1/domains/:id/verify",
    { preHandler: [...mutatingPreHandlers] },
    verifyDomainController
  );
}
