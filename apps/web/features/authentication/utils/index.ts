export { initialsOf } from "../../../lib/format";
import type { CurrentUser, CurrentUserOrganization } from "../types";

/** Most users belong to exactly one organization — this is the "just pick one" default used right after login. */
export function getPrimaryOrganization(user: CurrentUser): CurrentUserOrganization | undefined {
  return user.organizations[0];
}
