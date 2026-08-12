import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store";

/**
 * Named action creators, kept separate from store/ (the state machine
 * itself) per this app's feature convention — components call these
 * instead of poking store setters directly.
 */
export function useLogoutAction() {
  const clearSession = useAuthStore((s) => s.clearSession);
  const queryClient = useQueryClient();

  return function logout() {
    clearSession();
    // Drop every cached query so a subsequent login doesn't briefly show
    // the previous user's/organization's data.
    queryClient.clear();
  };
}
