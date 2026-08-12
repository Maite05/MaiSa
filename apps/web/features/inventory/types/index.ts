// No apps/api module exists yet — physical/rental inventory (linens,
// signage, AV gear) an org owns and tracks across events.
export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  location?: string;
}
