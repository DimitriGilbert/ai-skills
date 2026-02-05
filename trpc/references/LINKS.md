# Client Links

## httpBatchLink (Batching Requests)

```typescript
import { createTRPCClient, httpBatchLink } from "@trpc/client";

const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      maxURLLength: 2083, // Optional
    }),
  ],
});
```

Batches multiple requests into single HTTP call. Improves performance.

## httpLink (Single Requests)

```typescript
import { createTRPCClient, httpLink } from "@trpc/client";

const client = createTRPCClient<AppRouter>({
  links: [
    httpLink({
      url: "/api/trpc",
    }),
  ],
});
```

Each request is separate HTTP call.

## Split Links (Route by Operation)

```typescript
import { splitLink, httpLink, httpBatchLink } from "@trpc/client";

const client = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === "subscription",
      trueLink: wsLink(), // Subscriptions use WebSocket
      falseLink: httpBatchLink(), // Queries/mutations use HTTP
    }),
  ],
});
```

## Headers

```typescript
httpBatchLink({
  url: "/api/trpc",
  headers: () => ({
    authorization: `Bearer ${getToken()}`,
    "x-custom-header": "value",
  }),
});
```

## Transformer (superjson)

```typescript
import superjson from "superjson";

const client = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: "/api/trpc" })],
  transformer: superjson,
});
```

Enables Date, Map, Set, and other complex types serialization.
