// Mirrors apps/api's organizations.service.ts listMembers() response
// (flattened user fields + role + membershipId) — the add/update-role
// endpoints return a differently-shaped raw Membership row, which the
// frontend doesn't need to model since it just refetches the list after.
export type OrgRole = "OWNER" | "ADMIN" | "PLANNER" | "MEMBER";

export interface Member {
  id: string;
  name: string | null;
  email: string;
  role: OrgRole;
  membershipId: string;
}
