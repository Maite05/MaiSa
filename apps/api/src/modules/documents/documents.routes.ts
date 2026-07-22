import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { requireRole } from "../../lib/hooks";
import { eventIdParamsSchema, eventItemParamsSchema } from "../../lib/pagination-schema";
import { createDocument, deleteDocument, getDocument, listDocuments, updateDocument } from "./documents.service";
import { createDocumentSchema, listDocumentsQuerySchema, updateDocumentSchema } from "./documents.schemas";

export const documentsRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/",
    { schema: { params: eventIdParamsSchema, querystring: listDocumentsQuerySchema } },
    async (request, reply) => {
      reply.send(await listDocuments(request.orgContext!.organizationId, request.params.eventId, request.query));
    },
  );

  app.get("/:id", { schema: { params: eventItemParamsSchema } }, async (request, reply) => {
    reply.send({
      data: await getDocument(request.orgContext!.organizationId, request.params.eventId, request.params.id),
    });
  });

  app.post(
    "/",
    { schema: { params: eventIdParamsSchema, body: createDocumentSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      const document = await createDocument(request.orgContext!.organizationId, request.params.eventId, request.body);
      reply.status(201).send({ data: document });
    },
  );

  app.patch(
    "/:id",
    { schema: { params: eventItemParamsSchema, body: updateDocumentSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      const document = await updateDocument(
        request.orgContext!.organizationId,
        request.params.eventId,
        request.params.id,
        request.body,
      );
      reply.send({ data: document });
    },
  );

  app.delete(
    "/:id",
    { schema: { params: eventItemParamsSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      await deleteDocument(request.orgContext!.organizationId, request.params.eventId, request.params.id);
      reply.status(204).send();
    },
  );
};
