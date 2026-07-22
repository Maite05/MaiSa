import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { requireRole } from "../../lib/hooks";
import { eventIdParamsSchema, eventItemParamsSchema } from "../../lib/pagination-schema";
import { createGuest, deleteGuest, getGuest, listGuests, updateGuest } from "./guests.service";
import { createGuestSchema, listGuestsQuerySchema, updateGuestSchema } from "./guests.schemas";

export const guestsRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/",
    { schema: { params: eventIdParamsSchema, querystring: listGuestsQuerySchema } },
    async (request, reply) => {
      reply.send(await listGuests(request.orgContext!.organizationId, request.params.eventId, request.query));
    },
  );

  app.get("/:id", { schema: { params: eventItemParamsSchema } }, async (request, reply) => {
    reply.send({
      data: await getGuest(request.orgContext!.organizationId, request.params.eventId, request.params.id),
    });
  });

  app.post(
    "/",
    { schema: { params: eventIdParamsSchema, body: createGuestSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      const guest = await createGuest(request.orgContext!.organizationId, request.params.eventId, request.body);
      reply.status(201).send({ data: guest });
    },
  );

  app.patch(
    "/:id",
    { schema: { params: eventItemParamsSchema, body: updateGuestSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      const guest = await updateGuest(
        request.orgContext!.organizationId,
        request.params.eventId,
        request.params.id,
        request.body,
      );
      reply.send({ data: guest });
    },
  );

  app.delete(
    "/:id",
    { schema: { params: eventItemParamsSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      await deleteGuest(request.orgContext!.organizationId, request.params.eventId, request.params.id);
      reply.status(204).send();
    },
  );
};
