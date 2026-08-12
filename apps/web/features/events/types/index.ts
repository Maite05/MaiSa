// Mirrors packages/database/prisma/schema.prisma's Event model + EventStatus enum.
export type EventStatus = "INQUIRY" | "PLANNING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface Event {
  id: string;
  organizationId: string;
  clientId: string;
  name: string;
  type: string | null;
  status: EventStatus;
  eventDate: string | null;
  venueName: string | null;
  guestCountEstimate: number | null;
  createdAt: string;
  updatedAt: string;
}
