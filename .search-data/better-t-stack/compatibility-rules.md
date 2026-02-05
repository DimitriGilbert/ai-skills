# Compatibility Rules Reference

## Overview

The Better-T-Stack CLI validates option combinations to ensure generated projects work correctly. This document provides a comprehensive reference of all compatibility rules and restrictions.

**Source**: `apps/web/content/docs/cli/compatibility.mdx`

## Database & ORM Compatibility

### Required Combinations

| Database | Compatible ORMs | Notes |
|-----------|------------------|--------|
| `sqlite` | `drizzle`, `prisma` | Lightweight, file-based database |
| `postgres` | `drizzle`, `prisma` | Advanced relational database |
| `mysql` | `drizzle`, `prisma` | Traditional relational database |
| `mongodb` | `mongoose`, `prisma` | Document database, requires specific ORMs |
| `none` | `none` | No database setup |

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 14-20

### Restrictions

**MongoDB + Drizzle**: ❌ Not supported
- Drizzle doesn't support MongoDB
- **Solution**: Use Mongoose or Prisma with MongoDB

**Database without ORM**: ❌ Not supported
- Database requires an ORM for code generation
- **Solution**: Select an ORM (drizzle, prisma, or mongoose)

**ORM without Database**: ❌ Not supported
- ORM requires a database target
- **Solution**: Select a database (sqlite, postgres, mysql, or mongodb)

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 22-27

### Valid Combinations

```bash
# ✅ Valid - SQLite with Drizzle
create-better-t-stack --database sqlite --orm drizzle

# ✅ Valid - SQLite with Prisma
create-better-t-stack --database sqlite --orm prisma

# ✅ Valid - PostgreSQL with Drizzle
create-better-t-stack --database postgres --orm drizzle

# ✅ Valid - PostgreSQL with Prisma
create-better-t-stack --database postgres --orm prisma

# ✅ Valid - MySQL with Drizzle
create-better-t-stack --database mysql --orm drizzle

# ✅ Valid - MySQL with Prisma
create-better-t-stack --database mysql --orm prisma

# ✅ Valid - MongoDB with Mongoose
create-better-t-stack --database mongodb --orm mongoose

# ✅ Valid - MongoDB with Prisma
create-better-t-stack --database mongodb --orm prisma

# ❌ Invalid - MongoDB with Drizzle
create-better-t-stack --database mongodb --orm drizzle
```

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 28-34

## Backend & Runtime Compatibility

### Cloudflare Workers Restrictions

Cloudflare Workers has specific compatibility requirements:

| Component | Requirement | Reason |
|-----------|--------------|---------|
| Backend | Must be `hono` | Only Hono supports Workers runtime |
| ORM | Must be `drizzle` or `prisma` | Workers supports Drizzle and Prisma; Mongoose is not supported |
| Database | Cannot be `mongodb` | MongoDB requires Prisma/Mongoose |
| Database Setup | Cannot be `docker` | Workers is serverless, no Docker support |

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 40-47

### Valid Cloudflare Workers Combinations

```bash
# ✅ Valid - Workers with Hono and Drizzle (D1)
create-better-t-stack --runtime workers --backend hono --database sqlite --orm drizzle --db-setup d1

# ✅ Valid - Workers with Hono and Prisma (D1)
create-better-t-stack --runtime workers --backend hono --database sqlite --orm prisma --db-setup d1

# ❌ Invalid - Workers with Express
create-better-t-stack --runtime workers --backend express

# ❌ Invalid - Workers with MongoDB
create-better-t-stack --runtime workers --database mongodb

# ❌ Invalid - Workers with Docker
create-better-t-stack --runtime workers --db-setup docker
```

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 48-58

### Backend Presets

#### Convex Backend

When using `--backend convex`, the following options are automatically set:

