import { createCrudHooks } from "../../../lib/mock-crud-hooks";
import { leadsApi } from "../api";
import type { Lead } from "../types";

export const { useList: useLeads, useCreate: useCreateLead, useUpdate: useUpdateLead, useRemove: useRemoveLead } =
  createCrudHooks<Lead>("leads", leadsApi);
