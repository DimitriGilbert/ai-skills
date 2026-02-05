# Better-T-Stack Best Practices

## Choosing the Right Stack

### For Full-Stack Apps

**Recommended Default Stack** (Source: `apps/web/content/docs/index.mdx`, line 49-56):
```bash
npm create better-t-stack@latest my-webapp \
  --frontend tanstack-router \
  --backend hono \
  --database sqlite \
  --orm drizzle \
  --auth better-auth \
  --addons turborepo
```

This stack provides:
- **TanStack Router**: Modern React routing with type-safe navigation
- **Hono**: Fast, lightweight backend framework
- **SQLite + Drizzle**: Simple local development with TypeScript-first ORM
- **Better-Auth**: Flexible authentication solution
- **Turborepo**: Monorepo management for efficient builds

### For Backend-Only Projects

**API Server** (Source: `apps/web/content/docs/index.mdx`, line 61-67):
```bash
npm create better-t-stack@latest my-api \
  --frontend none \
  --backend fastify \
  --runtime node \
  --database postgres \
  --orm prisma \
  --api trpc
```

Best practices:
- Use **Fastify** for high-performance Node.js backends
- **Prisma** for robust database management in production
- **PostgreSQL** for production databases
- **tRPC** for type-safe API communication

### For Frontend-Only Projects

**SPA with External API**:
```bash
npm create better-t-stack@latest my-frontend \
  --frontend next \
  --backend none \
  --api none
```

Considerations:
- Next.js for SSR/SSG capabilities
- TanStack Router for pure SPAs
- Add PWA addon for mobile-friendly experience

### For Native Apps

**Mobile App** (Source: `apps/web/content/docs/index.mdx`, line 72-79):
```bash
npm create better-t-stack@latest my-native \
  --frontend native-uniwind \
  --backend hono \
  --database sqlite \
  --orm drizzle \
  --auth better-auth
```

Best practices:
- **NativeWind/Unistyles** for React Native styling
- **Hono** backend for fast API responses
- **SQLite** for local development database
- Set `EXPO_PUBLIC_SERVER_URL` to machine IP (not `localhost`) for mobile connection (Source: `apps/web/content/docs/faq.mdx`, line 63-65)

## Configuration Management

### bts.jsonc Management

**Purpose**: (Source: `apps/web/content/docs/bts-config.mdx`, line 6-8)
- Captures stack choices during project creation
- Required for `add` command to detect current stack
- Helps validate compatibility and pre-fill sensible defaults

**Safe to Delete**: (Source: `apps/web/content/docs/bts-config.mdx`, line 19-21)
- Safe to delete for normal development
- Generated code remains the source of truth
- Must keep if using `add` command later

**Structure**: (Source: `apps/web/content/docs/bts-config.mdx`, line 27-47)
```jsonc
{
  "$schema": "https://r2.better-t-stack.dev/schema.json",
  "version": "x.y.z",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "reproducibleCommand": "bun create better-t-stack my-app --frontend tanstack-router ...",
  "frontend": ["tanstack-router"],
  "backend": "hono",
  "runtime": "bun",
  "database": "sqlite",
  "orm": "drizzle",
  "api": "trpc",
  "auth": "better-auth",
  "addons": ["turborepo"],
  "examples": [],
  "dbSetup": "none",
  "webDeploy": "none",
  "serverDeploy": "none",
  "packageManager": "bun"
}
```

### Environment Variables

**For Traditional Runtimes**: (Source: `apps/web/content/docs/project-structure.mdx`, line 406-416)
- Use `process.env` for server environment variables
- Client variables use `VITE_` prefix with t3-env validation

**For Cloudflare Workers**: (Source: `apps/web/content/docs/guides/cloudflare-alchemy.mdx`, line 396-411)
- Server env vars come from Worker bindings, not `process.env`
- Types come from Alchemy via `env.d.ts` file
- No t3-env validation needed for server env (bindings are already type-safe)
- Client env vars always use t3-env validation

### Project Updates

**Using Add Command**: (Source: `apps/web/content/docs/cli/index.mdx`, line 63-91)
```bash
# Add addons interactively
create-better-t-stack add

# Add specific addons
create-better-t-stack add --addons pwa tauri --install

# Add deployment setup
create-better-t-stack add --web-deploy alchemy
```

**Important**: The `add` command requires `bts.jsonc` to be present in the project root.

## Usage Patterns

### init vs add Commands

**Use `init` (default command) when**: (Source: `apps/web/content/docs/cli/index.mdx`, line 10-61)
- Creating a new project from scratch
- Starting with a fresh codebase
- Using a predefined template

**Use `add` when**: (Source: `apps/web/content/docs/cli/index.mdx`, line 63-91)
- Adding features to an existing Better-T-Stack project
- Adding deployment configuration
- Adding addons to an existing project

### Workflow Patterns

