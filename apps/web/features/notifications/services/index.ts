import type { Notification } from "../types";

export function countUnread(notifications: Notification[]): number {
  return notifications.filter((n) => !n.read).length;
}
