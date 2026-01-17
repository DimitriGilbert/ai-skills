# OpenTUI SolidJS Components

## Component Basics

SolidJS components are simple functions that return JSX:

```tsx
function Greeting(props: { name: string }) {
  return <text>Hello, {props.name}!</text>
}
```

## Props Destructuring

```tsx
function Button(props: { label: string; onClick: () => void }) {
  const { label, onClick } = props

  return (
    <box onClick={onClick} borderStyle="single">
      <text>{label}</text>
    </box>
  )
}
```

## Default Props

```tsx
function Counter(props: { initial: number }) {
  const [count, setCount] = createSignal(props.initial ?? 0)

  return <text>{count()}</text>
}
```

## Component Lifecycle

### onMount / onCleanup

```tsx
import { onMount, onCleanup } from "solid-js"

function Timer() {
  const [seconds, setSeconds] = createSignal(0)

  onMount(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)

    onCleanup(() => {
      clearInterval(interval)
    })
  })

  return <text>{seconds()}</text>
}
```

### on (Named Lifecycle)

```tsx
import { on } from "solid-js"

function Component() {
  const [active, setActive] = createSignal(false)

  // Run only when active becomes true
  on(active, (isActive) => {
    if (isActive) {
      console.log("Activated!")
    }
  })

  return <text>Active: {active()}</text>
}
```

## Conditional Rendering

### Show Component

```tsx
import { Show } from "solid-js"

function Modal(props: { isOpen: boolean; children: any }) {
  return (
    <Show when={props.isOpen}>
      <box borderStyle="double">
        {props.children}
      </box>
    </Show>
  )
}
```

### Show with Fallback

```tsx
function DataList() {
  const [items, setItems] = createSignal<string[]>([])
  const [loading, setLoading] = createSignal(false)

  return (
    <Show
      when={!loading()}
      fallback={<text>Loading...</text>}
    >
      <For each={items()}>
        {(item) => <text>{item}</text>}
      </For>
    </Show>
  )
}
```

### Switch/Match

```tsx
import { Switch, Match } from "solid-js"

function Status(props: { status: "loading" | "success" | "error" }) {
  return (
    <Switch fallback={<text>Unknown</text>}>
      <Match when={props.status === "loading"}>
        <text>Loading...</text>
      </Match>
      <Match when={props.status === "success"}>
        <text foregroundColor={{ r: 46, g: 204, b: 113 }}>Success!</text>
      </Match>
      <Match when={props.status === "error"}>
        <text foregroundColor={{ r: 231, g: 76, b: 60 }}>Error!</text>
      </Match>
    </Switch>
  )
}
```

## List Rendering

### For Component (Recommended)

```tsx
import { For } from "solid-js"

function List(props: { items: string[] }) {
  return (
    <box flexDirection="column">
      <For each={props.items}>
        {(item, index) => (
          <box>
            <text>{index()}: {item}</text>
          </box>
        )}
      </For>
    </box>
  )
}
```

**Key Points:**
- `For` efficiently updates DOM
- `index()` is a function (signal)
- Items are tracked by reference

### Index Component (Simple Lists)

```tsx
import { Index } from "solid-js"

function SimpleList(props: { items: string[] }) {
  return (
    <box flexDirection="column">
      <Index each={props.items}>
        {(item, index) => (
          <text>{index}: {item()}</text>
        )}
      </Index>
    </box>
  )
}
```

**When to use Index:**
- Lists of primitives (strings, numbers)
- When order doesn't change
- Simpler than `<For>`

## Dynamic Components

```tsx
import { Dynamic } from "solid-js"

function TabContent(props: { component: () => any }) {
  return (
    <box>
      <Dynamic component={props.component} />
    </box>
  )
}

// Usage
<TabContent component={() => <text>Hello</text>} />
```

## Refs

### let with Ref

```tsx
function InputWithRef() {
  let inputRef: any

  const focus = () => {
    inputRef?.focus()
  }

  return (
    <box>
      <input ref={inputRef} placeholder="Focus me" />
      <box onClick={focus}>
        <text>Focus Input</text>
      </box>
    </box>
  )
}
```

