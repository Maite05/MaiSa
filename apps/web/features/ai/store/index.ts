import { create } from "zustand";
import type { ChatMessage } from "../types";

interface AiChatState {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clear: () => void;
}

let localIdCounter = 0;

export const useAiChatStore = create<AiChatState>((set) => ({
  messages: [
    {
      id: "welcome",
      role: "assistant",
      content: "Ask me to draft a timeline, suggest a budget split, or shortlist vendors for an event.",
      createdAt: new Date().toISOString(),
    },
  ],
  addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),
  clear: () => set({ messages: [] }),
}));

export function makeUserMessage(content: string): ChatMessage {
  localIdCounter += 1;
  return { id: `user-${localIdCounter}`, role: "user", content, createdAt: new Date().toISOString() };
}
