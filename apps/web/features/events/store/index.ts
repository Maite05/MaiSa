import { create } from "zustand";
import type { EventStatus } from "../types";

interface EventsUiState {
  statusFilter: EventStatus | "ALL";
  modal: { mode: "closed" } | { mode: "create" } | { mode: "edit"; eventId: string };
  setStatusFilter: (status: EventStatus | "ALL") => void;
  openCreate: () => void;
  openEdit: (eventId: string) => void;
  closeModal: () => void;
}

export const useEventsUiStore = create<EventsUiState>((set) => ({
  statusFilter: "ALL",
  modal: { mode: "closed" },
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  openCreate: () => set({ modal: { mode: "create" } }),
  openEdit: (eventId) => set({ modal: { mode: "edit", eventId } }),
  closeModal: () => set({ modal: { mode: "closed" } }),
}));
