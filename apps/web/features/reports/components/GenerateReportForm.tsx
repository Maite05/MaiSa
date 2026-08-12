"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, SelectField, TextField } from "@maisa/ui";
import { useForm } from "react-hook-form";
import { useGenerateReport } from "../hooks";
import { generateReportFormSchema, type GenerateReportFormValues } from "../schemas";

const TYPE_OPTIONS = ["Revenue", "Event Summary", "Client Activity", "Budget Variance"].map((t) => ({ label: t, value: t }));

export function GenerateReportForm({ onDone }: { onDone: () => void }) {
  const generate = useGenerateReport();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GenerateReportFormValues>({ resolver: zodResolver(generateReportFormSchema), defaultValues: { type: "Revenue" } });

  async function onSubmit(values: GenerateReportFormValues) {
    await generate.mutateAsync(values);
    onDone();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <TextField label="Report Name" error={errors.name?.message} {...register("name")} />
      <SelectField label="Type" options={TYPE_OPTIONS} error={errors.type?.message} {...register("type")} />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={generate.isPending}>
          Generate
        </Button>
      </div>
    </form>
  );
}

export default GenerateReportForm;
