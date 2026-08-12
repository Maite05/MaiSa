import { color, font, space } from "@maisa/ui";
import type { ReactNode } from "react";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: color.background,
        padding: space(3),
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        <p style={{ fontFamily: font.serif, fontSize: "28px", textAlign: "center", marginBottom: space(4) }}>MaiSa</p>
        <div
          style={{
            background: color.surfaceContainerLowest,
            border: `1px solid ${color.borderSubtle}`,
            borderRadius: "0.375rem",
            padding: space(4),
          }}
        >
          <h1 style={{ fontFamily: font.serif, fontSize: "26px", fontWeight: 400, margin: 0 }}>{title}</h1>
          <p style={{ color: color.onSurfaceVariant, fontSize: "14px", margin: `${space(1)} 0 ${space(3)}` }}>{subtitle}</p>
          {children}
        </div>
        <p style={{ textAlign: "center", fontSize: "14px", color: color.onSurfaceVariant, marginTop: space(2.5) }}>
          {footer}
        </p>
      </div>
    </div>
  );
}

export default AuthLayout;
