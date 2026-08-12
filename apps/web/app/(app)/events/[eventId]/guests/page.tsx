import { GuestsListPage } from "@/features/guests/pages/GuestsListPage";

export default async function GuestsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  return <GuestsListPage eventId={eventId} />;
}
