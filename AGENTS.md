# RAG Brain Monorepo - Agent Guidelines

This is a Turborepo monorepo managed with `pnpm` (v9+). It uses Next.js 14 (App Router) for the web client and NestJS 10 for the API, with shared TypeScript interfaces and a shared Prisma database client.

## Code Style Rules (CRITICAL)

- **No Comments**: Do NOT write any comments in the code (no inline, no block, no JSDoc). Code must be self-explanatory through naming.
- **No Magic Strings/Numbers**: Never use magic numbers or strings inline. Extract them based on context:
  - **Enums**: for fixed sets of values (statuses, types).
  - **Constants file**: for app-wide or module-specific values (e.g., in a module's `constants/` directory).
  - **Config Service**: for environment-dependent values (timeouts, limits, URLs).

## Core Tooling & Setup

- **Package Manager**: `pnpm` only. Do not use `npm` or `yarn`.
- **Infrastructure**: Local development requires Docker (`docker-compose.yml`) to run Postgres, Qdrant (Vector DB), and Ollama (Local LLM).
- **Database/ORM**: Prisma. The schema lives in `packages/database/prisma/schema.prisma`.

## Common Commands

Run these from the monorepo root:

- `pnpm install` - Installs dependencies and runs Husky setup (`prepare`).
- `pnpm dev` - Starts both the Next.js web app and the NestJS API via Turborepo.
- `pnpm db:generate` - Generates the Prisma client. **MUST** be run after any `schema.prisma` changes.
- `pnpm db:migrate` - Applies migrations to the database.
- `pnpm lint` - Runs ESLint across the workspace.
- `pnpm format` - Runs Prettier to format code.

To run a command in a specific app or package:

- `pnpm --filter api <command>`
- `pnpm --filter web <command>`

## Architecture & Conventions

### NestJS API (`apps/api/`)

- **Repository Pattern**: Do NOT use `PrismaService` directly in business logic (Services). Always create and inject a dedicated Repository class (e.g., `UsersRepository`) to handle database queries.
- **Authentication**: Uses Google OAuth 2.0. The flow utilizes HTTP-only cookies (`sameSite: 'lax'`) for secure refresh token storage and token rotation.
- **Structure**: Each module should contain its own `interfaces` (DTOs, types) and `constants` (URLs, specific error messages) directories.

### Next.js Web (`apps/web/`)

- **Framework**: Next.js 14 utilizing the App Router (`src/app/`).
- **Styling**: Tailwind CSS is pre-configured.

### Shared Packages (`packages/`)

- `@rag-brain/database`: Re-exports PrismaClient.
- `@rag-brain/types`: Use this for all interfaces and DTOs shared between the API and Web applications.
- `@rag-brain/tsconfig`: Contains base, Next.js, and NestJS Typescript configurations.

## Commits & Code Quality

- **Pre-commit Hooks**: Husky is configured with `lint-staged`. Commits automatically format `.ts/.tsx` files via Prettier and fix ESLint errors. Ensure generated code is syntactically valid before committing.
