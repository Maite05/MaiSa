"use client";

import { Button, color, font, Modal, space, Table, tableIconButtonStyle, typography, type TableColumn } from "@maisa/ui";
import { useState } from "react";
import { AppShellHeader } from "@/components/AppShellHeader";
import { useLogoutAction } from "../../authentication/actions";
import { useSession } from "../../authentication/store";
import { useClientsActions } from "../actions";
import { ClientForm } from "../components/ClientForm";
import { useClients, useDeleteClient } from "../hooks";
import { formatClientContact } from "../services";
import { useClientsUiStore } from "../store";
import type { Client } from "../types";

export function ClientsListPage() {
  const session = useSession();
  const logout = useLogoutAction();

  const [page, setPage] = useState(1);
  const search = useClientsUiStore((s) => s.search);
  const modal = useClientsUiStore((s) => s.modal);
  const { setSearch, openCreate, openEdit, closeModal } = useClientsActions();

  const { data, isLoading } = useClients({ page, limit: 20, search: search || undefined });
  const deleteClient = useDeleteClient();

  const editingClient: Client | undefined =
    modal.mode === "edit" ? data?.data.find((c) => c.id === modal.clientId) : undefined;

  const columns: TableColumn<Client>[] = [
    { key: "name", header: "Name", render: (c) => <span style={{ fontWeight: 600 }}>{c.name}</span> },
    { key: "contact", header: "Contact", render: (c) => formatClientContact(c) },
    {
      key: "notes",
      header: "Notes",
      render: (c) => (
        <span style={{ color: color.onSurfaceVariant }}>
          {c.notes ? (c.notes.length > 60 ? `${c.notes.slice(0, 60)}…` : c.notes) : "—"}
        </span>
      ),
    },
  ];

  function handleDelete(client: Client) {
    if (window.confirm(`Delete ${client.name}? This can't be undone.`)) {
      deleteClient.mutate(client.id);
    }
  }

  return (
    <div style={{ background: color.background, color: color.onSurface, fontFamily: font.sans, minHeight: "100%" }}>
      <AppShellHeader activeNavId="clients" />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: `${space(6)} ${space(8)} ${space(15)}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: space(4), gap: space(2), flexWrap: "wrap" }}>
          <div>
            <p style={{ ...typography.labelCaps, color: color.mutedGold, margin: 0, marginBottom: space(1) }}>
              {session?.organizationName ?? "Your organization"}
            </p>
            <h1 style={{ ...typography.headlineLg, fontSize: "36px", margin: 0 }}>Clients</h1>
          </div>
          <div style={{ display: "flex", gap: space(1.5) }}>
            <Button variant="ghost" onClick={logout}>
              Log Out
            </Button>
            <Button onClick={openCreate}>+ New Client</Button>
          </div>
        </div>

        <div style={{ marginBottom: space(2.5), maxWidth: 320 }}>
          <input
            aria-label="Search clients"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{
              width: "100%",
              padding: `${space(1.25)} ${space(1.5)}`,
              border: `1px solid ${color.borderSubtle}`,
              borderRadius: "0.375rem",
              fontSize: "14px",
              fontFamily: font.sans,
            }}
          />
        </div>

        <div style={{ background: color.surfaceContainerLowest, border: `1px solid ${color.borderSubtle}`, borderRadius: "0.375rem", padding: space(2) }}>
          <Table
            columns={columns}
            rows={data?.data ?? []}
            getRowId={(c) => c.id}
            loading={isLoading}
            onRowClick={(c) => openEdit(c.id)}
            emptyTitle="No clients yet"
            emptyDescription="Add your first client to start planning events for them."
            rowActions={(c) => (
              <>
                <button style={tableIconButtonStyle} onClick={() => openEdit(c.id)}>
                  Edit
                </button>
                <button style={tableIconButtonStyle} onClick={() => handleDelete(c)}>
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

      <Modal open={modal.mode !== "closed"} onClose={closeModal} title={modal.mode === "edit" ? "Edit Client" : "New Client"}>
        <ClientForm client={editingClient} onDone={closeModal} />
      </Modal>
    </div>
  );
}

export default ClientsListPage;
