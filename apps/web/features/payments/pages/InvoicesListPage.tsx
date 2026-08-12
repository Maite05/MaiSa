"use client";

import { Button, color, font, Modal, space, Table, tableIconButtonStyle, type TableColumn } from "@maisa/ui";
import { useState } from "react";
import { EventScopedPageHeader } from "@/components/EventScopedPageHeader";
import { formatCurrency, parseDecimal } from "../../../lib/format";
import { usePaymentsActions } from "../actions";
import { InvoiceForm } from "../components/InvoiceForm";
import { InvoicePaymentsPanel } from "../components/InvoicePaymentsPanel";
import { InvoiceStatusPill } from "../components/InvoiceStatusPill";
import { useDeleteInvoice, useInvoices } from "../hooks";
import { usePaymentsUiStore } from "../store";
import type { Invoice } from "../types";

export function InvoicesListPage({ eventId }: { eventId: string }) {
  const createInvoiceModalOpen = usePaymentsUiStore((s) => s.createInvoiceModalOpen);
  const managingInvoiceId = usePaymentsUiStore((s) => s.managingInvoiceId);
  const { openCreateInvoice, manageInvoice, closeAll } = usePaymentsActions();
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);

  const { data, isLoading } = useInvoices(eventId, { limit: 200 });
  const deleteInvoice = useDeleteInvoice(eventId);

  const invoices = data?.data ?? [];
  const managingInvoice = invoices.find((i) => i.id === managingInvoiceId);
  const editingInvoice = invoices.find((i) => i.id === editingInvoiceId);

  const columns: TableColumn<Invoice>[] = [
    { key: "status", header: "Status", render: (i) => <InvoiceStatusPill status={i.status} /> },
    { key: "due", header: "Amount Due", align: "right", render: (i) => formatCurrency(parseDecimal(i.amountDue)) },
    { key: "paid", header: "Amount Paid", align: "right", render: (i) => formatCurrency(parseDecimal(i.amountPaid)) },
    { key: "dueDate", header: "Due Date", render: (i) => (i.dueDate ? new Date(i.dueDate).toLocaleDateString() : "—") },
  ];

  return (
    <div style={{ background: color.background, color: color.onSurface, fontFamily: font.sans, minHeight: "100%" }}>
      <EventScopedPageHeader eventId={eventId} title="Invoices & Payments" />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: `0 ${space(8)} ${space(15)}` }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: space(2) }}>
          <Button onClick={openCreateInvoice}>+ New Invoice</Button>
        </div>

        <div style={{ background: color.surfaceContainerLowest, border: `1px solid ${color.borderSubtle}`, borderRadius: "0.375rem", padding: space(2) }}>
          <Table
            columns={columns}
            rows={invoices}
            getRowId={(i) => i.id}
            loading={isLoading}
            onRowClick={(i) => manageInvoice(i.id)}
            emptyTitle="No invoices yet"
            emptyDescription="Create an invoice to start recording payments against this event."
            rowActions={(i) => (
              <>
                <button style={tableIconButtonStyle} onClick={() => setEditingInvoiceId(i.id)}>
                  Edit
                </button>
                <button
                  style={tableIconButtonStyle}
                  onClick={() => {
                    if (window.confirm("Delete this invoice and all its payments?")) deleteInvoice.mutate(i.id);
                  }}
                >
                  Delete
                </button>
              </>
            )}
          />
        </div>
      </main>

      <Modal open={createInvoiceModalOpen} onClose={closeAll} title="New Invoice">
        <InvoiceForm eventId={eventId} onDone={closeAll} />
      </Modal>

      <Modal open={Boolean(editingInvoice)} onClose={() => setEditingInvoiceId(null)} title="Edit Invoice">
        {editingInvoice && <InvoiceForm eventId={eventId} invoice={editingInvoice} onDone={() => setEditingInvoiceId(null)} />}
      </Modal>

      <Modal open={Boolean(managingInvoice)} onClose={closeAll} title="Manage Payments">
        {managingInvoice && <InvoicePaymentsPanel eventId={eventId} invoice={managingInvoice} />}
      </Modal>
    </div>
  );
}

export default InvoicesListPage;
