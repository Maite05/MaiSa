import { createCrudHooks } from "../../../lib/mock-crud-hooks";
import { calendarApi } from "../api";
import type { CalendarEntry } from "../types";

export const {
  useList: useCalendarEntries,
  useCreate: useCreateCalendarEntry,
  useUpdate: useUpdateCalendarEntry,
  useRemove: useRemoveCalendarEntry,
} = createCrudHooks<CalendarEntry>("calendar-entries", calendarApi);
