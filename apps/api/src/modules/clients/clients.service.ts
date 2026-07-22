import { prisma } from "@maisa/database";
import { getPagination, paginatedResult, NotFoundError } from "@maisa/utils";

import type { CreateClientInput, ListClientsQuery, UpdateClientInput } from "./clients.schemas";

export async function listClients(organizationId: string, query: ListClientsQuery) {
  const { skip, take, page, limit } = getPagination(query);

  const where = {
    organizationId,
    ...(query.search ? { name: { contains: query.search, mode: "insensitive" as const } } : {}),
  };

  const [clients, total] = await Promise.all([
    prisma.client.findMany({ where, skip, take, orderBy: { createdAt: "desc" } }),
    prisma.client.count({ where }),
  ]);

  return paginatedResult(clients, total, page, limit);
}

export async function getClient(organizationId: string, id: string) {
  const client = await prisma.client.findFirst({ where: { id, organizationId } });
  if (!client) {
    throw new NotFoundError("Client not found");
  }
  return client;
}

export async function createClient(organizationId: string, input: CreateClientInput) {
  return prisma.client.create({ data: { ...input, organizationId } });
}

export async function updateClient(organizationId: string, id: string, input: UpdateClientInput) {
  await getClient(organizationId, id);
  return prisma.client.update({ where: { id }, data: input });
}

export async function deleteClient(organizationId: string, id: string) {
  await getClient(organizationId, id);
  await prisma.client.delete({ where: { id } });
}
