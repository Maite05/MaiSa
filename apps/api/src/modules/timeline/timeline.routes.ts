import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { requireRole } from "../../lib/hooks";
import { eventIdParamsSchema, eventItemParamsSchema } from "../../lib/pagination-schema";
import {
  createTimelineItem,
  deleteTimelineItem,
  getTimelineItem,
  listTimelineItems,
  updateTimelineItem,
} from "./timeline.service";
import { createTimelineItemSchema, listTimelineItemsQuerySchema, updateTimelineItemSchema } from "./timeline.schemas";

export const timelineRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/",
    { schema: { params: eventIdParamsSchema, querystring: listTimelineItemsQuerySchema } },
    async (request, reply) => {
      reply.send(await listTimelineItems(request.orgContext!.organizationId, request.params.eventId, request.query));
    },
  );

  app.get("/:id", { schema: { params: eventItemParamsSchema } }, async (request, reply) => {
    reply.send({
      data: await getTimelineItem(request.orgContext!.organizationId, request.params.eventId, request.params.id),
    });
  });

  app.post(
    "/",
    { schema: { params: eventIdParamsSchema, body: createTimelineItemSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      const item = await createTimelineItem(
        request.orgContext!.organizationId,
        request.params.eventId,
        request.body,
      );
      reply.status(201).send({ data: item });
    },
  );

  app.patch(
    "/:id",
    { schema: { params: eventItemParamsSchema, body: updateTimelineItemSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      const item = await updateTimelineItem(
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
      await deleteTimelineItem(request.orgContext!.organizationId, request.params.eventId, request.params.id);
      reply.status(204).send();
    },
  );
};