| Option | Automatic Value | Reason |
|---------|------------------|---------|
| `auth` | `clerk` (if compatible frontends) or `none` | Convex uses Clerk authentication |
| `database` | `none` | Convex provides database |
| `orm` | `none` | Convex provides data layer |
| `api` | `none` | Convex provides API |
| `runtime` | `none` | Convex manages runtime |
| `db-setup` | `none` | Convex manages hosting |
| `examples` | `todo` | Todo example works with Convex |

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 62-72

**Convex Clerk Support**: Convex supports Clerk authentication with compatible frontends:
- ✅ Supported: React frameworks, Next.js, TanStack Start, native frameworks
- ❌ Not supported: Nuxt, Svelte, Solid

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 74

#### No Backend

When using `--backend none`, the following options are automatically set:

| Option | Automatic Value | Reason |
|---------|------------------|---------|
| `auth` | `none` | No backend for auth |
| `database` | `none` | No backend for database |
| `orm` | `none` | No database |
| `api` | `none` | No backend for API |
| `runtime` | `none` | No backend to run |
| `db-setup` | `none` | No database to host |
| `examples` | `none` | Examples require backend |

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 76-86

## Frontend & API Compatibility

### API Framework Support

| Frontend | tRPC Support | oRPC Support | Notes |
|-----------|--------------|--------------|-------|
| `tanstack-router` | ✅ | ✅ | Full support |
| `react-router` | ✅ | ✅ | Full support |
| `tanstack-start` | ✅ | ✅ | Full support |
| `next` | ✅ | ✅ | Full support |
| `nuxt` | ❌ | ✅ | tRPC not supported |
| `svelte` | ❌ | ✅ | tRPC not supported |
| `solid` | ❌ | ✅ | tRPC not supported |
| Native frameworks | ✅ | ✅ | Full support |

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 90-101

### Valid API Combinations

```bash
# ✅ Valid - React frameworks with tRPC
create-better-t-stack --frontend tanstack-router --api trpc
create-better-t-stack --frontend next --api trpc

# ✅ Valid - React frameworks with oRPC
create-better-t-stack --frontend tanstack-router --api orpc
create-better-t-stack --frontend next --api orpc

# ✅ Valid - Nuxt/Svelte/Solid with oRPC
create-better-t-stack --frontend nuxt --api orpc
create-better-t-stack --frontend svelte --api orpc
create-better-t-stack --frontend solid --api orpc

# ❌ Invalid - Nuxt with tRPC
create-better-t-stack --frontend nuxt --api trpc

# ❌ Invalid - Svelte with tRPC
create-better-t-stack --frontend svelte --api trpc

# ❌ Invalid - Solid with tRPC
create-better-t-stack --frontend solid --api trpc
```

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 103-109

### Frontend Restrictions

**Multiple Web Frontends**: ❌ Not allowed
- Only one web framework allowed per project

**Multiple Native Frontends**: ❌ Not allowed
- Only one native framework allowed per project

**Web + Native**: ✅ Allowed
- One web and one native framework allowed together

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 111-116

### Valid Frontend Combinations

```bash
# ✅ Valid - Single web frontend
create-better-t-stack --frontend next

# ✅ Valid - Single native frontend
create-better-t-stack --frontend native-uniwind

# ✅ Valid - Web + native
create-better-t-stack --frontend next native-uniwind

# ❌ Invalid - Multiple web frontends
create-better-t-stack --frontend next tanstack-router

# ❌ Invalid - Multiple native frontends
create-better-t-stack --frontend native-uniwind native-unistyles
```

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 117-123

## Database Setup Compatibility

### Provider Requirements

| Setup Provider | Required Database | Notes |
|----------------|-------------------|--------|
| `turso` | `sqlite` | Distributed SQLite; works with Drizzle and Prisma |
| `d1` | `sqlite` | Cloudflare D1 (requires Workers runtime); works with Drizzle and Prisma |
| `neon` | `postgres` | Serverless PostgreSQL |
| `supabase` | `postgres` | PostgreSQL with additional features |
| `prisma-postgres` | `postgres` | Managed PostgreSQL via Prisma |
| `planetscale` | `mysql`, `postgres` | PlanetScale serverless database |
| `mongodb-atlas` | `mongodb` | Managed MongoDB |
| `docker` | `postgres`, `mysql`, `mongodb` | Not compatible with `sqlite` or Workers |

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 127-138

