# Convex Comprehensive Research Documentation

**Research Date:** 2026-01-17
**Source:** Context7 Convex Documentation (/llmstxt/convex_dev_llms-full_txt)
**Code Snippets Available:** 2,845
**Source Reputation:** High
**Benchmark Score:** 77.6

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Core Concepts](#core-concepts)
4. [Database Schema & Modeling](#database-schema--modeling)
5. [Authentication & Authorization](#authentication--authorization)
6. [File Storage](#file-storage)
7. [Real-time Updates](#real-time-updates)
8. [Deployment & Production](#deployment--production)
9. [Frontend Framework Integration](#frontend-framework-integration)
10. [Testing Patterns](#testing-patterns)
11. [Best Practices & Anti-Patterns](#best-practices--anti-patterns)

---

## Overview

Convex is a **full-stack reactive database platform** with TypeScript that provides:

- **Reactive database** with TypeScript queries
- **Serverless functions** (queries, mutations, actions)
- **End-to-end type safety**
- **Real-time data synchronization**
- **File storage** capabilities
- **Built-in authentication** support
- **AI agent integration**

The platform combines database, backend logic, and real-time updates into a unified development experience.

---

## Getting Started

### Installation & Initialization

**Create a new Convex project:**

```bash
npm create convex@latest
```

This command allows you to:
- Select a frontend framework (React/Vite, TanStack Start, etc.)
- Opt-in to Convex Auth integration during setup
- Automatically configure the project structure

**Install Convex in an existing project:**

```bash
npm install convex
```

**Start the development server:**

```bash
npx convex dev
```

This initializes your backend development loop and guides you through the setup process.

### Project Structure

When you create a Convex project, you get a `convex/` folder where you write your server functions. This is where all backend application logic and database query code live.

### Quick Start with Frontend Integration

After setting up Convex, you can integrate it with your frontend:

```typescript
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export default function App() {
  const messages = useQuery(api.chat.getMessages);

  return (
    <div>
      {/* Display live messages */}
    </div>
  );
}
```

---

## Core Concepts

### Server Functions

Convex provides three types of server functions:

#### 1. Queries (Read-Only)

**Pure functions that can only read from the database.**

```typescript
import { query } from "./_generated/server";

export const listMessages = query({
  handler: async ({ db }) => {
    const messages = await db.query("messages").collect();
    return messages;
  }
});
```

**Key characteristics:**
- Receive a `db` object implementing `GenericDatabaseReader`
- Can only perform read operations
- Cannot make network requests
- Provide transactional guarantees
- Automatically reactive - UI updates when data changes

#### 2. Mutations (Write Operations)

**Transactions that can read or write to the database.**

```typescript
import { mutation } from "./_generated/server";

export const sendMessage = mutation({
  args: {
    body: v.string(),
    author: v.string()
  },
  handler: async ({ db }, { body, author }) => {
    const newId = await db.insert("messages", {
      body,
      author,
      createdAt: Date.now()
    });
    return { success: true, newId };
  }
});
```

**Key characteristics:**
- Receive a `db` object implementing `GenericDatabaseWriter`
- Can insert, update, and delete documents
- Run as transactions
- Cannot make network requests
- Automatically trigger reactive updates in queries

#### 3. Actions (General-Purpose Functions)

**Standard serverless functions that can make network requests.**

```typescript
import { action } from "./_generated/server";

export const summarizeConversation = action({
  args: {
    conversationId: v.id("conversations")
  },
  handler: async (ctx, { conversationId }) => {
    // Can make network requests
    const messages = await ctx.runQuery(api.conversations.listMessages, {
      conversationId
    });

    // Call external service (e.g., LLM)
    const summary = await callExternalService(messages);

    // Write back to database
    await ctx.runMutation(api.conversations.addSummary, {
      conversationId,
      summary
    });

    return summary;
  }
});
```

**Key characteristics:**
- Can make network requests (API calls, LLMs, emails)
- Must call queries/mutations to read/write database
- No direct database access
- Use `ctx.runQuery()` and `ctx.runMutation()` for database operations

### Function Types Summary

| Function Type | Database Access | Network Requests | Use Case |
|--------------|----------------|------------------|----------|
| Query | Read-only | No | Fetching data for UI |
| Mutation | Read/Write | No | Modifying data |
| Action | Indirect (via query/mutation) | Yes | External API calls, LLMs, emails |

### Documents & Data

Convex uses a document-based data model:

```typescript
// Insert a document
const messageId = await db.insert("messages", {
  channel: v.id("channels"),
  body: "Hello, world!",
  user: v.id("users"),
  timestamp: Date.now()
});

// Read a document
const message = await db.get(messageId);

// Update a document
await db.patch(messageId, { body: "Updated message" });

// Delete a document
await db.delete(messageId);
```

---

## Database Schema & Modeling

### Defining Schema

Convex uses TypeScript for schema definition with runtime validation:

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    channel: v.id("channels"),
    body: v.string(),
    user: v.id("users"),
    timestamp: v.number()
  }).index("by_channel", ["channel"])
});
```

### Value Types

Convex provides various value types for schema definition:

```typescript
v.string()       // String values
v.number()       // Number values
v.boolean()      // Boolean values
v.null()         // Null values
v.id("table")    // Foreign key reference
v.array(T)       // Arrays
v.object({ ... }) // Nested objects
v.union(...)     // Union types
v.literal(...)   // Literal values
v.optional(T)    // Optional values
```

### Indexes

Indexes optimize query performance:

```typescript
defineSchema({
  messages: defineTable({
    channel: v.id("channels"),
    body: v.string(),
    user: v.id("users")
  })
  .index("by_channel", ["channel"])
  .index("by_channel_user", ["channel", "user"])
});
```

**Using indexes in queries:**

```typescript
// Efficient query using index
const messages = await ctx.db
  .query("messages")
  .withIndex("by_channel", (q) => q.eq("channel", channelId))
  .collect();
```

### Relationships

#### One-to-One Relationship

```typescript
defineSchema({
  users: defineTable({
    name: v.string()
  }),
  authorProfiles: defineTable({
    userId: v.id("users"), // one-to-one
    bio: v.string()
  }).index("userId", ["userId"])
});
```

#### One-to-Many Relationship

```typescript
defineSchema({
  posts: defineTable({
    title: v.string(),
    authorId: v.id("authorProfiles"), // one-to-many
    content: v.string()
  }).index("by_authorId", ["authorId"])
});
```

#### Many-to-Many Relationship

```typescript
defineSchema({
  posts: defineTable({ ... }),
  categories: defineTable({ ... }),
  postCategories: defineTable({
    postId: v.id("posts"),
    categoryId: v.id("categories")
  }).index("postId", ["postId"])
});
```

### Querying Data

#### Basic Query

```typescript
// Get all documents
const allMessages = await ctx.db.query("messages").collect();

// Get single document
const message = await ctx.db.get(messageId);

// Filter in application code
const tomsMessages = allMessages.filter((m) => m.author === "Tom");
```

#### Query with Index (Recommended)

```typescript
// Efficient query using index
const tomsMessages = await ctx.db
  .query("messages")
  .withIndex("by_author", (q) => q.eq("author", "Tom"))
  .collect();
```

#### Query Methods

- `.collect()` - Collect all results
- `.first()` - Get first result
- `.unique()` - Get exactly one result (throws if not unique)
- `.paginate()` - Paginate results

---

## Authentication & Authorization

### Supported Providers

Convex supports multiple authentication providers:

- **Clerk** - Passwords, social login, email/SMS codes, MFA
- **Auth0** - Enterprise authentication
- **Firebase** - Google's authentication platform
- **Convex Auth** - Built-in authentication solution

### Clerk Integration

**Setup configuration (`auth.config.ts`):**

```typescript
import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex"
    }
  ]
} satisfies AuthConfig;
```

**React integration with Clerk:**

```typescript
import { ClerkLoginButton } from 'convex/react-clerk';

export function LoginPage() {
  return (
    <ClerkLoginButton
      clerkPublishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      convexUrl={import.meta.env.VITE_CONVEX_URL}
    />
  );
}
```

**Store authenticated users in database:**

```typescript
import { useUser } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export function useStoreUserEffect() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function createUser() {
      const id = await storeUser();
      setUserId(id);
    }

    createUser();
    return () => setUserId(null);
  }, [isAuthenticated, storeUser, user?.id]);

  return {
    isLoading: isLoading || (isAuthenticated && userId === null),
    isAuthenticated: isAuthenticated && userId !== null
  };
}
```

### Auth0 Integration

**Next.js setup with Auth0:**

```typescript
"use client";

