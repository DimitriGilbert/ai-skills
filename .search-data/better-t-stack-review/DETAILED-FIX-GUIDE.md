# Better-T-Stack Skill Fixes - Detailed Guide

This guide provides specific file paths, line numbers, and exact edits needed to fix all identified issues in the Better-T-Stack skill.

---

## 🔴 CRITICAL FIXES (Do First)

---

## Fix #1: Add Template System Documentation

### Files to Edit:
1. `/home/didi/.config/opencode/skill/better-t-stack/SKILL.md`
2. `/home/didi/.config/opencode/skill/better-t-stack/references/OPTIONS.md`
3. `/home/didi/.config/opencode/skill/better-t-stack/examples/SETUPS.md`

---

### Edit 1.1: SKILL.md - Add Template Quick Start

**Location**: After line 43 (after "Add to Existing Project" section)

**Add this content**:
```markdown
### Template Quick Start
```bash
# T3 Stack (Next.js + tRPC + Prisma)
create-better-t-stack my-app --template t3

# MERN Stack (MongoDB + Express + React + Node)
create-better-t-stack my-app --template mern

# PERN Stack (PostgreSQL + Express + React + Node)
create-better-t-stack my-app --template pern

# UniWind React Native
create-better-t-stack my-app --template uniwind
```

Templates provide pre-configured stack combinations for common use cases.
```

---

### Edit 1.2: OPTIONS.md - Add Template Options Table

**Location**: After line 27 (after `--manual-db / --no-manual-db` row in Core Options table)

**Add this row**:
```markdown
| `--template <type>` | mern, pern, t3, uniwind, none | Use predefined stack template |
```

**Location**: After line 107 (after Examples table)

**Add this section**:
```markdown
#### Templates

| Option | Values | Description |
|--------|--------|-------------|
| `--template <type>` | t3, mern, pern, uniwind, none | Predefined stack configuration |

**Template Descriptions**:
- **t3**: T3 Stack (Next.js + tRPC + Prisma + Tailwind)
- **mern**: MERN Stack (MongoDB + Express + React + Node)
- **pern**: PERN Stack (PostgreSQL + Express + React + Node)
- **uniwind**: UniWind (React Native with NativeWind styling)

**Example**:
```bash
# Create T3 Stack project
create-better-t-stack my-app --template t3

# Create MERN Stack project
create-better-t-stack my-app --template mern
```
```

---

### Edit 1.3: SETUPS.md - Add Template Section

**Location**: After line 26 (after "Empty Monorepo" section)

**Add this section**:
```markdown
### Template-Based Setup

**T3 Stack Template** (Source: CLI help)
```bash
npm create better-t-stack@latest my-t3-app \
  --template t3
```

**Pattern**: Creates a T3 Stack with Next.js, tRPC, Prisma, and Tailwind CSS. This is a popular, opinionated stack for full-stack TypeScript applications.

**When to use**: When you want a proven, battle-tested stack with strong community support.

**MERN Stack Template** (Source: CLI help)
```bash
npm create better-t-stack@latest my-mern-app \
  --template mern
```

**Pattern**: Creates a MERN Stack with MongoDB, Express, React, and Node.js. Traditional full-stack JavaScript stack.

**When to use**: When building with MongoDB and Express, or when migrating from a MERN stack.

**PERN Stack Template** (Source: CLI help)
```bash
npm create better-t-stack@latest my-pern-app \
  --template pern
```

**Pattern**: Creates a PERN Stack with PostgreSQL, Express, React, and Node.js. Similar to MERN but with PostgreSQL.

**When to use**: When building with PostgreSQL and Express, or when you need relational database features.

**UniWind Template** (Source: CLI help)
```bash
npm create better-t-stack@latest my-uniwind-app \
  --template uniwind
```

**Pattern**: Creates a React Native application with NativeWind styling utility. Native framework with Tailwind-like CSS.

**When to use**: Building mobile applications with React Native and prefer Tailwind-style utility classes.
```

---

## Fix #2: Add Astro to Frontend Lists and Compatibility

### Files to Edit:
1. `/home/didi/.config/opencode/skill/better-t-stack/SKILL.md`
2. `/home/didi/.config/opencode/skill/better-t-stack/references/OPTIONS.md`
3. `/home/didi/.config/opencode/skill/better-t-stack/references/COMPATIBILITY.md`
4. `/home/didi/.config/opencode/skill/better-t-stack/examples/SETUPS.md`

