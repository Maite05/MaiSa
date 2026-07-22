import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { requireRole } from "../../lib/hooks";
import { idParamsSchema } from "../../lib/pagination-schema";
import { createEvent, deleteEvent, getEvent, listEvents, updateEvent } from "./events.service";
import { createEventSchema, listEventsQuerySchema, updateEventSchema } from "./events.schemas";

export const eventsRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get("/", { schema: { querystring: listEventsQuerySchema } }, async (request, reply) => {
    reply.send(await listEvents(request.orgContext!.organizationId, request.query));
  });

  app.get("/:id", { schema: { params: idParamsSchema } }, async (request, reply) => {
    reply.send({ data: await getEvent(request.orgContext!.organizationId, request.params.id) });
  });

  app.post(
    "/",
    { schema: { body: createEventSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      const event = await createEvent(request.orgContext!.organizationId, request.body);
      reply.status(201).send({ data: event });
    },
  );

  app.patch(
    "/:id",
    { schema: { params: idParamsSchema, body: updateEventSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      const event = await updateEvent(request.orgContext!.organizationId, request.params.id, request.body);
      reply.send({ data: event });
    },
  );

  app.delete(
    "/:id",
    { schema: { params: idParamsSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      await deleteEvent(request.orgContext!.organizationId, request.params.id);
      reply.status(204).send();
    },
  );
};
