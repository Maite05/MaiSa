import { DocumentsListPage } from "@/features/documents/pages/DocumentsListPage";

export default async function EventDocumentsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  return <DocumentsListPage eventId={eventId} />;
}
