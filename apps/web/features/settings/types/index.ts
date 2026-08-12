// Mirrors apps/api's organizations.service.ts getOrganizationById() response
// (Organization fields + the caller's role in it).
export interface OrganizationProfile {
  id: string;
  name: string;
  slug: string;
  role: "OWNER" | "ADMIN" | "PLANNER" | "MEMBER";
  createdAt: string;
  updatedAt: string;
}
