# OpenTUI - Curated Resource List

**Last Updated:** 2026-01-17
**Purpose:** Comprehensive list of OpenTUI resources with source references

---

## Official Resources

### Core Repositories
| Resource | URL | Description |
|----------|-----|-------------|
| **OpenTUI Main Repository** | https://github.com/sst/opentui | Primary OpenTUI library (TypeScript + Zig) |
| **OpenTUI (Anomaly Fork)** | https://github.com/anomalyco/opentui | Alternative maintained fork |
| **npm @opentui/core** | https://www.npmjs.com/package/@opentui/core | Core package on npm |
| **npm @opentui/react** | https://www.npmjs.com/package/@opentui/react | React integration package |

**Source:** GitHub repositories and npm listings

### Documentation
| Resource | Location | Description |
|----------|----------|-------------|
| **Getting Started Guide** | `packages/core/docs/getting-started.md` | Core API and usage guide |
| **React README** | `packages/react/README.md` | React integration docs with examples |
| **Development Guide** | In-repo documentation | Building, testing, local dev linking |
| **Environment Variables** | In-repo documentation | Configuration options reference |

**Source:** Context7 query: `/sst/opentui` - "Getting Started with OpenTUI"

### Official Tools
| Tool | URL | Purpose |
|------|-----|---------|
| **create-tui** | https://github.com/msmps/create-tui | Project scaffolding CLI tool |

**Source:** Awesome OpenTUI list + GitHub search

---

## Starter Templates & Examples

### Project Initialization
| Tool | Command | Description |
|------|---------|-------------|
| **create-tui** | `bun create tui` | Quick project starter |
| **create-tui (React)** | `bun create tui --template react` | React-based TUI starter |

**Source:** Context7 query: `/sst/opentui` - "create-tui project setup"

### Example Collections
| Resource | URL | Description |
|----------|-----|-------------|
| **opentui-examples** | Listed in awesome-opentui | Collection of example projects |
| **Core Examples** | `packages/core/src/examples/` | Official TypeScript examples |
| **React Examples** | `packages/react/README.md` | React component examples |

**Source:** Awesome OpenTUI repository

### Standalone Examples
| Project | Description | Link |
|---------|-------------|------|
| **Shadcn OpenTUI** | Powerful, customizable terminal interface | https://opentui.vercel.app/ |
| **ZachJW34/open-tui** | Open WebUI terminal experience | https://github.com/ZachJW34/open-tui |

**Source:** Web search results

---

## Developer Tools Built with OpenTUI

### Productivity Tools
| Tool | Description | Source |
|------|-------------|--------|
| **cftop** | Cloudflare Workers terminal interface | awesome-opentui |
| **critique** | Git change review TUI | awesome-opentui |
| **easiarr** | Arr applications manager | awesome-opentui |
| **red** | Redis terminal interface | awesome-opentui |
| **tokscale** | Token usage tracker (OpenCode/Claude/Codex/Gemini/Cursor) | awesome-opentui |
| **waha-tui** | WhatsApp HTTP API interface | awesome-opentui |

**Source:** https://github.com/msmps/awesome-opentui

### Major Applications
| Application | Description | URL |
|-------------|-------------|-----|
| **OpenCode** | AI coding agent for terminal (75+ models, LSP-enabled) | https://opencode.ai |
| | GitHub Repository | https://github.com/opencode-ai/opencode |

**Source:** Web search "OpenCode terminal AI coding agent"

---

## Libraries & Components

### Component Libraries
| Library | Description | Source |
|---------|-------------|--------|
| **opentui-spinner** | Spinner component for OpenTUI | awesome-opentui |
| **opentui-ui** | UI component library built on @opentui/core | awesome-opentui |

**Source:** Awesome OpenTUI list

---

## Learning Resources

