"use client";

import { color, font, space, typography } from "@maisa/ui";
import { AppShellHeader } from "@/components/AppShellHeader";
import { ChatComposer } from "../components/ChatComposer";
import { useAiChatStore } from "../store";

export function AiAssistantPage() {
  const messages = useAiChatStore((s) => s.messages);

  return (
    <div style={{ background: color.background, color: color.onSurface, fontFamily: font.sans, minHeight: "100%" }}>
      <AppShellHeader activeNavId="ai" />

      <main style={{ maxWidth: 720, margin: "0 auto", padding: `${space(6)} ${space(8)} ${space(15)}`, display: "flex", flexDirection: "column", height: "calc(100vh - 80px)" }}>
        <p style={{ ...typography.labelCaps, color: color.mutedGold, margin: 0, marginBottom: space(1) }}>AI Assistant</p>
        <h1 style={{ ...typography.headlineLg, fontSize: "36px", margin: `0 0 ${space(3)}` }}>Ask MaiSa</h1>

        <div style={{ flex: 1, overflowY: "auto", marginBottom: space(3) }}>
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                marginBottom: space(1.5),
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: `${space(1.25)} ${space(1.75)}`,
                  borderRadius: "0.5rem",
                  background: m.role === "user" ? color.primary : color.surfaceContainerHigh,
                  color: m.role === "user" ? color.onPrimary : color.onSurface,
                  fontSize: "14px",
                  lineHeight: 1.5,
                }}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        <ChatComposer />
      </main>
    </div>
  );
}

export default AiAssistantPage;
