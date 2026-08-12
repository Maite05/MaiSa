"use client";

import type { TableColumn } from "@maisa/ui";
import { SimpleCrudPage } from "@/components/SimpleCrudPage";
import { CalendarEntryForm } from "../components/CalendarEntryForm";
import { useCalendarEntries, useRemoveCalendarEntry } from "../hooks";
import type { CalendarEntry } from "../types";

const columns: TableColumn<CalendarEntry>[] = [
  { key: "title", header: "Title", render: (e) => <span style={{ fontWeight: 600 }}>{e.title}</span> },
  { key: "date", header: "Date", render: (e) => new Date(e.date).toLocaleDateString() },
  { key: "allDay", header: "All Day", render: (e) => (e.allDay ? "Yes" : "No") },
  { key: "notes", header: "Notes", render: (e) => e.notes ?? "—" },
];

export function CalendarListPage() {
  return (
    <SimpleCrudPage<CalendarEntry>
      title="Calendar"
      activeNavId="calendar"
      createLabel="+ Add Entry"
      columns={columns}
      useList={useCalendarEntries}
      useRemove={useRemoveCalendarEntry}
      getRowLabel={(e) => e.title}
      renderForm={({ item, onDone }) => <CalendarEntryForm item={item} onDone={onDone} />}
      emptyTitle="Nothing scheduled"
      emptyDescription="Add reminders and appointments that aren't tied to a specific event."
    />
  );
}

export default CalendarListPage;
