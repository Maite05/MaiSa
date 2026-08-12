// Mirrors packages/database/prisma/schema.prisma's Document model (no updatedAt column).
export interface EventDocument {
  id: string;
  eventId: string;
  name: string;
  url: string;
  mimeType: string | null;
  createdAt: string;
}
