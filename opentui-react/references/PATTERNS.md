# OpenTUI React Patterns

## Form Patterns

### Controlled Form

```tsx
function ControlledForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    console.log("Form submitted:", formData)
  }

  useKeyboard((key) => {
    if (key.name === "enter" && key.ctrl) {
      handleSubmit()
    }
  })

  return (
    <box flexDirection="column" gap={1} padding={2}>
      <text decoration="bold">Contact Form</text>

      <input
        value={formData.name}
        onChange={handleChange("name")}
        placeholder="Name"
      />

      <input
        value={formData.email}
        onChange={handleChange("email")}
        placeholder="Email"
      />

      <textarea
        value={formData.message}
        onChange={handleChange("message")}
        placeholder="Message"
        rows={5}
      />

      <box onClick={handleSubmit} borderStyle="single" padding={1}>
        <text>Submit (Ctrl+Enter)</text>
      </box>
    </box>
  )
}
```

### Form with Validation

```tsx
function ValidatedForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validate = (field: string, value: string): string | null => {
    switch (field) {
      case "email":
        return !value.includes("@") ? "Invalid email" : null
      case "password":
        return value.length < 8 ? "Password too short" : null
      default:
        return null
    }
  }

  const handleChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    if (touched[field]) {
      const error = validate(field, value)
      setErrors(prev => ({ ...prev, [field]: error || "" }))
    }
  }

  const handleBlur = (field: string) => () => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validate(field, formData[field as keyof typeof formData])
    setErrors(prev => ({ ...prev, [field]: error || "" }))
  }

  const isValid = Object.values(errors).every(e => !e)

  return (
    <box flexDirection="column" gap={1}>
      <text decoration="bold">Register</text>

      <input
        value={formData.email}
        onChange={handleChange("email")}
        onBlur={handleBlur("email")}
        placeholder="Email"
      />
      {touched.email && errors.email && (
        <text foregroundColor={{ r: 231, g: 76, b: 60 }}>
          {errors.email}
        </text>
      )}

      <input
        value={formData.password}
        onChange={handleChange("password")}
        onBlur={handleBlur("password")}
        placeholder="Password"
        password
      />
      {touched.password && errors.password && (
        <text foregroundColor={{ r: 231, g: 76, b: 60 }}>
          {errors.password}
        </text>
      )}

      <box
        onClick={() => isValid && console.log("Submit", formData)}
        borderStyle={isValid ? "single" : "dashed"}
        opacity={isValid ? 1 : 0.5}
      >
        <text>Submit</text>
      </box>
    </box>
  )
}
```

## Navigation Patterns

### Menu

```tsx
function Menu({ items, onSelect }: { items: string[], onSelect: (item: string) => void }) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useKeyboard((key) => {
    if (key.name === "down") {
      setSelectedIndex(i => Math.min(i + 1, items.length - 1))
    }
    if (key.name === "up") {
      setSelectedIndex(i => Math.max(i - 1, 0))
    }
    if (key.name === "enter") {
      onSelect(items[selectedIndex])
    }
  })

  return (
    <box borderStyle="single" padding={1}>
      {items.map((item, index) => (
        <box
          key={index}
          backgroundColor={
            index === selectedIndex
              ? { r: 100, g: 149, b: 237 }
              : undefined
          }
        >
          <text>
            {index === selectedIndex ? "> " : "  "}
            {item}
          </text>
        </box>
      ))}
    </box>
  )
}
```

### Breadcrumbs

```tsx
function Breadcrumbs({ items }: { items: Array<{ label: string, onClick: () => void }> }) {
  return (
    <box flexDirection="row" gap={1}>
      {items.map((item, index) => (
        <box key={index}>
          <text
            foregroundColor={{ r: 100, g: 149, b: 237 }}
            onClick={item.onClick}
          >
            {item.label}
          </text>
          {index < items.length - 1 && (
            <text> / </text>
          )}
        </box>
      ))}
    </box>
  )
}
```

## Layout Patterns

### App Shell

```tsx
function AppShell({ sidebar, main, footer }: any) {
  const { width, height } = useTerminalDimensions()

  return (
    <box
      flexDirection="column"
      width={width}
      height={height}
    >
      {/* Header */}
      <box
        height={3}
        borderStyle="double"
        backgroundColor={{ r: 30, g: 30, b: 30 }}
      >
        <text decoration="bold">My App</text>
      </box>

      {/* Main content area */}
      <box flexDirection="row" flexGrow={1}>
        {/* Sidebar */}
        <box
          width={20}
          borderStyle="single"
          backgroundColor={{ r: 25, g: 25, b: 25 }}
        >
          {sidebar}
        </box>

        {/* Main content */}
        <box flexGrow={1} padding={1}>
          {main}
        </box>
      </box>

      {/* Footer */}
      <box
        height={2}
        borderStyle="single"
        backgroundColor={{ r: 30, g: 30, b: 30 }}
      >
        {footer}
      </box>
    </box>
  )
}
```

### Split Pane

