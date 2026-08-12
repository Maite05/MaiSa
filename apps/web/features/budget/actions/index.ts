import { useBudgetUiStore } from "../store";

export const useBudgetActions = () =>
  useBudgetUiStore((s) => ({ openCreate: s.openCreate, openEdit: s.openEdit, closeModal: s.closeModal }));
