# OpenTUI SolidJS Signals & Reactivity

## Signals (Core Primitive)

Signals are the foundation of SolidJS reactivity.

### Creating Signals

```tsx
import { createSignal } from "solid-js"

function Counter() {
  const [count, setCount] = createSignal(0)

  return (
    <box>
      <text>Count: {count()}</text>
    </box>
  )
}
```

**Returns:** `[getter, setter]` tuple

### Reading Signals

```tsx
const count = createSignal(0)

// In JSX: automatic tracking
<text>{count()}</text>

// In effects: automatic tracking
createEffect(() => {
  console.log(count())
})

// In computed values: automatic tracking
const doubled = createMemo(() => count() * 2)
```

### Writing Signals

```tsx
const [count, setCount] = createSignal(0)

// Set value
setCount(5)

// Update from previous value
setCount(c => c + 1)

// Set multiple times (only triggers effect once)
setCount(1)
setCount(2)
setCount(3)
```

## Signal Types

### Primitive Signals

```tsx
const [text, setText] = createSignal("hello")
const [number, setNumber] = createSignal(42)
const [bool, setBool] = createSignal(true)
```

### Object Signals

```tsx
const [user, setUser] = createSignal({
  name: "Alice",
  age: 30,
})

// Update entire object
setUser({ name: "Bob", age: 25 })

// Update property (triggers reactivity)
setUser(u => ({ ...u, name: "Charlie" }))
```

### Array Signals

```tsx
const [items, setItems] = createSignal([1, 2, 3])

// Replace array
setItems([4, 5, 6])

// Append
setItems(items => [...items, 4])

// Filter
setItems(items => items.filter(x => x > 1))

// Update specific index
setItems(items => {
  const newItems = [...items]
  newItems[0] = 99
  return newItems
})
```

## Derived Signals (Memo)

### createMemo

Derive values that only update when dependencies change:

```tsx
import { createMemo } from "solid-js"

function PriceCalculator(props: { price: number, tax: number }) {
  const subtotal = createMemo(() => props.price)
  const tax = createMemo(() => subtotal() * props.tax)
  const total = createMemo(() => subtotal() + tax())

  return (
    <box flexDirection="column">
      <text>Subtotal: ${subtotal()}</text>
      <text>Tax: ${tax()}</text>
      <text>Total: ${total()}</text>
    </box>
  )
}
```

**Key Points:**
- Only recalculates when dependencies change
- Caches result
- Lazy evaluation (only computed when accessed)

### Memo vs Effect

```tsx
// Memo: returns a value
const doubled = createMemo(() => count() * 2)

// Effect: side effects only (no return value)
createEffect(() => {
  console.log("Count changed:", count())
})
```

## Effects (createEffect)

### Basic Effect

```tsx
import { createEffect } from "solid-js"

function Logger() {
  const [count, setCount] = createSignal(0)

  createEffect(() => {
    console.log("Count is now:", count())
  })

  return <text>{count()}</text>
}
```

### Effect with Multiple Dependencies

```tsx
const [firstName, setFirstName] = createSignal("John")
const [lastName, setLastName] = createSignal("Doe")

createEffect(() => {
  // Automatically tracks both signals
  const fullName = `${firstName()} ${lastName()}`
  console.log("Full name:", fullName)
})
```

### Effect Cleanup

```tsx
createEffect((cleanup) => {
  const interval = setInterval(() => {
    console.log("Tick")
  }, 1000)

  // Cleanup function
  cleanup(() => {
    clearInterval(interval)
  })
})
```

### onCleanup (Explicit)

```tsx
import { onCleanup } from "solid-js"

function Component() {
  const [active, setActive] = createSignal(true)

  createEffect(() => {
    if (!active()) return

    const timer = setTimeout(() => {
      console.log("Timer fired")
    }, 1000)

    onCleanup(() => {
      clearTimeout(timer)
    })
  })

  return <text>Active: {active()}</text>
}
```

## Stores (Fine-Grained Reactivity)

### createStore

For object/array state with fine-grained updates:

```tsx
import { createStore } from "solid-js/store"

function TodoList() {
  const [todos, setTodos] = createStore({
    items: [
      { id: 1, text: "Learn SolidJS", done: false },
      { id: 2, text: "Build TUI", done: false },
    ],
    filter: "all",
  })

  const addTodo = (text: string) => {
    setTodos("items", items => [
      ...items,
      { id: Date.now(), text, done: false },
    ])
  }

  const toggleTodo = (id: number) => {
    setTodos(
      "items",
      item => item.id === id,
      "done",
      done => !done
    )
  }

  return (
    <box flexDirection="column">
      <For each={todos.items}>
        {(todo) => (
          <box>
            <text>
              {todo.done ? "✓" : " "} {todo.text}
            </text>
          </box>
        )}
      </For>
    </box>
  )
}
```

### Nested Updates

