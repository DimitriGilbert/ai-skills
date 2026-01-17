# OpenTUI Learning Paths

## Overview

Structured learning paths for mastering OpenTUI, from beginner to advanced.

## Path 1: Absolute Beginner (2-3 weeks)

### Week 1: Foundation

#### Day 1-2: Setup & Basics
- [ ] Install Zig (required dependency)
- [ ] Install Bun or npm
- [ ] Set up TypeScript project
- [ ] Install @opentui/core
- [ ] Create "Hello World" app

**Project:** Minimal Hello World
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

---

#### Day 3-4: Core Components
- [ ] TextRenderable
- [ ] BoxRenderable
- [ ] GroupRenderable
- [ ] InputRenderable

**Project:** Simple Form
```tsx
import { GroupRenderable, InputRenderable, BoxRenderable, TextRenderable } from "@opentui/core"

function createForm() {
  const form = new GroupRenderable()
  form.setStyle({ flexDirection: "column", gap: 1 })

  const name = new InputRenderable()
  name.setPlaceholder("Name")

  const submit = new BoxRenderable()
  submit.setStyle({ borderStyle: "single" })
  submit.add(new TextRenderable("Submit"))

  form.add(name)
  form.add(submit)
  return form
}
```

---

#### Day 5-7: Styling & Layout
- [ ] Yoga layout basics
- [ ] Colors (RGBA)
- [ ] Borders & padding
- [ ] Text decoration

**Project:** Styled Dashboard
```tsx
const container = new GroupRenderable()
container.setStyle({
  flexDirection: "column",
  gap: 2,
  padding: 2,
})
```

---

### Week 2: Interactivity

#### Day 8-10: Input Handling
- [ ] Keyboard events
- [ ] Mouse events
- [ ] Input component events
- [ ] Focus management

**Project:** Interactive Menu
```tsx
renderer.on("key", (key) => {
  if (key.name === "down") {
    selectedIndex++
  }
})
```

---

#### Day 11-12: Lists & Scroll
- [ ] ScrollBoxRenderable
- [ ] Dynamic list rendering
- [ ] List navigation

**Project:** File List
```tsx
const scrollBox = new ScrollBoxRenderable()
files.forEach(file => {
  scrollBox.add(new TextRenderable(file.name))
})
```

---

#### Day 13-14: State Management
- [ ] Component state
- [ ] Event-driven updates
- [ ] Data flow

**Project:** Todo List
```tsx
let todos = []

function addTodo(text: string) {
  todos.push({ text, done: false })
  renderTodos()
}
```

---

## Path 2: React Developer (2-3 weeks)

### Prerequisites
- Familiarity with React
- JSX knowledge
- Hooks understanding

### Week 1: React Integration

#### Day 1-2: Setup
- [ ] Install @opentui/react
- [ ] Configure React renderer
- [ ] Create basic React component

**Project:** React Hello World
```tsx
import { createRoot } from "@opentui/react"

function App() {
  return <text>Hello from React!</text>
}

const renderer = await createCliRenderer()
createRoot(renderer).render(<App />)
```

---

#### Day 3-5: React Hooks
- [ ] useKeyboard
- [ ] useRenderer
- [ ] useTerminalDimensions
- [ ] useTimeline

**Project:** Interactive Counter
```tsx
function Counter() {
  const [count, setCount] = useState(0)

  useKeyboard((key) => {
    if (key.name === "up") setCount(c => c + 1)
  })

  return <text>Count: {count}</text>
}
```

---

### Week 2: React Patterns

#### Day 6-8: Component Patterns
- [ ] Controlled components
- [ ] Compound components
- [ ] Render props
- [ ] Higher-order components

**Project:** Form Component
```tsx
function Form() {
  const [values, setValues] = useState({})

  return (
    <box flexDirection="column">
      <input
        value={values.name}
        onChange={(v) => setValues({...values, name: v})}
      />
    </box>
  )
}
```

---

#### Day 9-10: State Management
- [ ] Context API
- [ ] Redux integration
- [ ] Zustand integration

**Project:** App with Context
```tsx
const AppContext = createContext({})

function Provider({ children }) {
  const [state, setState] = useState({})
  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  )
}
```

---

### Week 3: Advanced React

#### Day 11-14: Advanced Topics
- [ ] Custom hooks
- [ ] Performance optimization
- [ ] Testing React components

**Project:** Full-featured Dashboard

---

## Path 3: SolidJS Developer (2-3 weeks)

### Week 1: SolidJS Basics

#### Day 1-3: Signals & Reactivity
- [ ] createSignal
- [ ] createMemo
- [ ] createEffect

**Project:** Signal Counter
```tsx
function Counter() {
  const [count, setCount] = createSignal(0)

  return <text>{count()}</text>
}
```

