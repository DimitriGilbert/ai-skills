# Common Usage Patterns

## Init Command Patterns

### Standard Full-Stack Setup

**Default Full-Stack App** (Source: `apps/web/content/docs/index.mdx`, line 49-56)
```bash
npm create better-t-stack@latest my-webapp \
  --frontend tanstack-router \
  --backend hono \
  --database sqlite \
  --orm drizzle \
  --auth better-auth \
  --addons turborepo
```

**Pattern**: This is the recommended starting point for most full-stack applications. It provides a complete, type-safe stack with:
- Modern React frontend (TanStack Router)
- Fast, lightweight backend (Hono)
- Local database (SQLite with Drizzle)
- Authentication (Better-Auth)
- Monorepo tooling (Turborepo)

**When to use**: Starting a new web application, prototype, or MVP

### Minimal Setup

**Empty Monorepo** (Source: `apps/web/content/docs/index.mdx`, line 82-87)
```bash
npm create better-t-stack@latest my-workspace \
  --frontend none \
  --backend none
```

**Pattern**: Creates a minimal monorepo structure with only the essential configuration files. This gives you maximum flexibility to add what you need later.

**When to use**: Starting a new project from scratch, creating a custom workspace, or when you want to add components manually

**Frontend-Only SPA**
```bash
npm create better-t-stack@latest my-frontend \
  --frontend next \
  --backend none \
  --api none \
  --addons pwa
```

**Pattern**: Creates a frontend-only project with no backend or API layer. Perfect for static sites, SPAs consuming external APIs, or when using a separate backend service.

**When to use**: Marketing sites, dashboards, applications using external APIs, when backend is managed separately

### Multi-Frontend Setup

**Web + Native Frontends** (Source: `apps/web/content/docs/cli/options.mdx`, line 238-239)
```bash
npm create better-t-stack@latest my-app \
  --frontend next native-uniwind
```

**Pattern**: Combines a web frontend with a React Native frontend in the same monorepo. Both share the same backend, API, and authentication infrastructure.

**Key Points** (Source: `apps/web/content/docs/cli/compatibility.mdx`, line 112-123):
- ✅ Allowed: One web + one native framework
- ❌ Not allowed: Multiple web frameworks
- ❌ Not allowed: Multiple native frameworks

**When to use**: Applications that need both web and mobile interfaces sharing the same backend

**Important Note**: Mobile app requires special configuration for local development (Source: `apps/web/content/docs/faq.mdx`, line 63-65):
```bash
# Set EXPO_PUBLIC_SERVER_URL to machine IP, not localhost
EXPO_PUBLIC_SERVER_URL=http://192.168.1.X:3000
```

## Add Command Patterns

### Adding Addons

**Interactive Mode** (Source: `apps/web/content/docs/cli/index.mdx`, line 82-84)
```bash
cd my-existing-project
create-better-t-stack add
```

**Pattern**: Runs the `add` command interactively, prompting you to select addons to add to your existing project. The CLI detects your current stack from `bts.jsonc` and validates compatibility.

**Specific Addons** (Source: `apps/web/content/docs/cli/index.mdx`, line 86-87)
```bash
cd my-existing-project
create-better-t-stack add --addons pwa tauri biome --install
```

**Pattern**: Adds specific addons non-interactively. Useful for automation and scripts.

**Common Addon Combinations**:

**PWA + Biome**
```bash
create-better-t-stack add --addons pwa biome --install
```
- PWA for mobile-friendly experience
- Biome for fast linting and formatting

**Turborepo + Lefthook**
```bash
create-better-t-stack add --addons turborepo lefthook --install
```
- Turborepo for monorepo management
- Lefthook for Git hooks

**Documentation (Starlight or Fumadocs)**
```bash
create-better-t-stack add --addons starlight --install
```
- Adds documentation site to your monorepo

### Adding Deployment

**Web Deployment** (Source: `apps/web/content/docs/cli/index.mdx`, line 89-90)
```bash
cd my-project
create-better-t-stack add --web-deploy alchemy
```

**Pattern**: Adds Cloudflare Workers deployment configuration for your web frontend. This generates:
- `packages/infra/` directory with Alchemy configuration
- `alchemy.run.ts` file for deployment
- Environment variable setup
- Deployment scripts

**Server Deployment**
```bash
cd my-project
create-better-t-stack add --server-deploy alchemy
```

