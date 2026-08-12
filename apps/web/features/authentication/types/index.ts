// Mirrors apps/api's auth.service.ts response shapes exactly (signup/login
// return { token, user, organization? }; /me returns the user + every org
// they belong to).

export interface AuthUser {
  id: string;
  name: string | null;
  email: string;
}

export interface AuthOrganizationSummary {
  id: string;
  name: string;
  slug: string;
}

export interface SignupResult {
  token: string;
  user: AuthUser;
  organization: AuthOrganizationSummary;
}

export interface LoginResult {
  token: string;
  user: AuthUser;
}

export type OrgRole = "OWNER" | "ADMIN" | "PLANNER" | "MEMBER";

export interface CurrentUserOrganization extends AuthOrganizationSummary {
  role: OrgRole;
}

export interface CurrentUser extends AuthUser {
  organizations: CurrentUserOrganization[];
}