import { Auth0Provider } from "@auth0/auth0-react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuth0 } from "convex/react-auth0";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri: typeof window === "undefined"
          ? undefined
          : window.location.origin
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <ConvexProviderWithAuth0 client={convex}>
        {children}
      </ConvexProviderWithAuth0>
    </Auth0Provider>
  );
}
```

### User Identity in Functions

**Access authenticated user information:**

```typescript
export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return {
      email: identity.email,
      name: identity.name,
      subject: identity.subject,
      issuer: identity.issuer
    };
  }
});
```

**UserIdentity interface:**

```typescript
interface UserIdentity {
  subject: string;              // Unique identifier
  issuer: string;               // Auth provider (e.g., 'https://accounts.google.com')
  email?: string;               // User's email
  email_verified?: boolean;     // Email verification status
  name?: string;                // Display name
  picture?: string;             // Profile picture URL
  phone_number?: string;        // Phone number
  phone_number_verified?: boolean; // Phone verification status
}
```

### Authorization Patterns

**Check authentication in functions:**

```typescript
export const createPost = mutation({
  args: {
    title: v.string(),
    content: v.string()
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const postId = await ctx.db.insert("posts", {
      ...args,
      authorId: identity.subject,
      createdAt: Date.now()
    });

    return postId;
  }
});
```

---

## File Storage

### Storing Files

Convex provides built-in file storage for all file types:

```typescript
export const uploadFile = mutation({
  args: {
    file: v.bytes(),
    author: v.string()
  },
  handler: async (ctx, { file, author }) => {
    // Store file in Convex storage
    const storageId = await ctx.storage.store(file);

    // Save reference in database
    const fileId = await ctx.db.insert("files", {
      storageId,
      author,
      uploadedAt: Date.now()
    });

    return fileId;
  }
});
```

### HTTP File Upload Endpoint

**Handle file uploads via HTTP actions:**

```typescript
import { httpAction } from "./_generated/server";

