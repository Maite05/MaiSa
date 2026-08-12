import { useContractsUiStore } from "../store";

export const useContractsActions = () =>
  useContractsUiStore((s) => ({ openCreate: s.openCreate, openEdit: s.openEdit, closeModal: s.closeModal }));
