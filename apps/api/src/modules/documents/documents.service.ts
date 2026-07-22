import { prisma } from "@maisa/database";
import { NotFoundError, getPagination, paginatedResult } from "@maisa/utils";

import { loadEventOrFail } from "../../lib/hooks";
import type { CreateDocumentInput, ListDocumentsQuery, UpdateDocumentInput } from "./documents.schemas";

export async function listDocuments(organizationId: string, eventId: string, query: ListDocumentsQuery) {
  await loadEventOrFail(eventId, organizationId);
  const { skip, take, page, limit } = getPagination(query);

  const where = { eventId };
  const [documents, total] = await Promise.all([
    prisma.document.findMany({ where, skip, take, orderBy: { createdAt: "desc" } }),
    prisma.document.count({ where }),
  ]);

  return paginatedResult(documents, total, page, limit);
}

export async function getDocument(organizationId: string, eventId: string, id: string) {
  await loadEventOrFail(eventId, organizationId);
  const document = await prisma.document.findFirst({ where: { id, eventId } });
  if (!document) {
    throw new NotFoundError("Document not found");
  }
  return document;
}

export async function createDocument(organizationId: string, eventId: string, input: CreateDocumentInput) {
  await loadEventOrFail(eventId, organizationId);
  return prisma.document.create({ data: { ...input, eventId } });
}

export async function updateDocument(
  organizationId: string,
  eventId: string,
  id: string,
  input: UpdateDocumentInput,
) {
  await getDocument(organizationId, eventId, id);
  return prisma.document.update({ where: { id }, data: input });
}

export async function deleteDocument(organizationId: string, eventId: string, id: string) {
  await getDocument(organizationId, eventId, id);
  await prisma.document.delete({ where: { id } });
}
