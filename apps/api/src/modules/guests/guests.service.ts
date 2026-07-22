import { prisma } from "@maisa/database";
import { NotFoundError, getPagination, paginatedResult } from "@maisa/utils";

import { loadEventOrFail } from "../../lib/hooks";
import type { CreateGuestInput, ListGuestsQuery, UpdateGuestInput } from "./guests.schemas";

export async function listGuests(organizationId: string, eventId: string, query: ListGuestsQuery) {
  await loadEventOrFail(eventId, organizationId);
  const { skip, take, page, limit } = getPagination(query);

  const where = { eventId, ...(query.rsvpStatus ? { rsvpStatus: query.rsvpStatus } : {}) };

  const [guests, total] = await Promise.all([
    prisma.guest.findMany({ where, skip, take, orderBy: { createdAt: "desc" } }),
    prisma.guest.count({ where }),
  ]);

  return paginatedResult(guests, total, page, limit);
}

export async function getGuest(organizationId: string, eventId: string, id: string) {
  await loadEventOrFail(eventId, organizationId);
  const guest = await prisma.guest.findFirst({ where: { id, eventId } });
  if (!guest) {
    throw new NotFoundError("Guest not found");
  }
  return guest;
}

export async function createGuest(organizationId: string, eventId: string, input: CreateGuestInput) {
  await loadEventOrFail(eventId, organizationId);
  return prisma.guest.create({ data: { ...input, eventId } });
}

export async function updateGuest(organizationId: string, eventId: string, id: string, input: UpdateGuestInput) {
  await getGuest(organizationId, eventId, id);
  return prisma.guest.update({ where: { id }, data: input });
}

export async function deleteGuest(organizationId: string, eventId: string, id: string) {
  await getGuest(organizationId, eventId, id);
  await prisma.guest.delete({ where: { id } });
}
