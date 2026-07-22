import { prisma } from "@maisa/database";
import { BadRequestError, NotFoundError, getPagination, paginatedResult } from "@maisa/utils";

import type { CreateEventInput, ListEventsQuery, UpdateEventInput } from "./events.schemas";

async function assertClientInOrg(organizationId: string, clientId: string) {
  const client = await prisma.client.findFirst({ where: { id: clientId, organizationId } });
  if (!client) {
    throw new BadRequestError("clientId does not belong to this organization");
  }
}

export async function listEvents(organizationId: string, query: ListEventsQuery) {
  const { skip, take, page, limit } = getPagination(query);

  const where = {
    organizationId,
    ...(query.status ? { status: query.status } : {}),
    ...(query.clientId ? { clientId: query.clientId } : {}),
  };

  const [events, total] = await Promise.all([
    prisma.event.findMany({ where, skip, take, orderBy: { createdAt: "desc" } }),
    prisma.event.count({ where }),
  ]);

  return paginatedResult(events, total, page, limit);
}

export async function getEvent(organizationId: string, id: string) {
  const event = await prisma.event.findFirst({ where: { id, organizationId } });
  if (!event) {
    throw new NotFoundError("Event not found");
  }
  return event;
}

export async function createEvent(organizationId: string, input: CreateEventInput) {
  await assertClientInOrg(organizationId, input.clientId);
  return prisma.event.create({ data: { ...input, organizationId } });
}

export async function updateEvent(organizationId: string, id: string, input: UpdateEventInput) {
  await getEvent(organizationId, id);
  if (input.clientId) {
    await assertClientInOrg(organizationId, input.clientId);
  }
  return prisma.event.update({ where: { id }, data: input });
}

export async function deleteEvent(organizationId: string, id: string) {
  await getEvent(organizationId, id);
  await prisma.event.delete({ where: { id } });
}
