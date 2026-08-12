"use client";

import { AppHeader } from "@maisa/ui";
import { useRouter } from "next/navigation";
import { useSession } from "@/features/authentication/store";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "events", label: "Events" },
  { id: "clients", label: "Clients" },
  { id: "vendors", label: "Vendors" },
  { id: "team", label: "Team" },
];

const PATH_BY_NAV_ID: Record<string, string> = {
  dashboard: "/",
  events: "/events",
  clients: "/clients",
  vendors: "/vendors",
  team: "/team",
};

/**
 * Every authenticated page renders this instead of wiring @maisa/ui's
 * AppHeader by hand — keeps nav items, routing, and the signed-in user's
 * display name consistent across all ~25 feature pages in one place.
 */
export function AppShellHeader({ activeNavId }: { activeNavId?: string }) {
  const router = useRouter();
  const session = useSession();

  return (
    <AppHeader
      navItems={NAV_ITEMS}
      activeNavId={activeNavId}
      displayName={session?.name ?? session?.email ?? "Account"}
      onNavigate={(id) => router.push(PATH_BY_NAV_ID[id] ?? "/")}
    />
  );
}

export default AppShellHeader;
