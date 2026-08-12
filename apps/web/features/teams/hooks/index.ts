"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addMember, listMembers, removeMember, updateMemberRole } from "../api";
import type { AddMemberFormValues } from "../schemas";
import type { OrgRole } from "../types";

const membersKey = ["team", "members"] as const;

export function useMembers() {
  return useQuery({ queryKey: membersKey, queryFn: listMembers });
}

export function useAddMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AddMemberFormValues) => addMember(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: membersKey }),
  });
}

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: OrgRole }) => updateMemberRole(userId, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: membersKey }),
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => removeMember(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: membersKey }),
  });
}
