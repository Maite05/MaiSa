import { z } from "zod";

import { paginationQuerySchema } from "../../lib/pagination-schema";

export const createDocumentSchema = z.object({
  name: z.string().min(1).max(200),
  url: z.string().url(),
  mimeType: z.string().max(120).optional(),
});
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;

export const updateDocumentSchema = createDocumentSchema.partial();
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;

export const listDocumentsQuerySchema = paginationQuerySchema;
export type ListDocumentsQuery = z.infer<typeof listDocumentsQuerySchema>;
