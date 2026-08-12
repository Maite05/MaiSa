// Mirrors packages/database/prisma/schema.prisma's Task model + TaskStatus enum.
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: string;
  eventId: string;
  title: string;
  status: TaskStatus;
  dueDate: string | null;
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
}
