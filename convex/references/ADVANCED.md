# Convex Advanced Features

Advanced patterns for HTTP endpoints, scheduled tasks, vector search, full-text search, and error handling.

## HTTP Endpoints

Create custom HTTP endpoints for webhooks, REST APIs, and external integrations.

**File:** `convex/http.ts`

```typescript
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";

const http = httpRouter();

// Basic endpoint
http.route({
  path: "/",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    return new Response("Hello from Convex!");
  }),
});

// Webhook with signature verification
http.route({
  path: "/webhooks/stripe",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return new Response("Missing signature", { status: 401 });
    }

    const payload = await request.json();
    await ctx.runMutation(internal.payments.processWebhook, {
      payload,
      signature,
    });

    return new Response(null, { status: 200 });
  }),
});

// Dynamic path prefix
http.route({
  pathPrefix: "/api/users/",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const userId = url.pathname.replace("/api/users/", "");
    const user = await ctx.runQuery(api.users.get, { userId });
    return new Response(JSON.stringify(user), {
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// File upload with CORS
http.route({
  path: "/upload",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const blob = await request.blob();
    const storageId = await ctx.storage.store(blob);
    
    return new Response(JSON.stringify({ storageId }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN!,
      },
    });
  }),
});

// CORS preflight
http.route({
  path: "/upload",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN!,
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

export default http;
```

**Endpoint URL:** `https://<deployment>.convex.site` (not `.cloud`)

**Key Points:**
- Request/response limit: 20MB
- Handle CORS for browser requests
- Use `ctx.runQuery`, `ctx.runMutation` to access database
- Access storage via `ctx.storage`
- Auth via `ctx.auth.getUserIdentity()` with Bearer token

## Scheduled Tasks & Cron Jobs

### Cron Jobs

**File:** `convex/crons.ts`

```typescript
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Run every minute
crons.interval(
  "cleanup sessions",
  { minutes: 1 },
  internal.sessions.cleanup,
);

// Run every hour
crons.interval(
  "sync data",
  { hours: 1 },
  internal.sync.fetchData,
);

// Run daily at 9 AM UTC
crons.daily(
  "daily digest",
  { hourUTC: 9, minuteUTC: 0 },
  internal.notifications.sendDigest,
);

// Run weekly on Mondays
crons.weekly(
  "weekly report",
  { dayOfWeek: "monday", hourUTC: 6, minuteUTC: 0 },
  internal.reports.generate,
);

// Run monthly on the 1st
crons.monthly(
  "monthly billing",
  { day: 1, hourUTC: 16, minuteUTC: 0 },
  internal.billing.process,
);

// Standard cron syntax (UTC)
crons.cron(
  "every 15 minutes",
  "*/15 * * * *",
  internal.tasks.processQueue,
);

// With arguments
crons.daily(
  "backup",
  { hourUTC: 2, minuteUTC: 0 },
  internal.backups.create,
  { type: "full" },
);

export default crons;
```

### Scheduler API

Schedule functions from within mutations/actions:

```typescript
import { mutation, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// Schedule for later
export const sendExpiringMessage = mutation({
  args: { body: v.string(), expiresInMs: v.number() },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("messages", {
      body: args.body,
      createdAt: Date.now(),
    });

    // Schedule deletion
    await ctx.scheduler.runAfter(
      args.expiresInMs,
      internal.messages.delete,
      { messageId: id },
    );

    return id;
  },
});

// Schedule at specific time
export const scheduleReminder = mutation({
  args: { reminderTime: v.number(), message: v.string() },
  handler: async (ctx, args) => {
    await ctx.scheduler.runAt(
      args.reminderTime,
      internal.notifications.send,
      { message: args.message },
    );
  },
});

// Cancel scheduled function
export const cancelScheduled = mutation({
  args: { scheduledId: v.id("_scheduled_functions") },
  handler: async (ctx, args) => {
    await ctx.scheduler.cancel(args.scheduledId);
  },
});
```

## Error Handling with ConvexError

Use `ConvexError` for structured, client-accessible errors.

