# Install Packages

## Core Backend

```bash
pnpm add @trpc/server zod superjson
npm install @trpc/server zod superjson
yarn add @trpc/server zod superjson
bun add @trpc/server zod superjson
```

## Server Adapter (Choose One)

```bash
# Next.js (built-in, no extra package)
pnpm add @trpc/server

# Express
pnpm add @trpc/server/adapters/express express

# Fastify
pnpm add @trpc/server/adapters/fastify fastify

# Hono
pnpm add @hono/trpc-server hono

# Bun
pnpm add @trpc/server/adapters/bun
```

## Frontend (React)

```bash
pnpm add @trpc/client @trpc/tanstack-react-query @tanstack/react-query
npm install @trpc/client @trpc/tanstack-react-query @tanstack/react-query
yarn add @trpc/client @trpc/tanstack-react-query @tanstack/react-query
bun add @trpc/client @trpc/tanstack-react-query @tanstack/react-query
```

## Notes

- Use your package manager of choice
- Versions are managed by your package.json
- Check [tRPC docs](https://trpc.io) for latest
