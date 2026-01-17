# Convex Quick Start Guide

Complete step-by-step guide for setting up a Convex project from scratch.

## Creating a New Project

### Option 1: Using the CLI (Recommended)

```bash
npm create convex@latest
```

The CLI will prompt you to:
1. Select a frontend framework (React/Vite, Next.js, etc.)
2. Choose whether to add Convex Auth
3. Name your project
4. Select a directory

### Option 2: Manual Setup

```bash
# Create project directory
mkdir my-convex-app && cd my-convex-app

# Initialize npm
npm init -y

# Install Convex
npm install convex

# Initialize Convex
npx convex dev
```

## Project Structure

```
my-convex-app/
├── convex/
│   ├── schema.ts           # Database schema
│   ├── config.ts           # Environment variables
│   ├── auth.config.ts      # Authentication config
│   └── _generated/         # Auto-generated types
├── src/                    # Frontend code
├── package.json
└── convex.json             # Project configuration
```

## Your First Convex App

### Step 1: Define Schema

**File:** `convex/schema.ts`

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    body: v.string(),
    author: v.string(),
    createdAt: v.number()
  })
});
```

### Step 2: Write a Query

**File:** `convex/messages.ts`

```typescript
import { query } from "./_generated/server";

export const list = query({
  handler: async ({ db }) => {
    return await db.query("messages").collect();
  }
});
```

### Step 3: Write a Mutation

**File:** `convex/messages.ts` (add to existing file)

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const send = mutation({
  args: {
    body: v.string(),
    author: v.string()
  },
  handler: async ({ db }, { body, author }) => {
    await db.insert("messages", {
      body,
      author,
      createdAt: Date.now()
    });
  }
});
```

### Step 4: Frontend Integration

**React:**

```typescript
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

function App() {
  return (
    <ConvexProvider client={convex}>
      <Messages />
    </ConvexProvider>
  );
}

function Messages() {
  const messages = useQuery(api.messages.list);
  const sendMessage = useMutation(api.messages.send);

  return (
    <div>
      {messages?.map((msg) => (
        <div key={msg._id}>{msg.author}: {msg.body}</div>
      ))}
      <button onClick={() => sendMessage({ body: "Hello!", author: "Me" })}>
        Send
      </button>
    </div>
  );
}
```

### Step 5: Run Development

```bash
# Terminal 1: Start Convex backend
npx convex dev

# Terminal 2: Start frontend
npm run dev
```

### Step 6: Verify

1. Check your browser - you should see the app
2. Check the dashboard at https://dashboard.convex.dev
3. Click "Send" button - messages should appear in real-time
4. Check the dashboard - you should see the data in your database

## Environment Variables

**Development:**
- Automatically set by `npx convex dev`
- Check `.convex/local.env` for local URL

**Production:**
- Set `NEXT_PUBLIC_CONVEX_URL` or `VITE_CONVEX_URL`
- Set `CONVEX_DEPLOY_KEY` for deployments

## Next Steps

After your first app works:

1. **Add indexes** to your schema for better performance
2. **Add authentication** with Clerk or other providers
3. **Add file storage** for uploads
4. **Set up testing** with convex-test
5. **Deploy to production**

## Common Issues

**Port already in use:**
```bash
# Kill process on port 3210
lsof -ti:3210 | xargs kill -9
```

**Types not generated:**
```bash
rm -rf convex/_generated
npx convex dev
```

**Frontend can't connect:**
1. Check `CONVEX_URL` environment variable
2. Verify `ConvexProvider` wraps your app
3. Check browser console for errors
