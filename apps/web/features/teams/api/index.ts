import { apiRequest, type ApiEnvelope } from "../../../lib/api-client";
import type { AddMemberFormValues } from "../schemas";
import type { Member, OrgRole } from "../types";

export async function listMembers(): Promise<Member[]> {
  const res = await apiRequest<ApiEnvelope<Member[]>>("/organizations/members");
  return res.data;
}

export async function addMember(input: AddMemberFormValues): Promise<void> {
  await apiRequest("/organizations/members", { method: "POST", body: input });
}

export async function updateMemberRole(userId: string, role: OrgRole): Promise<void> {
  await apiRequest(`/organizations/members/${userId}`, { method: "PATCH", body: { role } });
}

export async function removeMember(userId: string): Promise<void> {
  await apiRequest(`/organizations/members/${userId}`, { method: "DELETE" });
}
