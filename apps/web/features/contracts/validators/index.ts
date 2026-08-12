import type { Contract } from "../types";

/** A contract marked SIGNED without a signedAt date is an inconsistent state worth flagging in the UI. */
export function hasMissingSignedDate(contract: Pick<Contract, "status" | "signedAt">): boolean {
  return contract.status === "SIGNED" && !contract.signedAt;
}
