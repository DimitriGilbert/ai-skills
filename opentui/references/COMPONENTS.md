# OpenTUI Component Reference

## TextRenderable

Display text with styling options.

```typescript
import { TextRenderable } from "@opentui/core"

const text = new TextRenderable("Hello, World!")
text.setStyle({
  foregroundColor: new Color(255, 255, 255),
  textDecoration: "bold",
})

// Update text
text.setText("New text")

// Multiline text
const multiline = new TextRenderable("Line 1\nLine 2\nLine 3")
```

**Props/Options:**
- `text: string` - Initial text content
- `wrap: boolean` - Enable text wrapping
- `truncate: "start" | "end" | "middle"` - Truncation mode

**Methods:**
- `setText(text: string)` - Update text content
- `getText(): string` - Get current text

**Events:**
- None

---

## BoxRenderable

Container with borders and backgrounds.

```typescript
import { BoxRenderable } from "@opentui/core"

const box = new BoxRenderable()
box.setStyle({
  borderStyle: "single",
  borderColor: new Color(255, 255, 255),
  backgroundColor: new Color(30, 30, 30),
  padding: 1,
})

// Add children
const text = new TextRenderable("Content")
box.add(text)
```

**Style Properties:**
- `borderStyle: "single" | "double" | "round" | "bold" | "dashed" | "none"`
- `borderColor: Color`
- `backgroundColor: Color`
- `foregroundColor: Color`
- `paddingTop, paddingBottom, paddingLeft, paddingRight: number`
- `padding: number` - Shorthand

**Methods:**
- `add(child: Renderable)` - Add child component
- `remove(child: Renderable)` - Remove child component
- `clear()` - Remove all children

**Events:**
- `click` - Mouse click
- `mouseover` - Mouse enters
- `mouseout` - Mouse leaves

---

## GroupRenderable

Layout container using Yoga flexbox.

```typescript
import { GroupRenderable } from "@opentui/core"

const group = new GroupRenderable()
group.setStyle({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 2,
})
```

**Style Properties:**
All Yoga layout properties (see [LAYOUT.md](LAYOUT.md)):
- `flexDirection: "row" | "column" | "row-reverse" | "column-reverse"`
- `justifyContent: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly"`
- `alignItems: "flex-start" | "center" | "flex-end" | "stretch"`
- `alignContent: "flex-start" | "center" | "flex-end" | "stretch" | "space-between" | "space-around"`
- `flexWrap: "nowrap" | "wrap" | "wrap-reverse"`
- `gap, rowGap, columnGap: number`
- Child: `flexGrow, flexShrink, flexBasis: number`
- Child: `alignSelf: "auto" | "flex-start" | "center" | "flex-end" | "stretch"`
- Child: `width, height, minWidth, minHeight, maxWidth, maxHeight: number`
- Child: `position: "relative" | "absolute"`
- Child: `top, left, right, bottom: number`

**Methods:**
- `add(child: Renderable)` - Add child
- `remove(child: Renderable)` - Remove child
- `clear()` - Remove all children

---

## InputRenderable

Single-line text input field.

```typescript
import { InputRenderable } from "@opentui/core"

const input = new InputRenderable()
input.setStyle({
  backgroundColor: new Color(50, 50, 50),
  foregroundColor: new Color(255, 255, 255),
  borderStyle: "single",
})

// Set placeholder
input.setPlaceholder("Enter text...")

// Set initial value
input.setValue("Initial value")

// Focus
input.focus()
```

**Style Properties:**
- `backgroundColor: Color`
- `foregroundColor: Color`
- `borderStyle, borderColor: string | Color`
- `placeholderColor: Color` - Placeholder text color
- `cursorColor: Color` - Cursor color

**Methods:**
- `setValue(value: string)` - Set input value
- `getValue(): string` - Get current value
- `setPlaceholder(text: string)` - Set placeholder
- `focus()` - Focus input
- `blur()` - Remove focus
- `isFocused(): boolean` - Check focus state
- `clear()` - Clear value

**Events:**
- `change(value: string)` - Value changed
- `submit(value: string)` - Enter pressed
- `focus()` - Input focused
- `blur()` - Input blurred

---

## SelectRenderable

Dropdown selection component.

```typescript
import { SelectRenderable } from "@opentui/core"

const select = new SelectRenderable({
  options: [
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
    { label: "Option 3", value: "3" },
  ],
})

// Get selected value
console.log(select.getValue())

// Set selected value
select.setValue("2")
```

**Options:**
- `options: Array<{ label: string, value: string }>` - Available options

**Methods:**
- `setValue(value: string)` - Set selected value
- `getValue(): string` - Get current value
- `setOptions(options: Array<{ label: string, value: string }>)` - Update options
- `focus()` - Focus select
- `blur()` - Remove focus

**Events:**
- `change(value: string)` - Selection changed
- `submit(value: string)` - Option selected
- `focus()` - Select focused
- `blur()` - Select blurred

---

## ScrollBoxRenderable

Scrollable content container.

```typescript
import { ScrollBoxRenderable } from "@opentui/core"

const scrollBox = new ScrollBoxRenderable()
scrollBox.setStyle({
  width: 60,
  height: 20,
})

// Add content
for (let i = 0; i < 100; i++) {
  const text = new TextRenderable(`Line ${i}`)
  scrollBox.add(text)
}

// Scroll to position
scrollBox.scrollTo(50)

// Get scroll position
console.log(scrollBox.getScrollOffset())
```

**Style Properties:**
- `width, height: number` - Dimensions
- `backgroundColor, foregroundColor: Color`
- `borderStyle, borderColor: string | Color`

**Methods:**
- `scrollTo(offset: number)` - Scroll to offset
- `scrollBy(delta: number)` - Scroll by amount
- `getScrollOffset(): number` - Get current offset
- `getMaxScroll(): number` - Get maximum scroll offset
- `add(child: Renderable)` - Add child
- `clear()` - Remove all children

**Events:**
- `scroll(offset: number)` - Scroll position changed

---

## CodeRenderable

Syntax-highlighted code display.

```typescript
import { CodeRenderable } from "@opentui/core"

const code = new CodeRenderable()
code.setCode(`
function hello() {
  console.log("Hello, World!");
}
`, "javascript")

// Set language
code.setLanguage("typescript")

// Get code
console.log(code.getCode())
```

**Supported Languages:**
- `javascript`, `typescript`
- `python`, `rust`, `go`
- `json`, `yaml`, `xml`
- `html`, `css`
- `bash`, `shell`
- And more...

**Methods:**
- `setCode(code: string, language?: string)` - Set code and language
- `getCode(): string` - Get current code
- `setLanguage(language: string)` - Change language
- `getLanguage(): string` - Get current language

---

## Component Lifecycle

```typescript
const component = new BoxRenderable()

// Created
console.log("Component created")

// Mounted (added to parent)
parent.add(component)
console.log("Component mounted")

// Updated
component.setStyle({ backgroundColor: new Color(255, 0, 0) })
console.log("Component updated")

// Destroyed
parent.remove(component)
console.log("Component destroyed")
```

## Component Utilities

### Find by Type
```typescript
function findByType<T>(parent: any, type: new (...args: any[]) => T): T | null {
  // Implementation depends on OpenTUI internals
  return null
}
```

### Traverse Children
```typescript
function traverse(component: any, callback: (child: any) => void) {
  // Implementation depends on OpenTUI internals
}
```

## Reference

- Component API: OpenTUI core source code
- Examples: `.search-data/research/opentui/resources.md`
