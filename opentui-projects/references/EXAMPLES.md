# OpenTUI Examples Collection

## Official Examples

### Location
```
github.com/sst/opentui/tree/main/packages/core/src/examples/
```

### Running Official Examples

```bash
# Clone repository
git clone https://github.com/sst/opentui.git
cd opentui

# Install dependencies
bun install

# Run core examples
cd packages/core
bun run src/examples/index.ts
```

## Essential Examples by Category

### 1. Getting Started

#### Hello World
```tsx
import { createCliRenderer } from "@opentui/core"
import { TextRenderable } from "@opentui/core"

async function main() {
  const renderer = await createCliRenderer()
  const text = new TextRenderable("Hello, OpenTUI!")
  renderer.getRoot().add(text)
  renderer.start()
}

main()
```

**Concepts:** Basic setup, rendering, root

---

#### Colors & Styling
```tsx
import { createCliRenderer, Color } from "@opentui/core"
import { BoxRenderable, TextRenderable } from "@opentui/core"

async function main() {
  const renderer = await createCliRenderer()

  const box = new BoxRenderable()
  box.setStyle({
    backgroundColor: new Color(30, 30, 30),
    foregroundColor: new Color(255, 255, 255),
    borderStyle: "double",
    padding: 2,
  })

  const text = new TextRenderable("Styled Box")
  text.setStyle({ textDecoration: "bold" })

  box.add(text)
  renderer.getRoot().add(box)
  renderer.start()
}

main()
```

**Concepts:** Colors, borders, padding, text decoration

---

### 2. Layout Examples

#### Flexbox Layout
```tsx
import { createCliRenderer } from "@opentui/core"
import { GroupRenderable, BoxRenderable, TextRenderable } from "@opentui/core"

async function main() {
  const renderer = await createCliRenderer()

  const container = new GroupRenderable()
  container.setStyle({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 2,
    width: 60,
  })

  const box1 = new BoxRenderable()
  box1.setStyle({ width: 10, backgroundColor: new Color(255, 0, 0) })
  box1.add(new TextRenderable("A"))

  const box2 = new BoxRenderable()
  box2.setStyle({ width: 10, backgroundColor: new Color(0, 255, 0) })
  box2.add(new TextRenderable("B"))

  const box3 = new BoxRenderable()
  box3.setStyle({ width: 10, backgroundColor: new Color(0, 0, 255) })
  box3.add(new TextRenderable("C"))

  container.add(box1)
  container.add(box2)
  container.add(box3)

  renderer.getRoot().add(container)
  renderer.start()
}

main()
```

**Concepts:** Yoga layout, flexDirection, justifyContent, gap

---

#### Nested Layouts
```tsx
import { createCliRenderer } from "@opentui/core"
import { GroupRenderable, BoxRenderable } from "@opentui/core"

async function main() {
  const renderer = await createCliRenderer()

  const root = new GroupRenderable()
  root.setStyle({ flexDirection: "column", height: 20 })

  // Header row
  const header = new GroupRenderable()
  header.setStyle({ flexDirection: "row", height: 3 })
  const headerBox = new BoxRenderable()
  headerBox.setStyle({ backgroundColor: new Color(50, 50, 50) })
  header.add(headerBox)

  // Content row
  const content = new GroupRenderable()
  content.setStyle({ flexDirection: "row", flexGrow: 1 })

  const sidebar = new BoxRenderable()
  sidebar.setStyle({ width: 20, backgroundColor: new Color(30, 30, 30) })

  const main = new BoxRenderable()
  main.setStyle({ flexGrow: 1, backgroundColor: new Color(40, 40, 40) })

  content.add(sidebar)
  content.add(main)

  root.add(header)
  root.add(content)

  renderer.getRoot().add(root)
  renderer.start()
}

main()
```

**Concepts:** Nested groups, flexGrow, complex layouts

---

### 3. Input Handling

