import { useTimelineUiStore } from "../store";

export const useTimelineActions = () =>
  useTimelineUiStore((s) => ({ openCreate: s.openCreate, openEdit: s.openEdit, closeModal: s.closeModal }));
