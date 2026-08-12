import { StatusPill } from "@maisa/ui";
import { getContractStatusLabel, getContractStatusTone } from "../services";
import type { ContractStatus } from "../types";

export function ContractStatusPill({ status }: { status: ContractStatus }) {
  return <StatusPill label={getContractStatusLabel(status)} tone={getContractStatusTone(status)} />;
}

export default ContractStatusPill;
