# Client Error Handling

## TRPCError Type

```typescript
import type { TRPCError } from "@trpc/client";

const { error } = useQuery(trpc.items.get.queryOptions({ id }));

if (error?.data?.code === "NOT_FOUND") {
  return <div>Item not found</div>;
}

if (error?.data?.code === "UNAUTHORIZED") {
  return <div>Please log in</div>;
}
```

## Error Codes

| Code | Meaning |
|------|----------|
| BAD_REQUEST | Invalid input |
| UNAUTHORIZED | Not logged in |
| FORBIDDEN | No permission |
| NOT_FOUND | Resource missing |
| INTERNAL_SERVER_ERROR | Server error |
| TOO_MANY_REQUESTS | Rate limited |

## Global Error Handling (TanStack Query)

```typescript
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.error("Query error:", error);

      if (error?.data?.code === "UNAUTHORIZED") {
        // Redirect to login
        window.location.href = "/login";
      }
    },
  }),
});
```

## Mutation Error Handling

```typescript
const mutation = useMutation(
  trpc.items.create.mutationOptions({
    onError: (error) => {
      if (error?.data?.code === "BAD_REQUEST") {
        toast.error("Invalid input");
      } else if (error?.data?.code === "UNAUTHORIZED") {
        toast.error("Not logged in");
      } else {
        toast.error("Something went wrong");
      }
    },
  })
);
```
