# AGENTS.md for Monorepos

This guide covers best practices for using AGENTS.md files in monorepo configurations.

## Why Nested AGENTS.md?

In a monorepo, different packages often have:
- Different tech stacks (frontend vs backend)
- Different build processes
- Different conventions and patterns
- Different testing frameworks

Nested AGENTS.md files allow each package to provide specific guidance while maintaining a minimal root configuration.

## How Nested AGENTS.md Works

When an agent works on a file:
1. It reads the root AGENTS.md
2. It reads the nearest AGENTS.md in the directory tree
3. It merges both files
4. The closest AGENTS.md takes precedence for conflicting instructions

**Example structure:**
```
/AGENTS.md                    # Monorepo-level
packages/api/AGENTS.md        # API-specific
packages/web/AGENTS.md        # Web-specific
```

When editing `packages/api/src/users.ts`:
- Agent sees root AGENTS.md + packages/api/AGENTS.md
- Agent does NOT see packages/web/AGENTS.md

## Scope Guidelines

### Root AGENTS.md

**Focus on monorepo-level concerns:**

```markdown
# AGENTS.md

This is a monorepo containing web services and CLI tools.

## Package Manager

Use pnpm workspaces to manage dependencies.

## Navigation

- Use `pnpm --filter <package_name>` to run commands in specific packages
- Each package has its own AGENTS.md with specific guidelines
- Run `pnpm -w` for root-level commands

## Root Commands

- Install all: `pnpm install`
- Build all: `pnpm build`
- Test all: `pnpm test`
- Typecheck all: `pnpm typecheck`

## Packages

- [`web`](packages/web): Next.js frontend application
- [`api`](packages/api): Node.js GraphQL API
- [`cli`](packages/cli): TypeScript CLI tool
- [`shared`](packages/shared): Shared utilities and types
```

### Package-Level AGENTS.md

**Focus on package-specific concerns:**

```markdown
# AGENTS.md

This package is a Node.js GraphQL API using Prisma and Apollo Server.

## Package Manager

This package uses pnpm (inherited from monorepo root).

## Commands

- Dev: `pnpm dev` (runs API with hot reload)
- Build: `pnpm build` (compiles TypeScript)
- Test: `pnpm test` (runs Vitest)
- Migrate: `pnpm migrate` (runs Prisma migrations)
- Generate: `pnpm prisma generate` (generates Prisma client)

## Database

- Uses Prisma ORM with PostgreSQL
- Schema location: prisma/schema.prisma
- Migrations in prisma/migrations/

## Conventions

- For API design patterns, see [docs/API.md](docs/API.md)
- For database patterns, see [docs/DATABASE.md](docs/DATABASE.md)
```

## Common Monorepo Patterns

### Pattern 1: Framework Monorepo

**Structure:** One frontend framework + shared packages

```
/AGENTS.md
apps/
  web/AGENTS.md
  admin/AGENTS.md
packages/
  ui/AGENTS.md
  config/
```

**Root AGENTS.md:**
```markdown
# AGENTS.md

This is a Next.js monorepo with multiple applications and shared UI packages.

## Package Manager

Use pnpm workspaces with Turborepo for task orchestration.

## Commands

- Dev: `pnpm dev` (runs all apps)
- Build: `pnpm build` (builds all apps)
- Test: `pnpm test` (tests all packages)

## Apps

- [`web`](apps/web): Main Next.js application
- [`admin`](apps/admin): Admin dashboard

## Packages

- [`ui`](packages/ui): Shared component library
- [`config`](packages/config): ESLint, TypeScript configs
```

### Pattern 2: Full-Stack Monorepo

**Structure:** Frontend + Backend + Shared types

```
/AGENTS.md
apps/
  web/AGENTS.md
services/
  api/AGENTS.md
packages/
  types/AGENTS.md
  api-client/AGENTS.md
```

**Root AGENTS.md:**
```markdown
# AGENTS.md

This is a full-stack monorepo with web frontend, API backend, and shared types.

## Package Manager

Use pnpm workspaces.

## Commands

- Dev: `pnpm dev` (runs web + api)
- Build: `pnpm build`
- Test: `pnpm test`

## Architecture

- Frontend: Next.js in apps/web
- Backend: NestJS in services/api
- Shared: TypeScript types in packages/types

## Navigation

- Use `pnpm --filter <package>` for package-specific commands
- See each package's AGENTS.md for specific guidelines
```

### Pattern 3: Multi-Language Monorepo

**Structure:** Different languages in different directories

```
/AGENTS.md
services/
  api-node/AGENTS.md       # Node.js
  worker-go/AGENTS.md      # Go
  script-python/AGENTS.md  # Python
```

