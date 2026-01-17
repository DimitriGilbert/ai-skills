# OpenTUI Input Handling

## Keyboard Events

### Renderer-Level Keyboard Handling

```typescript
import { createCliRenderer, KeyEvent } from "@opentui/core"

const renderer = await createCliRenderer()

renderer.on("key", (key: KeyEvent) => {
  // Basic key info
  console.log(key.name)     // 'a', 'enter', 'escape', etc.
  console.log(key.sequence) // Raw character sequence
  console.log(key.ctrl)     // boolean
  console.log(key.meta)     // boolean (Command on Mac)
  console.log(key.shift)    // boolean

  // Common patterns
  if (key.name === "c" && key.ctrl) {
    // Ctrl+C
    process.exit(0)
  }

  if (key.name === "escape") {
    // ESC key
    process.exit(0)
  }

  if (key.name === "q") {
    // Quit on 'q'
    renderer.destroy()
  }
})
```

### Special Keys

| Key Name | Description |
|----------|-------------|
| `enter` | Return/Enter key |
| `escape` | ESC key |
| `space` | Space bar |
| `backspace` | Backspace |
| `delete` | Delete/Forward delete |
| `tab` | Tab key |
| `up`, `down`, `left`, `right` | Arrow keys |
| `home`, `end` | Home/End |
| `pageup`, `pagedown` | Page Up/Down |

### Modifier Combinations

```typescript
// Ctrl+Key combinations
if (key.ctrl && key.name === "s") { /* Save */ }
if (key.ctrl && key.name === "c") { /* Copy */ }
if (key.ctrl && key.name === "v") { /* Paste */ }
if (key.ctrl && key.name === "z") { /* Undo */ }

// Shift+Key combinations
if (key.shift && key.name === "tab") { /* Shift+Tab */ }

// Command/Meta+Key (Mac)
if (key.meta && key.name === "c") { /* Command+C */ }
```

## Component Input Events

### InputRenderable Events

```typescript
import { InputRenderable } from "@opentui/core"

const input = new InputRenderable()

// Submit on Enter
input.on("submit", (value: string) => {
  console.log("Submitted:", value)
})

// Change on every keystroke
input.on("change", (value: string) => {
  console.log("Changed:", value)
})

// Focus/Blur
input.on("focus", () => {
  console.log("Input focused")
})

input.on("blur", () => {
  console.log("Input blurred")
})
```

### SelectRenderable Events

```typescript
import { SelectRenderable } from "@opentui/core"

const select = new SelectRenderable({
  options: [
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
  ],
})

select.on("change", (value: string) => {
  console.log("Selected:", value)
})

select.on("submit", (value: string) => {
  console.log("Submitted:", value)
})
```

### ScrollBoxRenderable Events

```typescript
import { ScrollBoxRenderable } from "@opentui/core"

const scrollBox = new ScrollBoxRenderable()

scrollBox.on("scroll", (scrollOffset: number) => {
  console.log("Scrolled to:", scrollOffset)
})
```

## Mouse Events

```typescript
// Mouse click
renderer.on("mouse", (event: MouseEvent) => {
  console.log(event.x, event.y)    // Position
  console.log(event.button)        // 'left' | 'middle' | 'right'
  console.log(event.action)        // 'click' | 'drag' | 'scroll'
  console.log(event.shift)         // Modifiers
  console.log(event.ctrl)
  console.log(event.meta)
})

// Component-specific
box.on("click", (event: MouseEvent) => {
  console.log("Box clicked at:", event.x, event.y)
})
```

## Clipboard Paste Events

```typescript
renderer.on("paste", (text: string) => {
  console.log("Pasted:", text)
})
```

## Focus Management

```typescript
// Set focus programmatically
input.focus()

// Check if focused
if (input.isFocused()) {
  console.log("Input is focused")
}

// Blur (remove focus)
input.blur()

// Focus next/previous (Tab navigation)
renderer.focusNext()
renderer.focusPrevious()
```

## Custom Key Maps

```typescript
const keyMap = {
  "ctrl+s": () => save(),
  "ctrl+c": () => copy(),
  "ctrl+v": () => paste(),
  "ctrl+z": () => undo(),
  "ctrl+shift+z": () => redo(),
  "escape": () => cancel(),
  "enter": () => confirm(),
  "q": () => quit(),
}

renderer.on("key", (key: KeyEvent) => {
  const combo = [
    key.ctrl ? "ctrl" : null,
    key.shift ? "shift" : null,
    key.name,
  ].filter(Boolean).join("+")

  if (keyMap[combo]) {
    keyMap[combo]()
  }
})
```

## Event Patterns

### Debounce Input
```typescript
let debounceTimer: NodeJS.Timeout | null = null

input.on("change", (value: string) => {
  if (debounceTimer) clearTimeout(debounceTimer)

  debounceTimer = setTimeout(() => {
    console.log("Debounced:", value)
  }, 300)
})
```

### Keyboard Navigation
```typescript
let selectedIndex = 0
const items = [/* ... */]

renderer.on("key", (key: KeyEvent) => {
  if (key.name === "down" || (key.name === "tab" && !key.shift)) {
    selectedIndex = Math.min(selectedIndex + 1, items.length - 1)
  }
  if (key.name === "up" || (key.name === "tab" && key.shift)) {
    selectedIndex = Math.max(selectedIndex - 1, 0)
  }
})
```

### Global Shortcuts
```typescript
// Always active shortcuts
renderer.on("key", (key: KeyEvent) => {
  if (key.name === "c" && key.ctrl) {
    renderer.destroy()
    process.exit(0)
  }

  if (key.name === "?" && key.shift) {
    toggleHelp()
  }
})

// Context-sensitive shortcuts
function handleShortcuts(key: KeyEvent) {
  if (input.isFocused()) {
    // Input-specific shortcuts
    if (key.name === "escape") {
      input.blur()
    }
  } else {
    // Global shortcuts
    if (key.name === "/") {
      input.focus()
    }
  }
}
```

## Reference

- KeyEvent API: OpenTUI core types
- MouseEvent API: OpenTUI core types
- Examples: `.search-data/research/opentui/resources.md`
