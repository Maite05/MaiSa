# MaiSa

MaiSa is a modern, AI-powered event management platform built for professional event planners. It provides everything needed to plan, manage, and execute exceptional events—from client onboarding and budgeting to guest management, contracts, payments, and team collaboration.

Designed with elegance, efficiency, and scalability at its core, MaiSa delivers a premium experience while remaining intuitive and affordable for businesses of all sizes.

### ✨ Our Mission

To empower event professionals with a beautiful, intelligent platform that simplifies planning, streamlines operations, and helps create unforgettable experiences.

### Positioning

MaiSa is aimed at the same broad space as tools like Aisle Planner (CRM, contracts, invoicing, budgets, timelines), but differentiates on two fronts:

- **Affordability** — pricing that isn't gated by project count, so growing planning businesses aren't penalized for winning more business.
- **Real AI/automation**, not just templated documents — e.g. AI-drafted proposals and timelines, budget suggestions from historical data, and automated client follow-ups (see `packages/ai`).

**Phase 1 go-to-market scope** is the event planner and their client relationship: client onboarding, events, guests, contracts, invoicing/payments, budget, tasks, and timeline. Venue and vendor coordination (directories, bookings, vendor-facing tools) are intentionally out of scope for now and will come in a later phase.

## Tech stack

- **Monorepo:** [pnpm workspaces](https://pnpm.io/workspaces) + [Turborepo](https://turborepo.com)
- **Language:** TypeScript throughout
- **Database:** PostgreSQL via [Prisma](https://www.prisma.io/)
- **Backend:** a single shared API (`apps/api`) consumed by every client — web, admin, and mobile — so business logic and auth live in one place instead of being duplicated per app. Fastify + Zod (`fastify-type-provider-zod`) for request/response validation, JWT bearer auth, multi-org support via an `x-organization-id` header.
- **Frontend:** Next.js App Router (`apps/web`, `apps/admin`) — [TanStack Query](https://tanstack.com/query) for server state, [Zustand](https://zustand-demo.pmnd.rs/) for local UI state, [react-hook-form](https://react-hook-form.com/) + [Zod](https://zod.dev/) for forms, all built on a shared component kit in `packages/ui`
- **Mobile:** React Native (`apps/mobile`)

## Project structure

```
MaiSa/
├── apps/
│   ├── web/            # Client-facing planner app
│   ├── admin/           # Internal/admin dashboard
│   ├── api/              # Shared backend API — the only app that talks to the database
│   └── mobile/          # React Native app
└── packages/
    ├── ai/                        # AI-powered planning, suggestions, and automation
    ├── auth/                    # Authentication & authorization
    ├── config/                # Shared config (eslint, tsconfig, env schemas)
    ├── database/           # Prisma schema, client, and migrations
    ├── notifications/  # Email/SMS/push notifications
    ├── payments/           # Payment processing & invoicing
    ├── storage/             # File/media storage (contracts, photos, documents)
    ├── types/                  # Shared TypeScript types/interfaces
    ├── ui/                        # Shared UI component library
    └── utils/                  # Shared utility functions
```

Every app and package is a workspace member managed by pnpm and orchestrated by Turborepo, so shared code in `packages/*` can be imported directly by any app without publishing.

## Core domain

The data model (`packages/database/prisma/schema.prisma`) is organized around a handful of core entities that most other functionality hangs off of:

- **Organization / User / Membership** — multi-tenant agency accounts with role-based team access (owner, admin, planner, member)
- **Client** — onboarding, contact info, and history
- **Event** — the central hub linking a client to guests, contracts, invoices, budget, tasks, timeline, and documents
- **Guest** — invitations, RSVP status, plus-ones, seating, and dietary notes
- **Contract** — status tracking from draft through signed
- **Invoice / Payment** — amount due/paid, due dates, payment history
- **BudgetItem** — estimated vs. actual cost per category
- **Task / TimelineItem** — checklists assignable to team members, and day-of scheduling
- **Document** — file references (contracts, photos, etc.), backed by `packages/storage`

## How the app works

This walks through `apps/web` as a user would actually move through it — what's real (backed by `apps/api` and the database above) versus what's currently a UI preview running on local mock data.

### Getting in

A new user signs up at `/signup` with their name, email, password, and an organization name — that call ([`POST /auth/signup`](apps/api/src/modules/auth)) atomically creates the `User`, an `Organization`, and a `Membership` with the `OWNER` role, then returns a JWT. Returning users log in at `/login`. The session (token, user, active organization) is kept client-side and sent on every request as `Authorization: Bearer <token>` plus an `x-organization-id` header, so the backend always knows which organization's data you're allowed to see — this is what makes MaiSa multi-tenant: one login can belong to more than one organization, isolated from each other. Every route except `/login` and `/signup` requires a session; visiting one signed out redirects you back to `/login`.

### The planning workspace

Once in, the top nav (Dashboard, Events, Clients, Vendors, Team) is the spine of the app:

- **Dashboard** (`/`) — a production-overview landing page: upcoming releases, a pipeline snapshot, a production calendar, and recent team activity. Currently illustrative content, not yet wired to live counts.
- **Clients** (`/clients`) — the agency's client roster: name, contact info, notes. This is where a contact lands once they're a real prospect worth planning for (the CRM module's Leads list, further down, is the pre-client pipeline).
- **Events** (`/events`) — every event the organization is running: name, linked client, date, venue, status (Inquiry → Planning → Confirmed → Completed/Cancelled). Creating one just needs a name and an existing client.
- **Team** (`/team`) — everyone with a membership in the organization, their role, and (for Admins/Owners) the ability to invite by email, change roles, or remove someone. The backend enforces the same role check server-side, so this isn't just a UI restriction.
- **Settings** (`/settings`) — the organization's name/profile, editable by Owners and Admins.

### Inside an event

Clicking into an event (`/events/[eventId]`) opens its workspace — everything below it is scoped to that one event and shares its own sub-nav:

- **Overview** — the event's vitals (client, date, venue, status) plus rollups pulled live from its guests, budget, and tasks: an RSVP count, spend-vs-allocated, and an upcoming-milestones view built from the timeline.
- **Guests** — the guest list: RSVP status (pending/attending/declined/maybe), plus-ones, table assignment, dietary notes.
- **Budget** — line items by category with an estimated vs. actual cost each, rolling up into the overview's spend total.
- **Tasks** — a to-do/in-progress/done board, assignable, with due dates.
- **Timeline** — the day-of run of show: ordered items with start/end times and notes.
- **Contracts** — status from draft through signed, with a link out to the document itself.
- **Documents** — files attached to the event (photos, signed PDFs, etc.).
- **Payments** — invoices (amount due, due date, status) with payments recorded against each one, auto-updating the invoice's paid amount and status as they come in.

### Where the app is headed

The rest of the nav — **Vendors**, **Calendar**, **Checklists**, **CRM** (leads), **Inventory**, **Marketplace**, **Templates**, **Analytics**, **Notifications**, **Reports**, **Subscriptions**, and the **AI Assistant** — is built and clickable today, but runs on local mock data rather than `apps/api`, because those modules don't have a backend yet. They're real UI (you can add/edit/delete records, and it behaves like the rest of the app), just not persisted anywhere beyond your browser session. The AI Assistant in particular returns canned, keyword-matched replies — there's no live model call behind it yet (`packages/ai` is still a stub). Each of these becomes a Tier 1 feature — swapped over to a real `apps/api` module and database-backed data — the same way Clients and Events already have been.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 20
- [pnpm](https://pnpm.io/installation) (managed via [Corepack](https://nodejs.org/api/corepack.html))
- A PostgreSQL database (local or hosted)

### Installation

```bash
pnpm install
```

### Environment variables

Copy the example env file and fill in your own values:

```bash
cp .env.example .env
```

`.env` is git-ignored — never commit real credentials.

`apps/web` additionally reads `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:4000/api/v1` if unset) to know where to reach `apps/api`.

### Running the app locally

`apps/web` needs `apps/api` (and a Postgres database behind it) running to actually log in, create clients/events, and so on — the pages that don't yet have a backend (see [Where the app is headed](#where-the-app-is-headed)) will still render and let you click around on mock data even without it. In two terminals:

```bash
pnpm --filter @maisa/database migrate:dev   # first time only — see Database, below
pnpm --filter @maisa/api dev                # http://localhost:4000
pnpm --filter @maisa/web dev                # http://localhost:3000
```

Or run everything at once from the root with `pnpm dev` (see Common commands).

### Common commands

Run from the repo root; Turborepo fans these out to every workspace that defines the corresponding script.

```bash
pnpm dev         # Run all apps in development mode
pnpm build       # Build all apps and packages
pnpm lint        # Lint all workspaces
pnpm test        # Run tests across all workspaces
pnpm typecheck   # Type-check all workspaces
```

To scope a command to a single workspace, use pnpm's `--filter` flag, e.g.:

```bash
pnpm --filter @maisa/api dev
```

### Database

Schema, migrations, and the generated client live in `packages/database`:

```bash
pnpm --filter @maisa/database generate       # Regenerate the Prisma client from schema.prisma
pnpm --filter @maisa/database migrate:dev    # Create/apply a migration against your local DB
pnpm --filter @maisa/database migrate:deploy # Apply migrations in production/CI
pnpm --filter @maisa/database studio         # Open Prisma Studio to browse data
```

These load `DATABASE_URL` from the repo-root `.env` automatically.

## Status

MaiSa is under active development.

- ✅ Monorepo tooling (pnpm workspaces + Turborepo), workspace structure, shared package skeletons
- ✅ Core data model (`packages/database`) — phase 1 scope (planner ↔ client), schema defined, Prisma client generating and typechecking cleanly
- ✅ `apps/api` — auth, clients, events, guests, contracts, invoices/payments, budget, tasks, timeline, documents, and organizations/team modules, all validated with Zod and backed by the schema above
- ✅ `apps/web` — signup/login, dashboard, and the full client/event workspace (see [How the app works](#how-the-app-works)) wired to `apps/api`; the remaining nav items (vendors, calendar, checklists, CRM, inventory, marketplace, templates, analytics, notifications, reports, subscriptions, AI assistant) are built as UI running on local mock data, pending their own backend modules
- 🔜 `apps/admin`, React Native for `apps/mobile`
- 🔜 Real AI/automation in `packages/ai` (the AI Assistant page currently returns canned responses)
- 🔮 Phase 2: venue and vendor coordination
