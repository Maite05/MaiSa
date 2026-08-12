"use client";

import type { TableColumn } from "@maisa/ui";
import { SimpleCrudPage } from "@/components/SimpleCrudPage";
import { formatCurrency } from "../../../lib/format";
import { MarketplaceListingForm } from "../components/MarketplaceListingForm";
import { useMarketplaceListings, useRemoveMarketplaceListing } from "../hooks";
import type { MarketplaceListing } from "../types";

const columns: TableColumn<MarketplaceListing>[] = [
  { key: "title", header: "Listing", render: (l) => <span style={{ fontWeight: 600 }}>{l.title}</span> },
  { key: "vendor", header: "Vendor", render: (l) => l.vendorName },
  { key: "category", header: "Category", render: (l) => l.category },
  { key: "price", header: "Price", align: "right", render: (l) => formatCurrency(l.price) },
];

export function MarketplacePage() {
  return (
    <SimpleCrudPage<MarketplaceListing>
      title="Marketplace"
      activeNavId="marketplace"
      createLabel="+ Add Listing"
      columns={columns}
      useList={useMarketplaceListings}
      useRemove={useRemoveMarketplaceListing}
      getRowLabel={(l) => l.title}
      renderForm={({ item, onDone }) => <MarketplaceListingForm item={item} onDone={onDone} />}
      emptyTitle="No listings yet"
      emptyDescription="Browse curated vendor offerings available to book directly."
    />
  );
}

export default MarketplacePage;
