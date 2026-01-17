# Convex Core Concepts

Deep dive into queries, mutations, actions, database operations, and schema design.

## Server Functions

Convex provides three types of server functions with specific purposes and constraints.

### Queries

Read-only functions that automatically update the UI when data changes.

**Characteristics:**
- Receive `{ db }` - read-only database access
- Cannot write to database
- Cannot make network requests
- Run transactionally
- Auto-subscribe - clients re-run when data changes
- Return data directly to frontend

**Examples:**

```typescript
// Simple query - all documents
export const listAll = query({
  handler: async ({ db }) => {
    return await db.query("posts").collect();
  }
});

// Query with arguments
export const getByAuthor = query({
  args: { authorId: v.id("users") },
  handler: async ({ db }, { authorId }) => {
    return await db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorId", authorId))
      .collect();
  }
});

// Query with authentication check
export const getMyPosts = query({
  handler: async ({ db, auth }) => {
    const identity = await auth.getUserIdentity();
    if (!identity) return [];

    return await db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorId", identity.subject))
      .collect();
  }
});
```

### Mutations

Write operations that modify the database atomically.

**Characteristics:**
- Receive `{ db, auth }` - read/write database access
- Can insert, update, delete documents
- Run as transactions (all-or-nothing)
- Cannot make network requests
- Trigger query re-runs on connected clients
- Return values to frontend

**Examples:**

```typescript
// Simple insert
export const create = mutation({
  args: { title: v.string(), content: v.string() },
  handler: async ({ db }, { title, content }) => {
    const postId = await db.insert("posts", {
      title,
      content,
      createdAt: Date.now()
    });
    return postId;
  }
});

// Update with authorization check
export const update = mutation({
  args: {
    postId: v.id("posts"),
    title: v.optional(v.string()),
    content: v.optional(v.string())
  },
  handler: async ({ db, auth }, { postId, ...updates }) => {
    const identity = await auth.getUserIdentity();
    const post = await db.get(postId);

    if (!post || post.authorId !== identity?.subject) {
      throw new Error("Unauthorized");
    }

    await db.patch(postId, updates);
  }
});

// Delete
export const remove = mutation({
  args: { postId: v.id("posts") },
  handler: async ({ db, auth }, { postId }) => {
    const post = await db.get(postId);
    const identity = await auth.getUserIdentity();

    if (!post || post.authorId !== identity?.subject) {
      throw new Error("Unauthorized");
    }

    await db.delete(postId);
  }
});

// Transactional multi-document update
export const transferCredits = mutation({
  args: {
    from: v.id("users"),
    to: v.id("users"),
    amount: v.number()
  },
  handler: async ({ db }, { from, to, amount }) => {
    const sender = await db.get(from);
    const receiver = await db.get(to);

    if (!sender || !receiver || sender.balance < amount) {
      throw new Error("Invalid transfer");
    }

    // Both updates succeed or both fail
    await db.patch(from, { balance: sender.balance - amount });
    await db.patch(to, { balance: receiver.balance + amount });
  }
});
```

### Actions

General-purpose serverless functions that can make external API calls.

**Characteristics:**
- Receive `{ db, auth, storage }` - NO direct database access
- Must use `ctx.runQuery()` and `ctx.runMutation()` for database
- Can make network requests (fetch, APIs, LLMs)
- Can use `ctx.scheduler` for delayed execution
- Return values to frontend

**Examples:**

```typescript
// External API call
export const generateSummary = action({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    // Get post via query
    const post = await ctx.runQuery(api.posts.get, { postId });

    // Call external API
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        prompt: `Summarize: ${post.content}`
      })
    });

    const { summary } = await response.json();

    // Save via mutation
    await ctx.runMutation(api.posts.update, {
      postId,
      summary
    });

    return summary;
  }
});

// Scheduled task
export const scheduleReminder = action({
  args: { taskId: v.id("tasks"), delayMs: v.number() },
  handler: async (ctx, { taskId, delayMs }) => {
    await ctx.scheduler.runAfter(
      delayMs,
      api.tasks.sendReminder,
      { taskId }
    );
  }
});

// Sending email
export const sendWelcomeEmail = action({
  args: { email: v.string(), name: v.string() },
  handler: async (ctx, { email, name }) => {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "noreply@myapp.com",
        to: email,
        subject: `Welcome, ${name}!`,
        html: `<p>Welcome to our app!</p>`
      })
    });
  }
});
```

## Database Operations

### CRUD Operations

