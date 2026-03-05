import { FastifyInstance } from "fastify";
import { registerApiKeyRoutes } from "./api-keys.routes";
import { registerAuthRoutes } from "./auth.routes";
import { registerCompanyRoutes } from "./company.routes";
import { registerDomainRoutes } from "./domains.routes";
import { registerLogRoutes } from "./logs.routes";
import { registerSenderRoutes } from "./senders.routes";
import { registerTemplateRoutes } from "./templates.routes";
import { registerTestApiRoutes } from "./test-api.routes";

export async function registerAdminRoutes(app: FastifyInstance): Promise<void> {
  await registerAuthRoutes(app);
  await registerCompanyRoutes(app);
  await registerDomainRoutes(app);
  await registerTestApiRoutes(app);
  await registerSenderRoutes(app);
  await registerTemplateRoutes(app);
  await registerApiKeyRoutes(app);
  await registerLogRoutes(app);
}
