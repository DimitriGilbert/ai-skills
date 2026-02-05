# Subscriptions

## Pattern

Async generator with AbortSignal:

```typescript
onEvent: publicProcedure
  .input(z.object({ id: z.string().optional() }))
  .subscription(async function* (opts) {
    const controller = new AbortController();
    const signal = controller.signal;

    if (opts.signal) {
      opts.signal.addEventListener('abort', () => controller.abort());
    }

    const queue: Event[] = [];
    const unsubscribe = subscribeToEvents((event) => queue.push(event));

    try {
      while (!signal.aborted) {
        if (queue.length > 0) {
          const event = queue.shift();
          if (event) yield event;
        }
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    } finally {
      unsubscribe();
    }
  }),
```

## Key Points

- `opts.signal` is client abort signal
- Create local AbortController for cleanup
- Always call unsubscribe in finally block
- Use queue to buffer events