#### Keyboard Events
```tsx
import { createCliRenderer } from "@opentui/core"
import { BoxRenderable, TextRenderable } from "@opentui/core"

async function main() {
  const renderer = await createCliRenderer()

  const status = new TextRenderable("Press any key...")

  renderer.on("key", (key) => {
    status.setText(`Key: ${key.name} ${key.ctrl ? "(Ctrl)" : ""}`)
  })

  const box = new BoxRenderable()
  box.add(status)
  renderer.getRoot().add(box)
  renderer.start()
}

main()
```

**Concepts:** Keyboard events, key names, modifiers

---

#### Interactive Form
```tsx
import { createCliRenderer } from "@opentui/core"
import {
  GroupRenderable,
  BoxRenderable,
  TextRenderable,
  InputRenderable,
} from "@opentui/core"

async function main() {
  const renderer = await createCliRenderer()

  const form = new GroupRenderable()
  form.setStyle({ flexDirection: "column", gap: 1 })

  const nameInput = new InputRenderable()
  nameInput.setPlaceholder("Name")

  const emailInput = new InputRenderable()
  emailInput.setPlaceholder("Email")

  const submitBox = new BoxRenderable()
  submitBox.setStyle({ borderStyle: "single" })
  submitBox.add(new TextRenderable("Submit"))

  submitBox.on("click", () => {
    console.log(`Name: ${nameInput.getValue()}`)
    console.log(`Email: ${emailInput.getValue()}`)
  })

  form.add(nameInput)
  form.add(emailInput)
  form.add(submitBox)

  renderer.getRoot().add(form)
  renderer.start()
}

main()
```

**Concepts:** Input components, form handling, click events

---

### 4. Lists & Scroll

#### Scrollable List
```tsx
import { createCliRenderer } from "@opentui/core"
import { ScrollBoxRenderable, TextRenderable } from "@opentui/core"

async function main() {
  const renderer = await createCliRenderer()

  const scrollBox = new ScrollBoxRenderable()
  scrollBox.setStyle({ width: 40, height: 15 })

  for (let i = 1; i <= 50; i++) {
    const text = new TextRenderable(`Item ${i}`)
    scrollBox.add(text)
  }

  renderer.getRoot().add(scrollBox)
  renderer.start()
}

main()
```

**Concepts:** ScrollBox, dynamic content

---

#### Interactive List
```tsx
import { createCliRenderer } from "@opentui/core"
import {
  GroupRenderable,
  BoxRenderable,
  TextRenderable,
} from "@opentui/core"

async function main() {
  const renderer = await createCliRenderer()
  const items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]
  let selectedIndex = 0

  const container = new GroupRenderable()
  container.setStyle({ flexDirection: "column" })

  const renderList = () => {
    container.clear()
    items.forEach((item, index) => {
      const box = new BoxRenderable()
      box.setStyle({
        backgroundColor:
          index === selectedIndex
            ? new Color(100, 149, 237)
            : new Color(30, 30, 30),
      })
      box.add(
        new TextRenderable(
          `${index === selectedIndex ? "> " : "  "}${item}`
        )
      )
      container.add(box)
    })
  }

  renderer.on("key", (key) => {
    if (key.name === "down") {
      selectedIndex = Math.min(selectedIndex + 1, items.length - 1)
      renderList()
    } else if (key.name === "up") {
      selectedIndex = Math.max(selectedIndex - 1, 0)
      renderList()
    }
  })

  renderList()
  renderer.getRoot().add(container)
  renderer.start()
}

main()
```

**Concepts:** List navigation, selection, dynamic rendering

---

### 5. Animations

