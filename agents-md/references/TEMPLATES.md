# AGENTS.md Template Gallery

This gallery provides ready-to-use templates for common project types.

## Single-Package Templates

### Minimal TypeScript Project

```markdown
# AGENTS.md

This is a [brief description of project purpose].

## Package Manager

This project uses pnpm.

## Build & Test

- Build: `pnpm build`
- Test: `pnpm test`
- Typecheck: `pnpm typecheck`
```

### React Component Library

```markdown
# AGENTS.md

This is a React component library for [specific use case].

## Package Manager

This project uses pnpm.

## Build & Test

- Build: `pnpm build`
- Test: `pnpm test`
- Typecheck: `pnpm typecheck`
- Storybook: `pnpm storybook`

## Conventions

- For component patterns, see [docs/COMPONENTS.md](docs/COMPONENTS.md)
- For TypeScript conventions, see [docs/TYPESCRIPT.md](docs/TYPESCRIPT.md)
```

### Next.js Web Application

```markdown
# AGENTS.md

This is a Next.js application for [brief purpose].

## Package Manager

This project uses pnpm with workspaces.

## Build & Test

- Dev: `pnpm dev`
- Build: `pnpm build`
- Test: `pnpm test`
- Typecheck: `pnpm typecheck`
- Lint: `pnpm lint`

## Architecture

- App Router (app/ directory)
- Server Components by default
- API routes in app/api/

## Conventions

- For routing patterns, see [docs/ROUTING.md](docs/ROUTING.md)
- For component patterns, see [docs/COMPONENTS.md](docs/COMPONENTS.md)
```

### Node.js API Service

```markdown
# AGENTS.md

This is a Node.js REST API using [Express/Fastify] and [Prisma/TypeORM].

## Package Manager

This project uses npm.

## Build & Test

- Dev: `npm run dev`
- Build: `npm run build`
- Test: `npm test`
- Migrate: `npm run migrate`
- Seed: `npm run seed`

## Database

- Uses Prisma ORM
- Schema in prisma/schema.prisma
- Migrations in prisma/migrations/

## Conventions

- For API design patterns, see [docs/API.md](docs/API.md)
- For database patterns, see [docs/DATABASE.md](docs/DATABASE.md)
```

### Python Project

```markdown
# AGENTS.md

This is a Python project for [brief purpose].

## Package Manager

This project uses Poetry.

## Commands

- Install: `poetry install`
- Dev: `poetry run poe dev`
- Test: `poetry run pytest`
- Format: `poetry run ruff format`
- Lint: `poetry run ruff check`
- Typecheck: `poetry run mypy`

## Conventions

- Use Ruff for formatting and linting
- Use pytest for testing
- For type hints, see [docs/TYPING.md](docs/TYPING.md)
```

### Rust Project

```markdown
# AGENTS.md

This is a Rust CLI tool for [brief purpose].

## Build & Test

- Build: `cargo build --release`
- Dev: `cargo run`
- Test: `cargo test`
- Check: `cargo check`
- Format: `cargo fmt`
- Lint: `cargo clippy`

## Conventions

- Use `cargo clippy` for lints
- Prefer `Result<T, E>` over panic/unwrap
- For error handling patterns, see [docs/ERRORS.md](docs/ERRORS.md)
```

### Go Project

```markdown
# AGENTS.md

This is a Go service for [brief purpose].

## Build & Test

- Build: `go build ./cmd/service`
- Test: `go test ./...`
- Run: `go run ./cmd/service`
- Format: `go fmt ./...`
- Lint: `golangci-lint run`

## Conventions

- Standard Go project layout
- For error handling, see [docs/ERRORS.md](docs/ERRORS.md)
- For API patterns, see [docs/API.md](docs/API.md)
```

## Monorepo Templates

### Simple Monorepo (pnpm)

```markdown
# AGENTS.md

This is a monorepo containing [brief description of packages].

## Package Manager

Use pnpm workspaces to manage dependencies.

## Navigation

- Use `pnpm --filter <package_name>` to run commands in specific packages
- Each package has its own AGENTS.md with specific guidelines

## Packages

- [`web`](packages/web): Next.js frontend application
- [`api`](packages/api): Node.js GraphQL API
- [`shared`](packages/shared): Shared TypeScript types and utilities
```

### Turborepo Monorepo

```markdown
# AGENTS.md

This is a Turborepo monorepo with [description of apps and packages].

## Package Manager

Use pnpm with Turborepo for task orchestration.

## Commands

- Dev: `pnpm dev` (runs all apps and packages in dev mode)
- Build: `pnpm build` (builds all apps and packages)
- Test: `pnpm test` (tests all packages)
- Task: `turbo run <task> --filter=<package>`

## Navigation

- Each app and package has its own AGENTS.md
- Use `turbo run` to run tasks in specific packages

## Apps

- [`web`](apps/web): Next.js application
- [`admin`](apps/admin): Admin dashboard

## Packages

- [`ui`](packages/ui): Component library
- [`api`](packages/api): API client
- [`config`](packages/config): Shared ESLint, TypeScript configs
```