### Tutorials & Guides
| Resource | Format | Description | Source |
|----------|--------|-------------|--------|
| **OpenTUI Quick Start (Chinese)** | Blog Post | 30-minute tutorial for building first terminal app | https://blog.csdn.net/gitblog_00051/article/details/154369752 |
| **OpenTUI YouTube Introduction** | Video | Overview and demonstration | https://www.youtube.com/watch?v=_vkK1NK4NTs |
| **Creating a TUI Portfolio Site** | Article | TUI development patterns | https://medium.com/@compilecrafts/creating-a-tui-portfolio-site-1-10ea39b30aee |

**Source:** Web search results

### Video Tutorials
| Title | Platform | Description |
|-------|----------|-------------|
| **OpenTUI Introduction** | YouTube | Library overview and demo |
| **How I Built a TUI Without Leaving the Terminal** | Medium | Development experience and patterns |
| **Build a Real-life TUI Application** | YouTube | Practical TUI building tutorial |

**Source:** Web search results

---

## Documentation Deep Dives

### Context7 Documentation Queries
The following queries were made to `/sst/opentui` library:

1. **"What is OpenTUI, core concepts, architecture, key features"**
   - Resulted in comprehensive overview of renderer, console, installation

2. **"Component API Text Box Input Select ScrollBox Code examples"**
   - Resulted in detailed component examples and usage patterns

3. **"Layout engine Yoga flexbox CSS-like positioning"**
   - Resulted in layout system documentation with code examples

4. **"React SolidJS integration component development"**
   - Resulted in framework integration examples and patterns

5. **"Color management RGBA theme styling animations"**
   - Resulted in color system and animation documentation

6. **"create-tui project setup initialization quick start"**
   - Resulted in installation and quick start guides

**Source:** Context7 MCP tool queries

---

## Experimental & Fun Projects

### Games & Demos
| Project | Description | Source |
|---------|-------------|--------|
| **opentui-doom** | DOOM in terminal using framebuffer rendering | awesome-opentui |
| **present-drop** | Festive game - control Santa to drop presents | awesome-opentui |

**Source:** Awesome OpenTUI list

---

## Community Resources

### Curated Lists
| Resource | URL | Description |
|----------|-----|-------------|
| **Awesome OpenTUI** | https://github.com/msmps/awesome-opentui | Official curated list of resources |
| **Awesome TUIs** | https://github.com/rothgar/awesome-tuis | General TUI projects and libraries |
| **GitHub Topics: opentui** | https://github.com/topics/opentui | OpenTUI-related projects and discussions |

**Source:** Web search and GitHub exploration

### Community Discussions
| Platform | Description |
|----------|-------------|
| **LinkedIn Posts** | Community sharing and demos |
| **Reddit (r/sveltejs)** | Terminal UI framework discussions |
| **Dev.to** | TUI development experiences |

**Source:** Web search results

---

## Technical Documentation

### Core Concepts
| Topic | Source Location |
|-------|-----------------|
| **Renderer** | `packages/core/docs/getting-started.md` - "Renderer" section |
| **Console** | `packages/core/docs/getting-started.md` - "Console" section |
| **Colors (RGBA)** | `packages/core/docs/getting-started.md` - "Colors: RGBA" section |
| **Layout System** | Context7: "Layout System with Yoga" |
| **Keyboard Handling** | Context7: "Handle Keyboard Input with OpenTUI" |
| **Mouse Input** | Context7: "Mock Mouse Input - TypeScript" |

**Source:** Context7 queries and in-repo documentation

### Component API Reference
| Component | Example Source |
|-----------|----------------|
| **Input** | Context7: "Implement Text Input with OpenTUI" |
| **Select** | Context7: "Select Component for Dropdown Options (React)" |
| **ScrollBox** | Context7: "Scrollbox Component Example (React)" |
| **Textarea** | Context7: "Textarea Component for Multi-line Input (React)" |
| **Code** | Available in core package |

**Source:** Context7 query: "Component API Text Box Input Select ScrollBox Code"