**Root AGENTS.md:**
```markdown
# AGENTS.md

This is a polyglot monorepo with services in multiple languages.

## Package Manager

Root uses npm for tooling. Individual services use their native package managers.

## Commands

- Dev: `docker-compose up` (runs all services)
- Test: `./scripts/test-all.sh` (runs all tests)

## Services

- [`api-node`](services/api-node): Node.js/TypeScript API
- [`worker-go`](services/worker-go): Go background worker
- [`script-python`](services/script-python): Python data processing

## Navigation

- Each service has its own AGENTS.md with language-specific guidance
- Services communicate via gRPC/REST
```

## Monorepo-Specific Concerns

### Workspace Dependencies

**Problem:** Agent doesn't know how to add workspace dependencies

**Solution:** Document workspace-specific commands in package AGENTS.md:

```markdown
## Adding Dependencies

To add a workspace dependency:
- Internal: `pnpm --filter <package> add <workspace-package>`
- External: `pnpm --filter <package> add <external-package>`

Example:
```bash
pnpm --filter @monorepo/web add @monorepo/ui
```
```

### Shared Build Configuration

**Problem:** How to document shared tooling?

**Solution:** Reference shared packages from root AGENTS.md:

```markdown
## Tooling

- ESLint config: `@monorepo/config-eslint`
- TypeScript config: `@monorepo/config-typescript`
- Build tool: Turborepo

See individual package AGENTS.md for package-specific overrides.
```

### Inter-Package Communication

**Problem:** Agent needs to understand how packages interact

**Solution:** Document at root level, refer to package-specific docs:

```markdown
## Architecture

- **Web** calls **API** via generated client (packages/api-client)
- **API** publishes events to **Worker** via message queue
- **All packages** use shared types from packages/types

For details, see each package's AGENTS.md.
```

## Anti-Patterns to Avoid

### ❌ Don't Duplicate Commands

**Bad:**
```markdown
# Root AGENTS.md
- Build web: pnpm --filter web build
- Build api: pnpm --filter api build
- Build worker: pnpm --filter worker build
```

**Good:**
```markdown
# Root AGENTS.md
- Build all: `pnpm build`

# See each package's AGENTS.md for package-specific commands
```

### ❌ Don't Overload Root

**Bad:** Root AGENTS.md contains every package's conventions

**Good:** Root AGENTS.md focuses on monorepo-level concerns only

### ❌ Don't Mix Concerns

**Bad:** Package AGENTS.md contains monorepo navigation instructions

**Good:** Navigation stays at root level; packages focus on their own concerns

## Example: Complete Monorepo Setup

### Root AGENTS.md
```markdown
# AGENTS.md

This is a full-stack monorepo with Next.js frontend and Node.js API.

## Package Manager

Use pnpm workspaces with Turborepo.

## Commands

- Dev: `pnpm dev` (runs web + api)
- Build: `pnpm build`
- Test: `pnpm test`

## Architecture

- Frontend (apps/web) calls API via generated client
- Backend (apps/api) provides REST + GraphQL endpoints
- Shared types (packages/types) ensure contract safety
```

### apps/web/AGENTS.md
```markdown
# AGENTS.md

This is a Next.js application for the main web interface.

## Commands

- Dev: `pnpm dev` (runs on localhost:3000)
- Build: `pnpm build`
- Typecheck: `pnpm typecheck`

## API Integration

Use generated client from @monorepo/api-client:
```typescript
import { api } from '@monorepo/api-client';
const data = await api.users.list();
```

## Conventions

- For routing patterns, see docs/ROUTING.md
- For component patterns, see docs/COMPONENTS.md
```

### apps/api/AGENTS.md
```markdown
# AGENTS.md

This is a Node.js API using Express and Prisma.

## Commands

- Dev: `pnpm dev` (runs on localhost:4000)
- Build: `pnpm build`
- Test: `pnpm test`
- Migrate: `pnpm migrate`

## Database

Uses Prisma with PostgreSQL. Schema in prisma/schema.prisma.

## Conventions

- For API design, see docs/API.md
- For database patterns, see docs/DATABASE.md
```

## Testing Nested AGENTS.md

To verify your nested AGENTS.md setup:

1. **Check root**: Verify root AGENTS.md contains only monorepo-level concerns
2. **Check packages**: Verify each package AGENTS.md is focused on that package
3. **Check for duplication**: Remove any duplicated content
4. **Check links**: Verify progressive disclosure links work
5. **Test with tasks**: Run sample tasks to see if agent behavior improves

See [VERIFICATION.md](VERIFICATION.md) for general verification guidelines.
