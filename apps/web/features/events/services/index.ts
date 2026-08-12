import type { StatusTone } from "@maisa/ui";
import type { Event, EventStatus } from "../types";

const STATUS_LABEL: Record<EventStatus, string> = {
  INQUIRY: "Inquiry",
  PLANNING: "Planning",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const STATUS_TONE: Record<EventStatus, StatusTone> = {
  INQUIRY: "neutral",
  PLANNING: "warning",
  CONFIRMED: "success",
  COMPLETED: "info",
  CANCELLED: "danger",
};

export function getEventStatusLabel(status: EventStatus): string {
  return STATUS_LABEL[status];
}

export function getEventStatusTone(status: EventStatus): StatusTone {
  return STATUS_TONE[status];
}

export function isPastEvent(event: Pick<Event, "eventDate">): boolean {
  return Boolean(event.eventDate && new Date(event.eventDate) < new Date());
}
