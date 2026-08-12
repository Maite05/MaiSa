"use client";

import type { TableColumn } from "@maisa/ui";
import { SimpleCrudPage } from "@/components/SimpleCrudPage";
import { InventoryItemForm } from "../components/InventoryItemForm";
import { useInventoryItems, useRemoveInventoryItem } from "../hooks";
import type { InventoryItem } from "../types";

const columns: TableColumn<InventoryItem>[] = [
  { key: "name", header: "Item", render: (i) => <span style={{ fontWeight: 600 }}>{i.name}</span> },
  { key: "sku", header: "SKU", render: (i) => i.sku },
  { key: "quantity", header: "Quantity", align: "right", render: (i) => i.quantity },
  { key: "location", header: "Location", render: (i) => i.location ?? "—" },
];

export function InventoryListPage() {
  return (
    <SimpleCrudPage<InventoryItem>
      title="Inventory"
      activeNavId="inventory"
      createLabel="+ Add Item"
      columns={columns}
      useList={useInventoryItems}
      useRemove={useRemoveInventoryItem}
      getRowLabel={(i) => i.name}
      renderForm={({ item, onDone }) => <InventoryItemForm item={item} onDone={onDone} />}
      emptyTitle="No inventory tracked yet"
      emptyDescription="Track rental stock — linens, signage, AV gear — across your events."
    />
  );
}

export default InventoryListPage;