### Special Cases

#### Cloudflare D1

**Requirements**:
- Requires `--database sqlite`
- Requires `--runtime workers`
- Requires `--backend hono`

**Valid Combination**:
```bash
create-better-t-stack --runtime workers --backend hono --database sqlite --db-setup d1 --orm drizzle
```

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 142-147

#### Docker Setup

**Restrictions**:
- Cannot be used with `sqlite` (file-based database)
- Cannot be used with `workers` runtime (serverless environment)

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 149-151

### Valid Database Setup Combinations

```bash
# ✅ Valid - Turso with SQLite
create-better-t-stack --database sqlite --db-setup turso

# ✅ Valid - Neon with PostgreSQL
create-better-t-stack --database postgres --db-setup neon

# ✅ Valid - Supabase with PostgreSQL
create-better-t-stack --database postgres --db-setup supabase

# ✅ Valid - PlanetScale with MySQL
create-better-t-stack --database mysql --db-setup planetscale

# ✅ Valid - MongoDB Atlas with MongoDB
create-better-t-stack --database mongodb --db-setup mongodb-atlas

# ✅ Valid - Docker with PostgreSQL
create-better-t-stack --database postgres --db-setup docker

# ✅ Valid - Docker with MySQL
create-better-t-stack --database mysql --db-setup docker

# ✅ Valid - Docker with MongoDB
create-better-t-stack --database mongodb --db-setup docker

# ❌ Invalid - Docker with SQLite
create-better-t-stack --database sqlite --db-setup docker

# ❌ Invalid - Docker with Workers
create-better-t-stack --runtime workers --db-setup docker
```

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 127-138

## Addon Compatibility

### PWA Support

**Requirements**:
- Requires web frontend
- Compatible frontends: `tanstack-router`, `react-router`, `next`, `solid`
- Not compatible with native-only projects

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 155-159

### Tauri (Desktop Apps)

**Requirements**:
- Requires web frontend
- Compatible frontends: `tanstack-router`, `react-router`, `nuxt`, `svelte`, `solid`, `next`
- Cannot be combined with native frameworks

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 161-165

### Web Deployment

**Requirements**:
- `--web-deploy alchemy` requires a web frontend
- Cannot be used with native-only projects

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 167-170

### Valid Addon Combinations

```bash
# ✅ Valid - PWA with web frontend
create-better-t-stack --frontend next --addons pwa

# ✅ Valid - Tauri with web frontend
create-better-t-stack --frontend tanstack-router --addons tauri

# ❌ Invalid - PWA with native-only
create-better-t-stack --frontend native-uniwind --addons pwa

# ❌ Invalid - Tauri with native framework
create-better-t-stack --frontend next native-uniwind --addons tauri

# ✅ Valid - Web deployment with web frontend
create-better-t-stack --frontend next --web-deploy alchemy

# ❌ Invalid - Web deployment with native-only
create-better-t-stack --frontend native-uniwind --web-deploy alchemy
```

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 155-170

## Authentication Requirements

### Better-Auth Requirements

Better-Auth authentication requires:

1. A backend framework (cannot be `none`)
2. With database: Requires an ORM
3. Without database: Works with Convex backend or custom configuration

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 174-180

### Clerk Requirements

Clerk authentication requires:

1. Convex backend (`--backend convex`)
2. Compatible frontends (React frameworks, Next.js, TanStack Start, native frameworks)
3. Not compatible with Nuxt, Svelte, or Solid

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 182-188

### Payments Requirements

Polar payments require:
- Better-Auth authentication

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 190-192

