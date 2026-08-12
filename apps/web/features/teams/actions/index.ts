import { useTeamUiStore } from "../store";

export const useTeamActions = () => useTeamUiStore((s) => ({ openInvite: s.openInvite, closeInvite: s.closeInvite }));
