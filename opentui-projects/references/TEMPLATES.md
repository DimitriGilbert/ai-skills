# OpenTUI Project Templates

## Template Overview

| Template | Use Case | Complexity | Features |
|----------|----------|------------|----------|
| minimal | Hello world, learning | ⭐ | Basic setup |
| basic-cli | CLI tools | ⭐⭐ | Menus, navigation |
| dashboard | Multi-panel apps | ⭐⭐⭐ | Sidebar, layout |
| form-app | Data entry | ⭐⭐ | Forms, validation |
| editor | Text editing | ⭐⭐⭐⭐ | Buffer, syntax |
| game | Games | ⭐⭐⭐ | Animation, input |

## Template: Minimal

### Purpose
Quick start for learning OpenTUI basics

### Structure
```
minimal-app/
├── package.json
├── tsconfig.json
└── src/
    └── main.tsx
```

### Files

**package.json**
```json
{
  "name": "minimal-opentui",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "bun run src/main.tsx"
  },
  "dependencies": {
    "@opentui/core": "latest"
  }
}
```

**src/main.tsx**
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

## Template: Basic CLI

### Purpose
Command-line tools with menus and navigation

### Structure
```
cli-app/
├── package.json
├── tsconfig.json
└── src/
    ├── main.tsx
    ├── menu.tsx
    └── components/
        └── MenuItem.tsx
```

### Files

**src/menu.tsx**
```tsx
import { GroupRenderable, BoxRenderable, TextRenderable } from "@opentui/core"

export function createMenu(items: string[], onSelect: (index: number) => void) {
  const container = new GroupRenderable()
  container.setStyle({
    flexDirection: "column",
    gap: 1,
  })

  let selectedIndex = 0

  items.forEach((item, index) => {
    const menuItem = new BoxRenderable()
    menuItem.setStyle({
      borderStyle: "single",
      padding: 1,
    })

    const text = new TextRenderable(item)
    menuItem.add(text)
    container.add(menuItem)
  })

  return container
}
```

**src/main.tsx**
```tsx
import { createCliRenderer } from "@opentui/core"
import { createMenu } from "./menu"

async function main() {
  const renderer = await createCliRenderer()

  const menu = createMenu(
    ["Option 1", "Option 2", "Option 3", "Exit"],
    (index) => {
      console.log("Selected:", index)
      if (index === 3) {
        renderer.destroy()
        process.exit(0)
      }
    }
  )

  renderer.getRoot().add(menu)
  renderer.start()
}

main()
```

## Template: Dashboard

### Purpose
Multi-panel dashboard applications with sidebar

### Structure
```
dashboard-app/
├── package.json
├── tsconfig.json
└── src/
    ├── main.tsx
    ├── layout/
    │   ├── AppShell.tsx
    │   ├── Sidebar.tsx
    │   └── MainPanel.tsx
    └── widgets/
        ├── StatsWidget.tsx
        └── ListWidget.tsx
```

### Files

**src/layout/AppShell.tsx**
```tsx
import { GroupRenderable, BoxRenderable } from "@opentui/core"

export function createAppShell() {
  const shell = new GroupRenderable()
  shell.setStyle({
    flexDirection: "column",
    width: 80,
    height: 30,
  })

  // Header
  const header = new BoxRenderable()
  header.setStyle({
    height: 3,
    borderStyle: "double",
  })

  // Content area
  const content = new GroupRenderable()
  content.setStyle({
    flexDirection: "row",
    flexGrow: 1,
  })

  shell.add(header)
  shell.add(content)

  return { shell, header, content }
}
```

**src/layout/Sidebar.tsx**
```tsx
import { BoxRenderable, TextRenderable } from "@opentui/core"

export function createSidebar() {
  const sidebar = new BoxRenderable()
  sidebar.setStyle({
    width: 20,
    borderStyle: "single",
  })

  const title = new TextRenderable("Navigation")
  title.setStyle({ textDecoration: "bold" })
  sidebar.add(title)

  return sidebar
}
```

**src/main.tsx**
```tsx
import { createCliRenderer } from "@opentui/core"
import { createAppShell } from "./layout/AppShell"
import { createSidebar } from "./layout/Sidebar"

async function main() {
  const renderer = await createCliRenderer()
  const { shell, content } = createAppShell()

  const sidebar = createSidebar()
  content.add(sidebar)

  renderer.getRoot().add(shell)
  renderer.start()
}

main()
```

## Template: Form App

### Purpose
Data entry applications with validation

### Structure
```
form-app/
├── package.json
├── tsconfig.json
└── src/
    ├── main.tsx
    ├── forms/
    │   ├── Form.tsx
    │   ├── Field.tsx
    │   └── Validation.tsx
    └── components/
        └── Input.tsx
```

### Files

