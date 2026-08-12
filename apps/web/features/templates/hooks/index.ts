import { createCrudHooks } from "../../../lib/mock-crud-hooks";
import { templatesApi } from "../api";
import type { EventTemplate } from "../types";

export const {
  useList: useEventTemplates,
  useCreate: useCreateEventTemplate,
  useUpdate: useUpdateEventTemplate,
  useRemove: useRemoveEventTemplate,
} = createCrudHooks<EventTemplate>("event-templates", templatesApi);
