import { StatusPill } from "@maisa/ui";
import { getRsvpLabel, getRsvpTone } from "../services";
import type { RsvpStatus } from "../types";

export function RsvpPill({ status }: { status: RsvpStatus }) {
  return <StatusPill label={getRsvpLabel(status)} tone={getRsvpTone(status)} />;
}

export default RsvpPill;
