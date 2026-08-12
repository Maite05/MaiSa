import type { ReactNode } from "react";
import { color, font, space, typography } from "../theme/tokens";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div style={{ textAlign: "center", padding: `${space(6)} ${space(3)}` }}>
      <p style={{ fontFamily: font.serif, fontSize: "20px", margin: 0 }}>{title}</p>
      {description && (
        <p style={{ ...typography.bodyMd, color: color.onSurfaceVariant, margin: `${space(1)} 0 0` }}>{description}</p>
      )}
      {action && <div style={{ marginTop: space(2.5) }}>{action}</div>}
    </div>
  );
}

export default EmptyState;
