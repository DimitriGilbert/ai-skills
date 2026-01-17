# OpenTUI SolidJS Performance

## Fine-Grained Reactivity

SolidJS's key performance advantage is fine-grained reactivity - only what needs to update updates.

### Automatic Granularity

```tsx
function Component() {
  const [state, setState] = createStore({
    user: { name: "Alice", age: 30 },
    items: [1, 2, 3],
  })

  // Only the name text updates, not entire component
  return (
    <box>
      <text>{state.user.name}</text>
      <text>{state.user.age}</text>
      <For each={state.items}>
        {(item) => <text>{item}</text>}
      </For>
    </box>
  )
}
```

## Memoization

### createMemo for Expensive Computations

```tsx
function ExpensiveList() {
  const [items, setItems] = createSignal([...largeArray])

  // Only recalculates when items changes
  const sorted = createMemo(() =>
    items().sort((a, b) => a - b)
  )

  const filtered = createMemo(() =>
    sorted().filter(x => x > 10)
  )

  return <For each={filtered()}>{(item) => <text>{item}</text>}</For>
}
```

### Memo vs Computed

```tsx
// Memo: caches result, only recalculates when dependencies change
const doubled = createMemo(() => count() * 2)

// Computed: always runs on dependency change (no caching)
createComputed(() => {
  console.log("Count:", count())
})
```

## Batch Updates

### Automatic Batching

```tsx
function Component() {
  const [count, setCount] = createSignal(0)
  const [name, setName] = createSignal("Alice")

  const handleClick = () => {
    // Both updates batched automatically
    setCount(1)
    setName("Bob")
    // Only one render
  }

  return <text onClick={handleClick}>{count()} {name()}</text>
}
```

### Manual Batching (if needed)

```tsx
import { batch } from "solid-js"

function updateMultiple() {
  batch(() => {
    setCount(1)
    setName("Bob")
    setActive(true)
  })
  // Single update after batch completes
}
```

## List Optimization

### Use `<For>` for Lists

```tsx
function GoodList() {
  const [items, setItems] = createSignal([1, 2, 3, 4, 5])

  return (
    <For each={items()}>
      {(item, index) => (
        <text>{index()}: {item}</text>
      )}
    </For>
  )
}
```

**Why `<For>` is better:**
- Tracks items by reference
- Only updates changed items
- Efficient reordering
- Better than `.map()`

### Stable Keys

```tsx
function List(props: { items: Array<{ id: string; name: string }> }) {
  return (
    <For each={props.items}>
      {(item) => (
        <text key={item.id}>
          {item.name}
        </text>
      )}
    </For>
  )
}
```

## Store Optimization

### Fine-Grained Store Updates

```tsx
const [state, setState] = createStore({
  items: [
    { id: 1, name: "Item 1", done: false },
    { id: 2, name: "Item 2", done: false },
  ],
})

// Only updates the specific item
setState("items", item => item.id === 1, "done", true)

// Only updates the specific property
setState("items", 0, "name", "Updated")

// Entire component doesn't re-render, just affected text nodes
return (
  <For each={state.items}>
    {(item) => (
      <text decoration={item.done ? "strikethrough" : "none"}>
        {item.name}
      </text>
    )}
  </For>
)
```

### Path-based Updates

```tsx
const [state, setState] = createStore({
  users: {
    byId: {
      "1": { name: "Alice" },
      "2": { name: "Bob" },
    },
    allIds: ["1", "2"],
  },
})

// Efficient nested update
setState("users", "byId", "1", "name", "Alice Updated")
```

## Deferred Updates

### createDeferred (Debounce)

```tsx
import { createDeferred } from "solid-js"

function SearchBox() {
  const [query, setQuery] = createSignal("")
  const deferredQuery = createDeferred(query, { timeoutMs: 500 })

  // Search effect only runs 500ms after query stops changing
  createEffect(() => {
    const q = deferredQuery()
    if (q) {
      console.log("Searching for:", q)
    }
  })

  return <input value={query()} onInput={(e) => setQuery(e.value)} />
}
```

### createTransition (Mark Low-Priority Updates)

```tsx
import { createTransition } from "solid-js"

function Component() {
  const [isPending, startTransition] = createTransition()

  const [filter, setFilter] = createSignal("")
  const [list, setList] = createSignal([])

  const updateFilter = (value: string) => {
    // Immediate update
    setFilter(value)

    // Deferred, interruptible update
    startTransition(() => {
      setList(expensiveFilterOperation(value))
    })
  }

  return (
    <box>
      <input value={filter()} onInput={(e) => updateFilter(e.value)} />
      <Show when={isPending()}>
        <text>Filtering...</text>
      </Show>
    </box>
  )
}
```

