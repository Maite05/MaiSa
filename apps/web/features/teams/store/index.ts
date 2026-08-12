import { create } from "zustand";

interface TeamUiState {
  inviteModalOpen: boolean;
  openInvite: () => void;
  closeInvite: () => void;
}

export const useTeamUiStore = create<TeamUiState>((set) => ({
  inviteModalOpen: false,
  openInvite: () => set({ inviteModalOpen: true }),
  closeInvite: () => set({ inviteModalOpen: false }),
}));
