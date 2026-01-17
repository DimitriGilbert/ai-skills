# OpenTUI React Hooks Reference

## useKeyboard

Handle keyboard events at the component level.

```tsx
import { useKeyboard, KeyEvent } from "@opentui/react"

function Component() {
  useKeyboard((key: KeyEvent) => {
    console.log(key.name, key.sequence, key.ctrl, key.shift, key.meta)
  })

  return <text>Listening for keyboard events</text>
}
```

**Key Properties:**
- `name: string` - Key name ('a', 'enter', 'escape', etc.)
- `sequence: string` - Raw character sequence
- `ctrl: boolean` - Ctrl modifier
- `shift: boolean` - Shift modifier
- `meta: boolean` - Meta/Command modifier

**Cleanup:**
Hook automatically cleans up on unmount.

---

## useRenderer

Access the underlying CliRenderer instance.

```tsx
import { useRenderer } from "@opentui/react"

function Component() {
  const renderer = useRenderer()

  const destroy = () => {
    renderer.destroy()
    process.exit(0)
  }

  return <box onClick={destroy}>Exit</box>
}
```

**Returns:** `CliRenderer` instance

**Use Cases:**
- Manual renderer control
- Advanced event handling
- Performance optimization

---

## useTerminalDimensions

Subscribe to terminal size changes.

```tsx
import { useTerminalDimensions } from "@opentui/react"

function Responsive() {
  const { width, height } = useTerminalDimensions()

  const layout = width > 80 ? "desktop" : "mobile"

  return (
    <box>
      <text>Layout: {layout}</text>
      <text>Size: {width}x{height}</text>
    </box>
  )
}
```

**Returns:** `{ width: number, height: number }`

**Note:** Automatically re-renders on terminal resize.

---

## useTimeline

Create and manage animations.

```tsx
import { useTimeline } from "@opentui/react"
import { useRef } from "react"

function AnimatedComponent() {
  const boxRef = useRef<any>(null)

  const timeline = useTimeline({
    duration: 1000,
    easing: (t) => t,
    loop: false,
  })

  const animate = () => {
    if (boxRef.current) {
      timeline.to(boxRef.current, {
        backgroundColor: { r: 255, g: 0, b: 0 },
      })
      timeline.play()
    }
  }

  return (
    <box ref={boxRef} onClick={animate}>
      <text>Click to animate</text>
    </box>
  )
}
```

**Options:**
- `duration: number` - Animation duration in ms
- `easing: (t: number) => number` - Easing function
- `loop: boolean` - Loop animation
- `autoplay: boolean` - Start automatically

**Returns:** `Timeline` instance

**Methods:**
- `play()` - Start animation
- `pause()` - Pause animation
- `stop()` - Stop and reset
- `to(target, props, options)` - Add animation

---

## Custom Hooks

### useFocus

```tsx
function useFocus() {
  const [focused, setFocused] = useState(false)
  const ref = useRef<any>(null)

  useEffect(() => {
    const component = ref.current
    if (!component) return

    const onFocus = () => setFocused(true)
    const onBlur = () => setFocused(false)

    component.on("focus", onFocus)
    component.on("blur", onBlur)

    return () => {
      component.off("focus", onFocus)
      component.off("blur", onBlur)
    }
  }, [])

  return { ref, focused }
}

// Usage
function Input() {
  const { ref, focused } = useFocus()

  return (
    <box
      ref={ref}
      borderStyle={focused ? "double" : "single"}
    >
      <input />
    </box>
  )
}
```

### useInput

```tsx
function useInput(initialValue: string = "") {
  const [value, setValue] = useState(initialValue)
  const ref = useRef<any>(null)

  useEffect(() => {
    const component = ref.current
    if (!component) return

    const onChange = (newValue: string) => setValue(newValue)
    const onSubmit = (submittedValue: string) => {
      console.log("Submitted:", submittedValue)
    }

    component.on("change", onChange)
    component.on("submit", onSubmit)

    return () => {
      component.off("change", onChange)
      component.off("submit", onSubmit)
    }
  }, [])

  return { ref, value, setValue }
}

// Usage
function NameInput() {
  const { ref, value, setValue } = useInput("")

  return <input ref={ref} value={value} onChange={setValue} />
}
```

