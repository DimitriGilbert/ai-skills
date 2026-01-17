# OpenTUI Quick Reference

**Last Updated:** 2026-01-17
**Purpose:** Quick reference for OpenTUI development

---

## Essential Commands

### Installation
```bash
# Quick start
bun create tui

# Manual - Core
bun install @opentui/core

# Manual - React
bun install @opentui/react @opentui/core react

# Manual - SolidJS
bun install @opentui/solid @opentui/core solid-js
```

### Running Examples
```bash
# Clone and run
git clone https://github.com/sst/opentui.git
cd opentui
bun install
cd packages/core
bun run src/examples/index.ts
```

---

## Core Concepts Quick Reference

### 1. Renderer (The Canvas)
```typescript
import { createCliRenderer } from "@opentui/core"

const renderer = await createCliRenderer()
renderer.start() // Live mode with FPS
// Or just render on changes without start()
```

### 2. Basic Component (Core API)
```typescript
import { BoxRenderable, TextRenderable } from "@opentui/core"

const box = new BoxRenderable(renderer, {
  width: 20,
  height: 10,
  backgroundColor: "#444444",
})

const text = new TextRenderable(renderer, {
  content: "Hello, OpenTUI!",
  backgroundColor: "#FF0000",
})

renderer.root.add(box)
box.add(text)
```

### 3. Layout with Yoga (Flexbox)
```typescript
import { GroupRenderable } from "@opentui/core"

const container = new GroupRenderable(renderer, {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  height: 10,
})
```

### 4. Input Handling
```typescript
// Keyboard
renderer.keyInput.on("keypress", (key: KeyEvent) => {
  if (key.name === "escape") {
    renderer.destroy()
  }
})

// Focus
input.focus()
```

### 5. Colors
```typescript
import { RGBA, parseColor } from "@opentui/core"

const red = RGBA.fromInts(255, 0, 0, 255)
const blue = RGBA.fromHex("#0000FF")
const green = parseColor("green")
```

### 6. React Integration
```tsx
import { createCliRenderer } from "@opentui/core"
import { createRoot } from "@opentui/react"

function App() {
  return <text>Hello, world!</text>
}

const renderer = await createCliRenderer()
createRoot(renderer).render(<App />)
```

### 7. React Hooks
```tsx
import { useKeyboard, useTerminalDimensions, useTimeline } from "@opentui/react"

function App() {
  const { width, height } = useTerminalDimensions()

  useKeyboard((key) => {
    if (key.name === "escape") process.exit(0)
  })

  return <text>Terminal: {width}x{height}</text>
}
```

---

## Component Reference

### Core Components (Imperative)
| Component | Purpose | Key Props |
|-----------|---------|-----------|
| **TextRenderable** | Display text | content, fg, backgroundColor |
| **BoxRenderable** | Container | width, height, border, backgroundColor |
| **GroupRenderable** | Layout container | flexDirection, justifyContent, alignItems |
| **InputRenderable** | Text input | placeholder, focused, focusedBackgroundColor |
| **SelectRenderable** | Dropdown | options, selectedIndex, onChange |
| **ScrollBoxRenderable** | Scrollable area | scrollbar, content |
| **CodeRenderable** | Syntax-highlighted code | language, theme |

### React Components (Declarative)
| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `<text>` | Display text | content, fg |
| `<box>` | Container | style, border |
| `<input>` | Text input | placeholder, onInput, onSubmit |
| `<select>` | Dropdown | options, onChange |
| `<scrollbox>` | Scrollable area | style, children |
| `<textarea>` | Multi-line input | placeholder, ref |
| `<code>` | Code display | language |

---

## Layout Properties (Yoga Flexbox)

### Container Properties
- `flexDirection: 'row' | 'column'`
- `justifyContent: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'`
- `alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch'`
- `flexWrap: 'nowrap' | 'wrap' | 'wrap-reverse'`

### Item Properties
- `flexGrow: number`
- `flexShrink: number`
- `flexBasis: number | string`
- `width: number | string`
- `height: number | string`
- `position: 'relative' | 'absolute'`
- `top | left | right | bottom: number`

### Spacing
- `padding: number`
- `margin: number`
- `gap: number`

---

## Event Handling

### Keyboard Events
```typescript
interface KeyEvent {
  name: string        // 'escape', 'return', 'a', 'f1', etc.
  sequence: string    // Key sequence
  ctrl: boolean       // Ctrl modifier
  shift: boolean      // Shift modifier
  meta: boolean       // Alt/Option modifier
  option: boolean     // Option modifier (Mac)
}
```

### Input Events
- `InputRenderableEvents.CHANGE` - On Enter key
- `onInput` - During typing (React)
- `onSubmit` - On Enter (React)

---

## Common Patterns

### 1. Simple Box with Text
```typescript
const box = new BoxRenderable(renderer, {
  width: 30,
  height: 5,
  backgroundColor: "#444444",
  border: true,
})
const text = new TextRenderable(renderer, {
  content: "Hello!",
})
box.add(text)
renderer.root.add(box)
```

