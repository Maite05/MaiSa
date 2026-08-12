"use client";

import { Button, color, font, Modal, ProgressBar, space, Table, tableIconButtonStyle, type TableColumn } from "@maisa/ui";
import { EventScopedPageHeader } from "@/components/EventScopedPageHeader";
import { formatCurrency, parseDecimal } from "../../../lib/format";
import { useBudgetActions } from "../actions";
import { BudgetItemForm } from "../components/BudgetItemForm";
import { useBudgetItems, useDeleteBudgetItem } from "../hooks";
import { summarizeBudget } from "../services";
import { useBudgetUiStore } from "../store";
import type { BudgetItem } from "../types";
import { isOverBudget } from "../validators";

export function BudgetPage({ eventId }: { eventId: string }) {
  const modal = useBudgetUiStore((s) => s.modal);
  const { openCreate, openEdit, closeModal } = useBudgetActions();
  const { data, isLoading } = useBudgetItems(eventId, { limit: 200 });
  const deleteBudgetItem = useDeleteBudgetItem(eventId);

  const items = data?.data ?? [];
  const editingItem = modal.mode === "edit" ? items.find((i) => i.id === modal.itemId) : undefined;
  const totals = summarizeBudget(items);
  const spentPercent = totals.estimated > 0 ? (totals.actual / totals.estimated) * 100 : 0;

  const columns: TableColumn<BudgetItem>[] = [
    { key: "category", header: "Category", render: (i) => <span style={{ fontWeight: 600 }}>{i.category}</span> },
    { key: "description", header: "Description", render: (i) => i.description ?? "—" },
    { key: "estimated", header: "Estimated", align: "right", render: (i) => formatCurrency(parseDecimal(i.estimatedCost)) },
    {
      key: "actual",
      header: "Actual",
      align: "right",
      render: (i) => (
        <span style={{ color: isOverBudget(i) ? color.error : color.onSurface }}>
          {i.actualCost ? formatCurrency(parseDecimal(i.actualCost)) : "—"}
        </span>
      ),
    },
  ];

  function handleDelete(item: BudgetItem) {
    if (window.confirm(`Delete the "${item.category}" line item?`)) {
      deleteBudgetItem.mutate(item.id);
    }
  }

  return (
    <div style={{ background: color.background, color: color.onSurface, fontFamily: font.sans, minHeight: "100%" }}>
      <EventScopedPageHeader eventId={eventId} title="Budget" />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: `0 ${space(8)} ${space(15)}` }}>
        <div style={{ border: `1px solid ${color.borderSubtle}`, borderRadius: "0.375rem", padding: space(3), marginBottom: space(3) }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: space(1.5) }}>
            <span style={{ fontFamily: font.serif, fontSize: "28px" }}>{formatCurrency(totals.actual)}</span>
            <span style={{ color: color.onSurfaceVariant, fontSize: "14px", alignSelf: "flex-end" }}>
              of {formatCurrency(totals.estimated)} estimated
            </span>
          </div>
          <ProgressBar progress={spentPercent} tone={spentPercent > 100 ? "primary" : "gold"} />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: space(2) }}>
          <Button onClick={openCreate}>+ Add Line Item</Button>
        </div>

        <div style={{ background: color.surfaceContainerLowest, border: `1px solid ${color.borderSubtle}`, borderRadius: "0.375rem", padding: space(2) }}>
          <Table
            columns={columns}
            rows={items}
            getRowId={(i) => i.id}
            loading={isLoading}
            onRowClick={(i) => openEdit(i.id)}
            emptyTitle="No budget items yet"
            emptyDescription="Break the budget into line items by category to track estimated vs. actual spend."
            rowActions={(i) => (
              <>
                <button style={tableIconButtonStyle} onClick={() => openEdit(i.id)}>
                  Edit
                </button>
                <button style={tableIconButtonStyle} onClick={() => handleDelete(i)}>
                  Delete
                </button>
              </>
            )}
          />
        </div>
      </main>

      <Modal open={modal.mode !== "closed"} onClose={closeModal} title={modal.mode === "edit" ? "Edit Line Item" : "Add Line Item"}>
        <BudgetItemForm eventId={eventId} item={editingItem} onDone={closeModal} />
      </Modal>
    </div>
  );
}

export default BudgetPage;
