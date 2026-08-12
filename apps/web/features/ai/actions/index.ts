import { sendMessage } from "../api";
import { makeUserMessage, useAiChatStore } from "../store";

/** Orchestrates the send flow: append the user's message immediately, then the (mocked) assistant reply once it resolves. */
export function useSendChatMessage() {
  const addMessage = useAiChatStore((s) => s.addMessage);

  return async function send(content: string) {
    addMessage(makeUserMessage(content));
    const reply = await sendMessage(content);
    addMessage(reply);
  };
}
