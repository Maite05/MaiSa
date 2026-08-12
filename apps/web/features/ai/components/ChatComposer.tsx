"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@maisa/ui";
import { useForm } from "react-hook-form";
import { useAiChat } from "../hooks";
import { sendMessageFormSchema, type SendMessageFormValues } from "../schemas";

export function ChatComposer() {
  const { sendMessage, isSending } = useAiChat();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SendMessageFormValues>({ resolver: zodResolver(sendMessageFormSchema) });

  function onSubmit(values: SendMessageFormValues) {
    sendMessage(values.content);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
      <div style={{ flex: 1 }}>
        <TextField
          label="Ask MaiSa"
          placeholder="e.g. Draft a timeline for a 150-guest wedding"
          error={errors.content?.message}
          {...register("content")}
        />
      </div>
      <Button type="submit" loading={isSending} style={{ marginTop: 24 }}>
        Send
      </Button>
    </form>
  );
}

export default ChatComposer;
