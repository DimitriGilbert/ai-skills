# OpenTUI Testing

## Testing Utilities

OpenTUI provides testing utilities for component testing.

```typescript
import { createTestRenderer } from "@opentui/core/testing"

// Create test renderer (no terminal required)
const testRenderer = await createTestRenderer()

// Use test renderer like normal renderer
const box = new BoxRenderable()
testRenderer.getRoot().add(box)

testRenderer.render()
```

## Mocking Keyboard Input

```typescript
import { createTestRenderer } from "@opentui/core/testing"

const renderer = await createTestRenderer()

// Mock keyboard events
renderer.simulateKey({
  name: "enter",
  sequence: "\r",
  ctrl: false,
  meta: false,
  shift: false,
})

// Simulate Ctrl+C
renderer.simulateKey({
  name: "c",
  sequence: "\x03",
  ctrl: true,
  meta: false,
  shift: false,
})
```

## Mocking Mouse Input

```typescript
// Mock mouse clicks
renderer.simulateMouse({
  x: 10,
  y: 5,
  button: "left",
  action: "click",
  shift: false,
  ctrl: false,
  meta: false,
})

// Mock mouse drag
renderer.simulateMouse({
  x: 15,
  y: 10,
  button: "left",
  action: "drag",
  shift: false,
  ctrl: false,
  meta: false,
})
```

## Testing Components

```typescript
import { createTestRenderer } from "@opentui/core/testing"
import { InputRenderable } from "@opentui/core"

describe("Input Component", () => {
  it("should emit submit on enter", async () => {
    const renderer = await createTestRenderer()
    const input = new InputRenderable()

    let submittedValue: string | null = null
    input.on("submit", (value) => {
      submittedValue = value
    })

    renderer.getRoot().add(input)

    // Simulate typing
    input.setValue("test input")

    // Simulate Enter key
    renderer.simulateKey({ name: "enter", sequence: "\r", ctrl: false, meta: false, shift: false })

    // Assert
    expect(submittedValue).toBe("test input")
  })

  it("should focus on click", async () => {
    const renderer = await createTestRenderer()
    const input = new InputRenderable()
    renderer.getRoot().add(input)

    expect(input.isFocused()).toBe(false)

    // Simulate click
    renderer.simulateMouse({
      x: 5,
      y: 0,
      button: "left",
      action: "click",
      shift: false,
      ctrl: false,
      meta: false,
    })

    expect(input.isFocused()).toBe(true)
  })
})
```

## Testing Layout

```typescript
it("should layout children correctly", async () => {
  const renderer = await createTestRenderer()
  const group = new GroupRenderable()

  group.setStyle({
    flexDirection: "row",
    width: 80,
    height: 10,
  })

  const box1 = new BoxRenderable()
  box1.setStyle({ width: 20 })

  const box2 = new BoxRenderable()
  box2.setStyle({ flexGrow: 1 })

  group.add(box1)
  group.add(box2)

  renderer.getRoot().add(group)
  renderer.render()

  const layout1 = box1.getComputedLayout()
  const layout2 = box2.getComputedLayout()

  expect(layout1.width).toBe(20)
  expect(layout2.width).toBe(60) // 80 - 20
})
```

## Testing Animations

```typescript
import { Timeline } from "@opentui/core"

it("should animate property", async () => {
  const renderer = await createTestRenderer()
  const box = new BoxRenderable()

  const timeline = new Timeline({ duration: 1000 })
  timeline.to(box, { backgroundColor: new Color(255, 0, 0) })

  timeline.play()

  // Wait for animation
  await new Promise(resolve => setTimeout(resolve, 1000))

  const style = box.getStyle()
  expect(style.backgroundColor).toEqual(new Color(255, 0, 0))
})
```

## Testing Focus Management

```typescript
it("should handle focus navigation", async () => {
  const renderer = await createTestRenderer()

  const input1 = new InputRenderable()
  const input2 = new InputRenderable()

  renderer.getRoot().add(input1)
  renderer.getRoot().add(input2)

  // Focus first input
  input1.focus()
  expect(input1.isFocused()).toBe(true)

  // Tab to next
  renderer.simulateKey({ name: "tab", sequence: "\t", ctrl: false, meta: false, shift: false })

  expect(input1.isFocused()).toBe(false)
  expect(input2.isFocused()).toBe(true)
})
```

## Testing Render Output

```typescript
it("should render correctly", async () => {
  const renderer = await createTestRenderer()
  const box = new BoxRenderable()
  box.setStyle({
    borderStyle: "single",
    width: 10,
    height: 5,
  })

  renderer.getRoot().add(box)
  renderer.render()

  // Get rendered output
  const output = renderer.getOutput()

  // Assert output contains expected content
  expect(output).toContain("┌")
  expect(output).toContain("─")
  expect(output).toContain("┐")
})
```

## Integration Testing

```typescript
describe("Form Integration", () => {
  it("should submit form with validation", async () => {
    const renderer = await createTestRenderer()

    const form = new GroupRenderable()
    form.setStyle({ flexDirection: "column" })

    const usernameInput = new InputRenderable()
    const passwordInput = new InputRenderable()
    const submitButton = new BoxRenderable()

    form.add(usernameInput)
    form.add(passwordInput)
    form.add(submitButton)

    renderer.getRoot().add(form)

    // Fill form
    usernameInput.setValue("user@example.com")
    passwordInput.setValue("password123")

    // Simulate submit
    submitButton.emit("click")

    // Assert form data
    expect(getFormData()).toEqual({
      username: "user@example.com",
      password: "password123",
    })
  })
})
```

## Test Helpers

### Create Component Factory
```typescript
function createTestBox(props: any = {}) {
  const box = new BoxRenderable()
  box.setStyle({
    width: props.width || 10,
    height: props.height || 5,
    borderStyle: props.borderStyle || "single",
    ...props.style,
  })
  return box
}
```

### Wait for Render
```typescript
async function waitForRender(renderer: any, maxWait = 1000) {
  return new Promise((resolve) => {
    const startTime = Date.now()
    const checkRender = () => {
      if (Date.now() - startTime > maxWait) {
        resolve(false)
        return
      }
      requestAnimationFrame(checkRender)
    }
    checkRender()
  })
}
```

### Capture Console Output
```typescript
function captureConsole() {
  const logs: string[] = []
  const originalLog = console.log

  console.log = (...args: any[]) => {
    logs.push(args.join(" "))
  }

  return {
    getLogs: () => logs,
    restore: () => {
      console.log = originalLog
    },
  }
}
```

## Testing Best Practices

1. **Isolate Tests**: Each test should be independent
2. **Mock External Dependencies**: Don't rely on real terminal
3. **Test User Interactions**: Simulate keyboard/mouse events
4. **Assert Component State**: Check values, not just rendering
5. **Test Edge Cases**: Empty inputs, invalid values, etc.
6. **Clean Up**: Destroy renderers after tests

## Reference

- Testing Utilities: `@opentui/core/testing`
- Examples: `.search-data/research/opentui/resources.md`