```tsx
const [state, setState] = createStore({
  user: {
    profile: {
      name: "Alice",
      age: 30,
    },
  },
})

// Update nested property
setState("user", "profile", "name", "Bob")

// Update with function
setState("user", "profile", "age", age => age + 1)
```

### produce (Immutability Helper)

```tsx
import { produce } from "solid-js/store"

const [items, setItems] = createStore([1, 2, 3, 4, 5])

setItems(produce(items => {
  // Mutate directly in callback
  items.push(6)
  items[0] = 99
  items.splice(2, 1)
}))
```

## Reactive Utilities

### createResource (Async Data)

```tsx
import { createResource } from "solid-js"

async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

function UserProfile(props: { userId: string }) {
  const [user] = createResource(props.userId, fetchUser)

  return (
    <Show when={!user.loading} fallback={<text>Loading...</text>}>
      <text>Name: {user().name}</text>
      <text>Email: {user().email}</text>
    </Show>
  )
}
```

### createDeferred (Debounce Updates)

```tsx
import { createDeferred } from "solid-js"

function SearchBox() {
  const [query, setQuery] = createSignal("")
  const deferredQuery = createDeferred(query, { timeoutMs: 500 })

  createEffect(() => {
    // Only runs 500ms after query stops changing
    console.log("Search:", deferredQuery())
  })

  return <input value={query()} onInput={(e) => setQuery(e.value)} />
}
```

### createComputed (Always Running)

```tsx
// Runs immediately and on every dependency change
const count = createSignal(0)

createComputed(() => {
  console.log("Count is:", count())
})
```

## Lifecycle with Signals

### onMount

```tsx
import { onMount } from "solid-js"

function Component() {
  const [data, setData] = createSignal(null)

  onMount(async () => {
    const response = await fetch("/api/data")
    setData(await response.json())
  })

  return <text>{JSON.stringify(data())}</text>
}
```

### onCleanup (Component Level)

```tsx
function Timer() {
  const [seconds, setSeconds] = createSignal(0)

  let interval: NodeJS.Timeout

  onMount(() => {
    interval = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)
  })

  onCleanup(() => {
    clearInterval(interval)
  })

  return <text>Seconds: {seconds()}</text>
}
```

## Signal Patterns

### Computed State

```tsx
function ShoppingCart() {
  const [items, setItems] = createStore({
    products: [] as Array<{ price: number }>,
  })

  const subtotal = createMemo(() =>
    items.products.reduce((sum, item) => sum + item.price, 0)
  )

  const tax = createMemo(() => subtotal() * 0.1)

  const total = createMemo(() => subtotal() + tax())

  return (
    <box flexDirection="column">
      <text>Subtotal: ${subtotal()}</text>
      <text>Tax: ${tax()}</text>
      <text>Total: ${total()}</text>
    </box>
  )
}
```

### Local Storage Sync

```tsx
function createStoredSignal<T>(key: string, initialValue: T) {
  const stored = localStorage.getItem(key)
  const [signal, setSignal] = createSignal<T>(
    stored ? JSON.parse(stored) : initialValue
  )

  createEffect(() => {
    localStorage.setItem(key, JSON.stringify(signal()))
  })

  return [signal, setSignal] as const
}

// Usage
function Settings() {
  const [theme, setTheme] = createStoredSignal("theme", "dark")

  return <text>Theme: {theme()}</text>
}
```

### Undo/Redo History

```tsx
function createHistorySignal<T>(initialValue: T) {
  const [value, setValue] = createSignal<T>(initialValue)
  const [past, setPast] = createSignal<T[]>([])
  const [future, setFuture] = createSignal<T[]>([])

  const undo = () => {
    const current = value()
    const previous = past().slice(-1)[0]

    if (previous !== undefined) {
      setValue(previous)
      setPast(p => p.slice(0, -1))
      setFuture(f => [...f, current])
    }
  }

  const redo = () => {
    const current = value()
    const next = future().slice(-1)[0]

    if (next !== undefined) {
      setValue(next)
      setFuture(f => f.slice(0, -1))
      setPast(p => [...p, current])
    }
  }

  const setValueWithHistory = (newValue: T) => {
    setPast(p => [...p, value()])
    setValue(newValue)
    setFuture([])
  }

  return [value, setValueWithHistory, { undo, redo, canUndo: () => past().length > 0, canRedo: () => future().length > 0 }] as const
}
```

## Performance Tips

1. **Use createMemo for expensive computations**
2. **Batch updates to avoid unnecessary re-renders**
3. **Use createStore for complex objects**
4. **Clean up effects properly**
5. **Avoid creating signals in loops**

## Reference

- SolidJS Reactivity: https://www.solidjs.com/docs/latest/api#reactivity
- createStore: https://www.solidjs.com/docs/latest/api#store
- createResource: https://www.solidjs.com/docs/latest/api#server-functions
