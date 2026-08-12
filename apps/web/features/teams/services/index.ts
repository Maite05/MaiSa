import type { StatusTone } from "@maisa/ui";
import type { OrgRole } from "../types";

const ROLE_LABEL: Record<OrgRole, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  PLANNER: "Planner",
  MEMBER: "Member",
};

const ROLE_TONE: Record<OrgRole, StatusTone> = {
  OWNER: "info",
  ADMIN: "success",
  PLANNER: "warning",
  MEMBER: "neutral",
};

// Deliberately duplicated (not imported) from packages/auth's ROLE_RANK —
// that package also pulls in bcryptjs/jsonwebtoken, which are backend-only
// concerns with no reason to ship in the browser bundle for a 4-entry table.
const ROLE_RANK: Record<OrgRole, number> = { MEMBER: 1, PLANNER: 2, ADMIN: 3, OWNER: 4 };

export function getRoleLabel(role: OrgRole): string {
  return ROLE_LABEL[role];
}

export function getRoleTone(role: OrgRole): StatusTone {
  return ROLE_TONE[role];
}

export function hasMinimumRole(role: OrgRole, minimum: OrgRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}
