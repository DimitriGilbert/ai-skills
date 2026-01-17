# OpenTUI SolidJS Integration Guide

## Setup

### Installation

```bash
# Core dependencies
bun install @opentui/core @opentui/solid solid-js

# TypeScript types
bun install --save-dev @types/node
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "strict": true,
    "types": ["node", "solid-js"],
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Basic Renderer Setup

```tsx
import { createCliRenderer } from "@opentui/core"
import { createRoot } from "@opentui/solid"
import { render } from "solid-js/web"

function App() {
  return <text>Hello, OpenTUI + SolidJS!</text>
}

async function main() {
  const renderer = await createCliRenderer()
  createRoot(renderer, (root) => {
    root.render(() => <App />)
  })
}

main()
```

## Project Structure

### Recommended Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   └── Sidebar.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   └── features/
│       ├── auth/
│       └── dashboard/
├── stores/
│   └── useStore.ts
├── hooks/
│   ├── useKeyboard.ts
│   └── useNavigation.ts
├── utils/
│   └── helpers.ts
├── App.tsx
└── main.tsx
```

## Integrating with Build Tools

### Vite Configuration

```tsx
// vite.config.ts
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [solidPlugin()],
  clearScreen: false,
  server: {
    watch: {
      usePolling: true,
    },
  },
})
```

### Entry Point

```tsx
// src/main.tsx
import { createCliRenderer } from "@opentui/core"
import { createRoot } from "@opentui/solid"
import { dev } from "solid-js/web"
import App from "./App"

async function main() {
  const renderer = await createCliRenderer()

  // Use dev() in development for hot reload
  if (import.meta.env.DEV) {
    const root = createRoot(renderer)
    dev(() => root.render(() => <App />))
  } else {
    const root = createRoot(renderer)
    root.render(() => <App />)
  }
}

main()
```

## Component Patterns

### Component with Props

```tsx
// components/ui/Button.tsx
interface ButtonProps {
  label: string
  onClick?: () => void
  variant?: "primary" | "secondary"
}

export function Button(props: ButtonProps) {
  const styles = {
    primary: {
      backgroundColor: { r: 100, g: 149, b: 237 },
      foregroundColor: { r: 255, g: 255, b: 255 },
    },
    secondary: {
      backgroundColor: { r: 50, g: 50, b: 50 },
      foregroundColor: { r: 255, g: 255, b: 255 },
    },
  }

  const variant = props.variant ?? "primary"
  const style = styles[variant]

  return (
    <box
      onClick={props.onClick}
      borderStyle="single"
      padding={1}
      {...style}
    >
      <text>{props.label}</text>
    </box>
  )
}
```

### Compound Components

```tsx
// components/ui/Tabs.tsx
import { createContext, useContext } from "solid-js"

interface TabsContextValue {
  activeTab: () => number
  setActiveTab: (index: number) => void
}

const TabsContext = createContext<TabsContextValue>()

export function Tabs(props: { children: any; defaultIndex?: number }) {
  const [activeTab, setActiveTab] = createSignal(props.defaultIndex ?? 0)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {props.children}
    </TabsContext.Provider>
  )
}

export function TabList(props: { children: any }) {
  return <box flexDirection="row">{props.children}</box>
}

export function Tab(props: { label: string; index: number }) {
  const { activeTab, setActiveTab } = useContext(TabsContext)!

  return (
    <box
      borderStyle={activeTab() === props.index ? "double" : "single"}
      onClick={() => setActiveTab(props.index)}
    >
      <text>{props.label}</text>
    </box>
  )
}

export function TabPanel(props: { index: number; children: any }) {
  const { activeTab } = useContext(TabsContext)!

  return (
    <Show when={activeTab() === props.index}>
      <box padding={1}>{props.children}</box>
    </Show>
  )
}
```

## State Management Integration

### Zustand Integration

```bash
bun install zustand
```

```tsx
// stores/useStore.ts
import { createStore } from "zustand/vanilla"
import { createViaContext } from "zustand/solid"

const store = createStore((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))

export const useStore = createViaContext(store)

// Provider setup
export function StoreProvider(props: { children: any }) {
  return (
    <StoreProviderForZustand store={store}>
      {props.children}
    </StoreProviderForZustand>
  )
}

// Usage in component
function Counter() {
  const count = useStore((state) => state.count)
  const increment = useStore((state) => state.increment)

  return (
    <box>
      <text>{count()}</text>
      <box onClick={increment}>
        <text>+</text>
      </box>
    </box>
  )
}
```

