"use client";

import { Button, color, font, Modal, space, tableIconButtonStyle } from "@maisa/ui";
import { EventScopedPageHeader } from "@/components/EventScopedPageHeader";
import { formatDate } from "../../../lib/format";
import { useDocumentsActions } from "../actions";
import { DocumentForm } from "../components/DocumentForm";
import { useDeleteDocument, useDocuments } from "../hooks";
import { useDocumentsUiStore } from "../store";

export function DocumentsListPage({ eventId }: { eventId: string }) {
  const createModalOpen = useDocumentsUiStore((s) => s.createModalOpen);
  const { openCreate, closeModal } = useDocumentsActions();
  const { data, isLoading } = useDocuments(eventId, { limit: 200 });
  const deleteDocument = useDeleteDocument(eventId);

  const documents = data?.data ?? [];

  return (
    <div style={{ background: color.background, color: color.onSurface, fontFamily: font.sans, minHeight: "100%" }}>
      <EventScopedPageHeader eventId={eventId} title="Documents" />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: `0 ${space(8)} ${space(15)}` }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: space(2) }}>
          <Button onClick={openCreate}>+ Add Document</Button>
        </div>

        {isLoading ? (
          <p style={{ color: color.onSurfaceVariant }}>Loading…</p>
        ) : documents.length === 0 ? (
          <p style={{ color: color.onSurfaceVariant }}>No documents linked to this event yet.</p>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: space(2) }}>
            {documents.map((doc) => (
              <li key={doc.id} style={{ border: `1px solid ${color.borderSubtle}`, borderRadius: "0.375rem", padding: space(2) }}>
                <a href={doc.url} target="_blank" rel="noreferrer" style={{ fontWeight: 600, display: "block", marginBottom: space(0.5) }}>
                  {doc.name}
                </a>
                <p style={{ margin: 0, fontSize: "12px", color: color.onSurfaceVariant }}>
                  {doc.mimeType ?? "Unknown type"} · Added {formatDate(doc.createdAt)}
                </p>
                <button
                  style={{ ...tableIconButtonStyle, marginTop: space(1) }}
                  onClick={() => {
                    if (window.confirm(`Remove "${doc.name}"?`)) deleteDocument.mutate(doc.id);
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      <Modal open={createModalOpen} onClose={closeModal} title="Add Document">
        <DocumentForm eventId={eventId} onDone={closeModal} />
      </Modal>
    </div>
  );
}

export default DocumentsListPage;
