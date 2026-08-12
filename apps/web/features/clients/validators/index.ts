import type { Client } from "../types";

/** Used to nudge planners to fill in a contact method before relying on this client record for outreach. */
export function hasReachableContact(client: Pick<Client, "email" | "phone">): boolean {
  return Boolean(client.email || client.phone);
}
