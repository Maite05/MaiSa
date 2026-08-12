"use client";

import type { TableColumn } from "@maisa/ui";
import { SimpleCrudPage } from "@/components/SimpleCrudPage";
import { ChecklistItemForm } from "../components/ChecklistItemForm";
import { useChecklistItems, useRemoveChecklistItem } from "../hooks";
import type { ChecklistItem } from "../types";

const columns: TableColumn<ChecklistItem>[] = [
  { key: "done", header: "Done", render: (i) => (i.done ? "✓" : "—") },
  { key: "title", header: "Item", render: (i) => <span style={{ fontWeight: 600 }}>{i.title}</span> },
  { key: "due", header: "Due Date", render: (i) => (i.dueDate ? new Date(i.dueDate).toLocaleDateString() : "—") },
];

export function ChecklistsPage() {
  return (
    <SimpleCrudPage<ChecklistItem>
      title="Checklists"
      activeNavId="checklists"
      createLabel="+ Add Item"
      columns={columns}
      useList={useChecklistItems}
      useRemove={useRemoveChecklistItem}
      getRowLabel={(i) => i.title}
      renderForm={({ item, onDone }) => <ChecklistItemForm item={item} onDone={onDone} />}
      emptyTitle="No checklist items"
      emptyDescription="Track recurring operational to-dos that aren't specific to one event."
    />
  );
}

export default ChecklistsPage;
