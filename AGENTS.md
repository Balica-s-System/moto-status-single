<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

Key Next.js 16 gotchas verified in this codebase:

- `params` and `searchParams` in `page.tsx` are **Promises** — always `await` them.
- Route handlers and server components are async; dynamic routes need `Promise<{ id: string }>` typing.
<!-- END:nextjs-agent-rules -->

# Project conventions

## Stack
- Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS 4 · shadcn/ui (Radix) · Prisma 7 (Postgres) · better-auth · React Query v5 · React Hook Form + Zod (`zod/v3`) · Biome for lint/format.
- All UI copy is **Portuguese (pt-BR)**. Routes use English paths with Portuguese labels (e.g. `/management/clients`, `/support`).

## Path aliases
- `@/*` → `./src/*`
- `$/*` → `./*` (generated Prisma client). Import enums from `$/generated/prisma/enums`, types/Prisma namespace from `$/generated/prisma/client` (Node) or `$/generated/prisma/browser`.

## Database (Prisma 7)
- **Use `npx prisma db push` to sync schema**, NOT `prisma migrate dev`. The DB was set up via `db push` and migration history is out of sync (running `migrate dev` triggers a destructive reset).
- After editing `prisma/schema.prisma` (or on any fresh checkout) run `npx prisma db push`, which also regenerates the client.
- `src/lib/db.ts` exports the shared `PrismaClient` instance.

## Auth
- better-auth set up in `src/lib/auth.ts`.
- Server actions must call `requireAuth()` (any user) or `requireAdmin()` (admin only) from `@/lib/auth` — never trust client-passed identity/permissions.
- Dashboard routes inherit auth from `src/app/(dashboard)/layout.tsx`; pages still check `requireAuth()` defensively.

## Feature structure (follow exactly)
Each dashboard feature adds a folder under a route segment with:
- `page.tsx` — async Server Component: auth check + fetch, renders a client page component.
- `_components/` — client components (page, table, form dialog, badges, skeletons).
- `_services/` — `*Queries.ts` and `*Mutations.ts` server actions (`"use server"`) doing DB work; `use-*-queries.ts` / `use-*-mutations.ts` React Query hooks that call them, with `sonner` toasts and `queryClient.invalidateQueries`.
- `_types/` — Zod schemas (from `zod/v3`), default values, and label/variant maps for enums.
- `_libs/` — zustand stores via `src/lib/createStore.ts`.

Data flows: React Query hooks (client) → server actions (server, auth-checked) → `db`. Mutations may invalidate the same keys as relatives (e.g. inventory mutations also invalidate `["availableMotorcycles"]` used by the client-dialog combobox).

## UI
- Reuse shadcn primitives in `src/components/ui/` (Button, Card, Dialog, Table, Badge, Select, Input, Textarea, ControlledInput, ControlledSelect, ControlledTextarea, ControlledCombobox, ControlledDatePicker...).
- Shared pieces live in `src/components/` (`PageHeader`, `NoItemsFound`, `useDebounce`, `Footer`, `ThemeToggle`). Page container is provided by `(dashboard)/layout.tsx` — pages render their own content only.
- Confirmation dialogs use the `alert()` helper from `@/lib/use-global-store`.

## Lint / build
- `npm run lint` = `biome check`. The repo has many **pre-existing** lint errors (generated `generated/prisma/**`, format/CRLF, type-only imports in older service files, `role="list"`/`key={i}` patterns that mirror existing code). When touching a file, run `npx biome check <file>`; prefer auto-fix via `npx biome check --write <file>` on your own files only, and don't reformat unrelated files.
- `npm run build` for type-check + production build.