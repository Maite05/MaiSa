import type { Task } from "../types";

/** Used to flag overdue tasks in red in the UI. */
export function isOverdue(task: Pick<Task, "dueDate" | "status">): boolean {
  if (!task.dueDate || task.status === "DONE") return false;
  return new Date(task.dueDate) < new Date();
}
