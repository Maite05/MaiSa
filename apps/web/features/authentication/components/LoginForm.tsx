"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@maisa/ui";
import { useForm } from "react-hook-form";
import { ApiError } from "../../../lib/api-client";
import { useLogin } from "../hooks";
import { loginSchema, type LoginFormValues } from "../schemas";

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    try {
      await login.mutateAsync(values);
      onSuccess?.();
    } catch {
      // surfaced below via login.error
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <TextField label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <TextField
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />
      {login.isError && (
        <p style={{ color: "#ba1a1a", fontSize: "13px", margin: 0 }}>
          {login.error instanceof ApiError ? login.error.message : "Something went wrong. Please try again."}
        </p>
      )}
      <Button type="submit" loading={login.isPending}>
        Log In
      </Button>
    </form>
  );
}

export default LoginForm;
