import { InvoicesListPage } from "@/features/payments/pages/InvoicesListPage";

export default async function EventPaymentsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  return <InvoicesListPage eventId={eventId} />;
}
