import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { requireRole } from "../../lib/hooks";
import { eventIdParamsSchema, eventItemParamsSchema } from "../../lib/pagination-schema";
import { createContract, deleteContract, getContract, listContracts, updateContract } from "./contracts.service";
import { createContractSchema, listContractsQuerySchema, updateContractSchema } from "./contracts.schemas";

export const contractsRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/",
    { schema: { params: eventIdParamsSchema, querystring: listContractsQuerySchema } },
    async (request, reply) => {
      reply.send(await listContracts(request.orgContext!.organizationId, request.params.eventId, request.query));
    },
  );

  app.get("/:id", { schema: { params: eventItemParamsSchema } }, async (request, reply) => {
    reply.send({
      data: await getContract(request.orgContext!.organizationId, request.params.eventId, request.params.id),
    });
  });

  app.post(
    "/",
    { schema: { params: eventIdParamsSchema, body: createContractSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      const contract = await createContract(request.orgContext!.organizationId, request.params.eventId, request.body);
      reply.status(201).send({ data: contract });
    },
  );

  app.patch(
    "/:id",
    { schema: { params: eventItemParamsSchema, body: updateContractSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      const contract = await updateContract(
        request.orgContext!.organizationId,
        request.params.eventId,
        request.params.id,
        request.body,
      );
      reply.send({ data: contract });
    },
  );

  app.delete(
    "/:id",
    { schema: { params: eventItemParamsSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      await deleteContract(request.orgContext!.organizationId, request.params.eventId, request.params.id);
      reply.status(204).send();
    },
  );
};
