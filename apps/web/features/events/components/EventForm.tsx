"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, SelectField, TextField } from "@maisa/ui";
import { useForm } from "react-hook-form";
import { ApiError } from "../../../lib/api-client";
import { useClients } from "../../clients/hooks";
import { useCreateEvent, useUpdateEvent } from "../hooks";
import { createEventSchema, type CreateEventFormValues } from "../schemas";
import type { Event } from "../types";

const STATUS_OPTIONS = [
  { label: "Inquiry", value: "INQUIRY" },
  { label: "Planning", value: "PLANNING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export function EventForm({ event, onDone }: { event?: Event; onDone: () => void }) {
  const isEdit = Boolean(event);
  const { data: clientsPage } = useClients({ limit: 100 });
  const create = useCreateEvent();
  const update = useUpdateEvent(event?.id ?? "");
  const mutation = isEdit ? update : create;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      clientId: event?.clientId ?? "",
      name: event?.name ?? "",
      type: event?.type ?? "",
      status: event?.status ?? "INQUIRY",
      eventDate: event?.eventDate ? event.eventDate.slice(0, 10) : "",
      venueName: event?.venueName ?? "",
      guestCountEstimate: event?.guestCountEstimate ?? undefined,
    },
  });

  async function onSubmit(values: CreateEventFormValues) {
    try {
      await mutation.mutateAsync(values);
      onDone();
    } catch {
      // surfaced below via mutation.error
    }
  }

  const clientOptions = (clientsPage?.data ?? []).map((c) => ({ label: c.name, value: c.id }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <TextField label="Event Name" error={errors.name?.message} {...register("name")} />
      <SelectField
        label="Client"
        placeholder="Select a client…"
        options={clientOptions}
        error={errors.clientId?.message}
        {...register("clientId")}
      />
      <TextField label="Type" hint="e.g. Wedding, Gala, Product Launch" error={errors.type?.message} {...register("type")} />
      <SelectField label="Status" options={STATUS_OPTIONS} error={errors.status?.message} {...register("status")} />
      <TextField label="Event Date" type="date" error={errors.eventDate?.message} {...register("eventDate")} />
      <TextField label="Venue" error={errors.venueName?.message} {...register("venueName")} />
      <TextField
        label="Estimated Guest Count"
        type="number"
        min={0}
        error={errors.guestCountEstimate?.message}
        {...register("guestCountEstimate")}
      />
      {mutation.isError && (
        <p style={{ color: "#ba1a1a", fontSize: "13px", margin: 0 }}>
          {mutation.error instanceof ApiError ? mutation.error.message : "Something went wrong. Please try again."}
        </p>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={mutation.isPending}>
          {isEdit ? "Save Changes" : "Create Event"}
        </Button>
      </div>
    </form>
  );
}

export default EventForm;
