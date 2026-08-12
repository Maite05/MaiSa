# Feature architecture

Each top-level folder here is one product domain. `app/` route files stay thin
wrappers that import a page from the matching feature — the actual UI,
data-fetching, and business logic for that domain lives here, not in `app/`.

Cross-app, cross-feature logic (e.g. auth session handling, the Prisma
client, the AI client) stays in `packages/*` and gets consumed from there;
these folders are the *web app's* UI/composition layer on top of that shared
core, not a replacement for it.

## Subfolder convention

Every feature has the same 11 subfolders, used consistently:

| Folder | Holds |
|---|---|
| `components/` | Feature-specific UI pieces, not shared across features (shared, feature-agnostic UI lives in `packages/ui` instead) |
| `pages/` | Full page-level compositions. The route file in `app/` imports from here. |
| `hooks/` | Feature-scoped React hooks (data fetching, local state machines, etc.) |
| `services/` | Client-side business logic that isn't a hook or a raw API call |
| `api/` | Data-fetching functions (REST/GraphQL calls, or mock data during early development) |
| `store/` | Client state (e.g. a Zustand slice) scoped to this feature |
| `schemas/` | Runtime validation schemas (e.g. Zod) shared between forms and API calls |
| `types/` | TypeScript types/interfaces for this feature's domain data |
| `validators/` | Standalone validation functions not tied to a schema library |
| `utils/` | Small pure helper functions specific to this feature |
| `actions/` | Next.js Server Actions |

Folders are currently scaffolded but empty (`.gitkeep` only) except where a
feature already has real work — see `dashboard/pages/ProductionOverview.tsx`
and `events/pages/EventDetail.tsx` for the current example of a populated
`pages/` file. Fill in the other subfolders for a feature as real logic for
it is built, rather than pre-guessing their contents.
