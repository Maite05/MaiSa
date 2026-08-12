import { color, radius, space, typography } from "../theme/tokens";

export type StatusTone = "neutral" | "success" | "warning" | "info" | "danger";

const TONE_STYLE: Record<StatusTone, { background: string; color: string }> = {
  neutral: { background: color.surfaceContainerHigh, color: color.onSurfaceVariant },
  success: { background: color.secondaryContainer, color: color.onSecondaryContainer },
  warning: { background: "rgba(197, 160, 89, 0.18)", color: "#8a6a2f" },
  info: { background: color.primaryContainer, color: color.inverseOnSurface },
  danger: { background: color.errorContainer, color: color.onErrorContainer },
};

export interface StatusPillProps {
  label: string;
  tone?: StatusTone;
}

/** The pill/badge treatment used for every enum status across features (EventStatus, RsvpStatus, TaskStatus, ...). */
export function StatusPill({ label, tone = "neutral" }: StatusPillProps) {
  return (
    <span
      style={{
        ...typography.labelCaps,
        ...TONE_STYLE[tone],
        padding: `${space(0.5)} ${space(1.25)}`,
        borderRadius: radius.full,
        letterSpacing: "0.08em",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

export default StatusPill;