```typescript
import { mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";

export const createUser = mutation({
  args: { email: v.string(), name: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      // Simple string error
      throw new ConvexError("Email already in use");
    }

    // Structured error
    if (!args.email.includes("@")) {
      throw new ConvexError({
        code: "INVALID_EMAIL",
        message: "Email must contain @",
        field: "email",
      });
    }

    return await ctx.db.insert("users", args);
  },
});

// Authorization error pattern
export const deletePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "Must be logged in",
      });
    }

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Post not found",
      });
    }

    if (post.authorId !== identity.subject) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "Can only delete your own posts",
      });
    }

    await ctx.db.delete(args.postId);
  },
});
```

**Client-side handling:**

```typescript
import { ConvexError } from "convex/values";

try {
  await createUser({ email, name });
} catch (error) {
  if (error instanceof ConvexError) {
    const data = error.data;
    if (typeof data === "string") {
      alert(data);
    } else {
      console.error(data.code, data.message);
    }
  }
}
```

## Vector Search

For semantic/similarity search with embeddings.

### Schema

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    content: v.string(),
    category: v.string(),
    embedding: v.array(v.float64()),
  }).vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 1536, // OpenAI ada-002
    filterFields: ["category"],
  }),
});
```

### Search Action

```typescript
import { action, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const search = action({
  args: {
    query: v.string(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Generate embedding
    const embedding = await generateEmbedding(args.query);

    // Vector search
    const results = await ctx.vectorSearch("documents", "by_embedding", {
      vector: embedding,
      limit: 10,
      filter: args.category
        ? (q) => q.eq("category", args.category!)
        : undefined,
    });

    // Fetch full documents
    const docs = await ctx.runQuery(internal.search.fetchDocs, {
      ids: results.map((r) => r._id),
    });

    return results.map((r, i) => ({
      ...docs[i],
      score: r._score,
    }));
  },
});

// Helper query
export const fetchDocs = internalQuery({
  args: { ids: v.array(v.id("documents")) },
  handler: async (ctx, args) => {
    return Promise.all(args.ids.map((id) => ctx.db.get(id)));
  },
});
```

**Key Points:**
- `vectorSearch` only available in actions
- Results include `_score` (-1 to 1, cosine similarity)
- Max 256 results
- Put filters in `vectorSearch` for performance

## Full-Text Search

For text-based search with relevance ranking.

### Schema

```typescript
messages: defineTable({
  body: v.string(),
  channel: v.string(),
  author: v.string(),
}).searchIndex("search_body", {
  searchField: "body",
  filterFields: ["channel", "author"],
}),
```

### Search Query

```typescript
export const searchMessages = query({
  args: {
    query: v.string(),
    channel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withSearchIndex("search_body", (q) => {
        let search = q.search("body", args.query);
        if (args.channel) {
          search = search.eq("channel", args.channel);
        }
        return search;
      })
      .take(25);
  },
});
```

**Key Points:**
- Available in queries and mutations (unlike vector search)
- Results ranked by BM25 relevance
- Prefix matching on final term (good for typeahead)
- Reactive - updates in real-time

## Convex Auth (Built-in)

Native authentication with OAuth and password support.

### Installation

```bash
npm install @convex-dev/auth @auth/core@0.37.0
npx @convex-dev/auth
```

### Server Setup

**File:** `convex/auth.ts`

```typescript
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [GitHub, Google, Password],
});
```

**File:** `convex/schema.ts`

```typescript
import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  // Your tables
});
```

### Client Setup

```typescript
import { ConvexAuthProvider } from "@convex-dev/auth/react";

<ConvexAuthProvider client={convex}>
  <App />
</ConvexAuthProvider>
```

### Usage

```typescript
import { useAuthActions } from "@convex-dev/auth/react";
import { getAuthUserId } from "@convex-dev/auth/server";

// Client: sign in
const { signIn, signOut } = useAuthActions();
signIn("github");
signIn("password", formData);

// Server: get user
const userId = await getAuthUserId(ctx);
```

## Environment Variables

### CLI Commands

```bash
# List variables
npx convex env list

# Set variable
npx convex env set API_KEY "your-secret"

# Set for production
npx convex env set API_KEY "prod-key" --prod

# Remove variable
npx convex env unset API_KEY
```

### Usage in Functions

```typescript
export const callApi = action({
  handler: async (ctx) => {
    const apiKey = process.env.API_KEY;
    // Use apiKey
  },
});

// System variables (always available)
process.env.CONVEX_CLOUD_URL  // https://xxx.convex.cloud
process.env.CONVEX_SITE_URL   // https://xxx.convex.site
```

**Limits:** Max 100 variables; names ≤40 chars; values ≤8KB
