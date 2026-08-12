import { useDocumentsUiStore } from "../store";

export const useDocumentsActions = () =>
  useDocumentsUiStore((s) => ({ openCreate: s.openCreate, closeModal: s.closeModal }));
