import type { ReactNode } from "react";
import { color, radius, space, typography } from "../theme/tokens";
import { EmptyState } from "./EmptyState";
import { Spinner } from "./Spinner";

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  /** Defaults to left; use for numeric columns like currency amounts. */
  align?: "left" | "right";
  width?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Rendered on the right of each row, e.g. edit/delete icon buttons. */
  rowActions?: (row: T) => ReactNode;
}

/**
 * Generic data table used by every feature's list page — hairline row
 * dividers, label-caps column headers, per DESIGN.md's "Lists & Dividers".
 * Feature code only supplies columns + rows, not markup.
 */
export function Table<T>({
  columns,
  rows,
  getRowId,
  onRowClick,
  loading = false,
  emptyTitle = "Nothing here yet",
  emptyDescription = "Once records are added they'll show up in this list.",
  rowActions,
}: TableProps<T>) {
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: space(6) }}>
        <Spinner />
      </div>
    );
  }

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  ...typography.labelCaps,
                  textAlign: col.align ?? "left",
                  color: color.onSurfaceVariant,
                  fontWeight: 600,
                  padding: `${space(1)} ${space(1.5)}`,
                  borderBottom: `1px solid ${color.borderSubtle}`,
                  width: col.width,
                  whiteSpace: "nowrap",
                }}
              >
                {col.header}
              </th>
            ))}
            {rowActions && <th style={{ borderBottom: `1px solid ${color.borderSubtle}` }} />}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const id = getRowId(row);
            return (
              <tr
                key={id}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                style={{ cursor: onRowClick ? "pointer" : "default" }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      textAlign: col.align ?? "left",
                      padding: `${space(1.5)}`,
                      borderBottom: `1px solid ${color.borderSubtle}`,
                      fontSize: "14px",
                    }}
                  >
                    {col.render(row)}
                  </td>
                ))}
                {rowActions && (
                  <td
                    style={{
                      textAlign: "right",
                      padding: `${space(1.5)}`,
                      borderBottom: `1px solid ${color.borderSubtle}`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: space(1) }}>{rowActions(row)}</div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export const tableIconButtonStyle = {
  border: `1px solid ${color.borderSubtle}`,
  borderRadius: radius.sm,
  background: color.surfaceContainerLowest,
  color: color.onSurfaceVariant,
  padding: `${space(0.5)} ${space(1)}`,
  fontSize: "12px",
  cursor: "pointer",
};
