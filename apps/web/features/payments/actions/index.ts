import { usePaymentsUiStore } from "../store";

export const usePaymentsActions = () =>
  usePaymentsUiStore((s) => ({
    openCreateInvoice: s.openCreateInvoice,
    manageInvoice: s.manageInvoice,
    closeAll: s.closeAll,
  }));
