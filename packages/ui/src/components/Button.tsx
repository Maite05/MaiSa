import { forwardRef, type ButtonHTMLAttributes, type CSSProperties } from "react";
import { color, font, radius, space, typography } from "../theme/tokens";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Shows a spinner and disables the button. */
  loading?: boolean;
}

const VARIANT_STYLE: Record<ButtonVariant, CSSProperties> = {
  primary: { background: color.primary, color: color.onPrimary, border: "none" },
  secondary: { background: "transparent", color: color.primary, border: `1px solid ${color.primary}` },
  ghost: { background: "transparent", color: color.primary, border: "none" },
  danger: { background: color.error, color: color.onError, border: "none" },
};

/**
 * DESIGN.md Buttons spec: solid Deep Brown primary / outlined secondary /
 * text-only ghost, 4px radius, high-letter-spaced label typography.
 * Every feature's forms and toolbars should use this instead of one-off
 * <button className="..."> styling.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", loading = false, disabled, style, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      style={{
        ...typography.labelCaps,
        letterSpacing: "0.08em",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: space(1),
        padding: `${space(1.5)} ${space(2.5)}`,
        borderRadius: radius.DEFAULT,
        fontFamily: font.sans,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.6 : 1,
        transition: "opacity 150ms ease, background-color 150ms ease",
        ...VARIANT_STYLE[variant],
        ...style,
      }}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden
          style={{
            width: 12,
            height: 12,
            borderRadius: radius.full,
            border: `2px solid currentColor`,
            borderTopColor: "transparent",
            animation: "maisa-spin 0.7s linear infinite",
          }}
        />
      )}
      {children}
    </button>
  );
});

export default Button;
