import { create } from "zustand";

/** Client-only UI state for the clients list page — modal + search, not server data (that's react-query's job via hooks/). */
interface ClientsUiState {
  search: string;
  modal: { mode: "closed" } | { mode: "create" } | { mode: "edit"; clientId: string };
  setSearch: (search: string) => void;
  openCreate: () => void;
  openEdit: (clientId: string) => void;
  closeModal: () => void;
}

export const useClientsUiStore = create<ClientsUiState>((set) => ({
  search: "",
  modal: { mode: "closed" },
  setSearch: (search) => set({ search }),
  openCreate: () => set({ modal: { mode: "create" } }),
  openEdit: (clientId) => set({ modal: { mode: "edit", clientId } }),
  closeModal: () => set({ modal: { mode: "closed" } }),
}));
