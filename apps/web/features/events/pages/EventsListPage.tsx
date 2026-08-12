"use client";

import { Button, color, font, Modal, space, Table, tableIconButtonStyle, typography, type TableColumn } from "@maisa/ui";
import { useRouter } from "next/navigation";
import { useState, type MouseEvent } from "react";
import { AppShellHeader } from "@/components/AppShellHeader";
import { useClients } from "../../clients/hooks";
import { useLogoutAction } from "../../authentication/actions";
import { useSession } from "../../authentication/store";
import { useEventsActions } from "../actions";
import { EventForm } from "../components/EventForm";
import { EventStatusPill } from "../components/EventStatusPill";
import { useDeleteEvent, useEvent, useEvents } from "../hooks";
import { useEventsUiStore } from "../store";
import type { Event } from "../types";

export function EventsListPage() {
  const router = useRouter();
  const session = useSession();
  const logout = useLogoutAction();

  const [page, setPage] = useState(1);
  const modal = useEventsUiStore((s) => s.modal);
  const { openCreate, openEdit, closeModal } = useEventsActions();

  const { data, isLoading } = useEvents({ page, limit: 20 });
  const { data: clientsPage } = useClients({ limit: 100 });
  const { data: editingEvent } = useEvent(modal.mode === "edit" ? modal.eventId : undefined);
  const deleteEvent = useDeleteEvent();

  const clientNameById = new Map((clientsPage?.data ?? []).map((c) => [c.id, c.name]));

  const columns: TableColumn<Event>[] = [
    { key: "name", header: "Event", render: (e) => <span style={{ fontWeight: 600 }}>{e.name}</span> },
    { key: "client", header: "Client", render: (e) => clientNameById.get(e.clientId) ?? "—" },
    { key: "date", header: "Date", render: (e) => (e.eventDate ? new Date(e.eventDate).toLocaleDateString() : "TBD") },
    { key: "venue", header: "Venue", render: (e) => e.venueName ?? "—" },
    { key: "status", header: "Status", render: (e) => <EventStatusPill status={e.status} /> },
  ];

  function handleDelete(event: Event, e: MouseEvent) {
    e.stopPropagation();
    if (window.confirm(`Delete "${event.name}"? This can't be undone.`)) {
      deleteEvent.mutate(event.id);
    }
  }

  return (
    <div style={{ background: color.background, color: color.onSurface, fontFamily: font.sans, minHeight: "100%" }}>
      <AppShellHeader activeNavId="events" />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: `${space(6)} ${space(8)} ${space(15)}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: space(4), gap: space(2), flexWrap: "wrap" }}>
          <div>
            <p style={{ ...typography.labelCaps, color: color.mutedGold, margin: 0, marginBottom: space(1) }}>
              {session?.organizationName ?? "Your organization"}
            </p>
            <h1 style={{ ...typography.headlineLg, fontSize: "36px", margin: 0 }}>Events</h1>
          </div>
          <div style={{ display: "flex", gap: space(1.5) }}>
            <Button variant="ghost" onClick={logout}>
              Log Out
            </Button>
            <Button onClick={openCreate}>+ New Event</Button>
          </div>
        </div>

        <div style={{ background: color.surfaceContainerLowest, border: `1px solid ${color.borderSubtle}`, borderRadius: "0.375rem", padding: space(2) }}>
          <Table
            columns={columns}
            rows={data?.data ?? []}
            getRowId={(e) => e.id}
            loading={isLoading}
            onRowClick={(e) => router.push(`/events/${e.id}`)}
            emptyTitle="No events yet"
            emptyDescription="Create your first event to start building its timeline, guest list, and budget."
            rowActions={(e) => (
              <>
                <button
                  style={tableIconButtonStyle}
                  onClick={(evt) => {
                    evt.stopPropagation();
                    openEdit(e.id);
                  }}
                >
                  Edit
                </button>
                <button style={tableIconButtonStyle} onClick={(evt) => handleDelete(e, evt)}>
                  Delete
                </button>
              </>
            )}
          />
        </div>

        {data && data.meta.totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: space(1), marginTop: space(3) }}>
            <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span style={{ alignSelf: "center", fontSize: "14px", color: color.onSurfaceVariant }}>
              Page {data.meta.page} of {data.meta.totalPages}
            </span>
            <Button variant="secondary" disabled={page >= data.meta.totalPages} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        )}
      </main>

      <Modal open={modal.mode !== "closed"} onClose={closeModal} title={modal.mode === "edit" ? "Edit Event" : "New Event"}>
        <EventForm event={modal.mode === "edit" ? editingEvent : undefined} onDone={closeModal} />
      </Modal>
    </div>
  );
}

export default EventsListPage;
