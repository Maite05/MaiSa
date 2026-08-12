"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, SelectField, TextField } from "@maisa/ui";
import { useForm } from "react-hook-form";
import { ApiError } from "../../../lib/api-client";
import { useAddMember } from "../hooks";
import { addMemberSchema, type AddMemberFormValues } from "../schemas";

const ROLE_OPTIONS = [
  { label: "Member", value: "MEMBER" },
  { label: "Planner", value: "PLANNER" },
  { label: "Admin", value: "ADMIN" },
  { label: "Owner", value: "OWNER" },
];

export function InviteMemberForm({ onDone }: { onDone: () => void }) {
  const addMember = useAddMember();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddMemberFormValues>({ resolver: zodResolver(addMemberSchema), defaultValues: { role: "MEMBER" } });

  async function onSubmit(values: AddMemberFormValues) {
    try {
      await addMember.mutateAsync(values);
      onDone();
    } catch {
      // surfaced below via addMember.error
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <TextField
        label="Email"
        type="email"
        hint="They must already have a MaiSa account"
        error={errors.email?.message}
        {...register("email")}
      />
      <SelectField label="Role" options={ROLE_OPTIONS} error={errors.role?.message} {...register("role")} />
      {addMember.isError && (
        <p style={{ color: "#ba1a1a", fontSize: "13px", margin: 0 }}>
          {addMember.error instanceof ApiError ? addMember.error.message : "Something went wrong. Please try again."}
        </p>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={addMember.isPending}>
          Send Invite
        </Button>
      </div>
    </form>
  );
}

export default InviteMemberForm;
