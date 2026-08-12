"use client";

import { Button, color, font, Modal, space, Table, tableIconButtonStyle, typography, type TableColumn } from "@maisa/ui";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { useState } from "react";
import { AppShellHeader } from "./AppShellHeader";

export interface SimpleCrudPageProps<T extends { id: string }> {
  title: string;
  eyebrow?: string;
  activeNavId?: string;
  createLabel?: string;
  columns: TableColumn<T>[];
  useList: () => UseQueryResult<T[]>;
  useRemove: () => UseMutationResult<void, unknown, string>;
  getRowLabel: (row: T) => string;
  /** Renders the create/edit form inside the modal. */
  renderForm: (props: { item?: T; onDone: () => void }) => React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
}

/**
 * Generic list+create+edit+delete page shell used by every Tier 2 (mock
 * data) feature — vendors, calendar, checklists, crm, inventory,
 * marketplace, templates. Each of those supplies columns/a form and gets a
 * fully working page; this is the one place their shared behavior lives.
 */
export function SimpleCrudPage<T extends { id: string }>({
  title,
  eyebrow,
  activeNavId,
  createLabel = "+ New",
  columns,
  useList,
  useRemove,
  getRowLabel,
  renderForm,
  emptyTitle = "Nothing here yet",
  emptyDescription = "Add the first one to get started.",
}: SimpleCrudPageProps<T>) {
  const { data: rows = [], isLoading } = useList();
  const remove = useRemove();
  const [modal, setModal] = useState<{ mode: "closed" } | { mode: "create" } | { mode: "edit"; item: T }>({
    mode: "closed",
  });

  function handleDelete(row: T) {
    if (window.confirm(`Delete "${getRowLabel(row)}"?`)) {
      remove.mutate(row.id);
    }
  }

  return (
    <div style={{ background: color.background, color: color.onSurface, fontFamily: font.sans, minHeight: "100%" }}>
      <AppShellHeader activeNavId={activeNavId} />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: `${space(6)} ${space(8)} ${space(15)}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: space(4), gap: space(2), flexWrap: "wrap" }}>
          <div>
            {eyebrow && <p style={{ ...typography.labelCaps, color: color.mutedGold, margin: 0, marginBottom: space(1) }}>{eyebrow}</p>}
            <h1 style={{ ...typography.headlineLg, fontSize: "36px", margin: 0 }}>{title}</h1>
          </div>
          <Button onClick={() => setModal({ mode: "create" })}>{createLabel}</Button>
        </div>

        <div style={{ background: color.surfaceContainerLowest, border: `1px solid ${color.borderSubtle}`, borderRadius: "0.375rem", padding: space(2) }}>
          <Table
            columns={columns}
            rows={rows}
            getRowId={(r) => r.id}
            loading={isLoading}
            onRowClick={(r) => setModal({ mode: "edit", item: r })}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
            rowActions={(r) => (
              <>
                <button style={tableIconButtonStyle} onClick={() => setModal({ mode: "edit", item: r })}>
                  Edit
                </button>
                <button style={tableIconButtonStyle} onClick={() => handleDelete(r)}>
                  Delete
                </button>
              </>
            )}
          />
        </div>
      </main>

      <Modal
        open={modal.mode !== "closed"}
        onClose={() => setModal({ mode: "closed" })}
        title={modal.mode === "edit" ? `Edit ${title.replace(/s$/, "")}` : `New ${title.replace(/s$/, "")}`}
      >
        {renderForm({
          item: modal.mode === "edit" ? modal.item : undefined,
          onDone: () => setModal({ mode: "closed" }),
        })}
      </Modal>
    </div>
  );
}

export default SimpleCrudPage;
