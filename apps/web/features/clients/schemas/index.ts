import { z } from "zod";

// Mirrors apps/api/src/modules/clients/clients.schemas.ts field-for-field.

export const createClientSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().max(40).optional().or(z.literal("")),
  notes: z.string().max(5000).optional().or(z.literal("")),
});
export type CreateClientFormValues = z.infer<typeof createClientSchema>;

export const updateClientSchema = createClientSchema.partial();
export type UpdateClientFormValues = z.infer<typeof updateClientSchema>;

export const listClientsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  search: z.string().max(200).optional(),
});
export type ListClientsQuery = z.infer<typeof listClientsQuerySchema>;