## Routing Integration

### Simple Hash Router

```tsx
// router/createRouter.ts
import { createSignal, createContext, useContext } from "solid-js"

interface RouterContextValue {
  path: () => string
  navigate: (path: string) => void
}

const RouterContext = createContext<RouterContextValue>()

export function Router(props: { children: any }) {
  const [path, setPath] = createSignal(window.location.hash.slice(1) || "/")

  const navigate = (newPath: string) => {
    window.location.hash = newPath
    setPath(newPath)
  }

  window.addEventListener("hashchange", () => {
    setPath(window.location.hash.slice(1) || "/")
  })

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {props.children}
    </RouterContext.Provider>
  )
}

export function Route(props: { path: string; component: () => any }) {
  const { path } = useContext(RouterContext)!

  return (
    <Show when={path() === props.path}>
      <props.component />
    </Show>
  )
}

export function useRouter() {
  return useContext(RouterContext)!
}
```

## Testing Integration

### Vitest Setup

```tsx
// vitest.config.ts
import { defineConfig } from "vitest/config"
import solidPlugin from "vite-plugin-solid"

export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    environment: "jsdom",
  },
})
```

### Component Test

```tsx
import { render, screen } from "solid-testing-library"
import { describe, it, expect } from "vitest"
import { Button } from "./Button"

describe("Button", () => {
  it("should render label", () => {
    render(() => <Button label="Click me" />)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("should call onClick", async () => {
    let clicked = false
    render(() => (
      <Button label="Click me" onClick={() => (clicked = true)} />
    ))

    const button = screen.getByRole("button")
    button.click()
    expect(clicked).toBe(true)
  })
})
```

## Error Handling

### Error Boundaries

```tsx
import { ErrorBoundary } from "solid-js"

export function SafeComponent(props: { children: any }) {
  return (
    <ErrorBoundary
      fallback={(err) => (
        <box borderStyle="double" padding={2}>
          <text decoration="bold">Error:</text>
          <text>{err.message}</text>
          <text>Press Ctrl+C to exit</text>
        </box>
      )}
    >
      {props.children}
    </ErrorBoundary>
  )
}
```

## Debugging Integration

### DevTools

```bash
bun install solid-devtools
```

```tsx
// main.tsx
import { Devtools } from "solid-devtools"

function App() {
  return (
    <>
      <YourApp />
      <Devtools />
    </>
  )
}
```

### Console Overlay

```tsx
import { consoleOverlay } from "@opentui/core"

async function main() {
  const renderer = await createCliRenderer()

  // Enable debug console
  renderer.attach(consoleOverlay())

  // Now console.log() appears in terminal
  console.log("Debug mode enabled")

  const root = createRoot(renderer)
  root.render(() => <App />)
}
```

## Hot Module Replacement

### Vite HMR

```tsx
// main.tsx
import { createCliRenderer } from "@opentui/core"
import { createRoot, dev } from "solid-js/web"
import App from "./App"

async function main() {
  const renderer = await createCliRenderer()

  if (import.meta.env.DEV) {
    // Enable hot reload
    const root = createRoot(renderer, (dispose) => {
      // Dispose on HMR
      if (import.meta.hot) {
        import.meta.hot.accept dispose
      }
    })

    dev(() => root.render(() => <App />))
  } else {
    const root = createRoot(renderer)
    root.render(() => <App />)
  }
}

main()
```

## Production Build

### Build Configuration

```tsx
// vite.config.ts
export default defineConfig({
  build: {
    target: "node18",
    lib: {
      entry: "src/main.tsx",
      formats: ["es"],
    },
  },
})
```

### Running Production Build

```bash
# Build
bun run build

# Run
node dist/main.js
```

## Environment Variables

```tsx
// .env
VITE_API_URL=https://api.example.com
VITE_DEBUG=true
```

```tsx
// Access in code
const apiUrl = import.meta.env.VITE_API_URL
const isDebug = import.meta.env.VITE_DEBUG === "true"
```

## Reference

- SolidJS Docs: https://www.solidjs.com/docs
- OpenTUI Solid: https://github.com/sst/opentui/tree/main/packages/solid
- Vite Plugin: https://github.com/solidjs/vite-plugin-solid
