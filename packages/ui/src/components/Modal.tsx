"use client";

import { useEffect, type ReactNode } from "react";
import { color, font, radius, shadow, space } from "../theme/tokens";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Minimal modal: backdrop click + Escape both close it. Deliberately not a
 * full focus-trap implementation (no external dependency pulled in for
 * that) — fine for the create/edit forms every feature uses this for, but
 * revisit if this needs to satisfy a stricter accessibility audit.
 */
export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(74, 55, 40, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: space(2),
        zIndex: 100,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: color.surfaceContainerLowest,
          borderRadius: radius.md,
          boxShadow: shadow.ambientLg,
          width: "100%",
          maxWidth: 480,
          maxHeight: "90vh",
          overflowY: "auto",
          padding: space(3.5),
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: space(2.5) }}>
          <h2 style={{ fontFamily: font.serif, fontSize: "22px", fontWeight: 400, margin: 0 }}>{title}</h2>
          <button
            aria-label="Close"
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", lineHeight: 1, color: color.onSurfaceVariant }}
          >
            ×
          </button>
        </div>
        {children}
        {footer && <div style={{ marginTop: space(3), display: "flex", justifyContent: "flex-end", gap: space(1.5) }}>{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
