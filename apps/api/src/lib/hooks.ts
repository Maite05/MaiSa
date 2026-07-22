import type { FastifyReply, FastifyRequest } from "fastify";
import { hasMinimumRole, verifyAccessToken } from "@maisa/auth";
import { env } from "@maisa/config";
import { prisma } from "@maisa/database";
import type { OrgRole } from "@maisa/types";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "@maisa/utils";

export async function authenticate(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing or invalid Authorization header");
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = verifyAccessToken(token, env.JWT_SECRET);
    request.authUser = { id: payload.sub, email: payload.email };
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}

export async function resolveOrganization(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  if (!request.authUser) {
    throw new UnauthorizedError();
  }

  const memberships = await prisma.membership.findMany({
    where: { userId: request.authUser.id },
    select: { organizationId: true, role: true },
  });

  if (memberships.length === 0) {
    throw new ForbiddenError("You do not belong to any organization");
  }

  const requestedOrgId = request.headers["x-organization-id"];
  const organizationId = Array.isArray(requestedOrgId) ? requestedOrgId[0] : requestedOrgId;

  const membership = organizationId
    ? memberships.find((m) => m.organizationId === organizationId)
    : memberships.length === 1
      ? memberships[0]
      : undefined;

  if (!membership) {
    throw new ForbiddenError(
      organizationId
        ? "You are not a member of the requested organization"
        : "Multiple organizations found — specify one with the x-organization-id header",
    );
  }

  request.orgContext = { organizationId: membership.organizationId, role: membership.role };
}

export function requireRole(minimum: OrgRole) {
  return async function requireRoleHandler(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
    if (!request.orgContext) {
      throw new UnauthorizedError();
    }
    if (!hasMinimumRole(request.orgContext.role, minimum)) {
      throw new ForbiddenError(`This action requires the ${minimum} role or higher`);
    }
  };
}

export async function loadEventOrFail(eventId: string, organizationId: string) {
  const event = await prisma.event.findFirst({ where: { id: eventId, organizationId } });
  if (!event) {
    throw new NotFoundError("Event not found");
  }
  return event;
}
