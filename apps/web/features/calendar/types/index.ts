// No apps/api module exists for a standalone team calendar yet — distinct
// from the per-event Timeline (features/timeline), this is for org-wide
// reminders/appointments not tied to one event.
export interface CalendarEntry {
  id: string;
  title: string;
  date: string;
  allDay: boolean;
  notes?: string;
}
