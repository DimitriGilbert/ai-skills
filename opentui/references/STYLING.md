# OpenTUI Styling & Colors

## Color System (RGBA)

OpenTUI uses an RGBA color class for full color support.

### Creating Colors

```typescript
import { Color, parseColor } from "@opentui/core"

// From RGB integers (0-255)
const red = new Color(255, 0, 0)

// From RGB floats (0.0-1.0)
const blue = Color.fromValues(0.0, 0.0, 1.0)

// From hex string
const green = parseColor("#00FF00")

// From CSS color name
const yellow = parseColor("yellow")

// Transparent color
const transparent = parseColor("transparent")

// With alpha
const semiTransparentRed = new Color(255, 0, 0, 0.5)
```

### Color Methods

```typescript
const color = new Color(255, 0, 0)

// Get values
console.log(color.r)        // Red (0-255)
console.log(color.g)        // Green (0-255)
console.log(color.b)        // Blue (0-255)
console.log(color.a)        // Alpha (0.0-1.0)

// Convert formats
console.log(color.toHex())          // "#FF0000"
console.log(color.toRGB())          // "rgb(255, 0, 0)"
console.log(color.toRGBA())         // "rgba(255, 0, 0, 1)"

// Lighten/darken
const lighter = color.lighten(0.2)
const darker = color.darken(0.2)
```

### Supported Color Formats

```typescript
// Hex formats
parseColor("#F00")
parseColor("#FF0000")
parseColor("#FF0000FF")

// RGB formats
parseColor("rgb(255, 0, 0)")
parseColor("rgba(255, 0, 0, 0.5)")

// CSS color names
parseColor("red")
parseColor("blue")
parseColor("green")
parseColor("yellow")
parseColor("cyan")
parseColor("magenta")
parseColor("white")
parseColor("black")
parseColor("gray")
parseColor("grey")
```

## Style Properties

### Border Styles

```typescript
box.setStyle({
  // Border type
  borderStyle: "single",     // 'single' | 'double' | 'round' | 'bold' | 'dashed' | 'none'

  // Border color
  borderColor: new Color(255, 255, 255),

  // Text decoration
  textDecoration: "underline", // 'underline' | 'bold' | 'dim' | 'italic' | 'blink' | 'inverse' | 'hidden' | 'strikethrough'
})
```

### Background & Foreground

```typescript
box.setStyle({
  backgroundColor: new Color(30, 30, 30),
  foregroundColor: new Color(255, 255, 255),
})
```

### Spacing

```typescript
box.setStyle({
  // Padding (inside border)
  paddingTop: 1,
  paddingBottom: 1,
  paddingLeft: 2,
  paddingRight: 2,
  padding: 1, // Shorthand for all sides

  // Margin (outside border)
  marginTop: 1,
  marginBottom: 1,
  marginLeft: 1,
  marginRight: 1,
  margin: 1, // Shorthand for all sides
})
```

## Themes

### Creating a Theme

```typescript
const theme = {
  primary: new Color(100, 149, 237),    // Cornflower blue
  secondary: new Color(255, 165, 0),    // Orange
  success: new Color(46, 204, 113),     // Green
  danger: new Color(231, 76, 60),       // Red
  warning: new Color(241, 196, 15),     // Yellow
  info: new Color(52, 152, 219),        // Blue

  bg: {
    default: new Color(30, 30, 30),
    muted: new Color(50, 50, 50),
    elevated: new Color(70, 70, 70),
  },

  fg: {
    default: new Color(255, 255, 255),
    muted: new Color(180, 180, 180),
  },

  border: {
    default: new Color(100, 100, 100),
    focused: new Color(100, 149, 237),
  },
}
```

### Using Themes

```typescript
function createPrimaryBox(text: string) {
  const box = new BoxRenderable()
  box.setStyle({
    backgroundColor: theme.bg.elevated,
    borderColor: theme.primary,
    foregroundColor: theme.fg.default,
    borderStyle: "single",
    paddingLeft: 2,
    paddingRight: 2,
  })
  return box
}

function createDangerButton(text: string) {
  const button = new BoxRenderable()
  button.setStyle({
    backgroundColor: theme.danger,
    foregroundColor: new Color(255, 255, 255),
    borderStyle: "none",
    paddingLeft: 2,
    paddingRight: 2,
  })
  return button
}
```

## Text Styling

```typescript
const text = new TextRenderable("Hello, World!")
text.setStyle({
  foregroundColor: new Color(255, 255, 255),
  textDecoration: "bold", // Can combine: "bold underline"
})

// Multiple styles
const fancyText = new TextRenderable()
fancyText.setStyle({
  foregroundColor: new Color(255, 0, 0),
  textDecoration: "bold underline italic",
})
```

## Dynamic Styling

```typescript
// Hover effect
box.on("mouseover", () => {
  box.setStyle({ backgroundColor: new Color(50, 50, 50) })
})

box.on("mouseout", () => {
  box.setStyle({ backgroundColor: new Color(30, 30, 30) })
})

// Focus state
input.on("focus", () => {
  input.setStyle({ borderColor: theme.primary })
})

input.on("blur", () => {
  input.setStyle({ borderColor: theme.border.default })
})
```

## Color Utilities

```typescript
// Blend colors
function blendColors(color1: Color, color2: Color, ratio: number): Color {
  const r = color1.r * (1 - ratio) + color2.r * ratio
  const g = color1.g * (1 - ratio) + color2.g * ratio
  const b = color1.b * (1 - ratio) + color2.b * ratio
  return new Color(r, g, b)
}

// Gradient for text (simulated)
const gradientColors = [
  new Color(255, 0, 0),
  new Color(255, 165, 0),
  new Color(255, 255, 0),
]
```

## Terminal Color Limitations

### True Color Support
Most modern terminals support 24-bit true color (16 million colors).

### Fallback for Limited Terminals
```typescript
function getSafeColor(): Color {
  // Check terminal capabilities
  const supportsTrueColor = process.env.COLORTERM === "truecolor" ||
                            process.env.TERM === "xterm-256color"

  if (supportsTrueColor) {
    return new Color(100, 149, 237)
  } else {
    // Fallback to 256-color palette
    return new Color(100, 149, 237)
  }
}
```

## Common Style Patterns

### Card Component
```typescript
function createCard(title: string, content: string) {
  const card = new BoxRenderable()
  card.setStyle({
    borderStyle: "single",
    borderColor: theme.border.default,
    backgroundColor: theme.bg.default,
    padding: 1,
  })

  const titleText = new TextRenderable(title)
  titleText.setStyle({
    foregroundColor: theme.primary,
    textDecoration: "bold",
  })

  const contentText = new TextRenderable(content)

  const container = new GroupRenderable()
  container.setStyle({ flexDirection: "column", gap: 1 })
  container.add(titleText)
  container.add(contentText)

  card.add(container)
  return card
}
```

### Button Component
```typescript
function createButton(label: string, variant: "primary" | "secondary") {
  const button = new BoxRenderable()
  const colors = variant === "primary" ? {
    bg: theme.primary,
    fg: new Color(255, 255, 255),
  } : {
    bg: theme.bg.elevated,
    fg: theme.fg.default,
  }

  button.setStyle({
    backgroundColor: colors.bg,
    foregroundColor: colors.fg,
    borderStyle: "single",
    borderColor: theme.border.default,
    paddingLeft: 2,
    paddingRight: 2,
  })

  const text = new TextRenderable(label)
  button.add(text)

  return button
}
```

## Reference

- Color API: OpenTUI core types
- Terminal Colors: https://gist.github.com/XVilka/8346728
- Examples: `.search-data/research/opentui/resources.md`
