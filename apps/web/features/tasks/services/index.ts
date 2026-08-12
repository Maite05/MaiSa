import type { StatusTone } from "@maisa/ui";
import type { Task, TaskStatus } from "../types";

const STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

const STATUS_TONE: Record<TaskStatus, StatusTone> = {
  TODO: "neutral",
  IN_PROGRESS: "warning",
  DONE: "success",
};

export function getTaskStatusLabel(status: TaskStatus): string {
  return STATUS_LABEL[status];
}

export function getTaskStatusTone(status: TaskStatus): StatusTone {
  return STATUS_TONE[status];
}

/** Groups tasks by status for the kanban board view. */
export function groupTasksByStatus(tasks: Task[]): Record<TaskStatus, Task[]> {
  return {
    TODO: tasks.filter((t) => t.status === "TODO"),
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS"),
    DONE: tasks.filter((t) => t.status === "DONE"),
  };
}
