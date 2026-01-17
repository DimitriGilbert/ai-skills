# Convex Core Concepts

Deep dive into the fundamental concepts that power Convex applications.

---

## Table of Contents

1. [Server Functions](#server-functions)
2. [Documents & Data Model](#documents--data-model)
3. [Queries](#queries)
4. [Mutations](#mutations)
5. [Actions](#actions)
6. [Database Operations](#database-operations)
7. [Indexes & Performance](#indexes--performance)
8. [Validation & Types](#validation--types)
9. [Function Context](#function-context)

---

## Server Functions

Convex provides three types of server functions, each with specific capabilities:

### Function Type Comparison

| Function Type | Database Access | Network Requests | Use Case |
|--------------|----------------|------------------|----------|
| **Query** | Read-only | ❌ No | Fetching data for UI |
| **Mutation** | Read + Write | ❌ No | Modifying data |
| **Action** | Indirect only | ✅ Yes | External APIs, LLMs, emails |

### Query Functions

**Purpose:** Read-only data fetching with automatic reactivity

**Characteristics:**
- Pure functions (no side effects)
- Can only read from database
- No network requests allowed
- Auto-subscribe to data changes
- Transactional consistency

**Example:**

```typescript
import { query } from "./_generated/server";

export const listMessages = query({
  handler: async (ctx) => {
    // Read from database
    const messages = await ctx.db.query("messages").collect();

    // Transform data
    return messages.map(msg => ({
      id: msg._id,
      body: msg.body,
      author: msg.author
    }));
  }
});

// With arguments
export const getMessagesByChannel = query({
  args: {
    channelId: v.id("channels")
  },
  handler: async (ctx, { channelId }) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_channel", q => q.eq("channel", channelId))
      .collect();
  }
});
```

**Use Cases:**
- Fetching data for UI components
- Filtering and sorting data
- Aggregating data
- Combining data from multiple tables

### Mutation Functions

**Purpose:** Modify data in the database

**Characteristics:**
- Can insert, update, delete documents
- Run as transactions (ACID guarantees)
- No network requests allowed
- Automatically invalidate relevant queries
- Trigger real-time updates

**Example:**

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
  args: {
    body: v.string(),
    channelId: v.id("channels"),
    author: v.string()
  },
  handler: async (ctx, args) => {
    // Insert new document
    const messageId = await ctx.db.insert("messages", {
      ...args,
      timestamp: Date.now()
    });

    // Update channel metadata
    const channel = await ctx.db.get(args.channelId);
    if (channel) {
      await ctx.db.patch(args.channelId, {
        lastMessageAt: Date.now()
      });
    }

    return messageId;
  }
});

// Complex mutation with validation
export const updateMessage = mutation({
  args: {
    messageId: v.id("messages"),
    body: v.string(),
    editor: v.string()
  },
  handler: async (ctx, { messageId, body, editor }) => {
    const message = await ctx.db.get(messageId);

    if (!message) {
      throw new Error("Message not found");
    }

    if (message.author !== editor) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(messageId, {
      body,
      editedAt: Date.now(),
      editedBy: editor
    });

    return messageId;
  }
});
```

**Use Cases:**
- Creating new documents
- Updating existing data
- Deleting records
- Complex data modifications
- Transactional operations

### Action Functions

**Purpose:** General-purpose serverless functions with external integrations

**Characteristics:**
- Can make network requests
- No direct database access
- Must use `ctx.runQuery()` and `ctx.runMutation()` for database operations
- Useful for third-party APIs, LLMs, email services

**Example:**

```typescript
import { action } from "./_generated/server";
import { v } from "convex/values";

export const summarizeWithOpenAI = action({
  args: {
    conversationId: v.id("conversations")
  },
  handler: async (ctx, { conversationId }) => {
    // Fetch data via query
    const messages = await ctx.runQuery(
      api.conversations.getMessages,
      { conversationId }
    );

    // Make external API call
    const response = await fetch("https://api.openai.com/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: messages.map(m => ({
          role: "user",
          content: m.body
        }))
      })
    });

    const summary = await response.json();

    // Save result via mutation
    await ctx.runMutation(
      api.conversations.saveSummary,
      { conversationId, summary: summary.content }
    );

    return summary;
  }
});

// Send email notification
export const sendNotificationEmail = action({
  args: {
    email: v.string(),
    message: v.string()
  },
  handler: async (ctx, { email, message }) => {
    await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email }]
        }],
        from: { email: "noreply@myapp.com" },
        subject: "New Notification",
        content: [{
          type: "text/plain",
          value: message
        }]
      })
    });
  }
});
```

**Use Cases:**
- Calling LLMs (OpenAI, Anthropic, etc.)
- Sending emails
- Processing payments
- Calling external APIs
- Image processing
- Webhooks

---

## Documents & Data Model

### Document Structure

Every document in Convex has:

```typescript
{
  _id: Id<"tableName">,      // Unique identifier
  _creationTime: number,     // Creation timestamp (ms since epoch)
  // ... your custom fields
}
```

### Working with Documents

**Create a document:**

```typescript
const messageId = await ctx.db.insert("messages", {
  body: "Hello, world!",
  author: "Alice",
  channelId: "channel123"
});
// Returns: Id<"messages">
```

**Read a document:**

```typescript
const message = await ctx.db.get(messageId);
// Returns: { _id, _creationTime, body, author, channelId } | null
```

**Update a document:**

```typescript
await ctx.db.patch(messageId, {
  body: "Updated message"
});

