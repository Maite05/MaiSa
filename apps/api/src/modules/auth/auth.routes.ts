import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { authenticate } from "../../lib/hooks";
import { getProfile, login, signup } from "./auth.service";
import { loginSchema, signupSchema } from "./auth.schemas";

export const authRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post("/signup", { schema: { body: signupSchema } }, async (request, reply) => {
    const result = await signup(request.body);
    reply.status(201).send({ data: result });
  });

  app.post("/login", { schema: { body: loginSchema } }, async (request, reply) => {
    const result = await login(request.body);
    reply.send({ data: result });
  });

  app.get("/me", { preHandler: authenticate }, async (request, reply) => {
    const profile = await getProfile(request.authUser!.id);
    reply.send({ data: profile });
  });
};
