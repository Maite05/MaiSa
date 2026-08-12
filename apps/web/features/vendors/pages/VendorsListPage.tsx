"use client";

import { StatusPill, type TableColumn } from "@maisa/ui";
import { SimpleCrudPage } from "@/components/SimpleCrudPage";
import { VendorForm } from "../components/VendorForm";
import { useRemoveVendor, useVendors } from "../hooks";
import type { Vendor } from "../types";

const columns: TableColumn<Vendor>[] = [
  { key: "name", header: "Vendor", render: (v) => <span style={{ fontWeight: 600 }}>{v.name}</span> },
  { key: "category", header: "Category", render: (v) => <StatusPill label={v.category} tone="neutral" /> },
  { key: "email", header: "Contact", render: (v) => v.contactEmail },
  { key: "price", header: "Price", render: (v) => v.priceRange },
  { key: "rating", header: "Rating", render: (v) => (v.rating ? `${v.rating}★` : "—") },
];

export function VendorsListPage() {
  return (
    <SimpleCrudPage<Vendor>
      title="Vendors"
      activeNavId="vendors"
      createLabel="+ Add Vendor"
      columns={columns}
      useList={useVendors}
      useRemove={useRemoveVendor}
      getRowLabel={(v) => v.name}
      renderForm={({ item, onDone }) => <VendorForm item={item} onDone={onDone} />}
      emptyTitle="No vendors yet"
      emptyDescription="Build your vendor directory to speed up future bookings."
    />
  );
}

export default VendorsListPage;
