# Convex Best Practices

Production-ready patterns and anti-patterns for Convex development.

## Query Performance

### ✅ Use Indexes

```typescript
// Schema
.defineTable({
  channel: v.id("channels"),
  author: v.id("users"),
  timestamp: v.number()
})
.index("by_channel", ["channel"])
.index("by_channel_timestamp", ["channel", "timestamp"])

// Query
const messages = await db
  .query("messages")
  .withIndex("by_channel", (q) => q.eq("channel", channelId))
  .collect();
```

### ❌ Don't Use .filter() on Queries

```typescript
// BAD - Full table scan
const tomsMessages = db
  .query("messages")
  .filter((q) => q.eq(q.field("author"), "Tom"))
  .collect();

// GOOD - Filter in code
const allMessages = await db.query("messages").collect();
const tomsMessages = allMessages.filter((m) => m.author === "Tom");
```

### ✅ Use Pagination

```typescript
export const listMessages = query({
  handler: async ({ db }) => {
    return await db
      .query("messages")
      .paginate({ numItems: 50 });
  }
});
```

### ✅ Design Indexes for Query Patterns

```typescript
// Schema - support multiple query patterns
.defineTable({})
  .index("by_channel", ["channel"])           // channel=X
  .index("by_channel_timestamp", ["channel", "timestamp"])  // channel=X, timestamp>Y
  .index("by_author", ["author"])             // author=X
```

## Function Organization

### ✅ Keep Functions Focused

```typescript
// Good - Single responsibility
export const getPost = query({ /* ... */ });
export const listPosts = query({ /* ... */ });
export const createPost = mutation({ /* ... */ });
export const updatePost = mutation({ /* ... */ });
export const deletePost = mutation({ /* ... */ });
```

### ✅ Use Clear Naming

```typescript
// Good
export const getPostById = query(...)
export const listPostsByAuthor = query(...)
export const searchPosts = query(...)

// Avoid
export const get = query(...)  // What?
export const list = query(...)  // List what?
```

### ❌ Don't Over-Use ctx.runQuery/runMutation

```typescript
// BAD - Multiple round trips
export const process = action({
  handler: async (ctx, { orderId }) => {
    const order = await ctx.runQuery(api.orders.get, { orderId });
    const payment = await ctx.runQuery(api.payments.get, { orderId });
    const customer = await ctx.runQuery(api.customers.get, { customerId });
    // ...
  }
});

// GOOD - Single consolidated query
export const getOrderDetails = query({
  args: { orderId: v.id("orders") },
  handler: async ({ db }, { orderId }) => {
    const order = await db.get(orderId);
    const payment = await db.query("payments")
      .withIndex("by_order", (q) => q.eq("orderId", orderId))
      .unique();
    const customer = await db.get(order.customerId);
    return { order, payment, customer };
  }
});

export const process = action({
  handler: async (ctx, { orderId }) => {
    const { order, payment, customer } = await ctx.runQuery(
      api.orders.getOrderDetails,
      { orderId }
    );
    // ...
  }
});
```

## Schema Design

### ✅ Plan for Growth

```typescript
// Good - Uses indexes for queries
export default defineSchema({
  messages: defineTable({
    body: v.string(),
    channel: v.id("channels"),
    author: v.id("users"),
    timestamp: v.number()
  })
  .index("by_channel", ["channel"])
  .index("by_channel_timestamp", ["channel", "timestamp"])
  .index("by_author", ["author"])
});
```

### ✅ Use Relationships Wisely

```typescript
// One-to-many - Use index
posts: defineTable({
  authorId: v.id("users")
}).index("by_authorId", ["authorId"])

// Many-to-many - Use join table
postTags: defineTable({
  postId: v.id("posts"),
  tagId: v.id("tags")
}).index("by_postId", ["postId"]).index("by_tagId", ["tagId"])

// Embedded - For small, stable data
users: defineTable({
  name: v.string(),
  preferences: v.object({
    theme: v.union(v.literal("light"), v.literal("dark")),
    notifications: v.boolean()
  })
})
```

### ❌ Don't Over-Normalize

```typescript
// Bad - Unnecessary separation
users: defineTable({
  name: v.string(),
  email: v.string()
}),
userProfiles: defineTable({
  userId: v.id("users"),
  bio: v.string()  // Just put this in users
})

// Good - Keep related data together
users: defineTable({
  name: v.string(),
  email: v.string(),
  bio: v.optional(v.string())
})
```

## Security

### ✅ Always Validate Authentication

```typescript
export const createPost = mutation({
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    // Proceed
  }
});
```

### ✅ Validate Authorization

