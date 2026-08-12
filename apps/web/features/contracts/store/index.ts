import { create } from "zustand";

interface ContractsUiState {
  modal: { mode: "closed" } | { mode: "create" } | { mode: "edit"; contractId: string };
  openCreate: () => void;
  openEdit: (contractId: string) => void;
  closeModal: () => void;
}

export const useContractsUiStore = create<ContractsUiState>((set) => ({
  modal: { mode: "closed" },
  openCreate: () => set({ modal: { mode: "create" } }),
  openEdit: (contractId) => set({ modal: { mode: "edit", contractId } }),
  closeModal: () => set({ modal: { mode: "closed" } }),
}));
