"use client";

import { color, font, space, Spinner, typography } from "@maisa/ui";
import { AppShellHeader } from "@/components/AppShellHeader";
import { formatCurrency } from "../../../lib/format";
import { useAnalyticsSummary } from "../hooks";
import { getRevenueGrowthPercent } from "../services";

export function AnalyticsPage() {
  const { data, isLoading } = useAnalyticsSummary();

  return (
    <div style={{ background: color.background, color: color.onSurface, fontFamily: font.sans, minHeight: "100%" }}>
      <AppShellHeader activeNavId="analytics" />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: `${space(6)} ${space(8)} ${space(15)}` }}>
        <p style={{ ...typography.labelCaps, color: color.mutedGold, margin: 0, marginBottom: space(1) }}>Business Performance</p>
        <h1 style={{ ...typography.headlineLg, fontSize: "36px", margin: `0 0 ${space(4)}` }}>Analytics</h1>

        {isLoading || !data ? (
          <Spinner />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: space(2) }}>
            {[
              {
                label: "Revenue This Month",
                value: formatCurrency(data.revenueThisMonth),
                sub: `${getRevenueGrowthPercent(data) >= 0 ? "+" : ""}${getRevenueGrowthPercent(data).toFixed(1)}% vs. last month`,
              },
              { label: "Active Events", value: String(data.activeEvents), sub: `${data.upcomingEventsCount} upcoming` },
              { label: "Avg. Budget Utilization", value: `${data.avgBudgetUtilizationPercent}%`, sub: "Across active events" },
            ].map((stat) => (
              <div key={stat.label} style={{ border: `1px solid ${color.borderSubtle}`, borderRadius: "0.375rem", padding: space(3) }}>
                <p style={{ ...typography.labelCaps, color: color.onSurfaceVariant, margin: 0 }}>{stat.label}</p>
                <p style={{ fontFamily: font.serif, fontSize: "32px", margin: `${space(1)} 0 ${space(0.5)}` }}>{stat.value}</p>
                <p style={{ fontSize: "13px", color: color.onSurfaceVariant, margin: 0 }}>{stat.sub}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AnalyticsPage;
