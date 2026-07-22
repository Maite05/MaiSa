import type { FastifyInstance, FastifyError } from "fastify";
import { Prisma } from "@maisa/database";
import { AppError } from "@maisa/utils";
import { ZodError } from "zod";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error: FastifyError, request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
      reply.status(400).send({
        error: {
          message: "Validation failed",
          code: "VALIDATION_ERROR",
          details: error.validation,
        },
      });
      return;
    }

    if (error instanceof AppError) {
      reply.status(error.statusCode).send({
        error: { message: error.message, code: error.code },
      });
      return;
    }

    if (error instanceof ZodError) {
      reply.status(400).send({
        error: { message: "Validation failed", code: "VALIDATION_ERROR", details: error.issues },
      });
      return;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        reply.status(409).send({ error: { message: "A record with this value already exists", code: "CONFLICT" } });
        return;
      }
      if (error.code === "P2025") {
        reply.status(404).send({ error: { message: "Record not found", code: "NOT_FOUND" } });
        return;
      }
    }

    if (error.statusCode && error.statusCode < 500) {
      reply.status(error.statusCode).send({
        error: { message: error.message, code: "REQUEST_ERROR" },
      });
      return;
    }

    request.log.error(error);
    reply.status(500).send({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  });

  app.setNotFoundHandler((_request, reply) => {
    reply.status(404).send({ error: { message: "Route not found", code: "NOT_FOUND" } });
  });
}