```typescript
export const updatePost = mutation({
  args: { postId: v.id("posts"), ...updates },
  handler: async (ctx, { postId, ...updates }) => {
    const identity = await ctx.auth.getUserIdentity();
    const post = await ctx.db.get(postId);

    if (!post || post.authorId !== identity?.subject) {
      throw new Error("Forbidden");
    }

    await ctx.db.patch(postId, updates);
  }
});
```

### ✅ Validate Input Types

```typescript
export const createPost = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    published: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    // Types are validated automatically
    await ctx.db.insert("posts", args);
  }
});
```

### ❌ Don't Trust Client Input

```typescript
// Bad - No validation
export const createPost = mutation({
  args: {
    // No args validation!
  },
  handler: async (ctx, args) => {
    // args could be anything
    await ctx.db.insert("posts", args);
  }
});

// Good - Proper validation
export const createPost = mutation({
  args: {
    title: v.string(),
    content: v.string()
  },
  handler: async (ctx, { title, content }) => {
    await ctx.db.insert("posts", { title, content });
  }
});
```

## Real-time Performance

### ✅ Minimize Query Results

```typescript
// Good - Paginate
export const listMessages = query({
  handler: async ({ db }) => {
    return await db.query("messages").paginate({ numItems: 50 });
  }
});

// Good - Filter with index
export const listRecent = query({
  handler: async ({ db }) => {
    return await db
      .query("messages")
      .withIndex("by_timestamp", (q) =>
        q.gt("timestamp", Date.now() - 86400000)
      )
      .collect();
  }
});
```

### ✅ Use Preloading in Next.js

```typescript
// Server component
export default async function Page() {
  const preloaded = await preloadQuery(api.posts.list);
  return <ClientPage preloaded={preloaded} />;
}
```

## Error Handling

### ✅ Use ConvexError

```typescript
import { ConvexError } from "convex/values";

export const createPost = mutation({
  args: { title: v.string() },
  handler: async (ctx, { title }) => {
    if (title.length === 0) {
      throw new ConvexError({
        code: "INVALID_TITLE",
        message: "Title cannot be empty"
      });
    }

    await ctx.db.insert("posts", { title });
  }
});
```

### ✅ Handle Errors Gracefully

```typescript
const createPost = useMutation(api.posts.create, {
  onError: (error) => {
    if (error.data?.code === "INVALID_TITLE") {
      alert("Please enter a title");
    } else {
      alert("Something went wrong");
    }
  }
});
```

## Testing

### ✅ Test Edge Cases

```typescript
it("handles empty results", async () => {
  const t = convexTest(schema);
  const posts = await t.query(api.posts.list);
  expect(posts).toEqual([]);
});

it("validates auth", async () => {
  const t = convexTest(schema);
  await expect(
    t.mutation(api.posts.create, { title: "Test" })
  ).rejects.toThrow("Unauthorized");
});

it("enforces ownership", async () => {
  const t = convexTest(schema);
  const user1 = await t.runMutation(api.users.create, { name: "User1" });
  const user2 = await t.runMutation(api.users.create, { name: "User2" });

  const postId = await t.mutation(api.posts.create, {
    title: "User1's post",
    authorId: user1
  });

  await expect(
    t.mutation(api.posts.update, {
      postId,
      authorId: user2  // Wrong user
    })
  ).rejects.toThrow("Forbidden");
});
```

## Deployment

### ✅ Use Environment Variables

```typescript
// convex/config.ts
export default makeConfig({
  env: {
    openaiApiKey: {
      validation: v.string(),
      access: "secret"  // Only accessible in server functions
    },
    apiUrl: {
      validation: v.string(),
      access: "public"   // Accessible in frontend
    }
  }
});
```

### ✅ Use Deploy Keys for Production

```bash
# Production
CONVEX_DEPLOY_KEY=prod_key npx convex deploy

# With frontend
CONVEX_DEPLOY_KEY=prod_key npx convex deploy --cmd 'npm run build'
```

## Code Organization

### Recommended Structure

```
convex/
├── schema.ts
├── config.ts
├── auth.config.ts
├── users.ts
├── posts.ts
├── comments.ts
├── notifications.ts
├── cron.ts           # Scheduled jobs
├── http.ts           # HTTP endpoints
└── lib/
    ├── auth.ts       # Auth utilities
    ├── validation.ts # Validation helpers
    └── types.ts      # Shared types
```

### Group Related Functions

```typescript
// posts.ts
export const get = query(...);
export const list = query(...);
export const listByAuthor = query(...);
export const create = mutation(...);
export const update = mutation(...);
export const delete = mutation(...);
```

## Performance Checklist

- [ ] All queries use indexes
- [ ] Large result sets use pagination
- [ ] Actions minimize ctx.runQuery/runMutation calls
- [ ] Auth checks are efficient (cached where possible)
- [ ] No .filter() on queries
- [ ] Schema has indexes for all query patterns
- [ ] File uploads use storage efficiently
- [ ] Environment variables properly configured
