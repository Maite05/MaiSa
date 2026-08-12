import { create } from "zustand";

interface SettingsUiState {
  justSaved: boolean;
  markSaved: () => void;
  reset: () => void;
}

export const useSettingsUiStore = create<SettingsUiState>((set) => ({
  justSaved: false,
  markSaved: () => set({ justSaved: true }),
  reset: () => set({ justSaved: false }),
}));