### Valid Authentication Combinations

```bash
# ✅ Valid - Better-Auth with database and backend
create-better-t-stack --auth better-auth --database postgres --orm drizzle --backend hono

# ✅ Valid - Better-Auth without database (custom config)
create-better-t-stack --auth better-auth --database none --backend hono

# ✅ Valid - Clerk with Convex and compatible frontend
create-better-t-stack --auth clerk --backend convex --frontend tanstack-router

# ✅ Valid - Clerk with Convex and native framework
create-better-t-stack --auth clerk --backend convex --frontend native-uniwind

# ❌ Invalid - Clerk without Convex
create-better-t-stack --auth clerk --backend hono

# ❌ Invalid - Clerk with incompatible frontend (Nuxt)
create-better-t-stack --auth clerk --backend convex --frontend nuxt

# ❌ Invalid - Clerk with incompatible frontend (Svelte)
create-better-t-stack --auth clerk --backend convex --frontend svelte

# ❌ Invalid - Clerk with incompatible frontend (Solid)
create-better-t-stack --auth clerk --backend convex --frontend solid

# ❌ Invalid - Polar payments without Better-Auth
create-better-t-stack --payments polar --auth none

# ✅ Valid - Polar payments with Better-Auth
create-better-t-stack --payments polar --auth better-auth
```

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 196-208

## Example Compatibility

### Todo Example

**Requirements**:
- Requires a database when backend is present (except Convex)
- Cannot be used with `--backend none` and `--database none`

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 211-215

### AI Example

**Restrictions**:
- Not compatible with `--backend elysia`
- Not compatible with `--frontend solid`

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 217-221

### Valid Example Combinations

```bash
# ✅ Valid - Todo example with database
create-better-t-stack --examples todo --database postgres --orm prisma

# ✅ Valid - Todo example with Convex
create-better-t-stack --examples todo --backend convex

# ❌ Invalid - Todo example without database and backend
create-better-t-stack --examples todo --backend none --database none

# ❌ Invalid - AI example with Elysia
create-better-t-stack --examples ai --backend elysia

# ❌ Invalid - AI example with Solid
create-better-t-stack --examples ai --frontend solid
```

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 211-221

## Common Error Messages

### "Mongoose ORM requires MongoDB database"

**Problem**: Attempting to use Mongoose with a non-MongoDB database

**Solution**: Use MongoDB with Mongoose
```bash
# ❌ Invalid
create-better-t-stack --database postgres --orm mongoose

# ✅ Fix
create-better-t-stack --database mongodb --orm mongoose
```

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 224-29

### "Cloudflare Workers runtime is only supported with Hono backend"

**Problem**: Attempting to use Workers runtime with non-Hono backend

**Solution**: Use Hono with Workers
```bash
# ❌ Invalid
create-better-t-stack --runtime workers --backend express

# ✅ Fix
create-better-t-stack --runtime workers --backend hono
```

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 231-36

### "Cannot select multiple web frameworks"

**Problem**: Attempting to select multiple web frameworks

**Solution**: Choose one web framework
```bash
# ❌ Invalid
create-better-t-stack --frontend next tanstack-router

# ✅ Fix
create-better-t-stack --frontend tanstack-router
```

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 238-43

### "Polar payments requires Better Auth"

**Problem**: Attempting to use Polar payments without Better-Auth

**Solution**: Use Better-Auth with Polar payments
```bash
# ❌ Invalid
create-better-t-stack --payments polar --auth none

# ✅ Fix
create-better-t-stack --payments polar --auth better-auth

# Or use Clerk with Convex (no payments support)
create-better-t-stack --auth clerk --backend convex
```

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 245-53

## Validation Strategy

The CLI validates compatibility in this order:

1. **Basic validation**: Required parameters, valid enum values
2. **Combination validation**: Database + ORM, Backend + Runtime compatibility
3. **Feature validation**: Auth requirements, addon compatibility
4. **Example validation**: Example + stack compatibility

