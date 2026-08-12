import { ProductionOverview } from "@/features/dashboard/pages/ProductionOverview";

// Home route ("/"): the Production Overview dashboard.
// This route file stays a thin Server Component wrapper — the real page
// composition lives in the dashboard feature; swap in a server fetch here
// and pass the result down as props once real data is available.
export default function HomePage() {
  return <ProductionOverview />;
}