// Partial update - only modifies specified fields
```

**Replace a document:**

```typescript
await ctx.db.replace(messageId, {
  body: "Completely new content",
  author: "Bob",
  channelId: "channel456"
});
// Replaces entire document except _id
```

**Delete a document:**

```typescript
await ctx.db.delete(messageId);
```

### Document IDs

**Type-safe IDs:**

```typescript
const messageId: Id<"messages"> = "j4k3h2l1...";
const channelId: Id<"channels"> = "x9y8z7w6...";

// TypeScript enforces correct usage
await ctx.db.get(messageId); // ✅ OK
await ctx.db.insert("messages", { channelId }); // ✅ OK
// await ctx.db.insert("messages", { messageId }); // ❌ Type error
```

---

## Queries

### Query Structure

```typescript
import { query } from "./_generated/server";
import { v } from "convex/values";

export const myQuery = query({
  // Optional: Define input arguments
  args: {
    param1: v.string(),
    param2: v.optional(v.number())
  },

  // Handler function
  handler: async (ctx, args) => {
    // ctx.auth - Authentication context
    // ctx.db - Database reader

    // Return data
    return { /* ... */ };
  }
});
```

### Query Context

```typescript
export const exampleQuery = query({
  handler: async (ctx) => {
    // Access authenticated user
    const identity = await ctx.auth.getUserIdentity();

    // Access database (read-only)
    const data = await ctx.db.query("tableName").collect();

    return { data, user: identity };
  }
});
```

### Query Patterns

**Simple fetch:**

```typescript
export const getAllMessages = query({
  handler: async (ctx) => {
    return await ctx.db.query("messages").collect();
  }
});
```

**With filtering:**

```typescript
export const getMessagesByAuthor = query({
  args: { author: v.string() },
  handler: async (ctx, { author }) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_author", q => q.eq("author", author))
      .collect();
  }
});
```

**With pagination:**

```typescript
export const getPaginatedMessages = query({
  args: {
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null())
    })
  },
  handler: async (ctx, { paginationOpts }) => {
    return await ctx.db
      .query("messages")
      .paginate(paginationOpts);
  }
});
```

**Combining data:**

```typescript
export const getMessagesWithAuthors = query({
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").collect();

    return await Promise.all(
      messages.map(async (message) => {
        const author = await ctx.db.get(message.authorId);
        return {
          ...message,
          authorName: author?.name
        };
      })
    );
  }
});
```

---

## Mutations

### Mutation Structure

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const myMutation = mutation({
  // Define input validation
  args: {
    field1: v.string(),
    field2: v.optional(v.number())
  },

  // Handler function
  handler: async (ctx, args) => {
    // ctx.auth - Authentication context
    // ctx.db - Database writer (insert, update, delete)

    // Return result
    return { /* ... */ };
  }
});
```

### Mutation Context

```typescript
export const exampleMutation = mutation({
  args: { content: v.string() },
  handler: async (ctx, { content }) => {
    // Access authenticated user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Write to database
    const id = await ctx.db.insert("posts", {
      content,
      authorId: identity.subject,
      createdAt: Date.now()
    });

    return id;
  }
});
```

### Mutation Patterns

**Create document:**

```typescript
export const createMessage = mutation({
  args: {
    body: v.string(),
    channelId: v.id("channels")
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const messageId = await ctx.db.insert("messages", {
      ...args,
      author: identity?.subject ?? "anonymous",
      timestamp: Date.now()
    });

    return messageId;
  }
});
```

