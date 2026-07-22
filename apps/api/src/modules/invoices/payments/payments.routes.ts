import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { requireRole } from "../../../lib/hooks";
import { createPayment, deletePayment, listPayments } from "./payments.service";
import { createPaymentSchema, invoiceParamsSchema, listPaymentsQuerySchema, paymentItemParamsSchema } from "./payments.schemas";

export const paymentsRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/",
    { schema: { params: invoiceParamsSchema, querystring: listPaymentsQuerySchema } },
    async (request, reply) => {
      reply.send(
        await listPayments(
          request.orgContext!.organizationId,
          request.params.eventId,
          request.params.invoiceId,
          request.query,
        ),
      );
    },
  );

  app.post(
    "/",
    { schema: { params: invoiceParamsSchema, body: createPaymentSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      const payment = await createPayment(
        request.orgContext!.organizationId,
        request.params.eventId,
        request.params.invoiceId,
        request.body,
      );
      reply.status(201).send({ data: payment });
    },
  );

  app.delete(
    "/:id",
    { schema: { params: paymentItemParamsSchema }, preHandler: requireRole("PLANNER") },
    async (request, reply) => {
      await deletePayment(
        request.orgContext!.organizationId,
        request.params.eventId,
        request.params.invoiceId,
        request.params.id,
      );
      reply.status(204).send();
    },
  );
};