**Pattern**: Adds Cloudflare Workers deployment configuration for your server backend.

**Combined Deployment**
```bash
cd my-project
create-better-t-stack add --web-deploy alchemy --server-deploy alchemy
```

**Pattern**: Adds deployment configuration for both web and server, creating a full stack deployment to Cloudflare Workers.

**Important**: The `add` command requires `bts.jsonc` to be present in the project root. This file is created by the `init` command and contains your stack configuration (Source: `apps/web/content/docs/bts-config.mdx`, line 6-17).

### Updating Configuration

**Recreate Project with Changes**
```bash
# Use the reproducible command from bts.jsonc
bun create better-t-stack my-app-v2 --frontend tanstack-router --backend hono ...
```

**Pattern**: If you need to change fundamental aspects of your stack (like backend framework or ORM), it's often easier to create a new project and migrate your code.

**Manual Updates**
- You can manually edit `bts.jsonc` to reflect changes you've made to your project
- This helps the `add` command understand your current stack
- However, be careful as this doesn't regenerate code

## Stack Combinations

### Recommended Combinations

**The "T3 Stack" Modernized**
```bash
create-better-t-stack my-app \
  --frontend next \
  --backend next \
  --database postgres \
  --orm prisma \
  --auth better-auth \
  --api trpc
```

**When to use**: Full-stack Next.js application with API routes

**Convex + React + Clerk** (Source: `apps/web/content/docs/index.mdx`, line 58-67, slightly modified)
```bash
create-better-t-stack my-app \
  --frontend tanstack-router \
  --backend convex \
  --auth clerk \
  --database none
```

**Pattern**: Convex backend automatically sets:
- `--auth clerk` (if compatible frontend)
- `--database none` (Convex provides database)
- `--orm none` (Convex provides data layer)
- `--api none` (Convex provides API)
- `--runtime none` (Convex manages runtime)
- `--db-setup none` (Convex manages hosting)

**When to use**: Applications needing real-time features, automatic backend scaling, or when you prefer a managed backend solution

**Cloudflare Workers + D1 + Hono + Drizzle**
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

**Pattern**: Serverless edge deployment with type-safe infrastructure.

**Constraints** (Source: `apps/web/content/docs/cli/compatibility.mdx`, line 38-58):
- Backend must be Hono
- ORM must be Drizzle or Prisma (not Mongoose)
- Database must be SQLite (not MongoDB)
- db-setup must be d1 (not docker)

**When to use**: Global applications, edge computing, serverless architecture

### Common Use Cases

**API Server**
```bash
create-better-t-stack my-api \
  --frontend none \
  --backend fastify \
  --runtime node \
  --database postgres \
  --orm prisma \
  --api trpc
```

**When to use**: Building a REST or GraphQL API, microservices, or when the frontend is separate

**Full-Stack E-commerce**
```bash
create-better-t-stack my-shop \
  --frontend next \
  --backend hono \
  --runtime bun \
  --database postgres \
  --orm drizzle \
  --auth better-auth \
  --payments polar \
  --examples todo
```

**Pattern**: Includes Better-Auth for authentication and Polar payments for payment processing.

**When to use**: E-commerce sites, SaaS applications with payments

**Documentation Site**
```bash
create-better-t-stack my-docs \
  --frontend none \
  --backend none \
  --addons starlight
```

**Pattern**: Creates a documentation-only site using Starlight (Astro-based).

**When to use**: Project documentation, knowledge base, static documentation sites

### Example Stacks

**Todo App Example** (Source: `apps/web/content/docs/cli/options.mdx`, line 315-316)
```bash
create-better-t-stack my-app \
  --examples todo
```

**Pattern**: Adds a complete todo example application to your project. This example demonstrates:
- CRUD operations
- Database integration
- API communication (if API selected)
- Authentication flows (if auth selected)

**Requirements** (Source: `apps/web/content/docs/cli/compatibility.mdx`, line 211-215):
- Requires database when backend is present (except Convex)
- Cannot be used with `--backend none` and `--database none`

**AI Chat Example** (Source: `apps/web/content/docs/cli/options.mdx`, line 316)
```bash
create-better-t-stack my-app \
  --examples ai
```

**Pattern**: Adds an AI chat interface example. This example demonstrates:
- AI integration patterns
- Real-time communication
- Complex state management