### useKeyPress

```tsx
function useKeyPress(keyFilter: string | string[] | ((key: KeyEvent) => boolean)) {
  const [pressed, setPressed] = useState(false)

  useKeyboard((key) => {
    let match = false

    if (typeof keyFilter === "string") {
      match = key.name === keyFilter
    } else if (Array.isArray(keyFilter)) {
      match = keyFilter.includes(key.name)
    } else if (typeof keyFilter === "function") {
      match = keyFilter(key)
    }

    if (match) {
      setPressed(true)
      setTimeout(() => setPressed(false), 100)
    }
  })

  return pressed
}

// Usage
function SaveButton() {
  const isPressed = useKeyPress((key) => key.name === "s" && key.ctrl)

  return (
    <box
      borderStyle={isPressed ? "double" : "single"}
    >
      <text>{isPressed ? "Saving..." : "Save (Ctrl+S)"}</text>
    </box>
  )
}
```

### useListNavigation

```tsx
function useListNavigation(itemCount: number) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useKeyboard((key) => {
    if (key.name === "down" || (key.name === "tab" && !key.shift)) {
      setSelectedIndex(i => Math.min(i + 1, itemCount - 1))
    }
    if (key.name === "up" || (key.name === "tab" && key.shift)) {
      setSelectedIndex(i => Math.max(i - 1, 0))
    }
    if (key.name === "home") {
      setSelectedIndex(0)
    }
    if (key.name === "end") {
      setSelectedIndex(itemCount - 1)
    }
  })

  return { selectedIndex, setSelectedIndex }
}

// Usage
function List({ items }: { items: string[] }) {
  const { selectedIndex } = useListNavigation(items.length)

  return (
    <scrollbox>
      {items.map((item, index) => (
        <box
          key={index}
          backgroundColor={
            index === selectedIndex
              ? { r: 100, g: 149, b: 237 }
              : { r: 30, g: 30, b: 30 }
          }
        >
          <text>{item}</text>
        </box>
      ))}
    </scrollbox>
  )
}
```

### useModal

```tsx
function useModal() {
  const [isOpen, setIsOpen] = useState(false)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen(!isOpen)

  useKeyboard((key) => {
    if (key.name === "escape" && isOpen) {
      close()
    }
  })

  return { isOpen, open, close, toggle }
}

// Usage
function App() {
  const modal = useModal()

  return (
    <>
      <box onClick={modal.open}>
        <text>Open Modal</text>
      </box>

      {modal.isOpen && (
        <Modal onClose={modal.close}>
          <text>Modal content</text>
        </Modal>
      )}
    </>
  )
}
```

## Hook Patterns

### Combining Hooks

```tsx
function Component() {
  const { width, height } = useTerminalDimensions()
  const renderer = useRenderer()

  useKeyboard((key) => {
    if (key.name === "c" && key.ctrl) {
      renderer.destroy()
      process.exit(0)
    }
  })

  return (
    <box width={width} height={height}>
      <text>Press Ctrl+C to exit</text>
    </box>
  )
}
```

### Hook Dependencies

```tsx
function SearchableList({ items }: { items: string[] }) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  )

  // Update selected index when filter changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useKeyboard((key) => {
    if (key.name === "down") {
      setSelectedIndex(i => Math.min(i + 1, filteredItems.length - 1))
    }
  })

  return (
    <box flexDirection="column">
      <input value={query} onChange={setQuery} placeholder="Search..." />
      <scrollbox>
        {filteredItems.map((item, index) => (
          <box
            key={index}
            backgroundColor={index === selectedIndex ? { r: 100, g: 149, b: 237 } : { r: 30, g: 30, b: 30 }}
          >
            <text>{item}</text>
          </box>
        ))}
      </scrollbox>
    </box>
  )
}
```

## Reference

- React Hooks: https://react.dev/reference/react
- OpenTUI React Source: https://github.com/sst/opentui/tree/main/packages/react
- Examples: `.search-data/research/opentui/resources.md`
