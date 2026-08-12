"use client";

import { Spinner } from "@maisa/ui";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useHydrateSession } from "../services";
import { useAuthStore } from "../store";

/**
 * Wraps every authenticated route (see app/(app)/layout.tsx). Waits for
 * the localStorage hydration check before deciding, so a signed-in user
 * doesn't flash through the login page on every hard refresh.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  useHydrateSession();
  const router = useRouter();
  const hydrated = useAuthStore((s) => s.hydrated);
  const session = useAuthStore((s) => s.session);

  useEffect(() => {
    if (hydrated && !session) {
      router.replace("/login");
    }
  }, [hydrated, session, router]);

  if (!hydrated || !session) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthGuard;