### Nx Monorepo

```markdown
# AGENTS.md

This is an Nx monorepo containing [description].

## Package Manager

Use npm with Nx for task orchestration.

## Commands

- [Affected]: `npx nx affected -t build test`
- [Specific]: `npx nx run <project>:<task>`
- [Graph]: `npx nx graph`

## Navigation

- Use `npx nx affected` to work with changed projects
- Each project has its own AGENTS.md

## Projects

- [`app`](apps/app): Next.js application
- [`api`](apps/api): NestJS API
- [`shared`](libs/shared): Shared utilities
```

## Framework-Specific Templates

### Vue + Nuxt

```markdown
# AGENTS.md

This is a Nuxt 3 application for [brief purpose].

## Package Manager

This project uses pnpm.

## Commands

- Dev: `pnpm dev`
- Build: `pnpm build`
- Test: `pnpm test`
- Typecheck: `pnpm nuxi typecheck`

## Conventions

- Composition API with `<script setup>`
- Auto-imports for components and composables
- For component patterns, see [docs/COMPONENTS.md](docs/COMPONENTS.md)
```

### SvelteKit

```markdown
# AGENTS.md

This is a SvelteKit application for [brief purpose].

## Package Manager

This project uses pnpm.

## Commands

- Dev: `pnpm dev`
- Build: `pnpm build`
- Test: `pnpm test`
- Check: `pnpm check` (runs svelte-check)

## Conventions

- Use `<script lang="ts">` for TypeScript
- For routing patterns, see [docs/ROUTING.md](docs/ROUTING.md)
```

### Astro

```markdown
# AGENTS.md

This is an Astro site for [brief purpose].

## Package Manager

This project uses pnpm.

## Commands

- Dev: `pnpm dev`
- Build: `pnpm build`
- Preview: `pnpm preview`

## Architecture

- Content collections in src/content/config.ts
- Pages in src/pages/
- Layouts in src/layouts/

## Conventions

- Use .astro files for page components
- For component patterns, see [docs/COMPONENTS.md](docs/COMPONENTS.md)
```

### Django Project

```markdown
# AGENTS.md

This is a Django project for [brief purpose].

## Commands

- Dev: `python manage.py runserver`
- Migrate: `python manage.py migrate`
- Makemigrations: `python manage.py makemigrations`
- Test: `python manage.py test`
- Shell: `python manage.py shell`

## Architecture

- Apps in [apps/](apps/)
- Settings in [config/settings/](config/settings/)
- URLs in [config/urls/](config/urls/)

## Conventions

- Class-based views for complex logic, function-based for simple
- For API patterns, see [docs/API.md](docs/API.md)
```

### Rails Application

```markdown
# AGENTS.md

This is a Rails application for [brief purpose].

## Commands

- Server: `rails server`
- Console: `rails console`
- Test: `rails test`
- Migrate: `rails db:migrate`
- Routes: `rails routes`

## Architecture

- Models in app/models/
- Controllers in app/controllers/
- Views in app/views/
- Jobs in app/jobs/

## Conventions

- Follow Rails conventions
- Use service objects for complex business logic
- For testing patterns, see [docs/TESTING.md](docs/TESTING.md)
```

## Progressive Disclosure File Templates

### TYPESCRIPT.md

```markdown
# TypeScript Conventions

## Type Definitions

Prefer `interface` for object shapes that might be extended.
Use `type` for unions, intersections, and utility types.

## Type Safety

Avoid `any`. Use `unknown` when type is truly unknown.
Use strict mode settings in tsconfig.json.

## Related

- For testing patterns, see [TESTING.md](TESTING.md)
```

### TESTING.md

```markdown
# Testing Conventions

## Framework

We use [Vitest/Jest/pytest] for testing.

## Principles

- Test user behavior, not implementation details
- Mock external dependencies
- Keep tests focused and readable

## Related

- For TypeScript test patterns, see [TYPESCRIPT.md](TYPESCRIPT.md)
```

### COMPONENTS.md

```markdown
# Component Conventions

## Structure

- Co-locate related components
- Use composition over complex prop drilling
- Prefer compound components for related UI

## Naming

- Use descriptive, domain-specific names
- Prefix HOCs and hooks appropriately

## Related

- For TypeScript patterns, see [TYPESCRIPT.md](TYPESCRIPT.md)
```

## Tips for Customizing Templates

1. **Start minimal**: Use the minimal template and add only what's essential
2. **Remove unused sections**: If a section doesn't apply, delete it
3. **Customize commands**: Replace placeholder commands with actual ones
4. **Add progressive disclosure**: Link out to separate files for domain-specific info
5. **Keep it conversational**: Use natural language, not rigid commands

## Template Selection Guide

| Project Type | Use Template |
|--------------|--------------|
| Simple library/app | Minimal TypeScript Project |
| React components | React Component Library |
| Full-stack web | Next.js Web Application |
| Backend API | Node.js API Service |
| Multiple related projects | Simple/Turborepo/Nx Monorepo |
| Data science/ML | Python Project |
| Systems/CLI | Rust Project |
| Microservices | Go Project |
