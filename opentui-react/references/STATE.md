# OpenTUI React State Management

## Local State (useState)

For component-local state, use React's built-in `useState`:

```tsx
import { useState } from "react"

function Counter() {
  const [count, setCount] = useState(0)

  useKeyboard((key) => {
    if (key.name === "up") setCount(c => c + 1)
    if (key.name === "down") setCount(c => c - 1)
  })

  return <text>Count: {count}</text>
}
```

## Context API

For sharing state across components:

```tsx
import { createContext, useContext, useState } from "react"

// Create context
const AppContext = createContext<any>(null)

// Provider component
function AppProvider({ children }: { children: any }) {
  const [theme, setTheme] = useState("dark")
  const [user, setUser] = useState(null)

  return (
    <AppContext.Provider value={{ theme, setTheme, user, setUser }}>
      {children}
    </AppContext.Provider>
  )
}

// Custom hook to use context
function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider")
  }
  return context
}

// Usage in components
function ThemedComponent() {
  const { theme, setTheme } = useAppContext()

  return (
    <box
      backgroundColor={theme === "dark" ? { r: 30, g: 30, b: 30 } : { r: 255, g: 255, b: 255 }}
    >
      <text>Current theme: {theme}</text>
    </box>
  )
}
```

## Redux Integration

### Setup

```bash
bun install @reduxjs/toolkit react-redux
```

### Configure Store

```tsx
import { configureStore, createSlice } from "@reduxjs/toolkit"

// Create slice
const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions
export const counterReducer = counterSlice.reducer

// Configure store
export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
})

// Type definitions
type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch
```

### Provider Setup

```tsx
import { Provider } from "react-redux"
import { store } from "./store"

function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  )
}
```

### Using Redux in Components

```tsx
import { useSelector, useDispatch } from "react-redux"
import { increment, decrement, incrementByAmount } from "./store"

function Counter() {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()

  useKeyboard((key) => {
    if (key.name === "up") dispatch(increment())
    if (key.name === "down") dispatch(decrement())
    if (key.name === "right") dispatch(incrementByAmount(10))
  })

  return (
    <box>
      <text>Count: {count}</text>
      <text>Arrow keys to change</text>
    </box>
  )
}
```

## Zustand Integration

### Setup

```bash
bun install zustand
```

### Create Store

```tsx
import { create } from "zustand"

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  incrementByAmount: (amount: number) => void
}

const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  incrementByAmount: (amount) => set((state) => ({ count: state.count + amount })),
}))
```

### Use Store in Components

```tsx
function Counter() {
  const { count, increment, decrement, incrementByAmount } = useCounterStore()

  useKeyboard((key) => {
    if (key.name === "up") increment()
    if (key.name === "down") decrement()
    if (key.name === "right") incrementByAmount(10)
  })

  return (
    <box>
      <text>Count: {count}</text>
    </box>
  )
}
```

### With DevTools

```tsx
import { create } from "zustand"
import { devtools } from "zustand/middleware"

const useCounterStore = create<CounterState>()(
  devtools((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
  }))
)
```

## Jotai Integration

### Setup

```bash
bun install jotai
```

### Create Atoms

```tsx
import { atom, useAtom } from "jotai"

// Primitive atom
const countAtom = atom(0)

// Read-only derived atom
const doubleCountAtom = atom((get) => get(countAtom) * 2)

// Read-write derived atom
const countWithStepsAtom = atom(
  (get) => get(countAtom),
  (get, set, newValue: number) => {
    set(countAtom, Math.floor(newValue / 10) * 10)
  }
)
```

### Use Atoms in Components

```tsx
function Counter() {
  const [count, setCount] = useAtom(countAtom)
  const [doubleCount] = useAtom(doubleCountAtom)

  useKeyboard((key) => {
    if (key.name === "up") setCount(c => c + 1)
    if (key.name === "down") setCount(c => c - 1)
  })

  return (
    <box>
      <text>Count: {count}</text>
      <text>Double: {doubleCount}</text>
    </box>
  )
}
```

## React Query Integration

### Setup

```bash
bun install @tanstack/react-query
```

### Configure Query Client

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DataList />
    </QueryClientProvider>
  )
}
```

### Fetch Data

```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

async function fetchItems() {
  const response = await fetch("https://api.example.com/items")
  return response.json()
}

function DataList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
  })

  if (isLoading) return <text>Loading...</text>
  if (error) return <text>Error: {error.message}</text>

  return (
    <scrollbox>
      {data.map((item: any) => (
        <text key={item.id}>{item.name}</text>
      ))}
    </scrollbox>
  )
}
```

## Focus Management State

### Managing Focus Across Components

```tsx
// Focus context
const FocusContext = createContext<any>(null)

function FocusProvider({ children }: { children: any }) {
  const [focusedComponent, setFocusedComponent] = useState<string | null>(null)

  const register = (id: string) => {
    if (!focusedComponent) {
      setFocusedComponent(id)
    }
  }

  const focus = (id: string) => {
    setFocusedComponent(id)
  }

  return (
    <FocusContext.Provider value={{ focusedComponent, register, focus }}>
      {children}
    </FocusContext.Provider>
  )
}

// Focusable component
function FocusableBox({ id, children }: any) {
  const { focusedComponent, register, focus } = useContext(FocusContext)

  useEffect(() => {
    register(id)
  }, [id, register])

  const isFocused = focusedComponent === id

  useKeyboard((key) => {
    if (!isFocused) return
    // Handle keyboard when focused
  })

  return (
    <box
      borderStyle={isFocused ? "double" : "single"}
      onClick={() => focus(id)}
    >
      {children}
    </box>
  )
}
```

## Form State Management

### React Hook Form Integration

```bash
bun install react-hook-form
```

```tsx
import { useForm } from "react-hook-form"

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
  })

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <box flexDirection="column" gap={1}>
      <input
        {...register("name", { required: "Name is required" })}
        placeholder="Name"
      />
      {errors.name && (
        <text foregroundColor={{ r: 231, g: 76, b: 60 }}>
          {errors.name.message}
        </text>
      )}

      <input
        {...register("email", { required: "Email is required" })}
        placeholder="Email"
      />
      {errors.email && (
        <text foregroundColor={{ r: 231, g: 76, b: 60 }}>
          {errors.email.message}
        </text>
      )}

      <box onClick={handleSubmit(onSubmit)}>
        <text>Submit</text>
      </box>
    </box>
  )
}
```

## Async State Patterns

### Async Actions with useState

```tsx
function AsyncComponent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("https://api.example.com/data")
      const json = await response.json()
      setData(json)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useKeyboard((key) => {
    if (key.name === "r" && key.ctrl) {
      fetchData()
    }
  })

  if (loading) return <text>Loading...</text>
  if (error) return <text>Error: {error}</text>

  return (
    <box>
      <text>Data: {JSON.stringify(data)}</text>
      <text>Press Ctrl+R to refresh</text>
    </box>
  )
}
```

## Reference

- Redux Toolkit: https://redux-toolkit.js.org/
- Zustand: https://zustand-demo.pmnd.rs/
- Jotai: https://jotai.org/
- React Query: https://tanstack.com/query/latest
