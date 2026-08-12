import { TasksBoardPage } from "@/features/tasks/pages/TasksBoardPage";

export default async function EventTasksPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  return <TasksBoardPage eventId={eventId} />;
}
