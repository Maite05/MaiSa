// packages/ai is currently an empty stub (no provider wired up) — this
// feature's api/ mocks canned responses so the chat UI is real and
// testable now, swappable for a genuine packages/ai call later.
export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}
