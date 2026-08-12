import { hasMinimumRole } from "../services";
import type { OrgRole } from "../types";

/** Gates the invite/role-change/remove UI — mirrors the ADMIN-or-higher check the backend enforces server-side too. */
export function canManageMembers(currentUserRole: OrgRole): boolean {
  return hasMinimumRole(currentUserRole, "ADMIN");
}
