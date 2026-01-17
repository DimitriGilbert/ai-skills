# OpenTUI - Comprehensive Overview

**Research Date:** 2026-01-17
**Status:** Active Development (Not Production Ready)

## What is OpenTUI?

OpenTUI is a **TypeScript library for building terminal user interfaces (TUIs)**. It is a modern framework designed to bring component-based UI development patterns to the terminal, similar to how React or Vue work for web development.

### Key Characteristics
- **Language:** TypeScript (with Zig for high-performance rendering)
- **License:** MIT
- **Status:** In active development, not yet production-ready
- **GitHub Stars:** 6.4k+ (as of January 2026)
- **Maintainers:** SST (sst) and Anomaly (anomalyco)

### Problem It Solves
OpenTUI addresses the challenge of building rich, interactive terminal applications by providing:
1. A declarative component model (like React/Vue)
2. CSS-like flexbox layout via Yoga engine
3. Rich input handling (keyboard, mouse, clipboard)
4. Modern developer experience with TypeScript
5. Framework integrations (React, SolidJS, Vue)

---

## Core Architecture & Design

### Rendering System
- **CliRenderer:** The heart of OpenTUI that manages terminal output and orchestration
- **Rendering Loop:** Can run in "live" mode with target FPS, or on-demand when state changes
- **High Performance:** Uses Zig for low-level rendering operations

### Layout Engine
- **Yoga:** CSS Flexbox-like layout system
- **Features:**
  - flexDirection, justifyContent, alignItems
  - flexGrow, width, height
  - Absolute positioning
  - Gap, padding, margin
  - Responsive layouts

### Package Structure
```
@opentui/core      - Core library with imperative API and all primitives
@opentui/react     - React reconciler integration
@opentui/solid     - SolidJS reconciler integration
@opentui/vue       - Vue reconciler (unmaintained)
@opentui/go        - Go bindings (unmaintained)
```

---

## Key Features & Capabilities

### 1. Component System
OpenTUI provides a rich set of built-in components:

#### Core Components (Imperative API)
- **TextRenderable** - Text display with styling
- **BoxRenderable** - Container with borders and backgrounds
- **GroupRenderable** - Layout containers
- **InputRenderable** - Single-line text input
- **SelectRenderable** - Dropdown selection
- **ScrollBoxRenderable** - Scrollable content areas
- **CodeRenderable** - Syntax-highlighted code display

#### React/SolidJS Components
Declarative components with the same capabilities:
- `<text>`, `<box>`, `<input>`, `<select>`, `<scrollbox>`, `<textarea>`, `<code>`

### 2. Input Handling
- **Keyboard Input:**
  - Full key capture with modifiers (Ctrl, Shift, Alt)
  - Event-driven architecture
  - Hooks: `useKeyboard()` in React integration
  - Keypress events with detailed key information

- **Mouse Input:**
  - Click, double-click, drag
  - Scroll wheel support
  - Button state tracking
  - Modifier key handling

- **Clipboard:**
  - Paste event handling
  - Text paste capture

### 3. Color & Styling
- **RGBA Color System:**
  - Create from integers (0-255), floats (0.0-1.0), or hex
  - Parse color strings (hex, CSS names, "transparent")
  - Convert between formats
  - Alpha transparency support

- **Styling Options:**
  - backgroundColor, foregroundColor
  - Border styling
  - Padding and margins
  - Position (absolute/relative)

### 4. Animation System
- **Timeline-based Animations:**
  - Configurable duration and easing functions
  - Loop and autoplay options
  - Property interpolation
  - onUpdate callbacks

- **Animation Engine:**
  - Attach to renderer
  - Register multiple timelines
  - Performance-optimized

### 5. Debug Console
- **Built-in Console Overlay:**
  - Captures console.log, console.info, console.warn, console.error
  - Visual overlay at any terminal edge
  - Scrollable and focusable
  - Doesn't disrupt main interface

### 6. Framework Integrations

#### React Integration
```tsx
import { createCliRenderer } from "@opentui/core"
import { createRoot, useKeyboard } from "@opentui/react"

function App() {
  useKeyboard((key) => {
    if (key.name === "escape") process.exit(0)
  })

  return <text>Hello, world!</text>
}

const renderer = await createCliRenderer()
createRoot(renderer).render(<App />)
```

**Features:**
- Familiar React patterns
- Hooks: `useKeyboard`, `useRenderer`, `useTerminalDimensions`, `useTimeline`
- Component-based architecture
- State management with React state

#### SolidJS Integration
- Reactive programming model
- Fine-grained reactivity
- Same component set as React
- Performance-optimized

---

## Installation & Setup

### Prerequisites
- **Zig** must be installed on the system (required for building native modules)
- **Bun** or **npm** for package management

### Quick Start Methods

#### Method 1: create-tui (Recommended)
```bash
bun create tui
```

#### Method 2: Manual Installation
```bash
# Core library
bun install @opentui/core

# React integration
bun install @opentui/react @opentui/core react

# SolidJS integration
bun install @opentui/solid @opentui/core solid-js
```

### Running Examples
```bash
# Clone repository
git clone https://github.com/sst/opentui.git
cd opentui

# Install dependencies
bun install

# Run TypeScript examples
cd packages/core
bun run src/examples/index.ts
```

---

## Real-World Applications

### Notable Projects Built with OpenTUI

1. **OpenCode** (opencode.ai)
   - AI coding agent built for the terminal
   - Provider-agnostic (supports 75+ models)
   - LSP-enabled
   - Multi-session support
   - GitHub: https://github.com/opencode-ai/opencode

