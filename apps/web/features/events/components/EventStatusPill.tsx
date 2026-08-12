import { StatusPill } from "@maisa/ui";
import { getEventStatusLabel, getEventStatusTone } from "../services";
import type { EventStatus } from "../types";

export function EventStatusPill({ status }: { status: EventStatus }) {
  return <StatusPill label={getEventStatusLabel(status)} tone={getEventStatusTone(status)} />;
}

export default EventStatusPill;