**src/forms/Form.tsx**
```tsx
import { GroupRenderable, BoxRenderable, InputRenderable, TextRenderable } from "@opentui/core"

export interface FormField {
  name: string
  label: string
  type: "text" | "password" | "email"
  required: boolean
}

export function createForm(fields: FormField[], onSubmit: (data: any) => void) {
  const form = new GroupRenderable()
  form.setStyle({
    flexDirection: "column",
    gap: 1,
    width: 60,
  })

  const inputs: Map<string, InputRenderable> = new Map()

  fields.forEach(field => {
    const label = new TextRenderable(`${field.label}:`)
    if (field.required) {
      label.setStyle({ textDecoration: "bold" })
    }

    const input = new InputRenderable()
    if (field.type === "password") {
      // Configure password mode (if supported)
    }
    input.setPlaceholder(`Enter ${field.label.toLowerCase()}`)

    inputs.set(field.name, input)

    form.add(label)
    form.add(input)
  })

  // Submit button
  const submitButton = new BoxRenderable()
  submitButton.setStyle({ borderStyle: "single" })
  submitButton.add(new TextRenderable("Submit"))
  submitButton.on("click", () => {
    const data: any = {}
    inputs.forEach((input, name) => {
      data[name] = input.getValue()
    })
    onSubmit(data)
  })

  form.add(submitButton)

  return form
}
```

**src/main.tsx**
```tsx
import { createCliRenderer } from "@opentui/core"
import { createForm } from "./forms/Form"

async function main() {
  const renderer = await createCliRenderer()

  const form = createForm(
    [
      { name: "username", label: "Username", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "password", label: "Password", type: "password", required: true },
    ],
    (data) => {
      console.log("Form submitted:", data)
      renderer.destroy()
      process.exit(0)
    }
  )

  renderer.getRoot().add(form)
  renderer.start()
}

main()
```

## Template: Editor

### Purpose
Text editing with syntax highlighting

### Structure
```
editor-app/
├── package.json
├── tsconfig.json
└── src/
    ├── main.tsx
    ├── editor/
    │   ├── Editor.tsx
    │   ├── Buffer.tsx
    │   └── Cursor.tsx
    └── modes/
        ├── NormalMode.tsx
        └── InsertMode.tsx
```

### Files

**src/editor/Buffer.tsx**
```tsx
import { ScrollBoxRenderable, TextRenderable } from "@opentui/core"

export class Buffer {
  private scrollBox: ScrollBoxRenderable
  private lines: string[] = []

  constructor() {
    this.scrollBox = new ScrollBoxRenderable()
    this.scrollBox.setStyle({ width: 80, height: 20 })
  }

  load(content: string) {
    this.lines = content.split("\n")
    this.render()
  }

  render() {
    this.scrollBox.clear()
    this.lines.forEach(line => {
      this.scrollBox.add(new TextRenderable(line))
    })
  }

  insertLine(index: number, line: string) {
    this.lines.splice(index, 0, line)
    this.render()
  }

  getRenderable() {
    return this.scrollBox
  }
}
```

**src/editor/Editor.tsx**
```tsx
import { GroupRenderable, BoxRenderable } from "@opentui/core"
import { Buffer } from "./Buffer"

export function createEditor() {
  const editor = new GroupRenderable()
  editor.setStyle({
    flexDirection: "column",
    width: 80,
    height: 30,
  })

  // Status bar
  const statusBar = new BoxRenderable()
  statusBar.setStyle({
    height: 2,
    borderStyle: "single",
  })

  // Buffer
  const buffer = new Buffer()

  editor.add(buffer.getRenderable())
  editor.add(statusBar)

  return { editor, buffer, statusBar }
}
```

## Template: Game

### Purpose
Simple games with animation

### Structure
```
game-app/
├── package.json
├── tsconfig.json
└── src/
    ├── main.tsx
    ├── game/
    │   ├── Game.tsx
    │   ├── Loop.tsx
    │   └── Input.tsx
    └── entities/
        └── Player.tsx
```

### Files

**src/game/Loop.tsx**
```tsx
import { Timeline } from "@opentui/core"

export class GameLoop {
  private fps: number
  private interval: number
  private running: boolean = false

  constructor(fps: number = 60) {
    this.fps = fps
    this.interval = 1000 / fps
  }

  start(update: () => void) {
    this.running = true
    let lastTime = Date.now()

    const loop = () => {
      if (!this.running) return

      const now = Date.now()
      const delta = now - lastTime

      if (delta >= this.interval) {
        update()
        lastTime = now
      }

      setTimeout(loop, 0)
    }

    loop()
  }

  stop() {
    this.running = false
  }
}
```

**src/game/Game.tsx**
```tsx
import { BoxRenderable, TextRenderable } from "@opentui/core"
import { GameLoop } from "./Loop"

export function createGame() {
  const canvas = new BoxRenderable()
  canvas.setStyle({
    width: 40,
    height: 20,
    borderStyle: "single",
  })

  const score = new TextRenderable("Score: 0")
  canvas.add(score)

  const loop = new GameLoop(30)

  loop.start(() => {
    // Game logic here
    score.setText(`Score: ${Math.floor(Math.random() * 100)}`)
  })

  return canvas
}
```

## Custom Templates

### Creating Your Own Template

```bash
# Create template directory
mkdir my-opentui-template
cd my-opentui-template

# Initialize
bun init -y

# Add OpenTUI
bun add @opentui/core

# Create your template structure
mkdir -p src/{components,utils,types}

# Add template files
# ...

# Package as template
# Publish to npm or use locally
```

### Using Custom Template

```bash
# From local directory
bun create tui my-app --template ./my-opentui-template

# From npm (if published)
bun create tui my-app --template my-package-name
```

## Reference

- create-tui: https://github.com/msmps/create-tui
- OpenTUI Examples: https://github.com/sst/opentui/tree/main/packages/core/src/examples
- Awesome OpenTUI: https://github.com/msmps/awesome-opentui