2. **Terminal Tools from awesome-opentui:**
   - **cftop** - Cloudflare Workers terminal interface
   - **critique** - Git change review TUI
   - **easiarr** - Arr applications manager
   - **red** - Redis terminal interface
   -tokscale** - Token usage tracker
   - **waha-tui** - WhatsApp HTTP API interface

3. **Libraries & Components:**
   - **opentui-spinner** - Spinner component
   - **opentui-ui** - UI component library

4. **Experimental/Fun Projects:**
   - **opentui-doom** - DOOM in terminal (framebuffer rendering)
   - **present-drop** - Festive terminal game

---

## Development Philosophy

### Design Principles
1. **Component-First:** Everything is a component with props and state
2. **Framework Agnostic:** Works with multiple frameworks via reconcilers
3. **Performance:** Zig-powered rendering engine
4. **Modern DX:** TypeScript, hot reloading, familiar patterns
5. **Flexible Layout:** CSS-like flexbox for complex layouts

### Common Use Cases
- CLI tools with rich interfaces
- Terminal-based dashboards
- Code editors and IDEs
- Interactive tutorials
- Data visualization in terminal
- System monitoring tools
- Chat interfaces
- Game development (text-based)

---

## Current Limitations

### Development Status
- **Not Production Ready:** Still in active development
- **API Instability:** May have breaking changes
- **Documentation:** Evolving, some areas incomplete
- **Unmaintained Packages:** Vue and Go bindings not actively maintained

### Requirements
- **Zig Dependency:** Must have Zig installed to build
- **Platform Support:** Primarily macOS, Linux, WSL, Git Bash
- **Terminal Compatibility:** Requires modern terminal with proper escape sequence support

---

## Comparison with Other TUI Libraries

| Feature | OpenTUI | blessed | ink | textual |
|---------|---------|---------|-----|----------|
| Language | TypeScript | JavaScript | React (JS) | Python |
| Declarative | Yes | Partial | Yes | Yes |
| Layout Engine | Yoga (Flexbox) | Custom | Yoga | Custom |
| Framework Integration | React, SolidJS | None | React only | None |
| Performance | High (Zig) | Medium | Medium | High |
| Type Safety | Excellent | Partial | Good | Good |
| Modern Dev Exp | Excellent | Basic | Excellent | Good |

---

## Community & Ecosystem

### Official Resources
- **Main Repo:** https://github.com/sst/opentui
- **Documentation:** In-repo markdown files
- **Examples:** packages/core/src/examples/
- **Awesome List:** https://github.com/msmps/awesome-opentui

### Community Projects
- **create-tui:** Project scaffolding tool (https://github.com/msmps/create-tui)
- **opentui-examples:** Community examples collection
- **Shadcn OpenTUI:** Component library (https://opentui.vercel.app/)

### Contributing
- Active contributor base (45+ contributors)
- MIT license
- Accepting contributions
- Contributing guide available

---

## Technical Deep Dives

### Renderer Architecture
The CliRenderer manages:
1. Terminal output and clearing
2. Input event handling (keyboard, mouse, clipboard)
3. Rendering loop with target FPS
4. Console overlay management
5. Layout calculation via Yoga

### Event System
- Event emitters on renderables
- Event types: CHANGE, INPUT, SUBMIT, FOCUS, BLUR
- Keyboard events with full key state
- Paste events for clipboard

### Performance Optimizations
1. **Zig Backend:** Native code for critical paths
2. **Efficient Rendering:** Only re-renders on changes
3. **Layout Caching:** Yoga caches calculations
4. **Timeline Engine:** Optimized animation updates

---

## Future Directions

### Planned Features
- Production-ready stability
- Enhanced documentation
- More component examples
- Performance improvements
- Better error messages
- Additional framework integrations

### Roadmap Items
- Stabilize API
- Improve Vue bindings or deprecate
- Expand component library
- Better testing utilities
- Performance profiling tools

---

## Learning Resources

### Official Documentation
- Getting Started Guide: `packages/core/docs/getting-started.md`
- Development Guide: Building, testing, and local dev linking
- Environment Variables: Configuration options
- API Reference: In-code documentation

### Tutorials & Examples
- React integration examples in `packages/react/README.md`
- Core examples in `packages/core/src/examples/`
- Community projects in awesome-opentui

### Video Content
- YouTube tutorials available
- Conference talks emerging
- Community demos and showcases

---

## Conclusion

OpenTUI represents a **modern approach to terminal UI development** that brings the best practices from web development (components, declarative patterns, CSS-like layouts) to the terminal environment. While still in development, it shows immense promise for building sophisticated terminal applications with developer-friendly APIs.

**Strengths:**
- Modern TypeScript-first approach
- Powerful layout system
- Multiple framework integrations
- High performance with Zig backend
- Active community and development

**Considerations:**
- Not production-ready yet
- Requires Zig installation
- API may change
- Some integrations unmaintained

**Best For:**
- Developers comfortable with TypeScript
- Projects needing rich terminal interfaces
- Teams wanting modern development patterns
- Building terminal-first applications (like OpenCode)

---

**Sources:**
- OpenTUI GitHub: https://github.com/sst/opentui
- OpenTUI Context7 Documentation: /sst/opentui
- Awesome OpenTUI: https://github.com/msmps/awesome-opentui
- OpenCode: https://opencode.ai, https://github.com/opencode-ai/opencode
- create-tui: https://github.com/msmps/create-tui
- npm @opentui/react: https://www.npmjs.com/package/@opentui/react
- Web Search Results: Various tutorials and community discussions (2025-2026)
