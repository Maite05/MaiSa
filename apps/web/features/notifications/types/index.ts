// No apps/api module exists yet — system/team activity notifications
// (contract signed, payment received, task assigned, ...).
export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}
