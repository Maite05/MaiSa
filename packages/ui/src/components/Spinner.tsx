import { color, radius } from "../theme/tokens";

export interface SpinnerProps {
  size?: number;
  color?: string;
}

/** Relies on the `@keyframes maisa-spin` declared once in the host app's global CSS. */
export function Spinner({ size = 20, color: colorProp = color.primary }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: radius.full,
        border: `2px solid ${color.surfaceContainerHigh}`,
        borderTopColor: colorProp,
        animation: "maisa-spin 0.7s linear infinite",
      }}
    />
  );
}

export default Spinner;
