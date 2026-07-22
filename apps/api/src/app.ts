import fastifyCompress from "@fastify/compress";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifySensible from "@fastify/sensible";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { env } from "@maisa/config";
import Fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

import { registerErrorHandler } from "./lib/error-handler";
import { authenticate, resolveOrganization } from "./lib/hooks";
import { authRoutes } from "./modules/auth/auth.routes";
import { budgetRoutes } from "./modules/budget/budget.routes";
import { clientsRoutes } from "./modules/clients/clients.routes";
import { contractsRoutes } from "./modules/contracts/contracts.routes";
import { documentsRoutes } from "./modules/documents/documents.routes";
import { eventsRoutes } from "./modules/events/events.routes";
import { guestsRoutes } from "./modules/guests/guests.routes";
import { invoicesRoutes } from "./modules/invoices/invoices.routes";
import { organizationsRoutes } from "./modules/organizations/organizations.routes";
import { tasksRoutes } from "./modules/tasks/tasks.routes";
import { timelineRoutes } from "./modules/timeline/timeline.routes";

export function buildApp() {
  const app = Fastify({
    logger: {
      transport: env.NODE_ENV === "development" ? { target: "pino-pretty" } : undefined,
      level: env.NODE_ENV === "production" ? "info" : "debug",
    },
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  registerErrorHandler(app);

  app.register(fastifyHelmet);
  app.register(fastifyCors, { origin: env.CORS_ORIGIN });
  app.register(fastifyCompress);
  app.register(fastifySensible);
  app.register(fastifyRateLimit, { max: 100, timeWindow: "1 minute" });

  app.register(fastifySwagger, {
    openapi: {
      info: { title: "MaiSa API", version: "0.1.0" },
      components: {
        securitySchemes: {
          bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        },
      },
    },
    transform: jsonSchemaTransform,
  });
  app.register(fastifySwaggerUi, { routePrefix: "/docs" });

  app.get("/health", async () => ({ status: "ok" }));

  app.register(
    async (publicApi) => {
      await publicApi.register(authRoutes, { prefix: "/auth" });
    },
    { prefix: "/api/v1" },
  );

  app.register(
    async (protectedApi) => {
      protectedApi.addHook("preHandler", authenticate);
      protectedApi.addHook("preHandler", resolveOrganization);

      await protectedApi.register(organizationsRoutes, { prefix: "/organizations" });
      await protectedApi.register(clientsRoutes, { prefix: "/clients" });
      await protectedApi.register(eventsRoutes, { prefix: "/events" });
      await protectedApi.register(guestsRoutes, { prefix: "/events/:eventId/guests" });
      await protectedApi.register(contractsRoutes, { prefix: "/events/:eventId/contracts" });
      await protectedApi.register(invoicesRoutes, { prefix: "/events/:eventId/invoices" });
      await protectedApi.register(budgetRoutes, { prefix: "/events/:eventId/budget-items" });
      await protectedApi.register(tasksRoutes, { prefix: "/events/:eventId/tasks" });
      await protectedApi.register(timelineRoutes, { prefix: "/events/:eventId/timeline-items" });
      await protectedApi.register(documentsRoutes, { prefix: "/events/:eventId/documents" });
    },
    { prefix: "/api/v1" },
  );

  return app;
}