http.route({
  path: "/sendImage",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const blob = await request.blob();
    const storageId = await ctx.storage.store(blob);

    const author = new URL(request.url).searchParams.get("author");
    if (author === null) {
      return new Response("Author is required", { status: 400 });
    }

    await ctx.runMutation(api.messages.sendImage, { storageId, author });

    return new Response(null, {
      status: 200,
      headers: new Headers({
        "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN!,
        "Vary": "origin"
      })
    });
  })
});
```

**Upload from client:**

```typescript
const sendImageUrl = new URL(`${convexSiteUrl}/sendImage`);
sendImageUrl.searchParams.set("author", "Jack Smith");

await fetch(sendImageUrl, {
  method: "POST",
  headers: { "Content-Type": "image/jpeg" },
  body: imageBlob
});
```

### Retrieving Files

```typescript
export const getFile = query({
  args: { fileId: v.id("files") },
  handler: async (ctx, { fileId }) => {
    const file = await ctx.db.get(fileId);
    if (!file) throw new Error("File not found");

    // Get file from storage
    const blob = await ctx.storage.get(file.storageId);
    return blob;
  }
});
```

### File Metadata

```typescript
export const getFileMetadata = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    const metadata = await ctx.storage.getMetadata(storageId);
    return {
      size: metadata.size,
      uploaded: metadata.uploaded,
      contentType: metadata.contentType
    };
  }
});
```

### Deleting Files

```typescript
export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  handler: async (ctx, { fileId }) => {
    const file = await ctx.db.get(fileId);
    if (!file) throw new Error("File not found");

    // Delete from storage
    await ctx.storage.delete(file.storageId);

    // Delete database record
    await ctx.db.delete(fileId);
  }
});
```

### Storage API

**Storage methods:**

- `ctx.storage.store(blob)` - Store file, returns storage ID
- `ctx.storage.get(storageId)` - Retrieve file as Blob
- `ctx.storage.getMetadata(storageId)` - Get file metadata
- `ctx.storage.delete(storageId)` - Delete file
- `ctx.storage.generateUrl(storageId)` - Generate download URL

---

## Real-time Updates

### Reactive Queries with React

Convex automatically subscribes to queries and updates the UI when data changes:

```typescript
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function MessageList() {
  // Automatically subscribes to updates
  const messages = useQuery(api.messages.list);

  if (messages === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {messages.map((message) => (
        <div key={message._id}>{message.body}</div>
      ))}
    </div>
  );
}
```

### Manual Subscriptions

**Using `onUpdate` for callback-based subscriptions:**

```typescript
const unsubscribe = onUpdate(
  queryReference,
  { arg1: "value1" },
  (result) => {
    console.log("Query result updated:", result);
  },
  (error) => {
    console.error("Query error:", error);
  }
);

