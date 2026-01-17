# OpenTUI React Component Props

## Common Props

All OpenTUI React components share these common props:

### Layout Props

```tsx
<box
  flexDirection="row"
  justifyContent="center"
  alignItems="center"
  gap={1}
  width={80}
  height={20}
  flexGrow={1}
  flexShrink={0}
/>
```

**Props:**
- `flexDirection: "row" | "column" | "row-reverse" | "column-reverse"`
- `justifyContent: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly"`
- `alignItems: "flex-start" | "center" | "flex-end" | "stretch"`
- `alignContent: "flex-start" | "center" | "flex-end" | "stretch" | "space-between" | "space-around"`
- `flexWrap: "nowrap" | "wrap" | "wrap-reverse"`
- `gap?: number`
- `rowGap?: number`
- `columnGap?: number`
- `flexGrow?: number`
- `flexShrink?: number`
- `flexBasis?: number | "auto"`
- `alignSelf?: "auto" | "flex-start" | "center" | "flex-end" | "stretch"`
- `width?: number | "auto"`
- `height?: number | "auto"`
- `minWidth?: number`
- `minHeight?: number`
- `maxWidth?: number`
- `maxHeight?: number`
- `position?: "relative" | "absolute"`
- `top?: number`
- `left?: number`
- `right?: number`
- `bottom?: number`

### Style Props

```tsx
<box
  backgroundColor={{ r: 30, g: 30, b: 30 }}
  foregroundColor={{ r: 255, g: 255, b: 255 }}
  borderStyle="single"
  borderColor={{ r: 100, g: 149, b: 237 }}
  padding={1}
  paddingTop={1}
  paddingBottom={1}
  paddingLeft={2}
  paddingRight={2}
/>
```

**Props:**
- `backgroundColor?: { r: number, g: number, b: number, a?: number }`
- `foregroundColor?: { r: number, g: number, b: number, a?: number }`
- `borderStyle?: "single" | "double" | "round" | "bold" | "dashed" | "none"`
- `borderColor?: { r: number, g: number, b: number, a?: number }`
- `padding?: number`
- `paddingTop?: number`
- `paddingBottom?: number`
- `paddingLeft?: number`
- `paddingRight?: number`

### Event Props

```tsx
<box
  onClick={(event) => console.log("Clicked!", event)}
  onMouseover={(event) => console.log("Hovered!", event)}
  onMouseout={(event) => console.log("Left!", event)}
/>
```

**Props:**
- `onClick?: (event: MouseEvent) => void`
- `onMouseover?: (event: MouseEvent) => void`
- `onMouseout?: (event: MouseEvent) => void`

## Component-Specific Props

### `<text>`

```tsx
<text
  value="Hello, World!"
  decoration="bold underline"
/>
```

**Props:**
- `value?: string` - Text content (can also use children)
- `decoration?: "bold" | "dim" | "italic" | "underline" | "blink" | "inverse" | "hidden" | "strikethrough"`
- `wrap?: boolean` - Enable text wrapping

### `<box>`

```tsx
<box
  borderStyle="single"
  backgroundColor={{ r: 30, g: 30, b: 30 }}
  padding={1}
>
  <text>Content</text>
</box>
```

All common props apply.

### `<input>`

```tsx
<input
  value={text}
  onChange={setText}
  placeholder="Enter text..."
  password={false}
  placeholderColor={{ r: 128, g: 128, b: 128 }}
  cursorColor={{ r: 255, g: 255, b: 255 }}
/>
```

**Props:**
- `value?: string` - Input value
- `onChange?: (value: string) => void` - Value change handler
- `onSubmit?: (value: string) => void` - Submit (Enter) handler
- `onFocus?: () => void` - Focus handler
- `onBlur?: () => void` - Blur handler
- `placeholder?: string` - Placeholder text
- `password?: boolean` - Password mode (hide input)
- `placeholderColor?: { r: number, g: number, b: number, a?: number }`
- `cursorColor?: { r: number, g: number, b: number, a?: number }`

### `<select>`

```tsx
<select
  value={selectedValue}
  onChange={setSelectedValue}
  options={[
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
  ]}
/>
```

**Props:**
- `value?: string` - Selected value
- `onChange?: (value: string) => void` - Selection change handler
- `onSubmit?: (value: string) => void` - Submit handler
- `options?: Array<{ label: string, value: string }>` - Available options
- `onFocus?: () => void` - Focus handler
- `onBlur?: () => void` - Blur handler

### `<scrollbox>`

```tsx
<scrollbox
  width={60}
  height={20}
  onScroll={(offset) => console.log("Scrolled to", offset)}
>
  <text>Item 1</text>
  <text>Item 2</text>
  {/* ... more items ... */}
</scrollbox>
```

**Props:**
- `width?: number` - Width
- `height?: number` - Height
- `onScroll?: (offset: number) => void` - Scroll handler
- All common style props apply

### `<code>`

```tsx
<code
  code={`function hello() {\n  console.log("Hello!");\n}`}
  language="javascript"
/>
```

**Props:**
- `code?: string` - Code to display (can also use children)
- `language?: string` - Syntax highlighting language
  - `javascript`, `typescript`
  - `python`, `rust`, `go`
  - `json`, `yaml`, `xml`
  - `html`, `css`
  - `bash`, `shell`
  - And more...

### `<textarea>`

```tsx
<textarea
  value={longText}
  onChange={setLongText}
  rows={5}
  cols={60}
/>
```

**Props:**
- `value?: string` - Text content
- `onChange?: (value: string) => void` - Change handler
- `onSubmit?: (value: string) => void` - Submit handler
- `rows?: number` - Height in rows
- `cols?: number` - Width in columns
- `placeholder?: string` - Placeholder text
- `onFocus?: () => void` - Focus handler
- `onBlur?: () => void` - Blur handler

## Color Format

Colors in React are objects:

```tsx
// RGB
{ r: 255, g: 0, b: 0 }

// RGBA
{ r: 255, g: 0, b: 0, a: 0.5 }
```

**Ranges:**
- `r, g, b`: 0-255
- `a`: 0.0-1.0

## Ref Props

All components support refs:

```tsx
import { useRef } from "react"

function Component() {
  const boxRef = useRef<any>(null)

  const handleClick = () => {
    console.log(boxRef.current)
  }

  return <box ref={boxRef} onClick={handleClick}>Content</box>
}
```

## Children

Components accept children as JSX:

```tsx
<box flexDirection="column">
  <text>Title</text>
  <input />
  <text>Footer</text>
</box>
```

Or as arrays:

```tsx
<box>
  {items.map((item, index) => (
    <text key={index}>{item}</text>
  ))}
</box>
```

## TypeScript Types

```tsx
import type { Color } from "@opentui/react"

interface MyComponentProps {
  backgroundColor?: Color
  borderStyle?: "single" | "double" | "round" | "bold" | "dashed" | "none"
  onClick?: (event: MouseEvent) => void
}
```

## Reference

- Component Source: https://github.com/sst/opentui/tree/main/packages/react
- Examples: `.search-data/research/opentui/resources.md`
