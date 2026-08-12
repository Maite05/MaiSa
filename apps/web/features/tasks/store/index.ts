import { create } from "zustand";

interface TasksUiState {
  view: "board" | "list";
  modal: { mode: "closed" } | { mode: "create" } | { mode: "edit"; taskId: string };
  setView: (view: "board" | "list") => void;
  openCreate: () => void;
  openEdit: (taskId: string) => void;
  closeModal: () => void;
}

export const useTasksUiStore = create<TasksUiState>((set) => ({
  view: "board",
  modal: { mode: "closed" },
  setView: (view) => set({ view }),
  openCreate: () => set({ modal: { mode: "create" } }),
  openEdit: (taskId) => set({ modal: { mode: "edit", taskId } }),
  closeModal: () => set({ modal: { mode: "closed" } }),
}));