---

### Edit 2.1: SKILL.md - Update Frontend List

**Location**: Line 52

**Current**:
```markdown
- `--frontend <type>`: tanstack-router, next, react-router, nuxt, svelte, solid, native-uniwind, native-nativewind, none
```

**Change to**:
```markdown
- `--frontend <type>`: tanstack-router, react-router, tanstack-start, next, nuxt, native-bare, native-uniwind, native-unistyles, svelte, solid, astro, none
```

---

### Edit 2.2: SKILL.md - Update Convex Backend Compatibility

**Location**: Lines 83-90

**Current**:
```markdown
### Frontend + Backend Rules
- **Web + Native**: Can combine one web + one native
- **Self backend** (fullstack): Only supports next and tanstack-start
- **Convex backend**: Not compatible with solid frontend
```

**Change to**:
```markdown
### Frontend + Backend Rules
- **Web + Native**: Can combine one web + one native
- **Self backend** (fullstack): Only supports next, tanstack-start, nuxt, and astro
- **Convex backend**: Not compatible with solid or astro frontends
```

---

### Edit 2.3: SKILL.md - Update Web Frameworks List in Troubleshooting

**Location**: Line 223

**Current**:
```markdown
**"Cannot select multiple web frameworks"**
- Use only one web framework at a time
- Can combine one web + one native (e.g., `--frontend next native-uniwind`)
```

**Change to**:
```markdown
**"Cannot select multiple web frameworks"**
- Use only one web framework at a time (choose from: tanstack-router, tanstack-start, react-router, next, nuxt, svelte, solid, astro)
- Can combine one web + one native (e.g., `--frontend next native-uniwind`)
```

---

### Edit 2.4: OPTIONS.md - Update Frontend Constraints

**Location**: Lines 36-39 (already correct in OPTIONS.md)

**Note**: OPTIONS.md already lists "astro" correctly at line 34. No change needed.

---

### Edit 2.5: OPTIONS.md - Update Self Backend Constraint

**Location**: Line 48

**Current**:
```markdown
**Constraints:**
- Self (fullstack) backend only supports next and tanstack-start frontends
```

**Change to**:
```markdown
**Constraints:**
- Self (fullstack) backend only supports next, tanstack-start, nuxt, and astro frontends
```

---

### Edit 2.6: OPTIONS.md - Update Clerk Compatibility

**Location**: Line 82

**Current**:
```markdown
**Constraints:**
- Clerk + Convex not compatible with nuxt, svelte, solid frontends
```

**Change to**:
```markdown
**Constraints:**
- Clerk + Convex not compatible with nuxt, svelte, solid, or astro frontends
```

---

### Edit 2.7: OPTIONS.md - Update AI Example Constraints

**Location**: Line 112

**Current**:
```markdown
**Constraints:**
- AI example: Not compatible with solid frontend
```

**Change to**:
```markdown
**Constraints:**
- AI example: Not compatible with solid or astro frontends
```

---

### Edit 2.8: COMPATIBILITY.md - Update Convex Backend

**Location**: Lines 126-130

**Current**:
```markdown
**Convex Clerk Support**: Convex supports Clerk authentication with compatible frontends:
- ✅ Supported: React frameworks, Next.js, TanStack Start, native frameworks
- ❌ Not supported: Nuxt, Svelte, Solid
```

**Change to**:
```markdown
**Convex Clerk Support**: Convex supports Clerk authentication with compatible frontends:
- ✅ Supported: React frameworks, Next.js, TanStack Start, native frameworks
- ❌ Not supported: Nuxt, Svelte, Solid, Astro
```

---

### Edit 2.9: COMPATIBILITY.md - Update Auth Valid Combinations

**Location**: Lines 395-411

**Find and update**:

**Current** (around line 409):
```bash
# ❌ Invalid - Clerk with incompatible frontend (Solid)
create-better-t-stack --auth clerk --backend convex --frontend solid
```

**Add after**:
```bash
# ❌ Invalid - Clerk with incompatible frontend (Astro)
create-better-t-stack --auth clerk --backend convex --frontend astro
```

