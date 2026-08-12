import { create } from "zustand";

interface GuestsUiState {
  modal: { mode: "closed" } | { mode: "create" } | { mode: "edit"; guestId: string };
  openCreate: () => void;
  openEdit: (guestId: string) => void;
  closeModal: () => void;
}

export const useGuestsUiStore = create<GuestsUiState>((set) => ({
  modal: { mode: "closed" },
  openCreate: () => set({ modal: { mode: "create" } }),
  openEdit: (guestId) => set({ modal: { mode: "edit", guestId } }),
  closeModal: () => set({ modal: { mode: "closed" } }),
}));
