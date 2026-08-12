"use client";

import { Button, color, font, Modal, space, tableIconButtonStyle } from "@maisa/ui";
import { EventScopedPageHeader } from "@/components/EventScopedPageHeader";
import { formatDateTime, formatTime } from "../../../lib/format";
import { useTimelineActions } from "../actions";
import { TimelineItemForm } from "../components/TimelineItemForm";
import { useDeleteTimelineItem, useTimelineItems } from "../hooks";
import { sortByStartTime } from "../services";
import { useTimelineUiStore } from "../store";

export function TimelinePage({ eventId }: { eventId: string }) {
  const modal = useTimelineUiStore((s) => s.modal);
  const { openCreate, openEdit, closeModal } = useTimelineActions();
  const { data, isLoading } = useTimelineItems(eventId, { limit: 200 });
  const deleteItem = useDeleteTimelineItem(eventId);

  const items = sortByStartTime(data?.data ?? []);
  const editingItem = modal.mode === "edit" ? items.find((i) => i.id === modal.itemId) : undefined;

  return (
    <div style={{ background: color.background, color: color.onSurface, fontFamily: font.sans, minHeight: "100%" }}>
      <EventScopedPageHeader eventId={eventId} title="Timeline" />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: `0 ${space(8)} ${space(15)}` }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: space(2) }}>
          <Button onClick={openCreate}>+ Add Timeline Item</Button>
        </div>

        {isLoading ? (
          <p style={{ color: color.onSurfaceVariant }}>Loading…</p>
        ) : items.length === 0 ? (
          <p style={{ color: color.onSurfaceVariant }}>No timeline items yet. Add the first one to start building the run-of-show.</p>
        ) : (
          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {items.map((item) => (
              <li
                key={item.id}
                style={{
                  display: "flex",
                  gap: space(2),
                  padding: `${space(2)} 0`,
                  borderBottom: `1px solid ${color.borderSubtle}`,
                }}
              >
                <div style={{ width: 140, flexShrink: 0, color: color.onSurfaceVariant, fontSize: "13px" }}>
                  {formatTime(item.startTime)}
                  {item.endTime ? ` – ${formatTime(item.endTime)}` : ""}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>{item.title}</p>
                  {item.notes && <p style={{ margin: `${space(0.5)} 0 0`, fontSize: "13px", color: color.onSurfaceVariant }}>{item.notes}</p>}
                  <p style={{ margin: `${space(0.5)} 0 0`, fontSize: "11px", color: color.outline }}>{formatDateTime(item.startTime)}</p>
                </div>
                <div style={{ display: "flex", gap: space(1), alignSelf: "flex-start" }}>
                  <button style={tableIconButtonStyle} onClick={() => openEdit(item.id)}>
                    Edit
                  </button>
                  <button
                    style={tableIconButtonStyle}
                    onClick={() => {
                      if (window.confirm(`Remove "${item.title}" from the timeline?`)) deleteItem.mutate(item.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ol>
        )}
      </main>

      <Modal open={modal.mode !== "closed"} onClose={closeModal} title={modal.mode === "edit" ? "Edit Timeline Item" : "Add Timeline Item"}>
        <TimelineItemForm eventId={eventId} item={editingItem} onDone={closeModal} />
      </Modal>
    </div>
  );
}

export default TimelinePage;