#### Simple Animation
```tsx
import { createCliRenderer, Timeline } from "@opentui/core"
import { BoxRenderable, TextRenderable } from "@opentui/core"

async function main() {
  const renderer = await createCliRenderer()

  const box = new BoxRenderable()
  box.setStyle({
    width: 20,
    height: 5,
    borderStyle: "single",
  })
  box.add(new TextRenderable("Animated!"))

  const timeline = new Timeline({
    duration: 2000,
    easing: (t) => t * (2 - t), // easeOutQuad
  })

  timeline.to(box, { backgroundColor: new Color(255, 0, 0) }, {
    onUpdate: () => renderer.render(),
  })

  timeline.play()

  renderer.getRoot().add(box)
  renderer.start()
}

main()
```

**Concepts:** Timeline, easing, property animation

---

#### Pulsing Effect
```tsx
import { createCliRenderer, Timeline } from "@opentui/core"
import { BoxRenderable, TextRenderable } from "@opentui/core"

async function main() {
  const renderer = await createCliRenderer()

  const box = new BoxRenderable()
  box.setStyle({ width: 20, height: 5, borderStyle: "single" })
  box.add(new TextRenderable("Pulsing!"))

  const originalColor = new Color(30, 30, 30)
  const highlightColor = new Color(60, 60, 60)

  const timeline = new Timeline({
    duration: 1000,
    easing: (t) => t,
    loop: true,
  })

  timeline.to(
    box,
    { backgroundColor: highlightColor },
    {
      yoyo: true,
      from: { backgroundColor: originalColor },
      onUpdate: () => renderer.render(),
    }
  )

  timeline.play()

  renderer.getRoot().add(box)
  renderer.start()
}

main()
```

**Concepts:** Looping animations, yoyo effect

---

### 6. Real-World Examples

#### OpenCode (AI Coding Agent)

**Repository:** https://github.com/opencode-ai/opencode

**Features:**
- File explorer
- Code editor with syntax highlighting
- AI chat interface
- Multi-session support
- LSP integration

**Run:**
```bash
bun install opencode
opencode
```

---

#### cftop (CloudFlare Dashboard)

**Repository:** https://github.com/thedavejące/cftop

**Features:**
- Worker statistics
- Real-time metrics
- Interactive tables
- Navigation menus

---

#### critique (Git Review Tool)

**Repository:** https://github.com/kesuskese/critique

**Features:**
- Git diff visualization
- Review comments
- File navigation
- Status indicators

---

## Community Examples

### Component Libraries

#### Shadcn OpenTUI
**URL:** https://opentui.vercel.app/

**Components:**
- Button, Input, Select
- Modal, Dialog
- Table, List
- And more...

---

### Tools & Utilities

#### opentui-spinner
Spinner component for loading states

#### opentui-ui
Reusable UI component library

---

### Games & Demos

#### opentui-doom
DOOM running in the terminal using OpenTUI

#### present-drop
Festive terminal game

---

## Learning Path Examples

### Level 1: Beginner (1-2 days)
1. Hello World
2. Colors & Styling
3. Basic Layout
4. Simple Form

### Level 2: Intermediate (3-5 days)
5. Keyboard Navigation
6. Scrollable Lists
7. Simple Animations
8. Modal Dialogs

### Level 3: Advanced (1-2 weeks)
9. Complex Dashboard
10. Text Editor
11. Real-time Updates
12. Performance Optimization

---

## Finding More Examples

### GitHub Search
```bash
# Search for OpenTUI projects
# Query: "opentui" in:readme stars:>10

# Browse awesome list
# https://github.com/msmps/awesome-opentui
```

### Official Resources
- OpenTUI Examples: `/packages/core/src/examples/`
- React Examples: `/packages/react/README.md`
- Awesome List: https://github.com/msmps/awesome-opentui

## Contributing Examples

Have a great example? Share it!

1. **Fork and create** - Build your example
2. **Add to awesome list** - Submit PR to awesome-opentui
3. **Share in community** - Discord, Reddit, etc.

## Reference

- OpenTUI Examples: https://github.com/sst/opentui/tree/main/packages/core/src/examples
- Awesome OpenTUI: https://github.com/msmps/awesome-opentui
- OpenCode: https://github.com/opencode-ai/opencode
