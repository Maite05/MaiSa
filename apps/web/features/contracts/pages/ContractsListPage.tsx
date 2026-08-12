"use client";

import { Button, color, font, Modal, space, Table, tableIconButtonStyle, type TableColumn } from "@maisa/ui";
import { EventScopedPageHeader } from "@/components/EventScopedPageHeader";
import { useContractsActions } from "../actions";
import { ContractForm } from "../components/ContractForm";
import { ContractStatusPill } from "../components/ContractStatusPill";
import { useContracts, useDeleteContract } from "../hooks";
import { useContractsUiStore } from "../store";
import type { Contract } from "../types";

export function ContractsListPage({ eventId }: { eventId: string }) {
  const modal = useContractsUiStore((s) => s.modal);
  const { openCreate, openEdit, closeModal } = useContractsActions();
  const { data, isLoading } = useContracts(eventId, { limit: 200 });
  const deleteContract = useDeleteContract(eventId);

  const contracts = data?.data ?? [];
  const editingContract = modal.mode === "edit" ? contracts.find((c) => c.id === modal.contractId) : undefined;

  const columns: TableColumn<Contract>[] = [
    { key: "title", header: "Contract", render: (c) => <span style={{ fontWeight: 600 }}>{c.title}</span> },
    { key: "status", header: "Status", render: (c) => <ContractStatusPill status={c.status} /> },
    { key: "signed", header: "Signed On", render: (c) => (c.signedAt ? new Date(c.signedAt).toLocaleDateString() : "—") },
    {
      key: "doc",
      header: "Document",
      render: (c) =>
        c.documentUrl ? (
          <a href={c.documentUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
            View
          </a>
        ) : (
          "—"
        ),
    },
  ];

  return (
    <div style={{ background: color.background, color: color.onSurface, fontFamily: font.sans, minHeight: "100%" }}>
      <EventScopedPageHeader eventId={eventId} title="Contracts" />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: `0 ${space(8)} ${space(15)}` }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: space(2) }}>
          <Button onClick={openCreate}>+ Add Contract</Button>
        </div>

        <div style={{ background: color.surfaceContainerLowest, border: `1px solid ${color.borderSubtle}`, borderRadius: "0.375rem", padding: space(2) }}>
          <Table
            columns={columns}
            rows={contracts}
            getRowId={(c) => c.id}
            loading={isLoading}
            onRowClick={(c) => openEdit(c.id)}
            emptyTitle="No contracts yet"
            emptyDescription="Track vendor and client contracts here as they're drafted, sent, and signed."
            rowActions={(c) => (
              <>
                <button style={tableIconButtonStyle} onClick={() => openEdit(c.id)}>
                  Edit
                </button>
                <button
                  style={tableIconButtonStyle}
                  onClick={() => {
                    if (window.confirm(`Delete "${c.title}"?`)) deleteContract.mutate(c.id);
                  }}
                >
                  Delete
                </button>
              </>
            )}
          />
        </div>
      </main>

      <Modal open={modal.mode !== "closed"} onClose={closeModal} title={modal.mode === "edit" ? "Edit Contract" : "Add Contract"}>
        <ContractForm eventId={eventId} contract={editingContract} onDone={closeModal} />
      </Modal>
    </div>
  );
}

export default ContractsListPage;
