"use client";

import { useMutation } from "@tanstack/react-query";
import { useSendChatMessage } from "../actions";

export function useAiChat() {
  const send = useSendChatMessage();
  const mutation = useMutation({ mutationFn: (content: string) => send(content) });
  return { sendMessage: mutation.mutate, isSending: mutation.isPending };
}
