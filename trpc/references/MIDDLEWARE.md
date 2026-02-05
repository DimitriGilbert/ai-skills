# Middleware

## Protected Procedure

```typescript
export const protectedProcedure = publicProcedure.use(async (opts) => {
  const user = await getCurrentUser(opts.ctx);

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }

  return opts.next({ ctx: { ...opts.ctx, user } });
});
```

## Rate Limiting

```typescript
export const rateLimited = publicProcedure.use(async (opts) => {
  const allowed = await checkRateLimit(opts.ctx);

  if (!allowed) {
    throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Rate limit exceeded" });
  }

  return opts.next();
});
```

## Logging

```typescript
export const withLogging = publicProcedure.use(async (opts) => {
  console.log(`[${opts.type}] ${opts.path}`, opts.input);
  const result = await opts.next();
  console.log(`[${opts.type}] ${opts.path}: ${Date.now() - start}ms`);
  return result;
});
```

## Usage

```typescript
export const adminRouter = router({
  deleteUser: protectedProcedure
    .use(isAdmin)
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => await deleteUser(input.id)),
});
```
