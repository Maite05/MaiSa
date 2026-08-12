import { create } from "zustand";

interface DocumentsUiState {
  createModalOpen: boolean;
  openCreate: () => void;
  closeModal: () => void;
}

export const useDocumentsUiStore = create<DocumentsUiState>((set) => ({
  createModalOpen: false,
  openCreate: () => set({ createModalOpen: true }),
  closeModal: () => set({ createModalOpen: false }),
}));
