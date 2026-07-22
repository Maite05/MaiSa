import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { requireRole } from "../../lib/hooks";
import { idParamsSchema } from "../../lib/pagination-schema";
import { createClient, deleteClient, getClient, listClients, updateClient } from "./clients.service";
import { createClientSchema, listClientsQuerySchema, updateClientSchema } from "./clients.schemas";

export const clientsRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get("/", { schema: { querystring: listClientsQuerySchema } }, async (request, reply) => {
    reply.send(await listClients(request.orgContext!.organizationId, request.query));
  });

  app.get("/:id", { schema: { params: idParamsSchema } }, async (request, reply) => {
    reply.send({ data: await getClient(request.orgContext!.organizationId, request.params.id) });
  });

  app.post(
    "/",
    { schema: { body: createClientSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      const client = await createClient(request.orgContext!.organizationId, request.body);
      reply.status(201).send({ data: client });
    },
  );

  app.patch(
    "/:id",
    { schema: { params: idParamsSchema, body: updateClientSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      const client = await updateClient(request.orgContext!.organizationId, request.params.id, request.body);
      reply.send({ data: client });
    },
  );

  app.delete(
    "/:id",
    { schema: { params: idParamsSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      await deleteClient(request.orgContext!.organizationId, request.params.id);
      reply.status(204).send();
    },
  );
};