---

#### Day 4-7: SolidJS Components
- [ ] Component patterns
- [ ] Show/For/Switch
- [ ] Stores (createStore)

**Project:** Todo App with Signals
```tsx
const [todos, setTodos] = createStore({
  items: []
})
```

---

### Week 2: SolidJS + OpenTUI

#### Day 8-10: Integration
- [ ] useKeyboard (Solid)
- [ ] useRenderer (Solid)
- [ ] Component lifecycle

**Project:** SolidJS TUI App

---

#### Day 11-14: Advanced SolidJS
- [ ] Fine-grained reactivity
- [ ] Performance optimization
- [ ] Resource management

---

## Path 4: Advanced Development (4-6 weeks)

### Week 1-2: Advanced Layouts

**Topics:**
- Complex Yoga layouts
- Absolute positioning
- Responsive design
- Custom layout engines

**Project:**
```
Multi-panel IDE with:
- File explorer (left)
- Code editor (center)
- Output panel (bottom)
- Status bar (top)
```

---

### Week 3-4: Advanced Features

**Topics:**
- Timeline animations
- Custom renderables
- Plugin architecture
- Event delegation

**Project:**
```
Animated dashboard with:
- Real-time data updates
- Smooth transitions
- Plugin system
```

---

### Week 5-6: Production Ready

**Topics:**
- Error handling
- Performance profiling
- Memory management
- Testing strategies
- Production deployment

**Project:**
```
Production TUI app with:
- Comprehensive error handling
- 95%+ performance scores
- Full test coverage
- CLI distribution
```

---

## Specialized Paths

### Path A: Game Development (3-4 weeks)

**Focus:**
- Game loops
- Input handling
- Sprite rendering
- Collision detection
- Sound (if available)

**Projects:**
1. Snake game
2. Tetris clone
3. Roguelike basics

---

### Path B: Data Visualization (2-3 weeks)

**Focus:**
- Chart rendering
- Graph layouts
- Real-time updates
- Data aggregation

**Projects:**
1. Line charts
2. Bar charts
3. System monitor

---

### Path C: Developer Tools (3-4 weeks)

**Focus:**
- File system operations
- Process management
- API integration
- Complex workflows

**Projects:**
1. File manager
2. Process monitor
3. Database client

---

## Learning Resources

### Official
- OpenTUI Docs: `.search-data/research/opentui/`
- GitHub Examples: https://github.com/sst/opentui
- Source Code: https://github.com/sst/opentui/tree/main/packages

### Community
- Awesome OpenTUI: https://github.com/msmps/awesome-opentui
- Discord (if available)
- Reddit r/opentui

### Reference
- Yoga Layout: https://yogalayout.com/
- Terminal Escape Codes: https://gist.github.com/fnky/458734346b0e3e4d3852b706a7a0b4a6

---

## Practice Projects

### Beginner Projects
1. **Hello World** - Basic rendering
2. **Counter** - State management
3. **Todo List** - Forms & lists
4. **Menu** - Navigation
5. **Form** - Input handling

### Intermediate Projects
6. **File Browser** - File system + lists
7. **Chat App** - Real-time updates
8. **Music Player** - Audio controls
9. **Weather App** - API integration
10. **Note App** - CRUD operations

### Advanced Projects
11. **Text Editor** - Syntax highlighting
12. **Terminal Emulator** - Process handling
13. **Database Client** - SQL + tables
14. **Git UI** - Version control
15. **IDE** - Complex multi-panel

---

## Assessment Checklist

### Beginner
- [ ] Can create basic OpenTUI app
- [ ] Understands core components
- [ ] Can style components
- [ ] Handles keyboard input
- [ ] Manages simple state

### Intermediate
- [ ] Builds complex layouts
- [ ] Uses lists & scrolling
- [ ] Implements forms
- [ ] Manages application state
- [ ] Handles errors gracefully

### Advanced
- [ ] Optimizes performance
- [ ] Creates custom components
- [ ] Implements animations
- [ ] Tests applications
- [ ] Ships production apps

---

## Tips for Success

1. **Build projects, not tutorials** - Create real apps
2. **Read source code** - Learn from OpenTUI internals
3. **Join community** - Share and learn
4. **Teach others** - Solidify knowledge
5. **Experiment** - Try new patterns

---

## Next Steps After Learning

1. **Contribute to OpenTUI**
2. **Publish component library**
3. **Create CLI tool**
4. **Share your projects**
5. **Mentor others**

---

## Reference

- OpenTUI Research: `.search-data/research/opentui/`
- Examples: `references/EXAMPLES.md`
- Templates: `references/TEMPLATES.md`
