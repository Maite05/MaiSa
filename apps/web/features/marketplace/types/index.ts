// No apps/api module exists yet — a curated directory of external vendor
// listings an org can browse/book, distinct from features/vendors' own
// private roster of vendors they've already worked with.
export interface MarketplaceListing {
  id: string;
  title: string;
  vendorName: string;
  price: number;
  category: string;
}
