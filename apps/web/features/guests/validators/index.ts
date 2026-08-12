import type { Guest } from "../types";

/** Table assignment can't be finalized for a guest who hasn't confirmed they're coming. */
export function canAssignTable(guest: Pick<Guest, "rsvpStatus">): boolean {
  return guest.rsvpStatus === "ATTENDING";
}
