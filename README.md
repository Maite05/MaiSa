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
- **Backend:** a single shared API (`apps/api`) consumed by every client — web, admin, and mobile — so business logic and auth live in one place instead of being duplicated per app
- **Frontend:** Next.js (`apps/web`, `apps/admin`)
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
- 🔜 `apps/api` scaffolding to expose the data model
- 🔜 Next.js scaffolding for `apps/web` / `apps/admin`, React Native for `apps/mobile`
- 🔜 AI/automation features in `packages/ai`
- 🔮 Phase 2: venue and vendor coordination