### 2. Form with Input
```typescript
const input = new InputRenderable(renderer, {
  width: 25,
  placeholder: "Enter name...",
})
input.on(InputRenderableEvents.CHANGE, (value) => {
  console.log("Submitted:", value)
})
input.focus()
```

### 3. Scrollable List
```typescript
const scrollBox = new ScrollBoxRenderable(renderer, {
  width: 40,
  height: 20,
})
// Add items
for (let i = 0; i < 100; i++) {
  const item = new TextRenderable(renderer, {
    content: `Item ${i}`,
  })
  scrollBox.add(item)
}
```

### 4. React Form
```tsx
function Form() {
  const [name, setName] = useState("")

  return (
    <box style={{ flexDirection: "column", gap: 1 }}>
      <text>Enter your name:</text>
      <input
        placeholder="Name..."
        onInput={setName}
        onSubmit={(v) => console.log("Hello,", v)}
      />
    </box>
  )
}
```

---

## Styling Quick Reference

### Colors
```typescript
// From integers (0-255)
RGBA.fromInts(255, 0, 0, 255)

// From floats (0.0-1.0)
RGBA.fromValues(1.0, 0.0, 0.0, 1.0)

// From hex
RGBA.fromHex("#FF0000")

// Parse string
parseColor("red")
parseColor("#FF0000")
parseColor("transparent")
```

### Style Properties
- `backgroundColor: string`
- `foregroundColor: string` (or `fg`)
- `border: boolean`
- `borderColor: string`
- `focusedBackgroundColor: string`

---

## Debugging

### Enable Console Overlay
```typescript
renderer.console.show()
renderer.console.position = "bottom"
```

### All Console Methods Captured
- `console.log()`
- `console.info()`
- `console.warn()`
- `console.error()`
- `console.debug()`

---

## Animation Basics

### Timeline Animation
```typescript
import { Timeline, engine } from "@opentui/core"

const timeline = new Timeline({
  duration: 2000,
  loop: true,
  autoplay: true,
})

const state = { x: 0 }

timeline.add(
  state,
  {
    x: 50,
    duration: 2000,
    ease: "easeInOutQuad",
    onUpdate: (anim) => {
      box.left = Math.round(anim.targets[0].x)
    },
  },
  0
)

engine.attach(renderer)
engine.register(timeline)
renderer.start()
```

### React Animation Hook
```tsx
const timeline = useTimeline({
  duration: 2000,
  loop: false,
})

useEffect(() => {
  timeline.add(
    { width: 0 },
    {
      width: 50,
      duration: 2000,
      ease: "linear",
      onUpdate: (anim) => {
        setWidth(anim.targets[0].width)
      },
    }
  )
}, [])
```

---

## Testing

### Mock Input
```typescript
import { createMockMouse, MouseButtons } from "@opentui/core/testing"

const mockMouse = createMockMouse(renderer)

// Click
await mockMouse.click(x, y)

// Drag
await mockMouse.drag(startX, startY, endX, endY)

// Scroll
await mockMouse.scroll(x, y, "up")
```

---

## Key Resources

### Official
- **GitHub:** https://github.com/sst/opentui
- **Docs:** Context7 `/sst/opentui`
- **Awesome List:** https://github.com/msmps/awesome-opentui
- **create-tui:** https://github.com/msmps/create-tui

### Applications
- **OpenCode:** https://opencode.ai

### NPM
- **@opentui/core:** https://www.npmjs.com/package/@opentui/core
- **@opentui/react:** https://www.npmjs.com/package/@opentui/react

---

## Common Issues

### Zig Not Found
```bash
# Install Zig first
# Visit: https://ziglang.org/download/
```

### Terminal Not Clearing
```typescript
// Make sure to start renderer
renderer.start()

// Or destroy when done
renderer.destroy()
```

### Events Not Firing
```typescript
// Make sure component is focused
input.focus()

// Or renderer is started
renderer.start()
```

---

## Learning Path

### Beginner
1. Install and run examples
2. Create simple "Hello, world!" with core API
3. Add keyboard input handling
4. Build a simple form

### Intermediate
5. Learn Yoga flexbox layouts
6. Create scrollable lists
7. Add animations
8. Use React integration

### Advanced
9. Build complex layouts
10. Optimize performance
11. Create custom components
12. Write tests

---

## Keyboard Shortcuts (Common)

| Key | Usage |
|-----|-------|
| `escape` | Exit application |
| `ctrl+c` | Exit (if configured) |
| `return` | Submit form/confirm |
| `tab` | Next focus |
| `shift+tab` | Previous focus |
| `up/down` | Navigate list |
| `page up/down` | Scroll page |

---

**For detailed information, see:**
- Complete overview: `overview.md`
- All resources: `resources.md`
- Skill recommendations: `skill-recommendations.md`
- Research summary: `RESEARCH_SUMMARY.md`