**Source**: `apps/web/content/docs/cli/compatibility.mdx`, line 256-63

Understanding these rules helps you create valid configurations and troubleshoot issues when the CLI reports compatibility errors.

## Compatibility Matrices

### Database × ORM Matrix

| | Drizzle | Prisma | Mongoose | None |
|---|---------|---------|-----------|-------|
| SQLite | ✅ | ✅ | ❌ | ❌ |
| PostgreSQL | ✅ | ✅ | ❌ | ❌ |
| MySQL | ✅ | ✅ | ❌ | ❌ |
| MongoDB | ❌ | ✅ | ✅ | ❌ |
| None | ❌ | ❌ | ❌ | ✅ |

### Backend × Runtime Matrix

| | Bun | Node | Workers | None |
|---|-----|------|---------|------|
| Hono | ✅ | ✅ | ✅ | ❌ |
| Express | ✅ | ✅ | ❌ | ❌ |
| Fastify | ✅ | ✅ | ❌ | ❌ |
| Elysia | ✅ | ❌ | ❌ | ❌ |
| Next | ✅ | ✅ | ❌ | ❌ |
| Convex | ❌ | ❌ | ❌ | ✅ |
| None | ❌ | ❌ | ❌ | ✅ |

### Frontend × API Matrix

| | tRPC | oRPC | None |
|---|-------|-------|------|
| tanstack-router | ✅ | ✅ | ✅ |
| react-router | ✅ | ✅ | ✅ |
| tanstack-start | ✅ | ✅ | ✅ |
| next | ✅ | ✅ | ✅ |
| nuxt | ❌ | ✅ | ✅ |
| svelte | ❌ | ✅ | ✅ |
| solid | ❌ | ✅ | ✅ |
| native frameworks | ✅ | ✅ | ✅ |
| none | ❌ | ❌ | ✅ |

### Database Setup × Database Matrix

| | SQLite | PostgreSQL | MySQL | MongoDB | None |
|---|--------|------------|-------|---------|------|
| turso | ✅ | ❌ | ❌ | ❌ | ❌ |
| d1 | ✅ | ❌ | ❌ | ❌ | ❌ |
| neon | ❌ | ✅ | ❌ | ❌ | ❌ |
| supabase | ❌ | ✅ | ❌ | ❌ | ❌ |
| prisma-postgres | ❌ | ✅ | ❌ | ❌ | ❌ |
| planetscale | ❌ | ✅ | ✅ | ❌ | ❌ |
| mongodb-atlas | ❌ | ❌ | ❌ | ✅ | ❌ |
| docker | ❌ | ✅ | ✅ | ✅ | ❌ |
| none | ✅ | ✅ | ✅ | ✅ | ✅ |

### Auth × Backend Matrix

| | Hono | Express | Fastify | Elysia | Next | Convex | None |
|---|-----|---------|----------|---------|------|--------|------|
| better-auth | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| clerk | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| none | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## Quick Reference

### Default Stack (Recommended)
```bash
create-better-t-stack my-app \
  --frontend tanstack-router \
  --backend hono \
  --database sqlite \
  --orm drizzle \
  --auth better-auth \
  --addons turborepo
```

### Serverless Edge Stack
```bash
create-better-t-stack my-app \
  --frontend tanstack-router \
  --backend hono \
  --runtime workers \
  --database sqlite \
  --orm drizzle \
  --db-setup d1 \
  --web-deploy alchemy \
  --server-deploy alchemy
```

### Convex + Clerk Stack
```bash
create-better-t-stack my-app \
  --frontend tanstack-router \
  --backend convex \
  --auth clerk
```

### Mobile + Web Stack
```bash
create-better-t-stack my-app \
  --frontend next native-uniwind \
  --backend hono \
  --database sqlite \
  --orm drizzle \
  --auth better-auth
```