### Animation & Effects
| Feature | Example Source |
|---------|----------------|
| **Timeline Animations** | Context7: "Create Animations with useTimeline Hook" |
| **Easing Functions** | Context7: "Timeline Animation with Easing in TypeScript" |

**Source:** Context7 query: "Color management RGBA theme styling animations"

---

## Framework-Specific Resources

### React Integration
| Resource | Description | Source |
|----------|-------------|--------|
| **@opentui/react README** | Comprehensive React integration guide | `packages/react/README.md` |
| **useKeyboard Hook** | Keyboard event handling examples | Context7: "Handle Keyboard Events with useKeyboard Hook" |
| **useTimeline Hook** | Animation management examples | Context7: "Create Animations with useTimeline Hook" |
| **Component Examples** | Text, Box, Input, Select, ScrollBox, Textarea | Context7: Various React component examples |

**Source:** Context7 queries and React README

### SolidJS Integration
| Resource | Description | Source |
|----------|-------------|--------|
| **@opentui/solid** | SolidJS reconciler package | Context7: "OpenTUI" summary |
| **Reactive Patterns** | Fine-grained reactivity examples | Context7: "React Integration for Terminal UIs" |

**Source:** Context7 query: "React SolidJS integration component development"

---

## Installation & Setup

### Installation Commands
```bash
# Quick start with create-tui
bun create tui

# Manual - Core
bun install @opentui/core

# Manual - React
bun install @opentui/react @opentui/core react

# Manual - SolidJS
bun install @opentui/solid @opentui/core solid-js
```

**Source:** Context7 query: "Install OpenTUI Packages"

### Prerequisites
| Requirement | Description |
|-------------|-------------|
| **Zig** | Required for building native modules |
| **Bun or npm** | Package manager |
| **TypeScript** | For development (recommended) |

**Source:** GitHub README and Context7 documentation

---

## Performance & Architecture

### Technical Details
| Aspect | Details | Source |
|--------|---------|--------|
| **Rendering Engine** | Zig-powered for high performance | GitHub repository |
| **Layout Engine** | Yoga (CSS Flexbox) | Context7: "Layout System with Yoga" |
| **Terminal Output** | CliRenderer manages output and events | Context7: "Getting Started - Renderer" |
| **Animation System** | Timeline-based with easing | Context7: "Timeline Animation with Easing" |

**Source:** Context7 queries and GitHub analysis

---

## Testing & Development

### Testing Utilities
| Resource | Description | Source |
|----------|-------------|--------|
| **Mock Mouse Input** | Testing mouse interactions | Context7: "Mock Mouse Input - TypeScript" |
| **Testing Framework** | `@opentui/core/testing` | In-repo testing documentation |

**Source:** Context7 query: "Component API" and testing docs

### Development Workflow
| Resource | Description | Location |
|----------|-------------|----------|
| **Development Guide** | Building, testing, debugging | In-repo documentation |
| **Contributing Guide** | How to contribute | `CONTRIBUTING.md` |
| **Local Development Linking** | Development workflow | Development Guide |

**Source:** GitHub repository structure

---

## Comparison & Alternatives

### Related Libraries
| Library | Language | Notes |
|---------|----------|-------|
| **blessed** | JavaScript | Older TUI library |
| **ink** | React (JS) | React for terminal (different approach) |
| **textual** | Python | Python TUI framework |
| **PyTermGUI** | Python | Python TUI with modular widgets |

**Source:** Context7 resolve-library-id results

---

## API Documentation

### Key APIs
| API | Description | Source |
|-----|-------------|--------|
| **createCliRenderer()** | Initialize renderer | Context7: Multiple examples |
| **RGBA** | Color management | Context7: "Working with RGBA Colors" |
| **Timeline** | Animation system | Context7: "Timeline Animation with Easing" |
| **KeyEvent** | Keyboard input type | Context7: "Handle Keyboard Input" |
| **useKeyboard()** | React keyboard hook | Context7: "Handle Keyboard Events" |
| **useTimeline()** | React animation hook | Context7: "Create Animations with useTimeline" |

