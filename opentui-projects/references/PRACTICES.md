# OpenTUI Best Practices

## Project Structure

### Recommended Directory Layout

```
my-opentui-app/
├── src/
│   ├── main.tsx                 # Entry point
│   ├── app/                     # Application components
│   │   ├── App.tsx
│   │   └── layout/
│   │       ├── AppShell.tsx
│   │       ├── Sidebar.tsx
│   │       └── Header.tsx
│   ├── components/              # Reusable components
│   │   ├── ui/                  # Basic UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Modal.tsx
│   │   └── features/            # Feature-specific components
│   │       └── auth/
│   │           └── LoginForm.tsx
│   ├── hooks/                   # Custom hooks (React/SolidJS)
│   │   ├── useKeyboard.ts
│   │   └── useNavigation.ts
│   ├── stores/                  # State management
│   │   └── useStore.ts
│   ├── utils/                   # Helper functions
│   │   ├── logger.ts
│   │   └── helpers.ts
│   ├── types/                   # TypeScript types
│   │   └── index.ts
│   └── constants/               # Constants
│       └── keys.ts
├── tests/                       # Tests
│   ├── unit/
│   └── integration/
├── package.json
├── tsconfig.json
└── README.md
```

## Code Organization

### File Naming

**Components:** PascalCase
```
Button.tsx
Modal.tsx
UserProfile.tsx
```

**Hooks:** camelCase with 'use' prefix
```
useKeyboard.ts
useNavigation.ts
useForm.ts
```

**Utils:** camelCase
```
logger.ts
formatDate.ts
```

### Component Structure

**Recommended order:**
1. Imports
2. Types/Interfaces
3. Constants
4. Component function
5. Helper functions (inside or outside)

```tsx
// 1. Imports
import { BoxRenderable, TextRenderable } from "@opentui/core"
import { useKeyboard } from "@opentui/react"

// 2. Types
interface ButtonProps {
  label: string
  onClick?: () => void
}

// 3. Component
export function Button(props: ButtonProps) {
  // Component logic
  const handleClick = () => {
    props.onClick?.()
  }

  return (
    <box onClick={handleClick}>
      <text>{props.label}</text>
    </box>
  )
}
```

## Styling Best Practices

### Use Theme Objects

```tsx
// constants/theme.ts
export const theme = {
  colors: {
    primary: { r: 100, g: 149, b: 237 },
    secondary: { r: 50, g: 50, b: 50 },
    success: { r: 46, g: 204, b: 113 },
    danger: { r: 231, g: 76, b: 60 },
  },
  spacing: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
  },
}

// Usage
import { theme } from "./constants/theme"

<box
  backgroundColor={theme.colors.primary}
  padding={theme.spacing.md}
>
```

### Consistent Style Props

```tsx
// Good: reusable style function
const cardStyle = () => ({
  borderStyle: "single" as const,
  backgroundColor: theme.colors.secondary,
  padding: theme.spacing.sm,
})

// Usage
<box style={cardStyle()}>

// Bad: inline styles everywhere
<box borderStyle="single" backgroundColor={{r:50,g:50,b:50}} padding={2}>
```

### Style Utilities

```tsx
// utils/styles.ts
export const styles = {
  card: (variant: "primary" | "secondary") => ({
    borderStyle: "single" as const,
    backgroundColor:
      variant === "primary"
        ? theme.colors.primary
        : theme.colors.secondary,
    padding: theme.spacing.sm,
  }),

  button: (size: "sm" | "md" | "lg") => ({
    padding: size === "sm" ? 1 : size === "md" ? 2 : 3,
  }),
}
```

## State Management

### Choose the Right Tool

| Need | Solution |
|------|----------|
| Local component state | useState / createSignal |
| Parent-child state | Props / Context |
| Complex app state | Zustand / Redux |
| Server state | React Query / createResource |
| Form state | React Hook Form / Stores |

### State Organization

```tsx
// stores/useStore.ts (Zustand example)
import { create } from "zustand"

interface AppState {
  // UI state
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void

  // Data state
  users: User[]
  fetchUsers: () => Promise<void>

  // View state
  currentView: "dashboard" | "settings"
  setCurrentView: (view: "dashboard" | "settings") => void
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  sidebarOpen: true,
  users: [],
  currentView: "dashboard",

  // Actions
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  fetchUsers: async () => {
    const users = await api.getUsers()
    set({ users })
  },

  setCurrentView: (view) => set({ currentView: view }),
}))
```

## Error Handling

### Error Boundaries (React)

```tsx
// components/ErrorBoundary.tsx
import { ErrorBoundary } from "solid-js" // or React equivalent

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

### Try-Catch in Async

```tsx
async function loadData() {
  try {
    const data = await fetch("/api/data")
    return await data.json()
  } catch (error) {
    console.error("Failed to load data:", error)
    // Show error to user
    showError("Failed to load data")
  }
}
```

## Performance

### Memoization

```tsx
// Good: memoize expensive computation
const sortedList = createMemo(() =>
  items().sort((a, b) => a.name.localeCompare(b.name))
)