**Restrictions** (Source: `apps/web/content/docs/cli/compatibility.mdx`, line 217-221):
- Not compatible with `--backend elysia`
- Not compatible with `--frontend solid`

## Workflow Patterns

### Development Workflow

**Interactive Development**
```bash
# 1. Create project with prompts
npm create better-t-stack@latest my-app

# 2. Navigate to project
cd my-app

# 3. Install dependencies (if not auto-installed)
bun install

# 4. Start development server
bun run dev
```

**Pattern**: Use interactive mode when exploring options or learning the tool. The prompts guide you through choices and validate compatibility.

**Non-Interactive Development**
```bash
# 1. Create project with all options specified
npm create better-t-stack@latest my-app \
  --frontend tanstack-router \
  --backend hono \
  --database sqlite \
  --orm drizzle \
  --auth better-auth \
  --yes

# 2. Navigate to project
cd my-app

# 3. Start development
bun run dev
```

**Pattern**: Use non-interactive mode for reproducible project creation, automation, or when you know exactly what you want.

**Using Stack Builder UI** (Source: `apps/web/content/docs/index.mdx`, line 35-42)
```bash
# 1. Open stack builder
npm create better-t-stack@latest builder

# 2. Visual configuration opens in browser
# 3. Select stack components visually
# 4. Copy generated command

# 5. Paste and run command
npm create better-t-stack@latest my-app [pasted command]
```

**Pattern**: Use the UI when you're unsure about options, want to visualize your stack, or prefer visual selection over command-line flags.

### Testing Workflow

**Local Testing**
```bash
# 1. Start development server
bun run dev

# 2. Run database migrations (if needed)
bun run db:push

# 3. Open database studio (optional)
bun run db:studio

# 4. Run tests (if any)
bun test
```

**Pattern**: Standard development workflow for testing changes locally.

**Testing CLI Changes** (Source: `apps/web/content/docs/contributing.mdx`, line 84-86)
```bash
# 1. Build CLI
cd apps/cli
bun dev

# 2. Test in separate directory
cd /tmp
create-better-t-stack test-project
```

**Pattern**: When developing CLI changes, use `bun link` or test in a separate directory to verify changes.

### Deployment Workflow

**Traditional Deployment**
```bash
# 1. Build project
bun run build

# 2. Deploy to your platform
# (Platform-specific commands)
```

**Cloudflare Workers Deployment** (Source: `apps/web/content/docs/guides/cloudflare-alchemy.mdx`, line 456-497)
```bash
# 1. Set environment variables
# Edit packages/infra/.env
ALCHEMY_PASSWORD=your-secure-password
STAGE=prod

# 2. Deploy
bun run deploy

# 3. Update environment variables for production
# Edit apps/web/.env and apps/server/.env
VITE_SERVER_URL=https://my-app-server.subdomain.workers.dev
CORS_ORIGIN=https://my-app-web.subdomain.workers.dev

# 4. Deploy again to apply changes
bun run deploy
```

**Pattern**: Deploy to Cloudflare Workers using Alchemy infrastructure-as-code.

**Multi-Stage Deployment**
```bash
# 1. Deploy to development (default)
bun run deploy

# 2. Deploy to staging
bun run deploy --stage staging

# 3. Deploy to production
bun run deploy --stage prod
```

**Pattern**: Use multiple stages for development, testing, and production environments.

### Migration Workflow

**Adding Features to Existing Project**
```bash
# 1. Ensure bts.jsonc exists
cd my-project
ls bts.jsonc  # Should exist

# 2. Add features
create-better-t-stack add --addons pwa tauri --install

# 3. Restart development server
bun run dev
```

**Pattern**: Use the `add` command to incrementally add features to an existing project.

**Migrating to New Stack**
```bash
# 1. Create new project with desired stack
create-better-t-stack my-app-v2 \
  --frontend next \
  --backend hono \
  --database postgres \
  --orm drizzle

# 2. Copy application code
cp -r my-app/src my-app-v2/src

# 3. Adapt code to new stack
# (Manual changes to match new stack structure)

# 4. Test thoroughly
cd my-app-v2
bun run dev
```

**Pattern**: When changing fundamental aspects of your stack, it's often easier to create a new project and migrate code manually.

## Programmatic API Patterns

**Automation Workflows** (Source: `apps/web/content/docs/cli/programmatic-api.mdx`, line 20-47)
```typescript
import { create } from "create-better-t-stack";

async function createProject() {
  const result = await create("my-app", {
    yes: true,
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
  } else {
    console.error(`❌ Failed: ${result.error}`);
  }
}

createProject();
```

