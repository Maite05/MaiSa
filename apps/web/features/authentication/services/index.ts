"use client";

import { useEffect } from "react";
import { readSession } from "../../../lib/session";
import { useAuthStore } from "../store";

/** Call once near the app root — syncs the Zustand store from localStorage on first mount (client-only, can't run during SSR). */
export function useHydrateSession(): void {
  const hydrate = useAuthStore((s) => s.hydrate);
  const hydrated = useAuthStore((s) => s.hydrated);
  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);
}

/** Non-reactive check for use outside React (e.g. before a fetch fires). */
export function hasActiveSession(): boolean {
  return readSession() !== null;
}