// Bad: recompute on every render
const sortedList = items().sort((a, b) => a.name.localeCompare(b.name))
```

### List Rendering

```tsx
// Good: Use <For> in SolidJS
<For each={items()}>
  {(item) => <text>{item.name}</text>}
</For>

// Good: Use key prop in React
{items().map((item) => (
  <text key={item.id}>{item.name}</text>
))}
```

### Avoid Unnecessary Re-renders

```tsx
// Good: Split into separate components
function List() {
  const [items] = useStore(state => state.items)

  return (
    <For each={items}>
      {(item) => <ListItem item={item} />}
    </For>
  )
}

function ListItem(props: { item: any }) {
  // Only re-renders when props.item changes
  return <text>{props.item.name}</text>
}
```

## Testing

### Test Structure

```
tests/
├── unit/
│   ├── components/
│   │   └── Button.test.tsx
│   └── utils/
│       └── formatDate.test.ts
└── integration/
    └── LoginForm.test.tsx
```

### Test Naming

```tsx
describe("Button", () => {
  it("should render label", () => {
    // Test
  })

  it("should call onClick when clicked", () => {
    // Test
  })

  it("should not call onClick when disabled", () => {
    // Test
  })
})
```

### Test Best Practices

1. **Test user behavior, not implementation**
2. **One assertion per test when possible**
3. **Use descriptive test names**
4. **Mock external dependencies**
5. **Test edge cases**

## Documentation

### Component Documentation

```tsx
/**
 * Button component for user actions
 *
 * @param label - Text to display on button
 * @param onClick - Callback when button is clicked
 * @param variant - Visual style variant
 *
 * @example
 * ```tsx
 * <Button
 *   label="Submit"
 *   onClick={() => console.log("clicked")}
 *   variant="primary"
 * />
 * ```
 */
export function Button(props: ButtonProps) {
  // ...
}
```

### README Structure

```markdown
# My OpenTUI App

## Description
Brief description of what the app does

## Installation
\`\`\`bash
bun install
\`\`\`

## Usage
\`\`\`bash
bun run start
\`\`\`

## Features
- Feature 1
- Feature 2

## Keyboard Shortcuts
- Ctrl+C - Exit
- Ctrl+S - Save

## Development
\`\`\`bash
bun run dev
\`\`\`
```

## Git Practices

### Commit Messages

```
feat: add user authentication
fix: resolve layout issue on small terminals
docs: update installation guide
refactor: simplify form handling
test: add tests for Button component
```

### .gitignore

```
node_modules/
dist/
.env
.DS_Store
*.log
```

## Deployment

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "bun run src/main.tsx",
    "build": "tsc",
    "start": "node dist/main.js",
    "test": "vitest",
    "lint": "eslint src/",
    "format": "prettier --write src/"
  }
}
```

### Distribution

```bash
# Build
bun run build

# Package
tar czf my-app.tar.gz dist/

# Or install globally
bun link
```

## Security

### Input Validation

```tsx
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
```

### Sanitization

```tsx
// Sanitize file paths
function sanitizePath(path: string): string {
  return path.replace(/\.\./g, "").replace(/~/g, "")
}
```

## Accessibility

### Keyboard Navigation

```tsx
// Always provide keyboard alternatives
function Button(props: ButtonProps) {
  useKeyboard((key) => {
    if (key.name === "enter" || key.name === " ") {
      props.onClick()
    }
  })

  return <box onClick={props.onClick}>{props.label}</box>
}
```

### Focus Indicators

```tsx
// Show focus clearly
function FocusableBox(props: { children: any }) {
  const [focused, setFocused] = useState(false)

  return (
    <box
      borderStyle={focused ? "double" : "single"}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {props.children}
    </box>
  )
}
```

## Debugging

### Enable Console Overlay

```tsx
import { consoleOverlay } from "@opentui/core"

async function main() {
  const renderer = await createCliRenderer()

  if (process.env.DEBUG) {
    renderer.attach(consoleOverlay())
  }

  // Now console.log() appears in terminal
  console.log("Debug mode enabled")
}
```

### Performance Profiling

```tsx
function profileRender(component: any, label: string) {
  const start = performance.now()

  renderer.getRoot().add(component)
  renderer.render()

  const end = performance.now()
  console.log(`${label} rendered in ${end - start}ms`)
}
```

## Common Pitfalls

### Don't Mix Concerns

```tsx
// Bad: UI and business logic mixed
function BadComponent() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch("/api/users")
      .then(res => res.json())
      .then(data => setUsers(data))
  }, [])

  return <text>{users.length} users</text>
}

// Good: Separated concerns
function GoodComponent() {
  const users = useUsers() // Custom hook handles data

  return <UserCount count={users.length} />
}
```

### Avoid Prop Drilling

```tsx
// Bad: Prop drilling
function App() {
  const [theme, setTheme] = useState("dark")
  return <Sidebar theme={theme} setTheme={setTheme} />
}

// Good: Context
function App() {
  return (
    <ThemeProvider>
      <Sidebar />
    </ThemeProvider>
  )
}
```

## Resources

- OpenTUI Docs: https://github.com/sst/opentui
- Yoga Layout: https://yogalayout.com/
- TypeScript Best Practices: https://github.com/typescript-cheatsheets/react