## Resource Optimization

### createResource (Async Data)

```tsx
import { createResource } from "solid-js"

function DataComponent() {
  const [data] = createResource(
    () => props.id,
    async (id) => {
      const response = await fetch(`/api/data/${id}`)
      return response.json()
    },
    {
      storage: (init) => {
        // Custom storage (e.g., for caching)
        let value = init
        return [
          () => value,
          (v) => { value = v }
        ] as const
      }
    }
  )

  return <Show when={!data.loading}>{data().name}</Show>
}
```

### Resource Refetching

```tsx
const [data, { refetch }] = createResource(fetchData)

// Manual refetch
const handleRefresh = () => {
  refetch()
}

// Refetch on interval
onMount(() => {
  const interval = setInterval(() => {
    refetch()
  }, 5000)

  onCleanup(() => clearInterval(interval))
})
```

## Untrack (Escape Reactivity)

### Read without Tracking

```tsx
import { untrack } from "solid-js"

function Component() {
  const [count, setCount] = createSignal(0)
  let renderCount = 0

  createEffect(() => {
    // Read count without tracking this effect
    const value = untrack(count)

    renderCount++
    console.log("Effect run", renderCount, "with count", value)
  })

  return <text>{count()}</text>
}
```

**Use cases:**
- Reading values without creating dependency
- Breaking reactive cycles
- Logging/debugging

## Signal Splitting

### Separate Signals for Independent Updates

```tsx
// Bad: single object causes full re-render
const [state, setState] = createSignal({
  count: 0,
  name: "Alice",
  active: false,
})

// Good: separate signals for granular updates
const [count, setCount] = createSignal(0)
const [name, setName] = createSignal("Alice")
const [active, setActive] = createSignal(false)
```

## Lazy Loading

### Code Splitting

```tsx
import { lazy, Suspense } from "solid-js"

const HeavyComponent = lazy(() => import("./HeavyComponent"))

function App() {
  return (
    <Suspense fallback={<text>Loading...</text>}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### Lazy Signal Initialization

```tsx
function createLazySignal<T>(factory: () => T) {
  let initialized = false
  let value: T

  return createSignal(() => {
    if (!initialized) {
      value = factory()
      initialized = true
    }
    return value
  })
}

// Usage
const expensiveData = createLazySignal(() =>
  computeExpensiveInitialValue()
)
```

## Rendering Optimization

### Avoid Inline Functions

```tsx
// Bad: creates new function on each render
<box onClick={() => console.log("clicked")}>

// Good: stable function
const handleClick = () => console.log("clicked")
<box onClick={handleClick}>
```

### useMemo in JSX

```tsx
function Component() {
  const [items, setItems] = createSignal([...])

  const renderItem = (item: any) => {
    // Function defined once
    return <text>{item.name}</text>
  }

  return <For each={items()}>{renderItem}</For>
}
```

## Performance Debugging

### Track Effect Executions

```tsx
let effectRuns = 0

createEffect(() => {
  effectRuns++
  console.log(`Effect run #${effectRuns}`)
  console.log("Count:", count())
})
```

### DevTools

```tsx
import { devhooks } from "solid-devtools"

// Enable devtools tracking
// In browser: https://github.com/thetarnav/solid-devtools
```

### Profiling

```tsx
import { onMount } from "solid-js"

function ProfiledComponent() {
  onMount(() => {
    const start = performance.now()

    onCleanup(() => {
      const end = performance.now()
      console.log("Component lifetime:", end - start, "ms")
    })
  })

  return <text>Content</text>
}
```

## Best Practices

1. **Use `<For>` instead of `.map()`** for lists
2. **Split signals** for independent state
3. **Memo expensive computations** with `createMemo`
4. **Use stores** for complex objects
5. **Lazy load heavy components**
6. **Debounce with `createDeferred`**
7. **Batch updates when needed**
8. **Use `untrack`** to break reactive cycles

## Reference

- SolidJS Performance: https://www.solidjs.com/guides/performance
- createDeferred: https://www.solidjs.com/docs/latest/api#createdeferred
- createResource: https://www.solidjs.com/docs/latest/api#createresource
