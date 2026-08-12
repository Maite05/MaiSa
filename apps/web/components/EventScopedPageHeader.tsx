"use client";

import { color, font, space, typography } from "@maisa/ui";
import Link from "next/link";
import { useEvent } from "@/features/events/hooks";
import { AppShellHeader } from "./AppShellHeader";

/**
 * Shared chrome for every "resource nested under an event" page (guests,
 * budget, tasks, timeline, contracts, documents, payments) — app header +
 * a back-link to the event + that event's name, so those 7+ pages don't
 * each reimplement this.
 */
export function EventScopedPageHeader({ eventId, title }: { eventId: string; title: string }) {
  const { data: event } = useEvent(eventId);

  return (
    <>
      <AppShellHeader activeNavId="events" />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: `${space(6)} ${space(8)} 0` }}>
        <Link
          href={`/events/${eventId}`}
          style={{ ...typography.labelCaps, color: color.onSurfaceVariant, textDecoration: "none" }}
        >
          ← {event?.name ?? "Back to event"}
        </Link>
        <h1 style={{ ...typography.headlineLg, fontSize: "32px", margin: `${space(1)} 0 ${space(4)}` }}>{title}</h1>
      </div>
    </>
  );
}

export default EventScopedPageHeader;
