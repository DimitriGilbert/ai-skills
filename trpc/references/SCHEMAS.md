# Complex Zod Schemas

## Nested Objects

```typescript
publicProcedure
  .input(z.object({
    user: z.object({
      id: z.string().uuid(),
      name: z.string().min(1).max(100),
      email: z.string().email(),
    }),
    preferences: z.object({
      theme: z.enum(["light", "dark"]),
      notifications: z.boolean(),
    }),
  }))
  .query(async ({ input }) => { /* ... */ });
```

## Arrays with Validation

```typescript
publicProcedure
  .input(z.object({
    items: z.array(z.object({
      id: z.string(),
      quantity: z.number().int().positive(),
    })),
  }))
  .mutation(async ({ input }) => { /* ... */ });
```

## Optional Fields with Defaults

```typescript
publicProcedure
  .input(z.object({
    search: z.string().optional(),
    limit: z.number().min(1).max(100).default(20),
    page: z.number().int().positive().default(1),
  }))
  .query(async ({ input }) => { /* ... */ });
```

## Enums and Unions

```typescript
publicProcedure
  .input(z.object({
    type: z.enum(["user", "admin", "guest"]),
    status: z.union([z.literal("active"), z.literal("inactive")]),
  }))
  .query(async ({ input }) => { /* ... */ });
```

## Custom Validation

```typescript
publicProcedure
  .input(z.object({
    password: z.string().min(8).refine(
      (val) => /[A-Z]/.test(val),
      { message: "Must contain uppercase letter" }
    ),
  }))
  .mutation(async ({ input }) => { /* ... */ });
```
