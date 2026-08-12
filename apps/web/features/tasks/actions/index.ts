import { useTasksUiStore } from "../store";

export const useTasksActions = () =>
  useTasksUiStore((s) => ({
    setView: s.setView,
    openCreate: s.openCreate,
    openEdit: s.openEdit,
    closeModal: s.closeModal,
  }));
