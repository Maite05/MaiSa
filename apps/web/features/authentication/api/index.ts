import { apiRequest, type ApiEnvelope } from "../../../lib/api-client";
import type { LoginFormValues, SignupFormValues } from "../schemas";
import type { CurrentUser, LoginResult, SignupResult } from "../types";

export async function signupRequest(input: SignupFormValues): Promise<SignupResult> {
  const res = await apiRequest<ApiEnvelope<SignupResult>>("/auth/signup", { method: "POST", body: input });
  return res.data;
}

export async function loginRequest(input: LoginFormValues): Promise<LoginResult> {
  const res = await apiRequest<ApiEnvelope<LoginResult>>("/auth/login", { method: "POST", body: input });
  return res.data;
}

export async function getCurrentUserRequest(): Promise<CurrentUser> {
  const res = await apiRequest<ApiEnvelope<CurrentUser>>("/auth/me");
  return res.data;
}
