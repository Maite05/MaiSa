/**
 * Design tokens mirrored from /DESIGN.md ("Luxe Concierge Editorial").
 *
 * Kept as a plain TS object (not Tailwind config) so it can back either
 * inline styles or a future Tailwind theme extension without duplication.
 */

export const color = {
  surface: "#fff8f4",
  surfaceDim: "#e2d8d1",
  surfaceBright: "#fff8f4",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#fcf2eb",
  surfaceContainer: "#f6ece5",
  surfaceContainerHigh: "#f0e6df",
  surfaceContainerHighest: "#eae1da",
  onSurface: "#1f1b17",
  onSurfaceVariant: "#4e453e",
  inverseSurface: "#34302b",
  inverseOnSurface: "#f9efe8",
  outline: "#80756d",
  outlineVariant: "#d2c4bb",
  primary: "#322214",
  onPrimary: "#ffffff",
  primaryContainer: "#4a3728",
  onPrimaryContainer: "#bba08c",
  secondary: "#566342",
  onSecondary: "#ffffff",
  secondaryContainer: "#d7e5bb",
  onSecondaryContainer: "#5a6745",
  tertiary: "#252523",
  error: "#ba1a1a",
  onError: "#ffffff",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",
  background: "#fff8f4",
  onBackground: "#1f1b17",
  ivoryBg: "#fcf9f4",
  deepEspresso: "#4a3728",
  softSage: "#a3b18a",
  mutedGold: "#c5a059",
  borderSubtle: "#e5e1da",
} as const;

// `var(--font-serif)` / `var(--font-sans)` let a host app swap in a real
// loaded webfont (e.g. via next/font, which sets these on <html>) while
// still degrading gracefully to system fonts if the vars are never set.
export const font = {
  serif: "var(--font-serif), 'EB Garamond', Georgia, 'Times New Roman', serif",
  sans: "var(--font-sans), 'Hanken Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
} as const;

export const typography = {
  headlineXl: { fontFamily: font.serif, fontSize: "48px", fontWeight: 400, lineHeight: 1.2 },
  headlineLg: { fontFamily: font.serif, fontSize: "32px", fontWeight: 400, lineHeight: 1.3 },
  headlineMd: { fontFamily: font.serif, fontSize: "24px", fontWeight: 500, lineHeight: 1.4 },
  bodyLg: { fontFamily: font.sans, fontSize: "18px", fontWeight: 400, lineHeight: 1.6 },
  bodyMd: { fontFamily: font.sans, fontSize: "16px", fontWeight: 400, lineHeight: 1.6 },
  labelCaps: {
    fontFamily: font.sans,
    fontSize: "12px",
    fontWeight: 600,
    lineHeight: 1,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  labelSm: { fontFamily: font.sans, fontSize: "14px", fontWeight: 500, lineHeight: 1.2 },
} as const;

export const radius = {
  sm: "0.125rem",
  DEFAULT: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  full: "9999px",
} as const;

/** 8px base unit — every spacing value in the system is a multiple of this. */
export const space = (units: number): string => `${units * 8}px`;

export const shadow = {
  /** Ambient shadow: Deep Brown at low opacity, large blur — "diffused light". */
  ambient: "0 12px 32px rgba(74, 55, 40, 0.06)",
  ambientLg: "0 20px 48px rgba(74, 55, 40, 0.08)",
} as const;

export const tokens = { color, font, typography, radius, space, shadow };
