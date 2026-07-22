import { prisma } from "@maisa/database";
import { NotFoundError, getPagination, paginatedResult } from "@maisa/utils";

import { loadEventOrFail } from "../../lib/hooks";
import type { CreateTimelineItemInput, ListTimelineItemsQuery, UpdateTimelineItemInput } from "./timeline.schemas";

export async function listTimelineItems(organizationId: string, eventId: string, query: ListTimelineItemsQuery) {
  await loadEventOrFail(eventId, organizationId);
  const { skip, take, page, limit } = getPagination(query);

  const where = { eventId };
  const [items, total] = await Promise.all([
    prisma.timelineItem.findMany({ where, skip, take, orderBy: { startTime: "asc" } }),
    prisma.timelineItem.count({ where }),
  ]);

  return paginatedResult(items, total, page, limit);
}

export async function getTimelineItem(organizationId: string, eventId: string, id: string) {
  await loadEventOrFail(eventId, organizationId);
  const item = await prisma.timelineItem.findFirst({ where: { id, eventId } });
  if (!item) {
    throw new NotFoundError("Timeline item not found");
  }
  return item;
}

export async function createTimelineItem(
  organizationId: string,
  eventId: string,
  input: CreateTimelineItemInput,
) {
  await loadEventOrFail(eventId, organizationId);
  return prisma.timelineItem.create({ data: { ...input, eventId } });
}

export async function updateTimelineItem(
  organizationId: string,
  eventId: string,
  id: string,
  input: UpdateTimelineItemInput,
) {
  await getTimelineItem(organizationId, eventId, id);
  return prisma.timelineItem.update({ where: { id }, data: input });
}

export async function deleteTimelineItem(organizationId: string, eventId: string, id: string) {
  await getTimelineItem(organizationId, eventId, id);
  await prisma.timelineItem.delete({ where: { id } });
}