**Update document:**

```typescript
export const updateMessage = mutation({
  args: {
    messageId: v.id("messages"),
    updates: v.object({
      body: v.optional(v.string()),
      edited: v.optional(v.boolean())
    })
  },
  handler: async (ctx, { messageId, updates }) => {
    const message = await ctx.db.get(messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    await ctx.db.patch(messageId, updates);
    return messageId;
  }
});
```

**Delete document:**

```typescript
export const deleteMessage = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, { messageId }) => {
    await ctx.db.delete(messageId);
  }
});
```

**Transactional operation:**

```typescript
export const transferCredits = mutation({
  args: {
    from: v.id("users"),
    to: v.id("users"),
    amount: v.number()
  },
  handler: async (ctx, { from, to, amount }) => {
    // Get both users
    const sender = await ctx.db.get(from);
    const receiver = await ctx.db.get(to);

    if (!sender || !receiver) {
      throw new Error("User not found");
    }

    if (sender.credits < amount) {
      throw new Error("Insufficient credits");
    }

    // Update both (atomic transaction)
    await ctx.db.patch(from, {
      credits: sender.credits - amount
    });

    await ctx.db.patch(to, {
      credits: receiver.credits + amount
    });

    return { success: true };
  }
});
```

---

## Actions

### Action Structure

```typescript
import { action } from "./_generated/server";
import { v } from "convex/values";

export const myAction = action({
  args: {
    param1: v.string()
  },
  handler: async (ctx, args) => {
    // ctx.runQuery() - Call query functions
    // ctx.runMutation() - Call mutation functions
    // Can make network requests

    return { /* ... */ };
  }
});
```

### Action Context

```typescript
export const exampleAction = action({
  args: { url: v.string() },
  handler: async (ctx, { url }) => {
    // Fetch external data
    const response = await fetch(url);
    const data = await response.json();

    // Save to database via mutation
    await ctx.runMutation(api.data.save, {
      url,
      data
    });

    return data;
  }
});
```

### Action Patterns

**LLM Integration:**

```typescript
export const chatWithAI = action({
  args: {
    conversationId: v.id("conversations"),
    message: v.string()
  },
  handler: async (ctx, { conversationId, message }) => {
    // Get conversation history
    const history = await ctx.runQuery(
      api.conversations.getHistory,
      { conversationId }
    );

    // Call OpenAI
    const completion = await fetch("https://api.openai.com/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          ...history,
          { role: "user", content: message }
        ]
      })
    });

    const response = await completion.json();

    // Save AI response
    await ctx.runMutation(api.conversations.addMessage, {
      conversationId,
      role: "assistant",
      content: response.choices[0].message.content
    });

    return response;
  }
});
```

**Payment Processing:**

```typescript
export const createPayment = action({
  args: {
    amount: v.number(),
    paymentMethodId: v.string()
  },
  handler: async (ctx, { amount, paymentMethodId }) => {
    // Call Stripe API
    const payment = await fetch("https://api.stripe.com/v1/payments", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to cents
        currency: "usd",
        payment_method: paymentMethodId,
        confirm: true
      })
    });

    const result = await payment.json();

    // Record payment in database
    await ctx.runMutation(api.payments.record, {
      stripeId: result.id,
      amount,
      status: result.status
    });

    return result;
  }
});
```

---

## Database Operations

### Query Building

**Basic query:**

```typescript
const messages = await ctx.db.query("messages").collect();
```

**With index:**

```typescript
const messages = await ctx.db
  .query("messages")
  .withIndex("by_channel", q => q.eq("channel", channelId))
  .collect();
```

**With filtering (in code):**

```typescript
const messages = await ctx.db.query("messages").collect();
const filtered = messages.filter(m => m.author === "Alice");
```

**With ordering:**

```typescript
const messages = await ctx.db
  .query("messages")
  .withIndex("by_timestamp", q => q.gt("timestamp", Date.now() - 86400000))
  .collect();
```

### Query Methods

```typescript
// Collect all results
const all = await ctx.db.query("messages").collect();

// Get first result
const first = await ctx.db.query("messages").first();

// Get unique result (throws if not unique)
const unique = await ctx.db.query("messages").unique();

// Paginate
const page = await ctx.db.query("messages").paginate({
  numItems: 50,
  cursor: null
});
```

### Index Queries

