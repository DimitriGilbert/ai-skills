# Convex Frontend Framework Integration Guide

Complete guide to integrating Convex with popular frontend frameworks.

---

## Table of Contents

1. [Overview](#overview)
2. [React Integration](#react-integration)
3. [Next.js Integration](#nextjs-integration)
4. [Vue Integration](#vue-integration)
5. [Svelte Integration](#svelte-integration)
6. [TanStack Start Integration](#tanstack-start-integration)
7. [Client API](#client-api)
8. [Real-time Updates](#real-time-updates)
9. [Data Preloading](#data-preloading)
10. [Best Practices](#best-practices)

---

## Overview

Convex provides official integrations for major frontend frameworks:

| Framework | Package | Status |
|-----------|---------|--------|
| **React** | `convex/react` | ✅ Official |
| **Next.js** | `convex/nextjs` | ✅ Official |
| **Vue** | `convex/vue` | ✅ Official |
| **Svelte** | `convex-svelte` | ✅ Community |
| **TanStack Start** | `@convex-dev/react-query` | ✅ Official |

---

## React Integration

### Installation

```bash
npm install convex
```

### Basic Setup

**1. Create Convex client:**

```typescript
// src/convex/client.ts
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL!
);

export default convex;
```

**2. Wrap your app:**

```typescript
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConvexProvider } from 'convex/react';
import convex from './convex/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </React.StrictMode>
);
```

**3. Use queries and mutations:**

```typescript
// src/App.tsx
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export default function App() {
  const messages = useQuery(api.messages.list);
  const sendMessage = useMutation(api.messages.send);

  if (messages === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {messages.map((message) => (
        <div key={message._id}>
          <strong>{message.author}:</strong> {message.body}
        </div>
      ))}

      <button onClick={() => sendMessage({
        body: "Hello!",
        author: "User"
      })}>
        Send Message
      </button>
    </div>
  );
}
```

### React Hooks

#### useQuery

```typescript
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

function MessageList() {
  const messages = useQuery(api.messages.list);

  if (messages === undefined) {
    return <div>Loading...</div>;
  }

  if (messages === null) {
    return <div>Error loading messages</div>;
  }

  return (
    <ul>
      {messages.map((msg) => (
        <li key={msg._id}>{msg.body}</li>
      ))}
    </ul>
  );
}
```

**With arguments:**

```typescript
const messages = useQuery(api.messages.byChannel, {
  channelId: "channel123"
});
```

**Conditional queries:**

```typescript
const messages = useQuery(
  api.messages.list,
  channelId ? { channelId } : "skip"
);
```

#### useMutation

```typescript
import { useMutation } from "convex/react";

function SendMessage() {
  const sendMessage = useMutation(api.messages.send);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendMessage({
        body: "Hello!",
        author: "User"
      });
      // Success - queries will auto-update
    } catch (error) {
      console.error("Failed to send:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Send</button>
    </form>
  );
}
```

#### useAction

```typescript
import { useAction } from "convex/react";

function CallLLM() {
  const generate = useAction(api.ai.generate);

  const handleClick = async () => {
    const result = await generate({ prompt: "Write a poem" });
    console.log(result);
  };

  return <button onClick={handleClick}>Generate</button>;
}
```

### Authentication in React

**With Clerk:**

```typescript
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";

const convex = new ConvexReactClient(CONVEX_URL);

export function Providers({ children }) {
  return (
    <ClerkProvider publishableKey={CLERK_KEY}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
```

**With Auth0:**

```typescript
import { ConvexProviderWithAuth0 } from "convex/react-auth0";
import { Auth0Provider } from "@auth0/auth0-react";

export function Providers({ children }) {
  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
    >
      <ConvexProviderWithAuth0 client={convex}>
        {children}
      </ConvexProviderWithAuth0>
    </Auth0Provider>
  );
}
```

---

## Next.js Integration

### Installation

```bash
npm install convex
```

### Pages Router

**Setup provider:**

```typescript
// pages/_app.tsx
import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { AppProps } from "next/app";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConvexProvider client={convex}>
      <Component {...pageProps} />
    </ConvexProvider>
  );
}

export default MyApp;
```

### App Router

**Create provider component:**

```typescript
// app/ConvexClientProvider.tsx
"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!
);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}
```

**Use in layout:**

```typescript
// app/layout.tsx
import { ConvexClientProvider } from "./ConvexClientProvider";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html>
      <body>
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
```

### Server Components with Data Preloading

**Server Component:**

```typescript
// app/messages/page.tsx
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import MessageList from "./MessageList";

export default async function MessagesPage() {
  // Preload data on server
  const preloaded = await preloadQuery(api.messages.list);

  return <MessageList preloaded={preloaded} />;
}
```

**Client Component:**

```typescript
// app/messages/MessageList.tsx
"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function MessageList(props: {
  preloaded: Preloaded<typeof api.messages.list>
}) {
  const messages = usePreloadedQuery(props.preloaded);

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg._id}>{msg.body}</div>
      ))}
    </div>
  );
}
```

### API Routes

**Call Convex from API routes:**

```typescript
// pages/api/create-user.ts
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

export default async function handler(req, res) {
  const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

  const userId = await convex.mutation(api.users.create, {
    name: req.body.name,
    email: req.body.email
  });

  res.status(200).json({ userId });
}
```

---

## Vue Integration

### Installation

```bash
npm install convex
```

### Setup

**Create Convex client:**

```typescript
// src/convex.ts
import { ConvexClient } from "convex/vue";

export const convex = new ConvexClient(
  import.meta.env.VITE_CONVEX_URL!
);
```

**Install plugin:**

```typescript
// src/main.ts
import { createApp } from "vue";
import { ConvexPlugin } from "convex/vue";
import App from "./App.vue";
import { convex } from "./convex";

const app = createApp(App);

app.use(ConvexPlugin, { client: convex });
app.mount("#app");
```

### Using in Components

**Composition API:**

```vue
<script setup lang="ts">
import { useQuery, useMutation } from "convex/vue";
import { api } from "../convex/_generated/api";

const messages = useQuery(api.messages.list);
const sendMessage = useMutation(api.messages.send);

const handleSend = async () => {
  await sendMessage({
    body: "Hello!",
    author: "User"
  });
};
</script>

<template>
  <div v-if="messages === undefined">Loading...</div>
  <div v-else>
    <div v-for="msg in messages" :key="msg._id">
      {{ msg.body }}
    </div>
    <button @click="handleSend">Send</button>
  </div>
</template>
```

**Options API:**

```vue
<script lang="ts">
import { useQuery, useMutation } from "convex/vue";
import { api } from "../convex/_generated/api";

export default {
  setup() {
    const messages = useQuery(api.messages.list);
    const sendMessage = useMutation(api.messages.send);

    return { messages, sendMessage };
  }
};
</script>
```

---

## Svelte Integration

### Installation

```bash
npm install convex-svelte
```

### Setup

**Initialize in layout:**

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { PUBLIC_CONVEX_URL } from '$env/static/public';
  import { setupConvex } from 'convex-svelte';

  const { children } = $props();
  setupConvex(PUBLIC_CONVEX_URL);
</script>

{@render children()}
```

### Using in Components

**Svelte 5 syntax:**

```svelte
<script lang="ts">
  import { useQuery, useMutation } from 'convex-svelte';
  import { api } from '../convex/_generated/api';

  const messages = useQuery(api.messages.list);
  const sendMessage = useMutation(api.messages.send);

  async function handleSend() {
    await sendMessage({
      body: 'Hello!',
      author: 'User'
    });
  }
</script>

{#if $messages === undefined}
  <p>Loading...</p>
{:else}
  <ul>
    {#each $messages as msg}
      <li>{msg.body}</li>
    {/each}
  </ul>
  <button on:click={handleSend}>Send</button>
{/if}
```

---

## TanStack Start Integration

### Installation

```bash
npm create convex@latest -- -t tanstack-start
```

Or add to existing project:

```bash
npm install convex @convex-dev/react-query @tanstack/react-router-with-query @tanstack/react-query
```

### Setup

**Create Convex client:**

```typescript
// app/convex-client.tsx
import { ConvexQueryClient } from "@convex-dev/react-query";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(CONVEX_URL!);
export const convexQueryClient = new ConvexQueryClient(convex);
```

**Configure router:**

```typescript
// app/router.tsx
import { router } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { convexQueryClient } from "./convex-client";

const queryClient = new QueryClient({
  queryCache: convexQueryClient.queryCache,
});

const routerWithProvider = router
  .addContext({
    queryClient,
  })
  .addRoute({
    path: "/",
    component: () => (
      <QueryClientProvider client={queryClient}>
        {/* Your routes */}
      </QueryClientProvider>
    ),
  });

export default routerWithProvider;
```

### Using in Components

```typescript
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const messages = useQuery(api.messages.list);
  const sendMessage = useMutation(api.messages.send);

  return (
    <div>
      {messages?.map((msg) => (
        <div key={msg._id}>{msg.body}</div>
      ))}
      <button onClick={() => sendMessage({ body: "Hi!" })}>
        Send
      </button>
    </div>
  );
}
```

---

## Client API

### ConvexReactClient

**Direct usage:**

```typescript
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(CONVEX_URL);

// Query
const messages = await convex.query(api.messages.list);

// Mutation
const messageId = await convex.mutation(api.messages.send, {
  body: "Hello!",
  author: "User"
});

// Action
const result = await convex.action(api.ai.generate, {
  prompt: "Write code"
});
```

### Subscriptions

**Manual subscription:**

```typescript
import { ConvexClient } from "convex/browser";

const client = new ConvexClient(CONVEX_URL);

// Subscribe to query
const unsubscribe = client.onUpdate(
  api.messages.list,
  {},
  (result) => {
    console.log("Messages updated:", result);
  }
);

// Unsubscribe later
unsubscribe();
```

**Using watchQuery:**

```typescript
const watch = client.watchQuery(api.messages.list, {});

// Get current value
const current = watch.localQueryResult();

// Subscribe to updates
watch.onUpdate((newResult) => {
  console.log("New result:", newResult);
});
```

---

## Real-time Updates

### Automatic Reactivity

Convex automatically updates your UI when data changes:

```typescript
function MessageList() {
  // Automatically re-renders when messages change
  const messages = useQuery(api.messages.list);

  return (
    <div>
      {messages?.map((msg) => (
        <div key={msg._id}>{msg.body}</div>
      ))}
    </div>
  );
}
```

### Optimistic Updates

```typescript
function LikeButton({ messageId }) {
  const like = useMutation(api.messages.like);
  const message = useQuery(api.messages.get, { messageId });

  const handleLike = async () => {
    // Update local state immediately
    const previousLikes = message.likes;

    // Call mutation
    await like({ messageId });

    // Or use optimistic update
    await like({ messageId }, {
      optimistic: { likes: previousLikes + 1 }
    });
  };

  return (
    <button onClick={handleLike}>
      {message?.likes} Likes
    </button>
  );
}
```

---

## Data Preloading

### Server-Side Preloading

**Next.js Server Component:**

```typescript
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function Page() {
  const preloaded = await preloadQuery(api.messages.list);

  return <ClientComponent preloaded={preloaded} />;
}
```

**Client Component:**

```typescript
"use client";

import { usePreloadedQuery } from "convex/react";

export function ClientComponent({ preloaded }) {
  const messages = usePreloadedQuery(preloaded);

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg._id}>{msg.body}</div>
      ))}
    </div>
  );
}
```

### Multiple Queries

```typescript
// Server component
const [messagesPreloaded, usersPreloaded] = await Promise.all([
  preloadQuery(api.messages.list),
  preloadQuery(api.users.list)
]);

return <ChatComponent
  messagesPreloaded={messagesPreloaded}
  usersPreloaded={usersPreloaded}
/>;
```

---

## Best Practices

### Performance

**1. Use data preloading for SSR:**

```typescript
// Faster initial page load
const preloaded = await preloadQuery(api.data.list);
```

**2. Avoid unnecessary re-renders:**

```typescript
// Memoize expensive computations
const sortedMessages = useMemo(() => {
  return messages?.sort((a, b) => b.timestamp - a.timestamp);
}, [messages]);
```

**3. Use pagination:**

```typescript
const page = useQuery(api.messages.paginated, {
  paginationOpts: {
    numItems: 50,
    cursor: null
  }
});
```

### Error Handling

```typescript
function MessageList() {
  const messages = useQuery(api.messages.list);

  if (messages === undefined) {
    return <div>Loading...</div>;
  }

  if (messages === null) {
    return <div>Error loading messages</div>;
  }

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg._id}>{msg.body}</div>
      ))}
    </div>
  );
}
```

### TypeScript Types

```typescript
import type { Preloaded } from "convex/react";

type Message = {
  _id: Id<"messages">;
  body: string;
  author: string;
};

export function Component({
  preloaded
}: {
  preloaded: Preloaded<typeof api.messages.list>
}) {
  const messages = usePreloadedQuery(preloaded);
  // messages is typed as Message[]
}
```

### Authentication

**Wrap authenticated routes:**

```typescript
function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <Dashboard />;
}
```

---

## Advanced Patterns

### Custom Hooks

```typescript
// src/hooks/useMessages.ts
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export function useMessages(channelId: string) {
  const messages = useQuery(api.messages.byChannel, {
    channelId
  });

  const sendMessage = useMutation(api.messages.send);

  const send = useCallback(async (body: string) => {
    await sendMessage({ body, channelId, author: "User" });
  }, [channelId, sendMessage]);

  return {
    messages,
    sendMessage: send,
    isLoading: messages === undefined
  };
}
```

### Context Composition

```typescript
// Combine with other contexts
export function Providers({ children }) {
  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </AuthProvider>
    </ConvexProvider>
  );
}
```

---

## Troubleshooting

### Common Issues

**"Cannot find ConvexProvider"**

Make sure you've wrapped your app with the provider:

```typescript
<ConvexProvider client={convex}>
  <App />
</ConvexProvider>
```

**"Query returns undefined indefinitely"**

Check your Convex URL:

```typescript
console.log(import.meta.env.VITE_CONVEX_URL);
```

**"Type errors with generated API"**

Regenerate types:

```bash
npx convex dev
```

---

**Next: Learn about [Testing Patterns](./convex-context7-research.md#testing-patterns)**
