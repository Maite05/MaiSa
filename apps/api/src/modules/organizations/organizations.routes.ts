import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { requireRole } from "../../lib/hooks";
import { idParamsSchema } from "../../lib/pagination-schema";
import {
  addMember,
  createOrganization,
  getOrganizationById,
  listMembers,
  listMyOrganizations,
  removeMember,
  updateMemberRole,
  updateOrganization,
} from "./organizations.service";
import { addMemberSchema, createOrganizationSchema, memberParamsSchema, updateMemberRoleSchema, updateOrganizationSchema } from "./organizations.schemas";

export const organizationsRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get("/", async (request, reply) => {
    reply.send({ data: await listMyOrganizations(request.authUser!.id) });
  });

  app.get("/:id", { schema: { params: idParamsSchema } }, async (request, reply) => {
    reply.send({ data: await getOrganizationById(request.authUser!.id, request.params.id) });
  });

  app.post("/", { schema: { body: createOrganizationSchema } }, async (request, reply) => {
    const organization = await createOrganization(request.authUser!.id, request.body);
    reply.status(201).send({ data: organization });
  });

  app.patch(
    "/",
    { schema: { body: updateOrganizationSchema }, preHandler: requireRole("ADMIN") },
    async (request, reply) => {
      const organization = await updateOrganization(request.orgContext!.organizationId, request.body);
      reply.send({ data: organization });
    },
  );

  app.get("/members", async (request, reply) => {
    reply.send({ data: await listMembers(request.orgContext!.organizationId) });
  });

  app.post(
    "/members",
    { schema: { body: addMemberSchema }, preHandler: requireRole("ADMIN") },
    async (request, reply) => {
      const member = await addMember(request.orgContext!.organizationId, request.body);
      reply.status(201).send({ data: member });
    },
  );

  app.patch(
    "/members/:userId",
    { schema: { params: memberParamsSchema, body: updateMemberRoleSchema }, preHandler: requireRole("ADMIN") },
    async (request, reply) => {
      const member = await updateMemberRole(request.orgContext!.organizationId, request.params.userId, request.body.role);
      reply.send({ data: member });
    },
  );

  app.delete(
    "/members/:userId",
    { schema: { params: memberParamsSchema }, preHandler: requireRole("ADMIN") },
    async (request, reply) => {
      await removeMember(request.orgContext!.organizationId, request.params.userId);
      reply.status(204).send();
    },
  );
};