### Ref Callbacks

```tsx
function Component() {
  let ref: any

  onMount(() => {
    console.log("Ref mounted:", ref)
  })

  return <box ref={ref}>Content</box>
}
```

## Children

### Passing Children

```tsx
function Card(props: { children: any }) {
  return (
    <box borderStyle="single" padding={1}>
      {props.children}
    </box>
  )
}

// Usage
<Card>
  <text decoration="bold">Title</text>
  <text>Content</text>
</Card>
```

### Children Helper

```tsx
import { children } from "solid-js"

function SafeWrapper(props: { children: any }) {
  const resolved = children(() => props.children)

  return (
    <Show when={resolved()}>
      {resolved()}
    </Show>
  )
}
```

## Composition Patterns

### Render Props

```tsx
function DataLoader(props: {
  render: (data: any) => any
}) {
  const [data] = createResource(async () => {
    const response = await fetch("/api/data")
    return response.json()
  })

  return <Show when={data()}>{props.render}</Show>
}

// Usage
<DataLoader render={(data) => <text>{data.name}</text>} />
```

### Component Slots

```tsx
function Layout(props: {
  header: () => any
  content: () => any
  footer: () => any
}) {
  return (
    <box flexDirection="column" height={30}>
      <box height={3}>{props.header()}</box>
      <box flexGrow={1}>{props.content()}</box>
      <box height={2}>{props.footer()}</box>
    </box>
  )
}

// Usage
<Layout
  header={() => <text>Header</text>}
  content={() => <text>Main</text>}
  footer={() => <text>Footer</text>}
/>
```

## Higher-Order Components

```tsx
function withKeyboard<T>(Component: (props: T) => any) {
  return (props: T) => {
    useKeyboard((key) => {
      if (key.name === "escape") {
        process.exit(0)
      }
    })

    return <Component {...props} />
  }
}

// Usage
const MyComponent = withKeyboard((props: { name: string }) => {
  return <text>{props.name}</text>
})
```

## Component Patterns

### Controlled Component

```tsx
function ControlledInput(props: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <input
      value={props.value}
      onInput={(e) => props.onChange(e.value)}
    />
  )
}
```

### Uncontrolled Component

```tsx
function UncontrolledInput() {
  let ref: any

  const submit = () => {
    console.log("Value:", ref?.getValue())
  }

  return (
    <box>
      <input ref={ref} placeholder="Type something" />
      <box onClick={submit}>
        <text>Submit</text>
      </box>
    </box>
  )
}
```

### Compound Component

```tsx
function Tabs(props: { children: any }) {
  const [activeTab, setActiveTab] = createSignal(0)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {props.children}
    </TabsContext.Provider>
  )
}

function TabList(props: { children: any }) {
  const { activeTab, setActiveTab } = useTabsContext()

  return (
    <box flexDirection="row">
      {props.children((index: number) => setActiveTab(index))}
    </box>
  )
}

function Tab(props: { label: string; index: number }) {
  const { activeTab } = useTabsContext()

  return (
    <box
      borderStyle={activeTab() === props.index ? "double" : "single"}
    >
      <text>{props.label}</text>
    </box>
  )
}

// Usage
<Tabs>
  <TabList>
    {(setActive) => (
      <>
        <Tab label="Tab 1" index={0} />
        <Tab label="Tab 2" index={1} />
      </>
    )}
  </TabList>
</Tabs>
```

## Error Boundaries

```tsx
import { ErrorBoundary } from "solid-js"

function SafeComponent() {
  return (
    <ErrorBoundary
      fallback={(err) => (
        <text foregroundColor={{ r: 231, g: 76, b: 60 }}>
          Error: {err.message}
        </text>
      )}
    >
      <RiskyComponent />
    </ErrorBoundary>
  )
}
```

## Lazy Loading

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

## Reference

- SolidJS Components: https://www.solidjs.com/docs/latest/api#component-apis
- For/Index: https://www.solidjs.com/docs/latest/api#for
- Show/Switch: https://www.solidjs.com/docs/latest/api#show
