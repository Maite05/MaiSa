"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getCurrentUserRequest, loginRequest, signupRequest } from "../api";
import type { LoginFormValues, SignupFormValues } from "../schemas";
import { useAuthStore } from "../store";

export function useSignup() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (input: SignupFormValues) => signupRequest(input),
    onSuccess: (result) => {
      setSession({
        token: result.token,
        userId: result.user.id,
        email: result.user.email,
        name: result.user.name,
        organizationId: result.organization.id,
        organizationName: result.organization.name,
      });
    },
  });
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (input: LoginFormValues) => loginRequest(input),
    onSuccess: async (result) => {
      // Login alone doesn't tell us which org to activate — fetch /me and
      // default to the first membership (most users belong to exactly one).
      const previousSession = useAuthStore.getState().session;
      const provisional = {
        token: result.token,
        userId: result.user.id,
        email: result.user.email,
        name: result.user.name,
        organizationId: previousSession?.organizationId ?? "",
        organizationName: previousSession?.organizationName ?? "",
      };
      setSession(provisional);

      const me = await getCurrentUserRequest();
      const org = me.organizations[0];
      if (org) {
        setSession({ ...provisional, organizationId: org.id, organizationName: org.name });
      }
    },
  });
}

export function useCurrentUser() {
  const hasSession = useAuthStore((s) => s.session !== null);
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUserRequest,
    enabled: hasSession,
  });
}
