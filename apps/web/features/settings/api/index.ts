import { apiRequest, type ApiEnvelope } from "../../../lib/api-client";
import type { UpdateOrganizationFormValues } from "../schemas";
import type { OrganizationProfile } from "../types";

export async function getOrganization(id: string): Promise<OrganizationProfile> {
  const res = await apiRequest<ApiEnvelope<OrganizationProfile>>(`/organizations/${id}`);
  return res.data;
}

/** Updates the *active* organization (resolved server-side from the x-organization-id header) — apps/api's PATCH /organizations takes no id in the path. */
export async function updateActiveOrganization(input: UpdateOrganizationFormValues): Promise<OrganizationProfile> {
  const res = await apiRequest<ApiEnvelope<OrganizationProfile>>("/organizations", { method: "PATCH", body: input });
  return res.data;
}
