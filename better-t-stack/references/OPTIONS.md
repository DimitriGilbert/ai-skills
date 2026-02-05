# Better-T-Stack CLI Options Reference

Complete reference for all CLI flags and options.

## Commands

### `create` - Create New Project

```bash
create-better-t-stack [project-directory] [options]
```

#### Arguments
- `project-directory` (optional): Name or path for your project directory

#### Core Options

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `--template [string]` | mern, pern, t3, uniwind, none | Use a predefined template | none |
| `--yes, -y` | boolean | Use default configuration (skip prompts) | false |
| `--yolo` | boolean | Bypass validations and compatibility checks | false |
| `--verbose` | boolean | Show detailed result information as JSON | false |
| `--package-manager <pm>` | npm, pnpm, bun | Package manager to use | auto-detect |
| `--install / --no-install` | boolean | Install dependencies after creation | true |
| `--git / --no-git` | boolean | Initialize Git repository | true |
| `--render-title / --no-render-title` | boolean | Show/hide ASCII art title | true |
| `--disable-analytics / --no-disable-analytics` | boolean | Control analytics collection | false |
| `--manual-db / --no-manual-db` | boolean | Skip database setup prompt | false |

#### Frontend Options

| Option | Values | Description |
|--------|--------|-------------|
| `--frontend <types...>` | tanstack-router, react-router, tanstack-start, next, nuxt, native-bare, native-uniwind, native-unistyles, svelte, solid, astro, none | Web and/or native frameworks |

**Constraints:**
- Only one web framework allowed
- Only one native framework allowed
- Can combine one web + one native (e.g., `--frontend next native-uniwind`)
- Astro: Not compatible with Convex backend or tRPC API

#### Backend Options

| Option | Values | Description |
|--------|--------|-------------|
| `--backend <framework>` | hono, express, fastify, elysia, convex, self, none | Backend framework |

**Constraints:**
- Self (fullstack) backend only supports next, tanstack-start, nuxt, and astro frontends
- Convex backend not compatible with solid or astro frontend
- Workers runtime requires hono backend

#### Database Options

| Option | Values | Description |
|--------|--------|-------------|
| `--database <type>` | none, sqlite, postgres, mysql, mongodb | Database type |
| `--orm <type>` | drizzle, prisma, mongoose, none | ORM type |
| `--db-setup <setup>` | turso, neon, prisma-postgres, planetscale, mongodb-atlas, supabase, d1, docker, none | Database hosting setup |

**Constraints:**
- Database and ORM must both be selected (both non-`none`)
- MongoDB requires Mongoose or Prisma (not Drizzle)
- Workers runtime only supports SQLite database

#### API Layer

| Option | Values | Description |
|--------|--------|-------------|
| `--api <type>` | trpc, orpc, none | API type |

**Constraints:**
- tRPC not supported with nuxt, svelte, solid, or astro frontends
- Use oRPC for those frontends

#### Authentication

| Option | Values | Description |
|--------|--------|-------------|
| `--auth <provider>` | better-auth, clerk, none | Authentication provider |

**Constraints:**
- Clerk + Convex not compatible with nuxt, svelte, solid, or astro frontends

#### Payments

| Option | Values | Description |
|--------|--------|-------------|
| `--payments <provider>` | polar, none | Payments provider |

**Constraints:**
- Polar requires Better Auth and a web frontend

#### Addons

| Option | Values | Description |
|--------|--------|-------------|
| `--addons <types...>` | pwa, tauri, starlight, biome, lefthook, husky, ruler, turborepo, fumadocs, ultracite, oxlint, opentui, wxt, skills, none | Additional addons |

**Frontend Restrictions:**
- PWA: Requires tanstack-router, react-router, solid, or next
- Tauri: Requires tanstack-router, react-router, nuxt, svelte, solid, or next
- Others: No restrictions

#### Examples

| Option | Values | Description |
|--------|--------|-------------|
| `--examples <types...>` | todo, ai, none | Example templates to include |

