import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { requireRole } from "../../lib/hooks";
import { eventIdParamsSchema, eventItemParamsSchema } from "../../lib/pagination-schema";
import { createTask, deleteTask, getTask, listTasks, updateTask } from "./tasks.service";
import { createTaskSchema, listTasksQuerySchema, updateTaskSchema } from "./tasks.schemas";

export const tasksRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/",
    { schema: { params: eventIdParamsSchema, querystring: listTasksQuerySchema } },
    async (request, reply) => {
      reply.send(await listTasks(request.orgContext!.organizationId, request.params.eventId, request.query));
    },
  );

  app.get("/:id", { schema: { params: eventItemParamsSchema } }, async (request, reply) => {
    reply.send({
      data: await getTask(request.orgContext!.organizationId, request.params.eventId, request.params.id),
    });
  });

  app.post(
    "/",
    { schema: { params: eventIdParamsSchema, body: createTaskSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      const task = await createTask(request.orgContext!.organizationId, request.params.eventId, request.body);
      reply.status(201).send({ data: task });
    },
  );

  app.patch(
    "/:id",
    { schema: { params: eventItemParamsSchema, body: updateTaskSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      const task = await updateTask(
        request.orgContext!.organizationId,
        request.params.eventId,
        request.params.id,
        request.body,
      );
      reply.send({ data: task });
    },
  );

  app.delete(
    "/:id",
    { schema: { params: eventItemParamsSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      await deleteTask(request.orgContext!.organizationId, request.params.eventId, request.params.id);
      reply.status(204).send();
    },
  );
};
