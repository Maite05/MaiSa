import type { StatusTone } from "@maisa/ui";
import type { Guest, RsvpStatus } from "../types";

const RSVP_LABEL: Record<RsvpStatus, string> = {
  PENDING: "Pending",
  ATTENDING: "Attending",
  DECLINED: "Declined",
  MAYBE: "Maybe",
};

const RSVP_TONE: Record<RsvpStatus, StatusTone> = {
  PENDING: "neutral",
  ATTENDING: "success",
  DECLINED: "danger",
  MAYBE: "warning",
};

export function getRsvpLabel(status: RsvpStatus): string {
  return RSVP_LABEL[status];
}

export function getRsvpTone(status: RsvpStatus): StatusTone {
  return RSVP_TONE[status];
}

export interface GuestSummary {
  totalGuests: number;
  attending: number;
  declined: number;
  pendingOrMaybe: number;
}

/** Powers the "142 / 180 Confirmed" style rollup shown on the event overview. */
export function summarizeGuests(guests: Guest[]): GuestSummary {
  const attending = guests.filter((g) => g.rsvpStatus === "ATTENDING");
  const declined = guests.filter((g) => g.rsvpStatus === "DECLINED");
  const totalHeadcount = attending.reduce((sum, g) => sum + 1 + g.plusOnes, 0);
  return {
    totalGuests: guests.length,
    attending: totalHeadcount,
    declined: declined.length,
    pendingOrMaybe: guests.length - attending.length - declined.length,
  };
}
