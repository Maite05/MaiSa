import { useGuestsUiStore } from "../store";

export const useGuestsActions = () =>
  useGuestsUiStore((s) => ({ openCreate: s.openCreate, openEdit: s.openEdit, closeModal: s.closeModal }));
