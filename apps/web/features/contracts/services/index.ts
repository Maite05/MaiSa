import type { StatusTone } from "@maisa/ui";
import type { ContractStatus } from "../types";

const STATUS_LABEL: Record<ContractStatus, string> = {
  DRAFT: "Draft",
  SENT: "Sent",
  SIGNED: "Signed",
  VOID: "Void",
};

const STATUS_TONE: Record<ContractStatus, StatusTone> = {
  DRAFT: "neutral",
  SENT: "warning",
  SIGNED: "success",
  VOID: "danger",
};

export function getContractStatusLabel(status: ContractStatus): string {
  return STATUS_LABEL[status];
}

export function getContractStatusTone(status: ContractStatus): StatusTone {
  return STATUS_TONE[status];
}
