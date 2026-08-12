import { useClientsUiStore } from "../store";

/** Named action creators over the UI store — pages call these instead of touching store setters directly. */
export const useClientsActions = () =>
  useClientsUiStore((s) => ({
    setSearch: s.setSearch,
    openCreate: s.openCreate,
    openEdit: s.openEdit,
    closeModal: s.closeModal,
  }));