**Interactive Mode**: (Source: `apps/web/content/docs/cli/prompts.mdx`, line 8-58)
- Use prompts when exploring options
- Navigate with Up/Down arrows
- Confirm with Enter
- Cancel with Ctrl+C
- Toggle multi-select options with Space

**Non-Interactive Mode**: (Source: `apps/web/content/docs/cli/index.mdx`, line 24-25)
```bash
npm create better-t-stack@latest --yes
```
- Skip all prompts and use defaults
- Useful for automation and CI/CD

**UI-Based Stack Builder**: (Source: `apps/web/content/docs/index.mdx`, line 35-42)
```bash
npm create better-t-stack@latest builder
```
- Opens web-based stack builder at `/new`
- Visual selection of stack components
- Generates command to copy and paste

### Common Workflows

**Development Workflow**: (Source: `apps/web/content/docs/project-structure.mdx`, line 386-417)

With Turborepo:
```bash
# Start all apps
turbo dev

# Start specific app
turbo -F web dev
turbo -F server dev

# Build all
turbo build

# Database operations
turbo -F server db:push
turbo -F server db:studio
```

Without Turborepo (Bun example):
```bash
# Start all apps
bun run --filter '*' dev

# Start specific app
bun run --filter web dev
bun run --filter server dev

# Build all
bun run --filter '*' build
```

## Development Practices

### Testing

**Testing CLI**: (Source: `.search-data/better-t-stack/repo/AGENTS.md`, line 15-20)
```bash
# Run all tests
bun test

# Run specific test file
bun test apps/cli/test/cli.test.ts

# Run specific test case
bun test -t "test name pattern"

# Always build before testing build artifacts
bun run build
```

**Run in Watch Mode**: (Source: `apps/web/content/docs/contributing.mdx`, line 40-42)
```bash
cd apps/cli
bun dev
```

### Deployment

**Cloudflare Workers with Alchemy**: (Source: `apps/web/content/docs/guides/cloudflare-alchemy.mdx`, line 440-497)

Deploy commands:
```bash
# Deploy to default stage
bun run deploy

# Deploy to specific stage
bun run deploy --stage prod

# Development mode (local emulation)
bun run dev

# Destroy resources
bun run destroy
```

Multi-stage deployments:
- Each stage has isolated state and resources
- State stored in `.alchemy/<stage>/` directories
- Stage resolution order: `--stage` > `ALCHEMY_STAGE` > `STAGE` > `$USER` > `"dev"`

### Maintenance

**Linting and Formatting**: (Source: `.search-data/better-t-stack/repo/AGENTS.md`, line 22-24)
```bash
bun check  # Runs oxfmt and oxlint
oxfmt .     # Fix formatting issues
```

**Commit Conventions**: (Source: `apps/web/content/docs/contributing.mdx`, line 108-118)
```bash
feat(cli): add new CLI feature
fix(cli): fix CLI bug
feat(web): add new web feature
fix(web): fix web bug
chore(web): update dependencies
docs: update documentation
```

## Performance Considerations

### Runtime Selection

**Bun**: (Source: `apps/web/content/docs/index.mdx`, line 95)
- Recommended package manager and runtime
- Fastest JavaScript runtime
- Best for development and production
- Native support for file operations

**Node.js**: (Source: `apps/web/content/docs/index.mdx`, line 95)
- LTS version required (20+) (Source: `apps/web/content/docs/faq.mdx`, line 27)
- Traditional, stable runtime
- Best for legacy integration
- Good ecosystem support

**Cloudflare Workers**: (Source: `apps/web/content/docs/cli/compatibility.mdx`, line 38-58)
- Serverless edge computing
- Must use Hono backend
- Supports Drizzle and Prisma (not Mongoose)
- Cannot use MongoDB
- Requires D1 database setup
- No Docker support

### Database Selection

**SQLite**: (Source: `apps/web/content/docs/cli/options.mdx`, line 125)
- Lightweight, file-based database
- Best for local development
- Works with Drizzle and Prisma
- Compatible with Turso and Cloudflare D1

**PostgreSQL**: (Source: `apps/web/content/docs/cli/options.mdx`, line 126)
- Advanced relational database
- Production-ready
- Works with Drizzle and Prisma
- Compatible with Neon, Supabase, PlanetScale

**MySQL**: (Source: `apps/web/content/docs/cli/options.mdx`, line 127)
- Traditional relational database
- Works with Drizzle and Prisma
- Compatible with PlanetScale

**MongoDB**: (Source: `apps/web/content/docs/cli/options.mdx`, line 128)
- Document database
- Requires Mongoose or Prisma (not Drizzle)
- Compatible with MongoDB Atlas

### Addon Selection

**Turborepo**: (Source: `apps/web/content/docs/project-structure.mdx`, line 355-402)
- Use for monorepos with multiple packages
- Provides build caching and task orchestration
- Improves build performance
- Adds `turbo.json` configuration

