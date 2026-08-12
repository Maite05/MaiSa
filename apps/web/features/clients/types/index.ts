// Mirrors packages/database/prisma/schema.prisma's Client model.
export interface Client {
  id: string;
  organizationId: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
