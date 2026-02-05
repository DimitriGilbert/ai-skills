# Context

## Pattern

Context provides request-specific data (user, session, db connection):

```typescript
export type CreateContextOptions = {
  req?: Request;
  res?: Response;
};

export async function createContext({ req }: CreateContextOptions) {
  const user = await getUserFromRequest(req);

  return {
    user,
    session: user?.session ?? null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
```

## Initialization with Context

```typescript
import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";

export const t = initTRPC.context<Context>().create();
export const router = t.router;
export const publicProcedure = t.procedure;

// Protected procedure using context
export const protectedProcedure = publicProcedure.use(async (opts) => {
  if (!opts.ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  return opts.next();
});
```

## Usage in Procedures

```typescript
getUser: protectedProcedure.query(async ({ ctx }) => {
  return ctx.user; // Context provides user
});
```