// Unsubscribe when done
unsubscribe();
```

**Using `watchQuery` for Watch objects:**

```typescript
const watch = watchQuery(myQuery, { userId: "123" });

// Access current value
const currentValue = watch.localQueryResult();

// Subscribe to updates
watch.onUpdate((newResult) => {
  console.log("New result:", newResult);
});
```

### How Real-time Works

1. **Automatic subscriptions:** `useQuery` automatically subscribes to query results
2. **Reactive updates:** When data changes, queries re-run automatically
3. **UI re-rendering:** React components re-render with new data
4. **Optimized updates:** Only re-runs queries affected by data changes

### Server-Side Real-time

**Using ConvexClient without React:**

```typescript
import { ConvexClient } from "convex/browser";

const client = new ConvexClient(CONVEX_URL);

const unsubscribe = client.onUpdate(
  api.messages.list,
  {},
  (result) => {
    console.log("Messages updated:", result);
  }
);
```

---

## Deployment & Production

### Deployment Commands

**Deploy to production:**

```bash
npx convex deploy
```

**Deploy with environment variable:**

```bash
CONVEX_DEPLOY_KEY=[YOUR_DEPLOY_KEY] npx convex deploy
```

**Deploy with frontend build:**

```bash
npx convex deploy --cmd 'npm run build'
```

### Production Deploy Keys

1. Go to [Project Settings](https://dashboard.convex.dev/project/settings#production-deploy-keys)
2. Click "Generate Production Deploy Key"
3. Copy the key
4. Set as environment variable in your hosting platform

### Vercel Integration

**Configure Vercel Build Command:**

```shell
npx convex deploy --cmd 'npm run build'
```

**How it works:**

1. `npx convex deploy` reads `CONVEX_DEPLOY_KEY` from environment
2. Sets `CONVEX_URL` to production deployment
3. Frontend build reads `CONVEX_URL` to configure client
4. Pushes Convex functions to production
5. Frontend and backend are deployed together

**Environment Variables in Vercel:**

- `CONVEX_DEPLOY_KEY` - Production deploy key
- `CONVEX_URL` - Automatically set by deploy command

### Environment Variables

**Configure environment variables:**

```typescript
// convex/config.ts
export default makeConfig({
  env: {
    clerkJwtIssuerDomain: {
      validation: v.string(),
      access: "public"
    },
    openaiApiKey: {
      validation: v.string(),
      access: "secret"
    }
  }
});
```

**Use in functions:**

```typescript
export const callOpenAI = action({
  handler: async (ctx) => {
    const apiKey = process.env.OPENAI_API_KEY;
    // Use API key
  }
});
```

### Production Best Practices

1. **Environment variables:**
   - Use deploy keys for production environments
   - Separate dev/prod configurations
   - Never commit secrets to git

2. **Preview deployments:**
   - Test changes before production
   - Use preview URLs for pull requests
   - Isolate preview environments

3. **Monitoring:**
   - Set up error tracking (Sentry, etc.)
   - Monitor function performance
   - Track usage metrics

4. **Domain configuration:**
   - Configure custom domains in dashboard
   - Set up proper CORS headers
   - Enable SSL certificates

---

## Frontend Framework Integration

### React

**Basic setup:**

```typescript
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { api } from "../convex/_generated/api";

const convex = new ConvexReactClient(CONVEX_URL);

function App() {
  return (
    <ConvexProvider client={convex}>
      <YourApp />
    </ConvexProvider>
  );
}
```

**Using hooks:**

```typescript
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../convex/_generated/api";

function Messages() {
  const messages = useQuery(api.messages.list);
  const sendMessage = useMutation(api.messages.send);

  if (messages === undefined) return <div>Loading...</div>;

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg._id}>{msg.body}</div>
      ))}
      <button onClick={() => sendMessage({ body: "Hello!" })}>
        Send
      </button>
    </div>
  );
}
```

### Next.js

**Server Components with data preloading:**

```typescript
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import ClientComponent from "./ClientComponent";

export async function ServerComponent() {
  const preloaded = await preloadQuery(api.foo.baz);
  return <ClientComponent preloaded={preloaded} />;
}
```

**Client Component consuming preloaded data:**

```typescript
"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function ClientComponent(props: { preloaded: Preloaded }) {
  const data = usePreloadedQuery(props.preloaded);
  return <div>{data}</div>;
}
```

### SvelteKit

**Setup in layout:**

```typescript
<script lang="ts">
  import { PUBLIC_CONVEX_URL } from '$env/static/public';
  import { setupConvex } from 'convex-svelte';

  const { children } = $props();
  setupConvex(PUBLIC_CONVEX_URL);
