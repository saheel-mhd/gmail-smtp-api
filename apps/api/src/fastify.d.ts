import { ActorContext } from "./types";

declare module "fastify" {
  interface FastifyRequest {
    actor?: ActorContext;
  }
}
