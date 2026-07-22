import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { requireRole } from "../../lib/hooks";
import { eventIdParamsSchema, eventItemParamsSchema } from "../../lib/pagination-schema";
import { createBudgetItem, deleteBudgetItem, getBudgetItem, listBudgetItems, updateBudgetItem } from "./budget.service";
import { createBudgetItemSchema, listBudgetItemsQuerySchema, updateBudgetItemSchema } from "./budget.schemas";

export const budgetRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/",
    { schema: { params: eventIdParamsSchema, querystring: listBudgetItemsQuerySchema } },
    async (request, reply) => {
      reply.send(await listBudgetItems(request.orgContext!.organizationId, request.params.eventId, request.query));
    },
  );

  app.get("/:id", { schema: { params: eventItemParamsSchema } }, async (request, reply) => {
    reply.send({
      data: await getBudgetItem(request.orgContext!.organizationId, request.params.eventId, request.params.id),
    });
  });

  app.post(
    "/",
    { schema: { params: eventIdParamsSchema, body: createBudgetItemSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      const item = await createBudgetItem(request.orgContext!.organizationId, request.params.eventId, request.body);
      reply.status(201).send({ data: item });
    },
  );

  app.patch(
    "/:id",
    { schema: { params: eventItemParamsSchema, body: updateBudgetItemSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      const item = await updateBudgetItem(
        request.orgContext!.organizationId,
        request.params.eventId,
        request.params.id,
        request.body,
      );
      reply.send({ data: item });
    },
  );

  app.delete(
    "/:id",
    { schema: { params: eventItemParamsSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      await deleteBudgetItem(request.orgContext!.organizationId, request.params.eventId, request.params.id);
      reply.status(204).send();
    },
  );
};