**Current** (around line 411):
```bash
# ❌ Invalid - AI example with Solid
create-better-t-stack --examples ai --frontend solid
```

**Add after**:
```bash
# ❌ Invalid - AI example with Astro
create-better-t-stack --examples ai --frontend astro
```

---

### Edit 2.10: COMPATIBILITY.md - Update Example Compatibility Section

**Location**: Lines 432-436

**Current**:
```markdown
### AI Example

**Restrictions**:
- Not compatible with `--backend elysia`
- Not compatible with `--frontend solid`
```

**Change to**:
```markdown
### AI Example

**Restrictions**:
- Not compatible with `--backend elysia`
- Not compatible with `--frontend solid` or `--frontend astro`
```

---

### Edit 2.11: COMPATIBILITY.md - Add Astro to API Compatibility Matrix

**Location**: Lines 562-574 (add new row after "solid")

**Current table**:
```markdown
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
```

**Add row** (after "solid"):
```markdown
| astro | ❌ | ✅ | ✅ |
```

**Final table should be**:
```markdown
| | tRPC | oRPC | None |
|---|-------|-------|------|
| tanstack-router | ✅ | ✅ | ✅ |
| react-router | ✅ | ✅ | ✅ |
| tanstack-start | ✅ | ✅ | ✅ |
| next | ✅ | ✅ | ✅ |
| nuxt | ❌ | ✅ | ✅ |
| svelte | ❌ | ✅ | ✅ |
| solid | ❌ | ✅ | ✅ |
| astro | ❌ | ✅ | ✅ |
| native frameworks | ✅ | ✅ | ✅ |
| none | ❌ | ❌ | ✅ |
```

---

### Edit 2.12: COMPATIBILITY.md - Update Auth × Backend Matrix

**Location**: Lines 590-596

**Current**:
```markdown
### Auth × Backend Matrix

| | Hono | Express | Fastify | Elysia | Next | Convex | None |
|---|-----|---------|----------|---------|------|--------|------|
| better-auth | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| clerk | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| none | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
```

**Change to**:
```markdown
### Auth × Backend Matrix

| | Hono | Express | Fastify | Elysia | Self | Convex | None |
|---|-----|---------|----------|---------|-------|--------|------|
| better-auth | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| clerk | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| none | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
```

**Note**: Changed "Next" to "Self" column header to be more accurate.

---

### Edit 2.13: SETUPS.md - Update Convex Section

**Location**: Lines 199

**Current**:
```markdown
**Convex + React + Clerk** (Source: `apps/web/content/docs/index.mdx`, line 58-67, slightly modified)
```

**Note**: Already lists Convex, but add note about Astro incompatibility.

---

## 🟠 HIGH PRIORITY FIXES (Do Soon)

---

## Fix #3: Add Validation Order Documentation

### File to Edit:
`/home/didi/.config/opencode/skill/better-t-stack/references/COMPATIBILITY.md`

---

### Edit 3.1: Add Validation Order Section

**Location**: After line 640 (at the end of the file, before "Quick Reference" section)

