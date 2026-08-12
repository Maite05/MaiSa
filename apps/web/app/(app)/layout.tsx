import { AuthGuard } from "@/features/authentication/components/AuthGuard";
import type { ReactNode } from "react";

// Every route under this group requires a session — signup/login live
// outside it at app/(login|signup)/page.tsx. This layout doesn't render
// any chrome itself (each feature page renders its own AppHeader), it only
// gates access.
export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
