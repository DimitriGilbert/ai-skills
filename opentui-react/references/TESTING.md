# Testing OpenTUI React Components

## Testing Setup

```bash
bun install @testing-library/react @testing-library/user-event vitest
```

## Basic Component Test

```tsx
import { render, screen } from "@testing-library/react"
import { createTestRenderer } from "@opentui/core/testing"
import { createRoot } from "@opentui/react"

describe("MyComponent", () => {
  it("should render text", async () => {
    const renderer = await createTestRenderer()
    const root = createRoot(renderer)

    render(
      root,
      <text>Hello, World!</text>
    )

    renderer.render()

    const output = renderer.getOutput()
    expect(output).toContain("Hello, World!")
  })
})
```

## Testing Hooks

### useKeyboard Hook

```tsx
import { renderHook, act } from "@testing-library/react"
import { useKeyboard } from "@opentui/react"

describe("useKeyboard", () => {
  it("should call callback on key press", () => {
    const callback = vi.fn()

    renderHook(() => {
      useKeyboard(callback)
    })

    act(() => {
      // Simulate key event
      callback({ name: "enter", sequence: "\r", ctrl: false, shift: false, meta: false })
    })

    expect(callback).toHaveBeenCalled()
  })
})
```

### Custom Hook Test

```tsx
function useKeyPress(targetKey: string) {
  const [pressed, setPressed] = useState(false)

  useKeyboard((key) => {
    if (key.name === targetKey) {
      setPressed(true)
      setTimeout(() => setPressed(false), 100)
    }
  })

  return pressed
}

describe("useKeyPress", () => {
  it("should detect key press", () => {
    const { result } = renderHook(() => useKeyPress("enter"))

    expect(result.current).toBe(false)

    act(() => {
      // Trigger enter key
    })

    expect(result.current).toBe(true)
  })
})
```

## Testing User Interactions

### Keyboard Input

```tsx
describe("InputComponent", () => {
  it("should update value on input", async () => {
    const renderer = await createTestRenderer()
    const root = createRoot(renderer)

    let value = ""

    render(
      root,
      <input
        value={value}
        onChange={(v) => value = v}
      />
    )

    // Simulate typing
    act(() => {
      // Simulate key events for "hello"
    })

    expect(value).toBe("hello")
  })
})
```

### Click Events

```tsx
describe("ButtonComponent", () => {
  it("should call onClick when clicked", async () => {
    const handleClick = vi.fn()
    const renderer = await createTestRenderer()
    const root = createRoot(renderer)

    render(
      root,
      <box onClick={handleClick}>
        <text>Click me</text>
      </box>
    )

    // Simulate mouse click
    renderer.simulateMouse({
      x: 5,
      y: 0,
      button: "left",
      action: "click",
      shift: false,
      ctrl: false,
      meta: false,
    })

    expect(handleClick).toHaveBeenCalled()
  })
})
```

## Testing State Changes

### useState Updates

```tsx
describe("Counter", () => {
  it("should increment count", async () => {
    const renderer = await createTestRenderer()
    const root = createRoot(renderer)

    function Counter() {
      const [count, setCount] = useState(0)

      useKeyboard((key) => {
        if (key.name === "up") {
          setCount(c => c + 1)
        }
      })

      return <text>Count: {count}</text>
    }

    render(root, <Counter />)

    renderer.render()

    // Simulate up arrow key
    renderer.simulateKey({
      name: "up",
      sequence: "\u001B[A",
      ctrl: false,
      shift: false,
      meta: false,
    })

    renderer.render()

    const output = renderer.getOutput()
    expect(output).toContain("Count: 1")
  })
})
```

## Testing Forms

```tsx
describe("LoginForm", () => {
  it("should submit with valid data", async () => {
    const handleSubmit = vi.fn()
    const renderer = await createTestRenderer()
    const root = createRoot(renderer)

    render(
      root,
      <LoginForm onSubmit={handleSubmit} />
    )

    // Fill email
    // Fill password
    // Submit

    expect(handleClick).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    })
  })

  it("should show validation errors", async () => {
    const renderer = await createTestRenderer()
    const root = createRoot(renderer)

    render(
      root,
      <LoginForm />
    )

    // Submit empty form

    const output = renderer.getOutput()
    expect(output).toContain("Email is required")
    expect(output).toContain("Password is required")
  })
})
```

