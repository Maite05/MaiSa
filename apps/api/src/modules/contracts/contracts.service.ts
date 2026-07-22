import { prisma } from "@maisa/database";
import { NotFoundError, getPagination, paginatedResult } from "@maisa/utils";

import { loadEventOrFail } from "../../lib/hooks";
import type { CreateContractInput, ListContractsQuery, UpdateContractInput } from "./contracts.schemas";

export async function listContracts(organizationId: string, eventId: string, query: ListContractsQuery) {
  await loadEventOrFail(eventId, organizationId);
  const { skip, take, page, limit } = getPagination(query);

  const where = { eventId, ...(query.status ? { status: query.status } : {}) };

  const [contracts, total] = await Promise.all([
    prisma.contract.findMany({ where, skip, take, orderBy: { createdAt: "desc" } }),
    prisma.contract.count({ where }),
  ]);

  return paginatedResult(contracts, total, page, limit);
}

export async function getContract(organizationId: string, eventId: string, id: string) {
  await loadEventOrFail(eventId, organizationId);
  const contract = await prisma.contract.findFirst({ where: { id, eventId } });
  if (!contract) {
    throw new NotFoundError("Contract not found");
  }
  return contract;
}

export async function createContract(organizationId: string, eventId: string, input: CreateContractInput) {
  await loadEventOrFail(eventId, organizationId);
  return prisma.contract.create({ data: { ...input, eventId } });
}

export async function updateContract(
  organizationId: string,
  eventId: string,
  id: string,
  input: UpdateContractInput,
) {
  await getContract(organizationId, eventId, id);
  return prisma.contract.update({ where: { id }, data: input });
}

export async function deleteContract(organizationId: string, eventId: string, id: string) {
  await getContract(organizationId, eventId, id);
  await prisma.contract.delete({ where: { id } });
}