**Add this section**:
```markdown
## Validation Order

The CLI validates compatibility in the following order:

### 1. Self Backend Compatibility
Ensures that `--backend self` (fullstack mode) is only used with supported frontends:
- Supported: next, tanstack-start, nuxt, astro
- Not supported: Other web frameworks
- Support for svelte (SvelteKit) coming in future update

**Error example**:
```
Backend 'self' (fullstack) currently only supports Next.js, TanStack Start, Nuxt, and Astro frontends.
```

### 2. Workers Runtime Compatibility
Ensures `--runtime workers` is compatible with selected options:
- Backend must be `hono`
- ORM must be `drizzle` or `prisma`
- Database must NOT be `mongodb`
- db-setup must NOT be `docker`

**Error examples**:
```
Cloudflare Workers runtime (--runtime workers) is only supported with Hono backend.
Cloudflare Workers runtime (--runtime workers) is not compatible with MongoDB database.
Cloudflare Workers runtime (--runtime workers) is not compatible with Docker setup.
```

### 3. API/Frontend Compatibility
Ensures selected API framework works with selected frontends:
- tRPC: React frameworks, Next.js, TanStack Start, Native frameworks
- oRPC: All frameworks
- none: All frameworks (no API layer)

**Not compatible with tRPC**: nuxt, svelte, solid, astro

**Error example**:
```
tRPC API is not supported with 'nuxt' frontend. Please use --api orpc or --api none.
```

### 4. Web Deployment Requirements
Ensures `--web-deploy` has a web frontend:
- Requires at least one web framework
- Cannot be used with native-only projects

**Error example**:
```
'--web-deploy' requires a web frontend. Please select a web frontend or set '--web-deploy none'.
```

### 5. Server Deployment Requirements
Ensures `--server-deploy` has a backend:
- Requires a non-none backend
- Cannot be used with backend-less projects

**Error example**:
```
'--server-deploy' requires a backend. Please select a backend or set '--server-deploy none'.
```

### 6. Addon Compatibility
Ensures addons work with selected frontends:
- PWA: Requires tanstack-router, react-router, solid, next
- Tauri: Requires tanstack-router, react-router, nuxt, svelte, solid, next

**Error example**:
```
Incompatible addon/frontend combination: pwa addon requires one of these frontends: tanstack-router, react-router, solid, next
```

### 7. Payments Compatibility
Ensures payments provider requirements are met:
- Polar payments: Requires better-auth and a web frontend

**Error example**:
```
Polar payments requires Better Auth. Please use '--auth better-auth'.
```

### 8. Examples Compatibility
Ensures example templates work with selected stack:
- Todo example: Requires database (except Convex) and API
- AI example: Not compatible with solid or astro frontends
- AI example with Convex: Not compatible with nuxt or svelte

**Error examples**:
```
The 'todo' example requires a database. Cannot use --examples todo when database is 'none'.
The 'ai' example is not compatible with Solid frontend.
```

### Why Order Matters

The CLI performs validations in this specific order and **stops at the first error**. This means:

1. **First failed check** generates the error message
2. **Multiple issues** may exist but only first is reported
3. **Fix first error**, then re-run to find any additional issues

**Example**:
```bash
# This command has multiple issues
create-better-t-stack my-app \
  --frontend nuxt \
  --backend self \
  --runtime workers \
  --database mongodb \
  --api trpc
```

**Error returned** (only first issue):
```
Backend 'self' (fullstack) currently only supports Next.js, TanStack Start, Nuxt, and Astro frontends.
```

After fixing first issue (changing frontend to `next`), next error would be:
```
Backend 'self' is not compatible with Cloudflare Workers runtime.
```

And so on, until all compatibility issues are resolved.

### Agent Usage Pattern

When using programmatic API or building automation:

```typescript
import { create } from "create-better-t-stack";

const result = await create("my-app", options);

if (!result.success) {
  // Parse error to understand what needs fixing
  console.error(`Validation failed: ${result.error}`);

  // Common error patterns and fixes
  if (result.error.includes("multiple web frameworks")) {
    // Fix: Remove one web frontend
  } else if (result.error.includes("not compatible with")) {
    // Fix: Change incompatible option
  } else if (result.error.includes("requires")) {
    // Fix: Add missing required option
  }
}
```
```

**Source**: `apps/cli/src/utils/compatibility-rules.ts` and `apps/cli/src/utils/config-validation.ts`
```

---

## Fix #4: Add Programmatic API Error Handling

### Files to Edit:
1. `/home/didi/.config/opencode/skill/better-t-stack/SKILL.md`
2. `/home/didi/.config/opencode/skill/better-t-stack/references/BEST-PRACTICES.md`

---

### Edit 4.1: SKILL.md - Update Programmatic API Section

**Location**: Lines 178-195

**Current**:
```typescript
import { init } from "create-better-t-stack";

const result = await init("my-project", {
  frontend: ["tanstack-router"],
  backend: "hono",
  database: "sqlite",
  orm: "drizzle",
  auth: "better-auth",
  yes: true
});

if (!result.success) {
  console.error(result.error);
}
```

**Change to**:
```typescript
import { create } from "create-better-t-stack";

const result = await create("my-project", {
  frontend: ["tanstack-router"],
  backend: "hono",
  database: "sqlite",
  orm: "drizzle",
  auth: "better-auth",
  yes: true
});

