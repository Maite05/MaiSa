import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { requireRole } from "../../lib/hooks";
import { eventIdParamsSchema, eventItemParamsSchema } from "../../lib/pagination-schema";
import { createInvoice, deleteInvoice, getInvoiceOrFail, listInvoices, updateInvoice } from "./invoices.service";
import { createInvoiceSchema, listInvoicesQuerySchema, updateInvoiceSchema } from "./invoices.schemas";
import { paymentsRoutes } from "./payments/payments.routes";

export const invoicesRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/",
    { schema: { params: eventIdParamsSchema, querystring: listInvoicesQuerySchema } },
    async (request, reply) => {
      reply.send(await listInvoices(request.orgContext!.organizationId, request.params.eventId, request.query));
    },
  );

  app.get("/:id", { schema: { params: eventItemParamsSchema } }, async (request, reply) => {
    reply.send({
      data: await getInvoiceOrFail(request.orgContext!.organizationId, request.params.eventId, request.params.id),
    });
  });

  app.post(
    "/",
    { schema: { params: eventIdParamsSchema, body: createInvoiceSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      const invoice = await createInvoice(request.orgContext!.organizationId, request.params.eventId, request.body);
      reply.status(201).send({ data: invoice });
    },
  );

  app.patch(
    "/:id",
    { schema: { params: eventItemParamsSchema, body: updateInvoiceSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      const invoice = await updateInvoice(
        request.orgContext!.organizationId,
        request.params.eventId,
        request.params.id,
        request.body,
      );
      reply.send({ data: invoice });
    },
  );

  app.delete(
    "/:id",
    { schema: { params: eventItemParamsSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      await deleteInvoice(request.orgContext!.organizationId, request.params.eventId, request.params.id);
      reply.status(204).send();
    },
  );

  await app.register(paymentsRoutes, { prefix: "/:invoiceId/payments" });
};
