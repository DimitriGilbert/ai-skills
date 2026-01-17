# Convex Frontend Integration

Comprehensive guide for integrating Convex with frontend frameworks.

## React

### Installation

```bash
npm install convex
```

### Basic Setup

```typescript
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function App({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}
```

### Hooks Reference

```typescript
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../convex/_generated/api";

// Query - auto-subscribes to updates
const messages = useQuery(api.messages.list);
const message = useQuery(api.messages.get, { messageId });
// With undefined check
const messages = useQuery(api.messages.list, { channelId }, {
  onError: (error) => console.error(error)
});

// Mutation
const sendMessage = useMutation(api.messages.send);
const handleSubmit = () => {
  sendMessage({ body: "Hello!", channel: "general" });
};

// Action
const generateSummary = useAction(api.ai.summarize);
```

### Real-time Pagination

```typescript
function PaginatedList() {
  const results = useQuery(api.messages.listPaginated, {
    numItems: 20
  });

  if (!results) return <div>Loading...</div>;

  const { page, continueCursor, loadMore, status } = results;

  return (
    <div>
      {page.map((msg) => <div key={msg._id}>{msg.body}</div>)}
      {continueCursor && (
        <button
          onClick={loadMore}
          disabled={status === "Exhausted" || status === "LoadingMore"}
        >
          Load more
        </button>
      )}
    </div>
  );
}
```

## Next.js

### App Router

**Install:**

```bash
npm install convex
```

**Provider setup:**

```typescript
// app/providers.tsx
"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
```

**Root layout:**

```typescript
// app/layout.tsx
import { ConvexClientProvider } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
```

**Server-side data preloading:**

```typescript
// app/posts/page.tsx
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { PostsClient } from "./PostsClient";

export default async function PostsPage() {
  const preloaded = await preloadQuery(api.posts.list);

  return <PostsClient preloadedPosts={preloaded} />;
}
```

**Client component:**

```typescript
// app/posts/PostsClient.tsx
"use client";

import { usePreloadedQuery } from "convex/react";

export function PostsClient({
  preloadedPosts,
}: {
  preloadedPosts: Preloaded<typeof api.posts.list>;
}) {
  const posts = usePreloadedQuery(preloadedPosts);

  return (
    <div>
      {posts.map((post) => (
        <div key={post._id}>{post.title}</div>
      ))}
    </div>
  );
}
```

### Pages Router

**Provider:**

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

**Server-side rendering:**

```typescript
// pages/index.tsx
import { preloadQuery } from "convex/nextjs";
import { api } from "../convex/_generated/api";
import { Home } from "./Home";

export async function getServerSideProps() {
  const preloaded = await preloadQuery(api.posts.list);
  return { props: { preloaded } };
}
```

## Vue

### Installation

```bash
npm install convex
```

### Setup

```typescript
// main.ts
import { ConvexClient } from "convex/browser";
import { createApp } from "vue";

const convex = new ConvexClient(import.meta.env.VITE_CONVEX_URL);

const app = createApp(App);
app.provide("convex", convex);
app.mount("#app");
```

### Usage

```vue
<script setup lang="ts">
import { useQuery, useMutation } from "convex/vue";
import { api } from "../convex/_generated/api";

const messages = useQuery(api.messages.list);
const sendMessage = useMutation(api.messages.send);

const handleSend = () => {
  sendMessage({ body: "Hello!", channel: "general" });
};
</script>

<template>
  <div>
    <div v-for="msg in messages" :key="msg._id">
      {{ msg.body }}
    </div>
    <button @click="handleSend">Send</button>
  </div>
</template>
```

## Svelte

### Installation

```bash
npm install convex-svelte
```

### Setup

```svelte
<!-- app.svelte -->
<script>
  import { setupConvex } from 'convex-svelte';
  import { PUBLIC_CONVEX_URL } from '$env/static/public';

  setupConvex(PUBLIC_CONVEX_URL);
</script>

<slot />
```

### Usage

```svelte
<script lang="ts">
  import { useQuery, useMutation } from 'convex-svelte';
  import { api } from '../convex/_generated/api';

  const messages = useQuery(api.messages.list);
  const sendMessage = useMutation(api.messages.send);
</script>

{#if $messages}
  {#each $messages as msg}
    <div>{msg.body}</div>
  {/each}
{/if}

<button on:click={() => sendMessage({ body: 'Hello!' })}>
  Send
</button>
```

## React Native

### Installation

```bash
npm install convex react-native-url-polyfill
```

### Setup

```typescript
// App.tsx
import { ConvexProvider, ConvexReactClient } from "convex/react";
import "react-native-url-polyfill/auto";

const convex = new ConvexReactClient(CONVEX_URL);

export default function App() {
  return (
    <ConvexProvider client={convex}>
      <YourApp />
    </ConvexProvider>
  );
}
```

## Environment Variables

### Vite (React, Vue, Svelte)

```bash
# .env
VITE_CONVEX_URL=https://your-project.convex.cloud
```

```typescript
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
```

### Next.js

```bash
# .env.local
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
```

```typescript
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
```

### React Native

```bash
# .env
CONVEX_URL=https://your-project.convex.cloud
```

## Advanced Patterns

### Optimistic Updates

```typescript
function TodoList() {
  const todos = useQuery(api.todos.list) ?? [];
  const addTodo = useMutation(api.todos.create);

  const [pendingTodos, setPendingTodos] = useState<Set<string>>(new Set());

  const handleAdd = async (title: string) => {
    const tempId = `temp-${Date.now()}`;

    // Optimistic update
    setPendingTodos((prev) => new Set(prev).add(tempId));

    try {
      await addTodo({ title });
    } catch {
      // Rollback on error
      setPendingTodos((prev) => {
        const next = new Set(prev);
        next.delete(tempId);
        return next;
      });
    }
  };

  const allTodos = [
    ...todos,
    ...Array.from(pendingTodos).map((id) => ({
      _id: id,
      title: "Saving...",
      _creationTime: Date.now(),
    }))
  ];

  return <ul>{allTodos.map((todo) => <li key={todo._id}>{todo.title}</li>)}</ul>;
}
```

### Custom Hooks

```typescript
function useMessages(channelId: Id<"channels">) {
  const messages = useQuery(api.messages.list, { channelId });
  const sendMessage = useMutation(api.messages.send);

  const send = useCallback(
    (body: string) => {
      sendMessage({ body, channel: channelId });
    },
    [sendMessage, channelId]
  );

  return { messages, send: sendMessage };
}
```

### Error Handling

```typescript
function DataComponent() {
  const posts = useQuery(api.posts.list, {}, {
    onError: (error) => {
      console.error("Query failed:", error);
      // Handle error (show toast, etc.)
    }
  });

  const createPost = useMutation(api.posts.create, {
    onError: (error) => {
      console.error("Mutation failed:", error);
      alert("Failed to create post");
    }
  });

  if (posts === undefined) {
    return <div>Loading...</div>;
  }

  return <div>{/* render posts */}</div>;
}
```
