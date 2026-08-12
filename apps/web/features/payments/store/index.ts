import { create } from "zustand";

interface PaymentsUiState {
  createInvoiceModalOpen: boolean;
  /** Invoice currently open in the "manage payments" modal, if any. */
  managingInvoiceId: string | null;
  openCreateInvoice: () => void;
  manageInvoice: (invoiceId: string) => void;
  closeAll: () => void;
}

export const usePaymentsUiStore = create<PaymentsUiState>((set) => ({
  createInvoiceModalOpen: false,
  managingInvoiceId: null,
  openCreateInvoice: () => set({ createInvoiceModalOpen: true }),
  manageInvoice: (invoiceId) => set({ managingInvoiceId: invoiceId }),
  closeAll: () => set({ createInvoiceModalOpen: false, managingInvoiceId: null }),
}));
