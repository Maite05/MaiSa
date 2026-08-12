import type { Notification } from "../types";

const LATENCY_MS = 150;
function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

// Placeholder in-memory notifications — see lib/mock-store.ts for the
// pattern this follows (not reused verbatim since there's no create form,
// just list + markRead).
let notifications: Notification[] = [
  { id: "n1", message: "Julianne V. approved the latest fabric samples for Equinox Collection.", read: false, createdAt: new Date(Date.now() - 12 * 60000).toISOString() },
  { id: "n2", message: "Marcus T. uploaded 12 new hi-res assets to Lunar Series gallery.", read: false, createdAt: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: "n3", message: "Automated backup of all production files successful.", read: true, createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
];

export async function listNotifications(): Promise<Notification[]> {
  return delay([...notifications]);
}

export async function markNotificationRead(id: string): Promise<void> {
  notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  return delay(undefined);
}

export async function markAllNotificationsRead(): Promise<void> {
  notifications = notifications.map((n) => ({ ...n, read: true }));
  return delay(undefined);
}
