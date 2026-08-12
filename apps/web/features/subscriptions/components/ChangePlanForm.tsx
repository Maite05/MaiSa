"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, SelectField } from "@maisa/ui";
import { useForm } from "react-hook-form";
import { useChangePlan } from "../hooks";
import { changePlanFormSchema, type ChangePlanFormValues } from "../schemas";
import type { SubscriptionInfo } from "../types";

const PLAN_OPTIONS = ["Starter", "Studio", "Agency"].map((p) => ({ label: p, value: p }));

export function ChangePlanForm({ current, onDone }: { current: SubscriptionInfo; onDone: () => void }) {
  const changePlan = useChangePlan();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePlanFormValues>({ resolver: zodResolver(changePlanFormSchema), defaultValues: { plan: current.plan } });

  async function onSubmit(values: ChangePlanFormValues) {
    await changePlan.mutateAsync(values);
    onDone();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <SelectField label="Plan" options={PLAN_OPTIONS} error={errors.plan?.message} {...register("plan")} />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={changePlan.isPending}>
          Confirm
        </Button>
      </div>
    </form>
  );
}

export default ChangePlanForm;
