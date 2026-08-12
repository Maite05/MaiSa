import type { EventDocument } from "../types";

/** Coarse file-type grouping from mimeType, for picking a display icon/label. */
export function getDocumentKind(doc: Pick<EventDocument, "mimeType">): "image" | "pdf" | "other" {
  if (!doc.mimeType) return "other";
  if (doc.mimeType.startsWith("image/")) return "image";
  if (doc.mimeType === "application/pdf") return "pdf";
  return "other";
}