if (result.success) {
  console.log(`✅ Project created at: ${result.projectDirectory}`);
  console.log(`📝 Reproducible command: ${result.reproducibleCommand}`);
  console.log(`⏱️  Time taken: ${result.elapsedTimeMs}ms`);
  console.log(`📂 Created at: ${result.timeScaffolded}`);
} else {
  console.error(`❌ Failed: ${result.error}`);

  // Parse error to determine fix
  if (result.error?.includes("multiple web frameworks")) {
    console.error("Fix: Use only one web framework at a time");
  } else if (result.error?.includes("not compatible with")) {
    console.error("Fix: Check compatibility rules and change incompatible options");
  } else if (result.error?.includes("requires")) {
    console.error("Fix: Add the missing required option");
  }
}
```

**Note**: Also change `init` to `create` (correct API function name).

---

### Edit 4.2: BEST-PRACTICES.md - Update Programmatic API Example

**Location**: Lines 465-488

**Current**:
```typescript
import { create } from "create-better-t-stack";

const result = await create("my-app", {
  yes: true, // Use defaults, no prompts
  frontend: ["tanstack-router"],
  backend: "hono",
  database: "sqlite",
  orm: "drizzle",
  auth: "better-auth",
  packageManager: "bun",
  install: false,
  disableAnalytics: true,
});

if (result.success) {
  console.log(`✅ Project created at: ${result.projectDirectory}`);
  console.log(`📝 Reproducible command: ${result.reproducibleCommand}`);
  console.log(`⏱️  Time taken: ${result.elapsedTimeMs}ms`);
} else {
  console.error(`❌ Failed: ${result.error}`);
}
```

**Add after line 488**:
```typescript

### Error Handling Patterns

**Parse Error Messages**:
```typescript
if (!result.success) {
  const error = result.error;

  // Extract error type from message
  if (error.includes("multiple web frameworks")) {
    console.error("Multiple web frameworks selected");
    console.error("Solution: Use only one web framework");
  } else if (error.includes("not compatible with")) {
    console.error("Incompatible options detected");
    console.error("Solution: Check compatibility rules and change options");
  } else if (error.includes("requires")) {
    console.error("Missing required option");
    console.error("Solution: Add the missing required option");
  } else if (error.includes("only supported with")) {
    console.error("Unsupported combination");
    console.error("Solution: Use the supported options listed in error");
  }
}
```

**Retry with Fixed Configuration**:
```typescript
async function createProjectWithRetry(projectName: string, options: any) {
  let attempt = 0;
  const maxAttempts = 3;

  while (attempt < maxAttempts) {
    const result = await create(projectName, options);

    if (result.success) {
      return result;
    }

    attempt++;
    console.error(`Attempt ${attempt} failed: ${result.error}`);

    // Try to fix common errors automatically
    if (result.error.includes("multiple web frameworks")) {
      // Keep only first web framework
      const webFrameworks = options.frontend.filter((f: string) => isWebFramework(f));
      options.frontend = [webFrameworks[0], ...options.frontend.filter((f: string) => !isWebFramework(f))];
    } else if (result.error.includes("not compatible with")) {
      // Stop retrying for incompatibility - requires manual fix
      break;
    }

    // Use increment directory to avoid conflicts on retry
    options.directoryConflict = "increment";
  }

  throw new Error(`Failed to create project after ${maxAttempts} attempts`);
}
```
```

---

## 🟡 MEDIUM PRIORITY FIXES (Do Later)

---

## Fix #5: Clarify MongoDB + Workers Compatibility

### File to Edit:
`/home/didi/.config/opencode/skill/better-t-stack/references/COMPATIBILITY.md`

---

### Edit 5.1: Update MongoDB Workers Constraint

**Location**: Lines 78-84

**Current**:
```markdown
| Database | Cannot be `mongodb` | MongoDB requires Prisma/Mongoose |
```

**Change to**:
```markdown
| Database | Cannot be `mongodb` | MongoDB not compatible with Workers runtime (requires serverless databases like SQLite) |
```

**Add note after the table**:
```markdown
**Note**: MongoDB requires Prisma or Mongoose ORM, and while Workers runtime supports Prisma, MongoDB itself is not supported in the Workers environment. Workers runtime is designed for serverless databases like SQLite (via D1), PostgreSQL, or MySQL.

