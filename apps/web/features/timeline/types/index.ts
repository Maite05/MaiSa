// Mirrors packages/database/prisma/schema.prisma's TimelineItem model
// (deliberately has no createdAt/updatedAt, unlike most other models here).
export interface TimelineItem {
  id: string;
  eventId: string;
  title: string;
  startTime: string;
  endTime: string | null;
  notes: string | null;
}
