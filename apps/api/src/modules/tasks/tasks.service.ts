import { prisma } from "@maisa/database";
import { BadRequestError, NotFoundError, getPagination, paginatedResult } from "@maisa/utils";

import { loadEventOrFail } from "../../lib/hooks";
import type { CreateTaskInput, ListTasksQuery, UpdateTaskInput } from "./tasks.schemas";

async function assertAssigneeInOrg(organizationId: string, assigneeId: string) {
  const membership = await prisma.membership.findFirst({ where: { organizationId, userId: assigneeId } });
  if (!membership) {
    throw new BadRequestError("assigneeId must be a member of this organization");
  }
}

export async function listTasks(organizationId: string, eventId: string, query: ListTasksQuery) {
  await loadEventOrFail(eventId, organizationId);
  const { skip, take, page, limit } = getPagination(query);

  const where = {
    eventId,
    ...(query.status ? { status: query.status } : {}),
    ...(query.assigneeId ? { assigneeId: query.assigneeId } : {}),
  };

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({ where, skip, take, orderBy: { createdAt: "desc" } }),
    prisma.task.count({ where }),
  ]);

  return paginatedResult(tasks, total, page, limit);
}

export async function getTask(organizationId: string, eventId: string, id: string) {
  await loadEventOrFail(eventId, organizationId);
  const task = await prisma.task.findFirst({ where: { id, eventId } });
  if (!task) {
    throw new NotFoundError("Task not found");
  }
  return task;
}

export async function createTask(organizationId: string, eventId: string, input: CreateTaskInput) {
  await loadEventOrFail(eventId, organizationId);
  if (input.assigneeId) {
    await assertAssigneeInOrg(organizationId, input.assigneeId);
  }
  return prisma.task.create({ data: { ...input, eventId } });
}

export async function updateTask(organizationId: string, eventId: string, id: string, input: UpdateTaskInput) {
  await getTask(organizationId, eventId, id);
  if (input.assigneeId) {
    await assertAssigneeInOrg(organizationId, input.assigneeId);
  }
  return prisma.task.update({ where: { id }, data: input });
}

export async function deleteTask(organizationId: string, eventId: string, id: string) {
  await getTask(organizationId, eventId, id);
  await prisma.task.delete({ where: { id } });
}
