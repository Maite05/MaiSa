import type { OrganizationProfile } from "../types";

/** Only OWNER/ADMIN can rename the organization — mirrors the backend's requireRole("ADMIN") on PATCH /organizations. */
export function canEditOrganization(profile: Pick<OrganizationProfile, "role">): boolean {
  return profile.role === "OWNER" || profile.role === "ADMIN";
}
