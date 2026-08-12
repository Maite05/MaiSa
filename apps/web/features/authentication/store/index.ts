import { create } from "zustand";
import { readSession, writeSession, type Session } from "../../../lib/session";

interface AuthState {
  session: Session | null;
  /** False until the store has checked localStorage once (avoids a login-page flash on reload). */
  hydrated: boolean;
  setSession: (session: Session) => void;
  clearSession: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  hydrated: false,
  setSession: (session) => {
    writeSession(session);
    set({ session });
  },
  clearSession: () => {
    writeSession(null);
    set({ session: null });
  },
  hydrate: () => set({ session: readSession(), hydrated: true }),
}));

export const useIsAuthenticated = () => useAuthStore((s) => s.session !== null);
export const useSession = () => useAuthStore((s) => s.session);