## Testing Component Lifecycle

### Mount and Unmount

```tsx
describe("LifecycleComponent", () => {
  it("should setup on mount and cleanup on unmount", () => {
    const onMount = vi.fn()
    const onUnmount = vi.fn()

    function LifecycleComponent() {
      useEffect(() => {
        onMount()
        return onUnmount
      }, [])

      return <text>Test</text>
    }

    const { unmount } = render(<LifecycleComponent />)

    expect(onMount).toHaveBeenCalled()

    unmount()

    expect(onUnmount).toHaveBeenCalled()
  })
})
```

## Testing Async Operations

### Data Fetching

```tsx
describe("DataComponent", () => {
  it("should show loading state", async () => {
    const renderer = await createTestRenderer()
    const root = createRoot(renderer)

    render(
      root,
      <DataComponent />
    )

    renderer.render()

    let output = renderer.getOutput()
    expect(output).toContain("Loading...")

    // Wait for async
    await new Promise(resolve => setTimeout(resolve, 1000))

    renderer.render()

    output = renderer.getOutput()
    expect(output).not.toContain("Loading...")
  })
})
```

## Testing with Context

```tsx
describe("ComponentWithContext", () => {
  it("should use context value", () => {
    const TestContext = createContext({ theme: "dark" })

    function ThemedComponent() {
      const { theme } = useContext(TestContext)
      return <text>Theme: {theme}</text>
    }

    const { getByText } = render(
      <TestContext.Provider value={{ theme: "light" }}>
        <ThemedComponent />
      </TestContext.Provider>
    )

    expect(getByText("Theme: light")).toBeInTheDocument()
  })
})
```

## Integration Testing

### Full User Flow

```tsx
describe("User Registration Flow", () => {
  it("should complete registration", async () => {
    const renderer = await createTestRenderer()
    const root = createRoot(renderer)

    render(
      root,
      <App />
    )

    // Navigate to registration
    renderer.simulateKey({ name: "r", sequence: "r", ctrl: false, shift: false, meta: false })

    // Fill form
    // Validate fields
    // Submit

    // Verify success message
    const output = renderer.getOutput()
    expect(output).toContain("Registration successful!")
  })
})
```

## Test Utilities

### Create Test Wrapper

```tsx
function createTestWrapper({ store }: { store?: any } = {}) {
  return ({ children }: { children: any }) => (
    <QueryClientProvider client={queryClient}>
      {store ? (
        <Provider store={store}>
          {children}
        </Provider>
      ) : children}
    </QueryClientProvider>
  )
}

// Usage
render(
  <MyComponent />,
  { wrapper: createTestWrapper({ store }) }
)
```

### Mock Renderer

```tsx
import { createTestRenderer } from "@opentui/core/testing"

export async function setupTest() {
  const renderer = await createTestRenderer()
  const root = createRoot(renderer)

  return { renderer, root }
}

// Usage
describe("MyTest", () => {
  it("should work", async () => {
    const { renderer, root } = await setupTest()

    render(root, <MyComponent />)

    // Test...
  })
})
```

## Testing Best Practices

1. **Test user behavior, not implementation**
   - Test what users see and interact with
   - Don't test internal state or methods

2. **Keep tests simple and focused**
   - One assertion per test when possible
   - Clear test names that describe behavior

3. **Mock external dependencies**
   - API calls, file system, timers
   - Use vi.fn() for mocks

4. **Use test-specific props**
   - Pass default props to simplify setup
   - Override only what's needed for the test

5. **Test edge cases**
   - Empty states
   - Error conditions
   - Boundary values

## Reference

- Testing Library: https://testing-library.com/react
- Vitest: https://vitest.dev/
- OpenTUI Testing: `@opentui/core/testing`
