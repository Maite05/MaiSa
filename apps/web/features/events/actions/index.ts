import { useEventsUiStore } from "../store";

export const useEventsActions = () =>
  useEventsUiStore((s) => ({
    setStatusFilter: s.setStatusFilter,
    openCreate: s.openCreate,
    openEdit: s.openEdit,
    closeModal: s.closeModal,
  }));