```typescript
// Equality
const results = await ctx.db
  .query("messages")
  .withIndex("by_author", q => q.eq("author", "Alice"))
  .collect();

// Greater than
const recent = await ctx.db
  .query("messages")
  .withIndex("by_timestamp", q => q.gt("timestamp", Date.now() - 3600000))
  .collect();

// Range
const range = await ctx.db
  .query("messages")
  .withIndex("by_timestamp", q =>
    q.gte("timestamp", startTimestamp)
     .lt("timestamp", endTimestamp)
  )
  .collect();
```

---

## Indexes & Performance

### Defining Indexes

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    channel: v.id("channels"),
    author: v.string(),
    timestamp: v.number(),
    body: v.string()
  })
  .index("by_channel", ["channel"])
  .index("by_author", ["author"])
  .index("by_channel_author", ["channel", "author"])
  .index("by_timestamp", ["timestamp"])
});
```

### Using Indexes Effectively

**✅ DO: Use indexes for query filters**

```typescript
const messages = await ctx.db
  .query("messages")
  .withIndex("by_channel", q => q.eq("channel", channelId))
  .collect();
```

**❌ DON'T: Use .filter() on queries**

```typescript
// Inefficient: Scans all documents
const messages = await ctx.db
  .query("messages")
  .filter(q => q.eq(q.field("channel"), channelId))
  .collect();
```

**✅ DO: Filter in application code for small datasets**

```typescript
const allMessages = await ctx.db.query("messages").collect();
const channelMessages = allMessages.filter(m => m.channel === channelId);
```

### Compound Indexes

```typescript
// Schema
.index("by_channel_timestamp", ["channel", "timestamp"])

// Query
const messages = await ctx.db
  .query("messages")
  .withIndex("by_channel_timestamp", q =>
    q.eq("channel", channelId)
     .gt("timestamp", since)
  )
  .collect();
```

---

## Validation & Types

### Value Types

```typescript
import { v } from "convex/values";

v.string()       // "hello"
v.number()       // 42, 3.14
v.boolean()      // true, false
v.null()         // null
v.id("table")    // Foreign key reference
v.array(T)       // [1, 2, 3]
v.object({ ... }) // { key: value }
v.union(...)     // One of multiple types
v.literal(...)   // Specific value
v.optional(T)    // T | undefined
```

### Complex Validation

```typescript
export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    age: v.optional(v.number()),
    preferences: v.object({
      notifications: v.boolean(),
      theme: v.union(v.literal("light"), v.literal("dark"))
    }),
    tags: v.array(v.string())
  },
  handler: async (ctx, args) => {
    // All args are validated before handler runs
    const userId = await ctx.db.insert("users", args);
    return userId;
  }
});
```

---

## Function Context

### Authentication Context

```typescript
export const exampleQuery = query({
  handler: async (ctx) => {
    // Get authenticated user identity
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      // User is not authenticated
      return null;
    }

    // Access user info
    return {
      subject: identity.subject,      // Unique ID
      issuer: identity.issuer,        // Auth provider
      email: identity.email,
      name: identity.name,
      pictureUrl: identity.pictureUrl
    };
  }
});
```

### Database Context

**Query (read-only):**

```typescript
const data = await ctx.db.query("table").collect();
const doc = await ctx.db.get(id);
```

**Mutation (read + write):**

```typescript
const id = await ctx.db.insert("table", { /* ... */ });
await ctx.db.patch(id, { /* ... */ });
await ctx.db.delete(id);
```

### Scheduler Context

```typescript
import { mutation } from "./_generated/server";

export const scheduleReminder = mutation({
  args: {
    when: v.number(),
    message: v.string()
  },
  handler: async (ctx, { when, message }) => {
    // Schedule function to run in future
    await ctx.scheduler.runAt(
      new Date(when),
      api.notifications.send,
      { message }
    );
  }
});
```

---

## Best Practices

### Query Best Practices

1. **Use indexes** for efficient filtering
2. **Minimize data** - only fetch what you need
3. **Use pagination** for large result sets
4. **Combine data** in queries when possible

### Mutation Best Practices

1. **Validate all input** with `v.*` types
2. **Check authentication** and authorization
3. **Use transactions** for related changes
4. **Return meaningful results**

### Action Best Practices

1. **Consolidate database operations** - minimize runQuery/runMutation calls
2. **Handle errors** from external APIs
3. **Use timeouts** for external requests
4. **Cache results** when appropriate

---

**Next: Learn about [Database Schema & Modeling](./convex-context7-research.md#database-schema--modeling)**
