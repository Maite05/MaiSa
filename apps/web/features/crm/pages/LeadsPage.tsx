"use client";

import { StatusPill, type StatusTone, type TableColumn } from "@maisa/ui";
import { SimpleCrudPage } from "@/components/SimpleCrudPage";
import { LeadForm } from "../components/LeadForm";
import { useLeads, useRemoveLead } from "../hooks";
import type { Lead, LeadStage } from "../types";

const STAGE_TONE: Record<LeadStage, StatusTone> = {
  NEW: "neutral",
  CONTACTED: "info",
  QUALIFIED: "warning",
  WON: "success",
  LOST: "danger",
};

const columns: TableColumn<Lead>[] = [
  { key: "name", header: "Lead", render: (l) => <span style={{ fontWeight: 600 }}>{l.name}</span> },
  { key: "company", header: "Company", render: (l) => l.company ?? "—" },
  { key: "email", header: "Email", render: (l) => l.email },
  { key: "stage", header: "Stage", render: (l) => <StatusPill label={l.stage} tone={STAGE_TONE[l.stage]} /> },
];

export function LeadsPage() {
  return (
    <SimpleCrudPage<Lead>
      title="CRM"
      eyebrow="Leads Pipeline"
      activeNavId="crm"
      createLabel="+ Add Lead"
      columns={columns}
      useList={useLeads}
      useRemove={useRemoveLead}
      getRowLabel={(l) => l.name}
      renderForm={({ item, onDone }) => <LeadForm item={item} onDone={onDone} />}
      emptyTitle="No leads yet"
      emptyDescription="Track prospective clients here before they become a booked event."
    />
  );
}

export default LeadsPage;