**Why**: MongoDB requires a persistent connection and is not well-suited for the ephemeral, edge-based Workers runtime environment.
```

---

## Fix #6: Add Directory Conflict Usage Guide

### File to Edit:
`/home/didi/.config/opencode/skill/better-t-stack/references/OPTIONS.md`

---

### Edit 6.1: Add Directory Conflict Table

**Location**: After line 142 (after Directory Handling header and option table)

**Add this section**:
```markdown
**When to use each directory conflict strategy**:

| Strategy | Use Case | Behavior | Example |
|----------|----------|-----------|---------|
| `error` | Safe development, don't want to accidentally overwrite existing projects | Fails with error if directory exists | `create-better-t-stack my-app --directory-conflict error` |
| `increment` | Multiple iterations, want to keep all versions | Creates new directory with numeric suffix (e.g., `my-app-1`) | `create-better-t-stack my-app --directory-conflict increment` |
| `overwrite` | Know what you're doing, want to replace entire directory | Completely replaces existing directory and its contents | `create-better-t-stack my-app --directory-conflict overwrite` |
| `merge` | Updating existing project, want to preserve some files | Merges new files with existing directory | `create-better-t-stack my-app --directory-conflict merge` |

**Recommendations**:

**For AI Agents**:
```typescript
// Default to 'increment' for safe retries
const result = await create("my-app", {
  ...options,
  directoryConflict: "increment"  // Creates my-app-1, my-app-2, etc. on retries
});
```

**For Interactive Development**:
- Use `error` (default) to prevent accidental overwrites
- Use `increment` when testing multiple configurations
- Use `overwrite` only when you're certain

**For CI/CD**:
```bash
# Fail if directory exists (safe default)
create-better-t-stack my-app --directory-conflict error --yes

# Or clean first, then create
rm -rf my-app && create-better-t-stack my-app --yes
```
```

---

## Fix #7: Explain Manual Database Setup Flag

### File to Edit:
`/home/didi/.config/opencode/skill/better-t-stack/references/OPTIONS.md`

---

### Edit 7.1: Add Manual DB Explanation

**Location**: After line 28 (after `--manual-db / --no-manual-db` row in table)

**Add this section**:
```markdown
**Manual Database Setup**:

The `--manual-db` flag skips the automatic database setup prompt when you want to:

1. **Configure database manually** after project creation
2. **Use an external database service** not covered by built-in setup options (e.g., custom MongoDB Atlas, DigitalOcean managed database)
3. **Skip database setup** temporarily and add it later via the `add` command

**Example**:
```bash
# Create project without database setup
create-better-t-stack my-app --database postgres --orm drizzle --manual-db

# Then configure database manually:
cd my-app
# Edit .env files, configure connection strings, etc.
```

**Note**: This flag only affects the setup prompt phase. The database and ORM are still scaffolded in the project; you just skip the interactive setup for connection details.
```

---

## 🟢 LOW PRIORITY FIXES (Nice to Have)

---

## Fix #8: Add Frontend + Native Structure Diagram

### Files to Edit:
1. `/home/didi/.config/opencode/skill/better-t-stack/SKILL.md`
2. `/home/didi/.config/opencode/skill/better-t-stack/examples/SETUPS.md`

---

### Edit 8.1: SKILL.md - Add Structure Diagram

**Location**: After line 150 (after "Web + Native App" example)

**Add this section**:
```markdown
**Web + Native Project Structure**:
```
my-app/
├── apps/
│   ├── web/              # Next.js app (web frontend)
│   ├── native/           # React Native app (mobile app)
│   └── server/           # Shared backend (Hono)
├── packages/
│   ├── ui/               # Shared UI components
│   ├── config/           # Shared TypeScript config
│   ├── db/               # Shared database schema
│   └── api/             # Shared API types
├── package.json          # Monorepo root
└── turbo.json           # Turborepo configuration
```

**Key Points**:
- Web and native apps **share** backend, database, and UI packages
- Run both with: `turbo dev` (starts web on port 3000, native via Expo)
- Native app connects to local backend via `EXPO_PUBLIC_SERVER_URL` environment variable
```

---

### Edit 8.2: SETUPS.md - Update Multi-Frontend Section

**Location**: After line 68 (after "Important Note" about EXPO_PUBLIC_SERVER_URL)

**Add this structure**:
```markdown
**Resulting Project Structure**:
```
my-app/
├── apps/
│   ├── web/              # Web frontend (Next.js/TanStack/etc.)
│   │   ├── src/
│   │   └── package.json
│   ├── native/           # Native frontend (React Native)
│   │   ├── src/
│   │   └── package.json
│   └── server/           # Shared backend
│       ├── src/
│       └── package.json
├── packages/
│   ├── ui/               # Shared UI components
│   ├── config/           # Shared config
│   └── db/               # Shared database schema
└── turbo.json
```

