/**
 * In-memory CRUD backing store for the ~12 feature modules that don't have
 * a real apps/api module yet (vendors, calendar, checklists, crm,
 * inventory, marketplace, templates — see MEMORY's Tier 2 list). This is
 * explicitly a placeholder: state lives in a module-level array, resets on
 * every page reload, and is never sent over the network. Swap a module's
 * api/index.ts to call apiRequest() instead once a real backend module
 * exists for it — hooks/pages built against these functions' signatures
 * won't need to change shape, only their implementation.
 */

const LATENCY_MS = 150;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

export interface MockCrudApi<T extends { id: string }> {
  list: () => Promise<T[]>;
  create: (input: Omit<T, "id">) => Promise<T>;
  update: (id: string, input: Partial<Omit<T, "id">>) => Promise<T>;
  remove: (id: string) => Promise<void>;
}

let idCounter = 0;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-mock-${idCounter}`;
}

export function createMockCrudApi<T extends { id: string }>(idPrefix: string, seed: T[]): MockCrudApi<T> {
  let records = [...seed];

  return {
    async list() {
      return delay([...records]);
    },
    async create(input) {
      const record = { ...input, id: nextId(idPrefix) } as T;
      records = [record, ...records];
      return delay(record);
    },
    async update(id, input) {
      let updated: T | undefined;
      records = records.map((r) => {
        if (r.id !== id) return r;
        updated = { ...r, ...input };
        return updated;
      });
      if (!updated) throw new Error(`Record ${id} not found`);
      return delay(updated);
    },
    async remove(id) {
      records = records.filter((r) => r.id !== id);
      return delay(undefined);
    },
  };
}
