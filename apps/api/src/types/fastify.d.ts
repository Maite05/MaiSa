import "fastify";
import type { AuthenticatedUser, OrgContext } from "@maisa/types";

declare module "fastify" {
  interface FastifyRequest {
    authUser?: AuthenticatedUser;
    orgContext?: OrgContext;
  }
}
