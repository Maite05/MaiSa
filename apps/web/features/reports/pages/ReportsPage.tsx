"use client";

import { Button, color, font, Modal, space, Table, tableIconButtonStyle, typography, type TableColumn } from "@maisa/ui";
import { useState } from "react";
import { AppShellHeader } from "@/components/AppShellHeader";
import { GenerateReportForm } from "../components/GenerateReportForm";
import { useDeleteReport, useReports } from "../hooks";
import type { SavedReport } from "../types";

const columns: TableColumn<SavedReport>[] = [
  { key: "name", header: "Report", render: (r) => <span style={{ fontWeight: 600 }}>{r.name}</span> },
  { key: "type", header: "Type", render: (r) => r.type },
  { key: "generated", header: "Generated", render: (r) => new Date(r.generatedAt).toLocaleString() },
];

export function ReportsPage() {
  const { data: reports = [], isLoading } = useReports();
  const deleteReport = useDeleteReport();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div style={{ background: color.background, color: color.onSurface, fontFamily: font.sans, minHeight: "100%" }}>
      <AppShellHeader activeNavId="reports" />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: `${space(6)} ${space(8)} ${space(15)}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: space(4) }}>
          <div>
            <p style={{ ...typography.labelCaps, color: color.mutedGold, margin: 0, marginBottom: space(1) }}>Business Reports</p>
            <h1 style={{ ...typography.headlineLg, fontSize: "36px", margin: 0 }}>Reports</h1>
          </div>
          <Button onClick={() => setModalOpen(true)}>+ Generate Report</Button>
        </div>

        <div style={{ background: color.surfaceContainerLowest, border: `1px solid ${color.borderSubtle}`, borderRadius: "0.375rem", padding: space(2) }}>
          <Table
            columns={columns}
            rows={reports}
            getRowId={(r) => r.id}
            loading={isLoading}
            emptyTitle="No reports generated yet"
            emptyDescription="Generate a report to get a point-in-time export of your data."
            rowActions={(r) => (
              <button
                style={tableIconButtonStyle}
                onClick={() => {
                  if (window.confirm(`Delete "${r.name}"?`)) deleteReport.mutate(r.id);
                }}
              >
                Delete
              </button>
            )}
          />
        </div>
      </main>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Generate Report">
        <GenerateReportForm onDone={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default ReportsPage;