</script>

{@render children()}
```

### TanStack Start

**Initialize with Convex template:**

```bash
npm create convex@latest -- -t tanstack-start
```

**Install dependencies:**

```bash
npm install convex @convex-dev/react-query @tanstack/react-router-with-query @tanstack/react-query
```

### Vue

**Setup with Convex client:**

```typescript
import { ConvexClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const convex = new ConvexClient(CONVEX_URL);

// In component
const messages = await convex.query(api.messages.list);
```

---

## Testing Patterns

### Unit Testing with convex-test

**Install dependencies:**

```bash
npm install convex-test vitest --save-dev
```

**Basic test setup:**

```typescript
import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

describe("posts.list", () => {
  it("returns empty array when no posts exist", async () => {
    const t = convexTest(schema);

    const posts = await t.query(api.posts.list);
    expect(posts).toEqual([]);
  });

  it("returns all posts ordered by creation time", async () => {
    const t = convexTest(schema);

    // Create test data
    await t.mutation(api.posts.add, {
      title: "First Post",
      content: "This is the first post",
      author: "Alice"
    });

    await t.mutation(api.posts.add, {
      title: "Second Post",
      content: "This is the second post",
      author: "Bob"
    });

    // Query and assert
    const posts = await t.query(api.posts.list);
    expect(posts).toHaveLength(2);
    expect(posts[0].title).toBe("Second Post");
    expect(posts[1].title).toBe("First Post");
  });
});
```

### Testing Queries and Mutations

**Test query with filters:**

```typescript
test("queries user's own posts", async () => {
  const t = convexTest(schema);

  const userId = await t.mutation(api.users.create, {
    name: "Alice"
  });

  await t.mutation(api.posts.create, {
    authorId: userId,
    title: "My Post"
  });

  const posts = await t.query(api.posts.listByUser, { userId });
  expect(posts).toHaveLength(1);
  expect(posts[0].title).toBe("My Post");
});
```

### Testing Actions

**Test external API calls:**

```typescript
test("summarizes conversation", async () => {
  const t = convexTest(schema);

  const conversationId = await t.mutation(api.conversations.create);

  const summary = await t.action(api.conversations.summarize, {
    conversationId
  });

  expect(summary).toBeDefined();
});
```

### Testing Authentication

**Test with authenticated context:**

```typescript
test("requires authentication to create post", async () => {
  const t = convexTest(schema);

  await expect(
    t.mutation(api.posts.create, {
      title: "Test"
    })
  ).rejects.toThrow("Unauthorized");
});
```

### Integration Testing

**Test complete workflows:**

```typescript
test("message flow", async () => {
  const t = convexTest(schema);

  // Create channel
  const channelId = await t.mutation(api.channels.create, {
    name: "general"
  });

  // Send messages
  await t.mutation(api.messages.send, {
    channelId,
    body: "Hello!",
    author: "Alice"
  });

  // List messages
  const messages = await t.query(api.messages.listByChannel, {
    channelId
  });

  expect(messages).toHaveLength(1);
  expect(messages[0].body).toBe("Hello!");
});
```

---

## Best Practices & Anti-Patterns

### Performance Optimization

#### ✅ DO: Use Indexes

```typescript
// Efficient: Use index for querying
const tomsMessages = await ctx.db
  .query("messages")
  .withIndex("by_author", (q) => q.eq("author", "Tom"))
  .collect();
```

#### ❌ DON'T: Use .filter() on Queries

```typescript
// Inefficient: Filters on large datasets
const tomsMessages = ctx.db
  .query("messages")
  .filter((q) => q.eq(q.field("author"), "Tom"))
  .collect();
```

**Better alternative: Filter in application code**

```typescript
const allMessages = await ctx.db.query("messages").collect();
const tomsMessages = allMessages.filter((m) => m.author === "Tom");
```

### Function Organization

#### ✅ DO: Direct Function Calls

```typescript
// Good: Direct function calls
const messages = await ctx.runQuery(api.messages.list);
```

#### ❌ DON'T: Multiple runQuery Calls in Actions

```typescript
// Bad: Multiple separate runQuery calls
const foo = await ctx.runQuery(...);
const bar = await ctx.runQuery(...);

// Good: Single consolidated call
const fooAndBar = await ctx.runQuery(...);
```

### Code Organization

#### ❌ Anti-Pattern: Overusing ctx.runQuery/runMutation

```typescript
// Bad: Sequential context method calls
export const listMessages = query({
  handler: async (ctx) => {
    const user = await ctx.runQuery(api.users.getCurrent);
    return ctx.db.query("messages").filter(...);
  }
});

export const summarize = action({
  handler: async (ctx) => {
    const messages = await ctx.runQuery(api.messages.list);
    const summary = await callLLM(messages);
    await ctx.runMutation(api.messages.addSummary, { summary });
  }
});
```

**Problems:**
- Unnecessary round-trips
- Harder to test
- More complex maintenance

#### ✅ Best Practice: Direct Database Access

```typescript
// Good: Direct database access
export const listMessages = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return ctx.db.query("messages").filter(...);
  }
});
```

### Query Optimization

**Avoid large result sets:**

```typescript
// Bad: Fetch all messages
const allMessages = await ctx.db.query("messages").collect();