**PWA**: (Source: `apps/web/content/docs/cli/options.mdx`, line 289)
- Requires web frontend
- Compatible with tanstack-router, react-router, next, solid
- Not compatible with native-only projects
- Adds offline capabilities

**Tauri**: (Source: `apps/web/content/docs/cli/options.mdx`, line 290)
- Desktop app support
- Requires web frontend
- Cannot be combined with native frameworks
- Compatible with tanstack-router, react-router, nuxt, svelte, solid, next

## Security Best Practices

### Authentication Setup

**Better-Auth Requirements**: (Source: `apps/web/content/docs/cli/options.mdx`, line 263-266)
- Requires both a database and backend framework
- Can work without database (with Convex backend or custom config)
- Adds `src/lib/auth.ts` on server
- Adds login/dashboard pages on web app

**Clerk Requirements**: (Source: `apps/web/content/docs/cli/options.mdx`, line 264)
- Only available with Convex backend
- Compatible with React frameworks, Next.js, TanStack Start, native frameworks
- Not compatible with Nuxt, Svelte, or Solid

**Cross-Subdomain Cookies** (Cloudflare Workers): (Source: `apps/web/content/docs/guides/cloudflare-alchemy.mdx`, line 549-576)
```typescript
// packages/auth/src/auth.ts
export const auth = betterAuth({
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: ".workers.dev", // Shared domain for cookies
    },
  },
});
```

### Database Security

**ORM Security**:
- Always use parameterized queries (ORMs handle this automatically)
- Validate user input at the application layer
- Use environment variables for database credentials
- Never commit database connection strings

**Environment Variables**: (Source: `apps/web/content/docs/guides/cloudflare-alchemy.mdx`, line 161-204)
- Use `alchemy.secret.env` for sensitive values (API keys, credentials, secrets)
- Use `alchemy.env` for non-sensitive values (URLs, feature flags, stage identifiers)
- Secrets are encrypted with AES-256-GCM
- Set `ALCHEMY_PASSWORD` for secret encryption/decryption

### Deployment Security

**Analytics**: (Source: `apps/web/content/docs/analytics.mdx`, line 6-19)
- CLI sends `project_created` event with stack choices and environment data
- Random session ID (no IP collection)
- Project name, path, and file contents are NOT collected
- Disable with `BTS_TELEMETRY_DISABLED=1` environment variable

**Secrets in CI/CD**: (Source: `apps/web/content/docs/guides/cloudflare-alchemy.mdx`, line 208-220)
```yaml
# GitHub Actions
env:
  ALCHEMY_PASSWORD: ${{ secrets.ALCHEMY_PASSWORD }}
```

- Generate strong password: `openssl rand -base64 32`
- Store password securely (never commit to source control)
- For Convex backends, use `convex env set` to set secrets directly

**Cross-Domain Considerations**: (Source: `apps/web/content/docs/guides/cloudflare-alchemy.mdx`, line 525-578)
- Web and server Workers have different domains
- Update `VITE_SERVER_URL` and `CORS_ORIGIN` for production URLs
- Configure `crossSubDomainCookies` for auth across subdomains
- Pay attention to CORS settings when moving between stages

## Contributing

**Prerequisites**: (Source: `apps/web/content/docs/contributing.mdx`, line 20-24)
- Node.js LTS
- Bun (recommended)
- Git

**Development Setup**: (Source: `apps/web/content/docs/contributing.mdx`, line 28-50)
```bash
# Clone repository
git clone https://github.com/AmanVarshney01/create-better-t-stack.git
cd create-better-t-stack
bun install

# Develop CLI
cd apps/cli
bun link  # Optional global link
bun dev    # Watch mode

# Develop docs
bun i
cd packages/backend
bun dev:setup
```

**Contribution Flow**: (Source: `apps/web/content/docs/contributing.mdx`, line 74-107)
1. Open an issue/discussion before starting major work
2. Fork repository
3. Create feature branch
4. Make changes following existing code style
5. Update docs as needed
6. Test and format
7. Commit and push
8. Open Pull Request

## Programmatic Usage

**Use Programmatic API for**: (Source: `apps/web/content/docs/cli/index.mdx`, line 163-187)
- Build tools and generators
- CI/CD pipelines
- Development workflows
- Custom tooling integration

**Basic Example**: (Source: `apps/web/content/docs/cli/programmatic-api.mdx`, line 22-47)
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

## Getting Help

- **Docs**: Quick Start, CLI, Project Structure, Compatibility (Source: `apps/web/content/docs/faq.mdx`, line 76-78)
- **Ask/Report**: GitHub Issues & Discussions
- **Community**: Discord (Source: `apps/web/content/docs/contributing.mdx`, line 122)
- **Analytics**: `/analytics` page or `https://r2.better-t-stack.dev/analytics-data.json` (Source: `apps/web/content/docs/analytics.mdx`, line 34-36)
