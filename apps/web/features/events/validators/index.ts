import type { Event } from "../types";

/** Used to warn a planner before they flip status to CONFIRMED without the essentials in place. */
export function isReadyToConfirm(event: Pick<Event, "eventDate" | "venueName">): boolean {
  return Boolean(event.eventDate && event.venueName);
}