**Development Commands**:
```bash
# Start all apps
turbo dev

# Start specific app
turbo -F web dev        # Web only
turbo -F native dev     # Native only
turbo -F server dev     # Backend only
```
```

---

## Summary Checklist

Use this checklist to track fix completion:

### Critical Fixes (Phase 1)
- [ ] Fix #1.1: Add Template Quick Start to SKILL.md
- [ ] Fix #1.2: Add Template Options to OPTIONS.md
- [ ] Fix #1.3: Add Template Section to SETUPS.md
- [ ] Fix #2.1: Update Frontend List in SKILL.md
- [ ] Fix #2.2: Update Convex Backend Compatibility in SKILL.md
- [ ] Fix #2.3: Update Troubleshooting in SKILL.md
- [ ] Fix #2.5: Update Self Backend Constraint in OPTIONS.md
- [ ] Fix #2.6: Update Clerk Compatibility in OPTIONS.md
- [ ] Fix #2.7: Update AI Example Constraints in OPTIONS.md
- [ ] Fix #2.8: Update Convex Backend in COMPATIBILITY.md
- [ ] Fix #2.9: Update Auth Valid Combinations in COMPATIBILITY.md
- [ ] Fix #2.10: Update Example Compatibility in COMPATIBILITY.md
- [ ] Fix #2.11: Add Astro to API Matrix in COMPATIBILITY.md
- [ ] Fix #2.12: Update Auth Matrix in COMPATIBILITY.md

### High Priority Fixes (Phase 2)
- [ ] Fix #3.1: Add Validation Order to COMPATIBILITY.md
- [ ] Fix #4.1: Update Programmatic API in SKILL.md
- [ ] Fix #4.2: Add Error Handling to BEST-PRACTICES.md

### Medium Priority Fixes (Phase 3)
- [ ] Fix #5.1: Clarify MongoDB Workers in COMPATIBILITY.md
- [ ] Fix #6.1: Add Directory Conflict Guide to OPTIONS.md
- [ ] Fix #7.1: Explain Manual DB Flag in OPTIONS.md

### Low Priority Fixes (Phase 4)
- [ ] Fix #8.1: Add Structure Diagram to SKILL.md
- [ ] Fix #8.2: Add Structure to SETUPS.md

---

## Testing After Fixes

After applying all fixes, test with these commands:

```bash
# Test Template System
create-better-t-stack test-t3 --template t3
create-better-t-stack test-mern --template mern

# Test Astro Compatibility (should fail)
create-better-t-stack test-astro-convex --frontend astro --backend convex
create-better-t-stack test-astro-trpc --frontend astro --api trpc
create-better-t-stack test-astro-ai --frontend astro --examples ai

# Test Astro + Self Backend (should work)
create-better-t-stack test-astro-self --frontend astro --backend self

# Test Programmatic API with Error Handling
node test-programmatic-api.js

# Test Directory Conflict Strategies
create-better-t-stack test-error --directory-conflict error
create-better-t-stack test-increment --directory-conflict increment
```

---

## Estimated Time to Complete

| Phase | Fixes | Estimated Time |
|-------|--------|---------------|
| Phase 1 (Critical) | 14 fixes | 2-3 hours |
| Phase 2 (High Priority) | 3 fixes | 1 hour |
| Phase 3 (Medium Priority) | 3 fixes | 45 minutes |
| Phase 4 (Low Priority) | 2 fixes | 30 minutes |
| **Total** | **22 fixes** | **~4-5 hours** |

---

## Notes

1. **Line numbers** in this guide are approximate. Always search for context to find exact location.
2. **Always test** after making changes to ensure accuracy.
3. **Backup files** before editing in case of mistakes.
4. **Cross-reference** with source code when in doubt.
5. **Update all three files** (SKILL.md, OPTIONS.md, COMPATIBILITY.md) consistently when making changes related to a feature.

---

End of Fix Guide
