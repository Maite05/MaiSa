import type { TimelineItem } from "../types";

/** Timeline items sorted chronologically — the API doesn't guarantee order, callers shouldn't assume it. */
export function sortByStartTime(items: TimelineItem[]): TimelineItem[] {
  return [...items].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
}
