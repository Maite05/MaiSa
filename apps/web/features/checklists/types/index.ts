// No apps/api module exists yet — org-wide checklist items, distinct from
// per-event tasks (features/tasks).
export interface ChecklistItem {
  id: string;
  title: string;
  done: boolean;
  dueDate?: string;
}