**Pattern**: Use the programmatic API for automation, CI/CD pipelines, and custom tooling.

**Directory Conflict Handling** (Source: `apps/web/content/docs/cli/programmatic-api.mdx`, line 52-59)
```typescript
const result = await create("existing-folder", {
  yes: true,
  directoryConflict: "increment", // Creates "existing-folder-1"
  renderTitle: false,
});
```

**Pattern**: Handle existing directories gracefully by incrementing the name.

## Custom Template Patterns

**Using Predefined Templates** (Source: `apps/web/content/docs/cli/options.mdx`, line 16-28)
```bash
# T3 Stack
create-better-t-stack my-app --template t3

# MERN Stack
create-better-t-stack my-app --template mern

# PERN Stack
create-better-t-stack my-app --template pern

# UniWind React Native
create-better-t-stack my-app --template uniwind
```

**Pattern**: Use predefined templates for common stack combinations.

**Customizing After Creation**
```bash
# 1. Create with base template
create-better-t-stack my-app --template t3

# 2. Add additional features
cd my-app
create-better-t-stack add --addons pwa biome

# 3. Customize manually
# Edit generated code as needed
```

**Pattern**: Start with a template and customize incrementally.

## Interactive Prompt Usage

**Single Select Prompts** (Source: `apps/web/content/docs/cli/prompts.mdx`, line 18-22)
- **Navigation**: Up/Down arrow keys
- **Selection**: Enter to confirm highlighted option
- **Typical uses**: Choosing web or native framework, runtime, API type

**Multi-Select Prompts** (Source: `apps/web/content/docs/cli/prompts.mdx`, line 24-29)
- **Navigation**: Up/Down arrow keys
- **Toggle**: Space to highlight option on/off
- **Confirm**: Enter to confirm selections
- **Note**: Some prompts allow selecting none (press Enter without toggling)
- **Typical uses**: Selecting project types (web/native), choosing examples

**Grouped Multi-Select Prompts** (Source: `apps/web/content/docs/cli/prompts.mdx`, line 33-39)
- **Structure**: Options organized under group headings
- **Navigation**: Up/Down, Space to toggle, Enter to confirm
- **Note**: Group headings are informational; toggle items within groups
- **Typical uses**: Selecting addons (Biome, PWA, Turborepo, etc.)

**Confirm Prompts** (Source: `apps/web/content/docs/cli/prompts.mdx`, line 41-45)
- **Navigation**: Left/Right or Up/Down to highlight Yes/No
- **Confirm**: Enter to select
- **Typical uses**: Installing dependencies, initializing Git

**Text Input Prompts** (Source: `apps/web/content/docs/cli/prompts.mdx`, line 47-52)
- **Input**: Type your answer and press Enter
- **Validation**: If validation fails, message explains what to fix
- **Correction**: Edit and press Enter again
- **Typical uses**: Project name/path, database URLs, provider-specific inputs

**Tips** (Source: `apps/web/content/docs/cli/prompts.mdx`, line 54-57):
- Skip all prompts with `--yes` to use defaults
- Press Ctrl+C to cancel safely if you start the wrong flow

## Environment Setup Patterns

**Package Manager Selection** (Source: `apps/web/content/docs/cli/options.mdx`, line 38-44)
```bash
# Use Bun (recommended)
create-better-t-stack my-app --package-manager bun

# Use pnpm
create-better-t-stack my-app --package-manager pnpm

# Use npm
create-better-t-stack my-app --package-manager npm
```

**Pattern**: Choose the package manager that fits your workflow and team standards.

**Git Initialization** (Source: `apps/web/content/docs/cli/options.mdx`, line 54-60)
```bash
# Initialize Git repository
create-better-t-stack my-app --git

# Skip Git initialization
create-better-t-stack my-app --no-git
```

**Pattern**: Control whether Git is initialized during project creation.

**Dependency Installation** (Source: `apps/web/content/docs/cli/options.mdx`, line 46-52)
```bash
# Install dependencies after creation (default)
create-better-t-stack my-app --install

# Skip dependency installation
create-better-t-stack my-app --no-install
```

**Pattern**: Skip installation if you want to install manually or if you're in a CI/CD environment that handles dependencies separately.
