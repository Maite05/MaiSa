"use client";

import type { TableColumn } from "@maisa/ui";
import { SimpleCrudPage } from "@/components/SimpleCrudPage";
import { EventTemplateForm } from "../components/EventTemplateForm";
import { useEventTemplates, useRemoveEventTemplate } from "../hooks";
import type { EventTemplate } from "../types";

const columns: TableColumn<EventTemplate>[] = [
  { key: "name", header: "Template", render: (t) => <span style={{ fontWeight: 600 }}>{t.name}</span> },
  { key: "category", header: "Category", render: (t) => t.category },
  { key: "description", header: "Description", render: (t) => t.description || "—" },
];

export function EventTemplatesPage() {
  return (
    <SimpleCrudPage<EventTemplate>
      title="Templates"
      activeNavId="templates"
      createLabel="+ New Template"
      columns={columns}
      useList={useEventTemplates}
      useRemove={useRemoveEventTemplate}
      getRowLabel={(t) => t.name}
      renderForm={({ item, onDone }) => <EventTemplateForm item={item} onDone={onDone} />}
      emptyTitle="No templates yet"
      emptyDescription="Save a reusable starting point for common event types."
    />
  );
}

export default EventTemplatesPage;
