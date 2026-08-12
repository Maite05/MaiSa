"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@maisa/ui";
import { useForm } from "react-hook-form";
import { ApiError } from "../../../lib/api-client";
import { useSettingsActions } from "../actions";
import { useUpdateOrganization } from "../hooks";
import { updateOrganizationSchema, type UpdateOrganizationFormValues } from "../schemas";
import type { OrganizationProfile } from "../types";
import { hasNameChanged } from "../validators";

export function OrganizationProfileForm({ organization }: { organization: OrganizationProfile }) {
  const update = useUpdateOrganization(organization.id);
  const { markSaved } = useSettingsActions();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UpdateOrganizationFormValues>({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: { name: organization.name },
  });

  const unchanged = !hasNameChanged(organization.name, watch("name") ?? "");

  async function onSubmit(values: UpdateOrganizationFormValues) {
    try {
      await update.mutateAsync(values);
      markSaved();
    } catch {
      // surfaced below via update.error
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: 420 }}>
      <TextField label="Organization Name" error={errors.name?.message} {...register("name")} />
      <TextField
        label="Slug"
        defaultValue={organization.slug}
        readOnly
        disabled
        hint="Contact support to change your organization's slug."
      />
      {update.isError && (
        <p style={{ color: "#ba1a1a", fontSize: "13px", margin: 0 }}>
          {update.error instanceof ApiError ? update.error.message : "Something went wrong. Please try again."}
        </p>
      )}
      {update.isSuccess && <p style={{ color: "#566342", fontSize: "13px", margin: 0 }}>Saved.</p>}
      <Button type="submit" loading={update.isPending} disabled={unchanged} style={{ alignSelf: "flex-start" }}>
        Save Changes
      </Button>
    </form>
  );
}

export default OrganizationProfileForm;
