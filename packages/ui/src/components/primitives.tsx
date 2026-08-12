import type { CSSProperties } from "react";
import { color, radius, shadow, space } from "../theme/tokens";

/**
 * Shared building blocks used across screens (ProductionOverview,
 * EventDetail, ...) so card chrome and the progress-bar treatment stay
 * pixel-identical instead of drifting between files.
 */

export const cardStyle: CSSProperties = {
  background: color.surfaceContainerLowest,
  border: `1px solid ${color.borderSubtle}`,
  borderRadius: radius.md,
  padding: space(3.5),
  boxShadow: shadow.ambient,
};

export const cardHeaderRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: space(2),
  marginBottom: space(2.5),
};

export type ProgressTone = "primary" | "gold" | "muted" | "sage";

const PROGRESS_FILL: Record<ProgressTone, string> = {
  primary: color.primary,
  gold: color.mutedGold,
  muted: color.outlineVariant,
  sage: color.secondary,
};

export function ProgressBar({
  progress,
  tone = "primary",
}: {
  /** 0-100 */
  progress: number;
  tone?: ProgressTone;
}) {
  const clamped = Math.max(0, Math.min(100, progress));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        height: 6,
        borderRadius: radius.full,
        background: color.surfaceContainerHigh,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${clamped}%`,
          height: "100%",
          background: PROGRESS_FILL[tone],
          borderRadius: radius.full,
          transition: "width 300ms ease",
        }}
      />
    </div>
  );
}