**Constraints:**
- Todo example: Requires database unless using Convex or no backend
- AI example: Not compatible with solid or astro frontend

#### Runtime

| Option | Values | Description |
|--------|--------|-------------|
| `--runtime <runtime>` | bun, node, workers, none | Runtime environment |

**Constraints:**
- Workers only compatible with Hono backend
- Workers only supports Drizzle or Prisma ORM
- Workers only supports SQLite database
- Workers not compatible with MongoDB or Docker setup

#### Deployment

| Option | Values | Description |
|--------|--------|-------------|
| `--web-deploy <setup>` | cloudflare, none | Web deployment setup |
| `--server-deploy <setup>` | cloudflare, none | Server deployment setup |

**Constraints:**
- web-deploy requires a web frontend
- server-deploy requires a backend

#### Directory Handling

| Option | Values | Description |
|--------|--------|-------------|
| `--directory-conflict <strategy>` | merge, overwrite, increment, error | How to handle existing directory conflicts |

### `add` - Add to Existing Project

```bash
create-better-t-stack add [options]
```

Must be run in a project directory with `bts.jsonc`.

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `--addons <types...>` | string[] | Addons to add (same values as create) |
| `--web-deploy <setup>` | cloudflare, none | Web deployment setup |
| `--server-deploy <setup>` | cloudflare, none | Server deployment setup |
| `--project-dir <path>` | string | Project directory (defaults to current) |
| `--install` | boolean | Install dependencies after adding |
| `--package-manager <pm>` | npm, pnpm, bun | Package manager to use |

### Other Commands

#### `builder` - Open Stack Builder UI
```bash
create-better-t-stack builder
```
Opens https://better-t-stack.dev/new

#### `docs` - Open Documentation
```bash
create-better-t-stack docs
```
Opens https://better-t-stack.dev/docs

#### `sponsors` - Show Sponsors
```bash
create-better-t-stack sponsors
```
Displays project sponsors

#### `history` - Show Creation History
```bash
create-better-t-stack history
```
Shows project creation history

### Global Options

These work with any command:

| Option | Description |
|--------|-------------|
| `--help, -h` | Display help information |
| `--version, -V` | Display CLI version |

## Default Configuration

When using `--yes`, the following defaults are applied:

```json
{
  "frontend": ["tanstack-router"],
  "backend": "hono",
  "database": "sqlite",
  "orm": "drizzle",
  "auth": "better-auth",
  "payments": "none",
  "addons": ["turborepo"],
  "examples": [],
  "git": true,
  "install": true,
  "dbSetup": "none",
  "runtime": "bun",
  "api": "trpc",
  "webDeploy": "none",
  "serverDeploy": "none"
}
```

## Complete Example Commands

### Full-Stack App with All Options
```bash
npx create-better-t-stack@latest my-app \
  --frontend tanstack-router \
  --backend hono \
  --runtime bun \
  --database sqlite \
  --orm drizzle \
  --db-setup none \
  --auth better-auth \
  --payments none \
  --api trpc \
  --addons turborepo biome \
  --web-deploy none \
  --server-deploy none \
  --yes \
  --git \
  --install
```

### Workers App
```bash
npx create-better-t-stack@latest my-workers \
  --runtime workers \
  --backend hono \
  --database sqlite \
  --orm drizzle \
  --db-setup d1 \
  --api orpc \
  --yes
```

### Mobile + Web App
```bash
npx create-better-t-stack@latest my-app \
  --frontend next native-uniwind \
  --backend hono \
  --database sqlite \
  --orm drizzle \
  --auth better-auth \
  --addons tauri pwa \
  --yes
```

## Source References

- CLI implementation: `apps/cli/src/`
- Type definitions: `apps/cli/src/types.ts`
- Validation logic: `apps/cli/src/utils/compatibility-rules.ts`
- Constants: `apps/cli/src/constants.ts`
