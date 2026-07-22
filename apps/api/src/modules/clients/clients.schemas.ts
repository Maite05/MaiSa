import { z } from "zod";

import { paginationQuerySchema } from "../../lib/pagination-schema";

export const createClientSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().optional(),
  phone: z.string().max(40).optional(),
  notes: z.string().max(5000).optional(),
});
export type CreateClientInput = z.infer<typeof createClientSchema>;

export const updateClientSchema = createClientSchema.partial();
export type UpdateClientInput = z.infer<typeof updateClientSchema>;

export const listClientsQuerySchema = paginationQuerySchema.extend({
  search: z.string().max(200).optional(),
});
export type ListClientsQuery = z.infer<typeof listClientsQuerySchema>;
