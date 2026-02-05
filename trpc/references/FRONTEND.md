# Frontend Patterns

## Query with States

```typescript
const { data, isLoading, error } = useQuery(
  trpc.items.list.queryOptions({ limit: 20 })
);

if (isLoading) return <Loading />;
if (error) return <Error error={error} />;
return <Display data={data} />;
```

## Mutation

```typescript
const mutation = useMutation(trpc.items.create.mutationOptions());
mutation.mutate({ name: "Item" });
```

## Invalidation

```typescript
const queryClient = useQueryClient();
const mutation = useMutation(
  trpc.items.update.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.items.list.queryKey(),
      });
    },
  })
);
```

## Infinite Scroll

```typescript
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery(
  trpc.items.list.queryOptions(),
  {
    getNextPageParam: (last) => last.nextCursor,
  }
);
```

## Conditional Query

```typescript
const { data } = useQuery(
  trpc.user.get.queryOptions({ id }),
  { enabled: !!id }
);
```