**Source:** Context7 queries across multiple topics

---

## Platform & Compatibility

### Supported Platforms
| Platform | Status | Source |
|----------|--------|--------|
| **macOS** | Fully supported | GitHub README |
| **Linux** | Fully supported | GitHub README |
| **WSL** | Fully supported | GitHub README |
| **Git Bash** | Fully supported | GitHub README |
| **Windows (PowerShell/CMD)** | Supported via releases | GitHub README |

**Source:** GitHub README - "Running Examples" section

### Terminal Requirements
| Feature | Requirement |
|---------|-------------|
| **Escape Sequences** | Modern terminal with proper support |
| **Colors** | True color support recommended |
| **Mouse** | Mouse protocol support |

**Source:** Implied from documentation

---

## Package Statistics

### NPM Packages
| Package | Downloads | Updated | Source |
|---------|-----------|---------|--------|
| **@opentui/core** | Available on npm | Active | https://www.npmjs.com/package/@opentui/core |
| **@opentui/react** | Available on npm | 2 days ago | https://www.npmjs.com/package/@opentui/react |

**Source:** npm listings and web search

### GitHub Statistics
| Repository | Stars | Forks | Contributors | Source |
|------------|-------|-------|--------------|--------|
| **sst/opentui** | 6.4k+ | 248 | 45+ | GitHub |
| **awesome-opentui** | Active | 6 forks | Community | GitHub |

**Source:** GitHub repositories

---

## Additional Resources

### Articles & Blog Posts
| Title | Description | Source |
|-------|-------------|--------|
| **OpenTUI Terminal Graphics Acceleration** | WebGPU in terminal rendering (Chinese) | https://blog.csdn.net/gitblog_00407/article/details/154371138 |
| **How I Built a TUI Without Leaving the Terminal** | Development experience | https://medium.com/@samay15jan/how-i-built-a-tui-without-leaving-the-terminal-95958c5d4a7c |

**Source:** Web search results

### Third-Party Tools
| Tool | Description | Source |
|------|-------------|--------|
| **Together AI + OpenCode** | Using OpenCode with Together AI | https://docs.together.ai/docs/how-to-use-opencode |

**Source:** Web search results

---

## Resource Quality Indicators

### High Confidence Sources
- Official GitHub repositories (sst/opentui, anomalyco/opentui)
- Official npm packages
- In-repo documentation (README.md, getting-started.md)
- Context7 documentation queries (source reputation: High, benchmark: 86.4)

### Medium Confidence Sources
- Community tutorials (blog posts, videos)
- Awesome OpenTUI curated list
- Community projects (opentui-doom, shadcn-opentui)

### Emerging Sources
- LinkedIn community posts
- Reddit discussions
- Dev.to articles

---

## Keeping Updated

### Tracking Resources
| Resource | Frequency | Type |
|----------|-----------|------|
| **GitHub Releases** | Regular | Official updates |
| **npm Package Updates** | Regular | Version releases |
| **awesome-opentui** | Community-curated | New projects |
| **GitHub Topics** | Ongoing | Community discussions |

### Recommended Follows
- **sst** on GitHub (primary maintainer)
- **msmps** on GitHub (create-tui, awesome-opentui maintainer)
- **anomalyco** on GitHub (alternative fork maintainer)

---

**Research Methodology:**
1. Analyzed awesome-opentui repository structure and contents
2. Queried Context7 for `/sst/opentui` documentation across 6 topics
3. Performed web searches for tutorials, examples, and community resources
4. Cross-referenced GitHub repositories and npm packages
5. Verified sources and documented origins

**Total Sources Analyzed:** 20+ unique URLs, 6 Context7 queries, multiple web searches
