# Server Adapters

## Next.js

```typescript
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";

export default (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
  });
```

## Express

```typescript
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./router";
import { createContext } from "./context";

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);
```

## Fastify

```typescript
import fastifyTRPCPlugin from "@trpc/server/adapters/fastify";
import { appRouter } from "./router";
import { createContext } from "./context";

app.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: { router: appRouter, createContext },
});
```

## Hono

```typescript
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./router";
import { createContext } from "./context";

app.use("/api/trpc/*", trpcServer({
  router: appRouter,
  createContext: (_opts, context) => createContext({ context }),
}));
```

## Bun

```typescript
import { fetchRequestHandler } from "@trpc/server/adapters/bun";
import { appRouter } from "./router";
import { createContext } from "./context";

Bun.serve({
  async fetch(req) {
    return fetchRequestHandler({
      endpoint: "/api/trpc",
      req,
      router: appRouter,
      createContext,
    });
  },
});
```
