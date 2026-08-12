"use client";

import { Button, color, font, Modal, space, Table, tableIconButtonStyle, type TableColumn } from "@maisa/ui";
import { EventScopedPageHeader } from "@/components/EventScopedPageHeader";
import { useGuestsActions } from "../actions";
import { GuestForm } from "../components/GuestForm";
import { RsvpPill } from "../components/RsvpPill";
import { useDeleteGuest, useGuests } from "../hooks";
import { summarizeGuests } from "../services";
import { useGuestsUiStore } from "../store";
import type { Guest } from "../types";

export function GuestsListPage({ eventId }: { eventId: string }) {
  const modal = useGuestsUiStore((s) => s.modal);
  const { openCreate, openEdit, closeModal } = useGuestsActions();
  const { data, isLoading } = useGuests(eventId, { limit: 200 });
  const deleteGuest = useDeleteGuest(eventId);

  const guests = data?.data ?? [];
  const editingGuest = modal.mode === "edit" ? guests.find((g) => g.id === modal.guestId) : undefined;
  const summary = summarizeGuests(guests);

  const columns: TableColumn<Guest>[] = [
    { key: "name", header: "Guest", render: (g) => <span style={{ fontWeight: 600 }}>{g.name}</span> },
    { key: "rsvp", header: "RSVP", render: (g) => <RsvpPill status={g.rsvpStatus} /> },
    { key: "plusOnes", header: "Plus Ones", align: "right", render: (g) => g.plusOnes },
    { key: "table", header: "Table", render: (g) => g.tableNumber ?? "—" },
    { key: "dietary", header: "Dietary Notes", render: (g) => g.dietaryNotes ?? "—" },
  ];

  function handleDelete(guest: Guest) {
    if (window.confirm(`Remove ${guest.name} from the guest list?`)) {
      deleteGuest.mutate(guest.id);
    }
  }

  return (
    <div style={{ background: color.background, color: color.onSurface, fontFamily: font.sans, minHeight: "100%" }}>
      <EventScopedPageHeader eventId={eventId} title="Guest List" />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: `0 ${space(8)} ${space(15)}` }}>
        <div style={{ display: "flex", gap: space(2), marginBottom: space(3), flexWrap: "wrap" }}>
          {[
            { label: "Total Guests", value: summary.totalGuests },
            { label: "Attending (w/ plus ones)", value: summary.attending },
            { label: "Declined", value: summary.declined },
            { label: "Pending / Maybe", value: summary.pendingOrMaybe },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{ flex: 1, minWidth: 140, border: `1px solid ${color.borderSubtle}`, borderRadius: "0.375rem", padding: space(2) }}
            >
              <p style={{ fontSize: "12px", color: color.onSurfaceVariant, margin: 0 }}>{stat.label}</p>
              <p style={{ fontFamily: font.serif, fontSize: "28px", margin: `${space(0.5)} 0 0` }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: space(2) }}>
          <Button onClick={openCreate}>+ Add Guest</Button>
        </div>

        <div style={{ background: color.surfaceContainerLowest, border: `1px solid ${color.borderSubtle}`, borderRadius: "0.375rem", padding: space(2) }}>
          <Table
            columns={columns}
            rows={guests}
            getRowId={(g) => g.id}
            loading={isLoading}
            onRowClick={(g) => openEdit(g.id)}
            emptyTitle="No guests added yet"
            emptyDescription="Add guests to start tracking RSVPs, plus ones, and seating."
            rowActions={(g) => (
              <>
                <button style={tableIconButtonStyle} onClick={() => openEdit(g.id)}>
                  Edit
                </button>
                <button style={tableIconButtonStyle} onClick={() => handleDelete(g)}>
                  Remove
                </button>
              </>
            )}
          />
        </div>
      </main>

      <Modal open={modal.mode !== "closed"} onClose={closeModal} title={modal.mode === "edit" ? "Edit Guest" : "Add Guest"}>
        <GuestForm eventId={eventId} guest={editingGuest} onDone={closeModal} />
      </Modal>
    </div>
  );
}

export default GuestsListPage;
