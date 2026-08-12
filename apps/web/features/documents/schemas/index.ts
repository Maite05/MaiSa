import { z } from "zod";

// Mirrors apps/api/src/modules/documents/documents.schemas.ts field-for-field.
// Note: apps/api has no file-upload endpoint (no multipart handling in its
// routes) — `url` must already point at a hosted file. packages/storage
// exists for a future upload flow; this form just links to one.

export const createDocumentSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  url: z.string().url("Enter a valid URL"),
  mimeType: z.string().max(120).optional().or(z.literal("")),
});
export type CreateDocumentFormValues = z.infer<typeof createDocumentSchema>;

export const updateDocumentSchema = createDocumentSchema.partial();
export type UpdateDocumentFormValues = z.infer<typeof updateDocumentSchema>;

export const listDocumentsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});
export type ListDocumentsQuery = z.infer<typeof listDocumentsQuerySchema>;