```tsx
function SplitPane({
  left,
  right,
  splitPosition = 0.5,
  onSplitChange,
}: any) {
  const [isDragging, setIsDragging] = useState(false)

  useKeyboard((key) => {
    if (!isDragging) return

    const delta = key.name === "left" ? -1 : key.name === "right" ? 1 : 0
    if (delta !== 0) {
      onSplitChange(Math.max(0.1, Math.min(0.9, splitPosition + delta * 0.01)))
    }
  })

  const leftWidth = Math.floor(80 * splitPosition)
  const rightWidth = 80 - leftWidth

  return (
    <box flexDirection="row" width={80}>
      <box width={leftWidth}>
        {left}
      </box>

      {/* Resizer */}
      <box
        width={1}
        backgroundColor={{ r: 100, g: 149, b: 237 }}
        onClick={() => setIsDragging(!isDragging)}
      >
        <text>{isDragging ? "||" : "|"}</text>
      </box>

      <box width={rightWidth}>
        {right}
      </box>
    </box>
  )
}
```

## Data Display Patterns

### Table

```tsx
function Table({ columns, rows }: {
  columns: Array<{ key: string, label: string }>
  rows: Record<string, any>[]
}) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollOffset, setScrollOffset] = useState(0)

  useKeyboard((key) => {
    if (key.name === "down") {
      setSelectedIndex(i => Math.min(i + 1, rows.length - 1))
    }
    if (key.name === "up") {
      setSelectedIndex(i => Math.max(i - 1, 0))
    }
  })

  const columnWidths = columns.map(() =>
    Math.floor(80 / columns.length)
  )

  return (
    <box flexDirection="column">
      {/* Header */}
      <box flexDirection="row" borderStyle="single">
        {columns.map((col, index) => (
          <box
            key={col.key}
            width={columnWidths[index]}
            borderStyle="single"
          >
            <text decoration="bold">{col.label}</text>
          </box>
        ))}
      </box>

      {/* Rows */}
      <scrollbox height={20}>
        {rows.map((row, rowIndex) => (
          <box
            key={rowIndex}
            flexDirection="row"
            backgroundColor={
              rowIndex === selectedIndex
                ? { r: 100, g: 149, b: 237 }
                : undefined
            }
          >
            {columns.map((col, colIndex) => (
              <box
                key={col.key}
                width={columnWidths[colIndex]}
                borderStyle="single"
              >
                <text>{String(row[col.key])}</text>
              </box>
            ))}
          </box>
        ))}
      </scrollbox>
    </box>
  )
}
```

### Card List

```tsx
function CardList({ items }: { items: Array<{ title: string, description: string }> }) {
  return (
    <scrollbox height={25}>
      {items.map((item, index) => (
        <box
          key={index}
          borderStyle="single"
          marginBottom={1}
          padding={1}
        >
          <text decoration="bold">{item.title}</text>
          <text>{item.description}</text>
        </box>
      ))}
    </scrollbox>
  )
}
```

## Interactive Patterns

### Confirm Dialog

```tsx
function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string
  onConfirm: () => void
  onCancel: () => void
}) {
  const [selected, setSelected] = useState<"confirm" | "cancel">("confirm")

  useKeyboard((key) => {
    if (key.name === "left") setSelected("confirm")
    if (key.name === "right") setSelected("cancel")
    if (key.name === "enter") {
      if (selected === "confirm") onConfirm()
      else onCancel()
    }
    if (key.name === "escape") onCancel()
  })

  return (
    <box
      position="absolute"
      top={5}
      left={20}
      width={40}
      height={10}
      borderStyle="double"
      backgroundColor={{ r: 30, g: 30, b: 30 }}
      flexDirection="column"
      padding={2}
    >
      <text marginBottom={1}>{message}</text>

      <box flexDirection="row" gap={2}>
        <box
          borderStyle={selected === "confirm" ? "double" : "single"}
          padding={1}
        >
          <text>OK</text>
        </box>
        <box
          borderStyle={selected === "cancel" ? "double" : "single"}
          padding={1}
        >
          <text>Cancel</text>
        </box>
      </box>
    </box>
  )
}
```

### Progress Bar

```tsx
function ProgressBar({ progress, total }: { progress: number, total: number }) {
  const percentage = Math.floor((progress / total) * 100)
  const barWidth = 40
  const filledWidth = Math.floor((progress / total) * barWidth)

  return (
    <box>
      <text>{percentage}% </text>
      <text>[</text>
      <text
        backgroundColor={{ r: 46, g: 204, b: 113 }}
      >
        {"=".repeat(filledWidth)}
      </text>
      <text>{" ".repeat(barWidth - filledWidth)}]</text>
    </box>
  )
}
```

### Loading Spinner

```tsx
function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % 4)
    }, 250)

    return () => clearInterval(interval)
  }, [])

  const spinners = ["|", "/", "-", "\\"]

  return (
    <box>
      <text>{spinners[frame]} {message}</text>
    </box>
  )
}
```

## Reference

- React Patterns: https://react.dev/learn
- OpenTUI Examples: `.search-data/research/opentui/resources.md`
