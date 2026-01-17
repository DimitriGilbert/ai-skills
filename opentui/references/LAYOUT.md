# OpenTUI Layout Guide (Yoga Flexbox)

OpenTUI uses the Yoga layout engine for CSS Flexbox-like layouts.

## Yoga Layout Properties

### Container Properties

```typescript
import { GroupRenderable } from "@opentui/core"

const container = new GroupRenderable()
container.setStyle({
  // Main axis direction
  flexDirection: "row",        // 'row' | 'column' | 'row-reverse' | 'column-reverse'

  // Main axis alignment
  justifyContent: "flex-start", // 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'

  // Cross axis alignment
  alignItems: "flex-start",    // 'flex-start' | 'center' | 'flex-end' | 'stretch'

  // Multiple lines alignment (when wrapping)
  alignContent: "flex-start",  // 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'space-between' | 'space-around'

  // Wrapping
  flexWrap: "nowrap",          // 'nowrap' | 'wrap' | 'wrap-reverse'

  // Gap between items
  gap: 1,                      // number
  rowGap: 1,
  columnGap: 1,
})
```

### Child Properties

```typescript
child.setStyle({
  // Grow to fill available space
  flexGrow: 1,                 // number (0 = don't grow)

  // Shrink when needed
  flexShrink: 1,               // number (1 = can shrink)

  // Base size on main axis
  flexBasis: "auto",           // number | 'auto'

  // Alignment override
  alignSelf: "auto",           // 'auto' | 'flex-start' | 'center' | 'flex-end' | 'stretch'

  // Dimensions
  width: 80,                   // number | 'auto'
  height: 24,                  // number | 'auto'
  minWidth: 10,
  minHeight: 5,
  maxWidth: 100,
  maxHeight: 30,

  // Position (when parent is relative)
  position: "relative",        // 'relative' | 'absolute'
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
})
```

### Absolute Positioning

```typescript
const parent = new GroupRenderable()
parent.setStyle({ width: 80, height: 24, position: "relative" })

const absoluteChild = new BoxRenderable()
absoluteChild.setStyle({
  position: "absolute",
  top: 2,
  left: 2,
  width: 20,
  height: 5,
})
```

## Common Layout Patterns

### Center Content
```typescript
const container = new GroupRenderable()
container.setStyle({
  width: 80,
  height: 24,
  justifyContent: "center",
  alignItems: "center",
})
```

### Sidebar Layout
```typescript
const root = new GroupRenderable()
root.setStyle({
  flexDirection: "row",
  width: "100%",
  height: "100%",
})

const sidebar = new BoxRenderable()
sidebar.setStyle({ width: 20, flexGrow: 0 })

const main = new BoxRenderable()
main.setStyle({ flexGrow: 1 })

root.add(sidebar)
root.add(main)
```

### Vertical Form
```typescript
const form = new GroupRenderable()
form.setStyle({
  flexDirection: "column",
  gap: 1,
  width: 60,
})

const input1 = new InputRenderable()
const input2 = new InputRenderable()
const button = new BoxRenderable()

form.add(input1)
form.add(input2)
form.add(button)
```

### Responsive Layout
```typescript
function createResponsiveLayout(width: number) {
  const container = new GroupRenderable()

  if (width > 80) {
    container.setStyle({ flexDirection: "row" })
  } else {
    container.setStyle({ flexDirection: "column" })
  }

  return container
}
```

## Layout Debugging

```typescript
// Enable layout borders
box.setStyle({
  borderStyle: "single",
  borderColor: new Color(255, 0, 0),
})

// Check computed layout
console.log(box.getComputedLayout())
// { left: 0, top: 0, width: 80, height: 24 }
```

## Reference

- Yoga Documentation: https://yogalayout.com/docs/
- OpenTUI Examples: `.search-data/research/opentui/resources.md`