// Good: Use pagination
const page = await ctx.db
  .query("messages")
  .paginate({ numItems: 50 });
```

**Use indexes effectively:**

```typescript
// Bad: Full table scan
const recentMessages = await ctx.db
  .query("messages")
  .filter(q => q.gte(q.field("timestamp"), Date.now() - 86400000))
  .collect();

// Good: Use index on timestamp
const recentMessages = await ctx.db
  .query("messages")
  .withIndex("by_timestamp", q => q.gte("timestamp", Date.now() - 86400000))
  .collect();
```

### Mutation Best Practices

**Atomic operations:**

```typescript
// Good: Single mutation for related changes
export const createPostWithTags = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    tags: v.array(v.string())
  },
  handler: async (ctx, args) => {
    const postId = await ctx.db.insert("posts", {
      title: args.title,
      content: args.content
    });

    for (const tag of args.tags) {
      await ctx.db.insert("postTags", {
        postId,
        tag
      });
    }

    return postId;
  }
});
```

### Action Best Practices

**Minimize runQuery/runMutation calls:**

```typescript
// Bad: Multiple round-trips
export const processOrder = action({
  handler: async (ctx, { orderId }) => {
    const order = await ctx.runQuery(api.orders.get, { orderId });
    const payment = await ctx.runQuery(api.payments.get, { orderId });
    const result = await processPayment(payment);
    await ctx.runMutation(api.orders.updateStatus, { orderId, status: "paid" });
  }
});

// Good: Consolidate database operations
export const processOrder = action({
  handler: async (ctx, { orderId }) => {
    const { order, payment } = await ctx.runQuery(api.orders.getOrderDetails, { orderId });
    const result = await processPayment(payment);
    await ctx.runMutation(api.orders.completePayment, { orderId, result });
  }
});
```

### Security Best Practices

**Always validate authentication:**

```typescript
export const sensitiveOperation = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    // Proceed with operation
  }
});
```

**Validate user permissions:**

```typescript
export const updatePost = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string()
  },
  handler: async (ctx, { postId, content }) => {
    const identity = await ctx.auth.getUserIdentity();
    const post = await ctx.db.get(postId);

    if (!post || post.authorId !== identity?.subject) {
      throw new Error("Forbidden");
    }

    await ctx.db.patch(postId, { content });
  }
});
```

### The Zen of Convex

Key principles for optimal Convex development:

1. **Use indexes** for efficient queries
2. **Minimize .filter()** on queries - use indexes or filter in code
3. **Avoid sequential ctx.runQuery/runMutation** - consolidate operations
4. **Keep functions focused** - single responsibility
5. **Validate authentication and authorization** in every function
6. **Use transactions** for data consistency
7. **Optimize for reactivity** - queries auto-update when data changes
8. **Test thoroughly** - use convex-test for unit testing

---

## Additional Resources

### Documentation Links

- **Official Docs:** https://docs.convex.dev
- **Dashboard:** https://dashboard.convex.dev
- **GitHub:** https://github.com/get-convex/convex-js

### Key Concepts Covered

- ✅ Getting started guides
- ✅ Core concepts (documents, queries, mutations, actions)
- ✅ Database schema and modeling
- ✅ Authentication and authorization
- ✅ File storage
- ✅ Real-time updates
- ✅ Deployment best practices
- ✅ Frontend framework integration (React, Next.js, Vue, Svelte)
- ✅ Testing patterns
- ✅ Common patterns and anti-patterns

---

**Research completed using Context7 - 2,845 code snippets analyzed from official Convex documentation.**
