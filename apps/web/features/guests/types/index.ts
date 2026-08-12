// Mirrors packages/database/prisma/schema.prisma's Guest model + RsvpStatus enum.
export type RsvpStatus = "PENDING" | "ATTENDING" | "DECLINED" | "MAYBE";

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  email: string | null;
  phone: string | null;
  rsvpStatus: RsvpStatus;
  plusOnes: number;
  tableNumber: string | null;
  dietaryNotes: string | null;
  createdAt: string;
  updatedAt: string;
}
