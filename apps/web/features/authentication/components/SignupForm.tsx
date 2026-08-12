"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@maisa/ui";
import { useForm } from "react-hook-form";
import { ApiError } from "../../../lib/api-client";
import { useSignup } from "../hooks";
import { signupSchema, type SignupFormValues } from "../schemas";
import { passwordStrengthHint } from "../validators";

export function SignupForm({ onSuccess }: { onSuccess?: () => void }) {
  const signup = useSignup();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });

  const passwordHint = passwordStrengthHint(watch("password") ?? "");

  async function onSubmit(values: SignupFormValues) {
    try {
      await signup.mutateAsync(values);
      onSuccess?.();
    } catch {
      // surfaced below via signup.error
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <TextField label="Your name" autoComplete="name" error={errors.name?.message} {...register("name")} />
      <TextField label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <TextField
        label="Password"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        hint={passwordHint ?? undefined}
        {...register("password")}
      />
      <TextField
        label="Organization name"
        hint="You can invite teammates to it afterward."
        error={errors.organizationName?.message}
        {...register("organizationName")}
      />
      {signup.isError && (
        <p style={{ color: "#ba1a1a", fontSize: "13px", margin: 0 }}>
          {signup.error instanceof ApiError ? signup.error.message : "Something went wrong. Please try again."}
        </p>
      )}
      <Button type="submit" loading={signup.isPending}>
        Create Account
      </Button>
    </form>
  );
}

export default SignupForm;
