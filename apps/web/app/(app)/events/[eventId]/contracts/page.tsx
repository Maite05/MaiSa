import { ContractsListPage } from "@/features/contracts/pages/ContractsListPage";

export default async function EventContractsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  return <ContractsListPage eventId={eventId} />;
}
