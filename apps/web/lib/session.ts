// Framework-agnostic session storage — deliberately not a Zustand/React
// module so the plain api-client below can read it without a circular
// dependency on features/authentication. The Zustand auth store wraps this
// for reactive UI; anything doing a raw fetch reads it directly.

export interface Session {
  token: string;
  userId: string;
  email: string;
  name: string | null;
  organizationId: string;
  organizationName: string;
}

const STORAGE_KEY = "maisa.session";

export function readSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function writeSession(session: Session | null): void {
  if (typeof window === "undefined") return;
  if (session) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

/** Switch the active organization without a full re-login. */
export function setActiveOrganization(organizationId: string, organizationName: string): void {
  const current = readSession();
  if (!current) return;
  writeSession({ ...current, organizationId, organizationName });
}

export function getAuthHeaders(): Record<string, string> {
  const session = readSession();
  if (!session) return {};
  return {
    Authorization: `Bearer ${session.token}`,
    "x-organization-id": session.organizationId,
  };
}