```typescript
// CREATE
const id = await db.insert("posts", {
  title: "My Post",
  content: "Hello world",
  authorId: userId,
  createdAt: Date.now()
});

// READ - Single document
const post = await db.get(id);

// READ - With index
const posts = await db
  .query("posts")
  .withIndex("by_author", (q) => q.eq("authorId", userId))
  .collect();

// UPDATE
await db.patch(id, { title: "Updated Title" });

// DELETE
await db.delete(id);
```

### Query Building

```typescript
// Basic query
const all = await db.query("posts").collect();

// With index - single field
const byAuthor = await db
  .query("posts")
  .withIndex("by_author", (q) => q.eq("authorId", userId))
  .collect();

// With index - range query
const recent = await db
  .query("posts")
  .withIndex("by_created", (q) =>
    q.gt("createdAt", Date.now() - 86400000)
  )
  .collect();

// With index - compound
const byAuthorAndStatus = await db
  .query("posts")
  .withIndex("by_author_status", (q) =>
    q.eq("authorId", userId).eq("status", "published")
  )
  .collect();

// Order with index
const ordered = await db
  .query("posts")
  .withIndex("by_created", (q) => q.order("desc"))
  .collect();

// Pagination
const page = await db
  .query("posts")
  .paginate({ numItems: 50 });

// First page
const firstPage = await page.next();

// Continue pagination
const secondPage = await page.next(); // Use continueCursor from first page
```

### Query Methods

| Method | Returns | Use Case |
|--------|---------|----------|
| `.collect()` | `Array<T>` | Get all results |
| `.first()` | `T \| null` | Get first result or null |
| `.unique()` | `T` | Get exactly one (throws if not unique) |
| `.paginate({ numItems })` | `PaginationResult` | Paginate large result sets |

## Schema Design

### Value Types Reference

```typescript
// Primitives
v.string()       // "hello"
v.number()       // 42, 3.14
v.boolean()      // true, false
v.null()         // null

// ID references
v.id("users")    // Foreign key to users table

// Collections
v.array(v.string())  // ["a", "b", "c"]
v.object({
  name: v.string(),
  age: v.number()
})

// Optional
v.optional(v.string())  // string | null | undefined

// Union
v.union(v.string(), v.number())  // string | number

// Literal
v.literal("active"), v.literal("inactive")  // "active" | "inactive"
```

### Index Design

```typescript
// Single field index
.defineTable({ ... })
  .index("by_email", ["email"])

// Compound index
.defineTable({ ... })
  .index("by_author_created", ["authorId", "createdAt"])

// Using indexes in queries
// Single field
db.query("posts")
  .withIndex("by_author", (q) => q.eq("authorId", userId))

// Compound - must use prefix fields
db.query("posts")
  .withIndex("by_author_created", (q) =>
    q.eq("authorId", userId).gt("createdAt", timestamp)
  )

// Order with index
db.query("posts")
  .withIndex("by_created", (q) => q.order("desc"))
```

### Index Query Operators

```typescript
q.eq("field", value)        // Equals
q.neq("field", value)       // Not equals
q.lt("field", value)        // Less than
q.lte("field", value)       // Less than or equal
q.gt("field", value)        // Greater than
q.gte("field", value)       // Greater than or equal
```

## Relationships

### One-to-Many

```typescript
// Schema
users: defineTable({
  name: v.string(),
  email: v.string()
}),

posts: defineTable({
  title: v.string(),
  authorId: v.id("users")
}).index("by_authorId", ["authorId"])

// Query posts by user
const userPosts = await db
  .query("posts")
  .withIndex("by_authorId", (q) => q.eq("authorId", userId))
  .collect();
```

### Many-to-Many

```typescript
// Schema
posts: defineTable({ title: v.string() }),
tags: defineTable({ name: v.string() }),
postTags: defineTable({
  postId: v.id("posts"),
  tagId: v.id("tags")
}).index("by_postId", ["postId"]).index("by_tagId", ["tagId"])

// Get tags for a post
const tagRelations = await db
  .query("postTags")
  .withIndex("by_postId", (q) => q.eq("postId", postId))
  .collect();

const tagIds = tagRelations.map(r => r.tagId);
```

## Context Objects

### Query Context

```typescript
{
  db: GenericDatabaseReader,  // Read-only database
  auth: AuthManager            // Authentication
}
```

### Mutation Context

```typescript
{
  db: GenericDatabaseWriter,  // Read/write database
  auth: AuthManager            // Authentication
  storage: Storage            // File storage
}
```

### Action Context

```typescript
{
  auth: AuthManager,           // Authentication
  scheduler: Scheduler,        // Scheduled tasks
  runQuery: QueryRunner,       // Run queries
  runMutation: MutationRunner  // Run mutations
}
```
