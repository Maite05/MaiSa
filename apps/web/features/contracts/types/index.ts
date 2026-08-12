// Mirrors packages/database/prisma/schema.prisma's Contract model + ContractStatus enum.
export type ContractStatus = "DRAFT" | "SENT" | "SIGNED" | "VOID";

export interface Contract {
  id: string;
  eventId: string;
  title: string;
  status: ContractStatus;
  documentUrl: string | null;
  signedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
