# Router Merging

## Multiple Routers

```typescript
// features/users/router.ts
export const usersRouter = router({
  list: publicProcedure.query(async () => db.users.findMany()),
});

// features/posts/router.ts
export const postsRouter = router({
  list: publicProcedure.query(async () => db.posts.findMany()),
});

// routers/index.ts
export const appRouter = router({
  healthCheck: publicProcedure.query(() => "OK"),
  users: usersRouter,
  posts: postsRouter,
});

export type AppRouter = typeof appRouter;
```

## Type Export (Monorepo)

```json
// package.json
{
  "exports": {
    ".": { "types": "./src/index.ts", "default": "./src/index.ts" },
    "./router": { "types": "./src/routers/index.ts", "default": "./src/routers/index.ts" }
  }
}
```

## Frontend Import

```typescript
import type { AppRouter } from "@my-app/api";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

const client = createTRPCClient<AppRouter>({ /* ... */ });
```
