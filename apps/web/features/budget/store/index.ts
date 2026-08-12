import { create } from "zustand";

interface BudgetUiState {
  modal: { mode: "closed" } | { mode: "create" } | { mode: "edit"; itemId: string };
  openCreate: () => void;
  openEdit: (itemId: string) => void;
  closeModal: () => void;
}

export const useBudgetUiStore = create<BudgetUiState>((set) => ({
  modal: { mode: "closed" },
  openCreate: () => set({ modal: { mode: "create" } }),
  openEdit: (itemId) => set({ modal: { mode: "edit", itemId } }),
  closeModal: () => set({ modal: { mode: "closed" } }),
}));
