import type { Client } from "../types";

/** "email · phone", falling back gracefully when one or both are missing. */
export function formatClientContact(client: Client): string {
  return [client.email, client.phone].filter(Boolean).join(" · ") || "No contact info on file";
}
