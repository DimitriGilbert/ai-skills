# OpenTUI Skill Development Recommendations

**Date:** 2026-01-17
**Purpose:** Recommendations for creating comprehensive OpenTUI skill(s)

---

## Executive Summary

Based on comprehensive research of OpenTUI, I recommend creating **THREE SPECIALIZED SKILLS** rather than a single monolithic skill. This approach allows for focused, actionable assistance while maintaining flexibility for different use cases.

### Recommended Skills
1. **opentui** - Core OpenTUI development assistance
2. **opentui-react** - React-specific OpenTUI development
3. **opentui-projects** - Project scaffolding and examples

---

## Rationale for Multi-Skill Approach

### Advantages
1. **Focused Expertise:** Each skill specializes in a specific aspect
2. **Faster Invocation:** Users get relevant help without unnecessary context
3. **Modular Maintenance:** Easier to update and maintain individual skills
4. **Clear Use Cases:** Users understand when to use each skill
5. **Framework Flexibility:** React and SolidJS users get tailored help

### Alternative Considered: Single Comprehensive Skill
**Pros:**
- All knowledge in one place
- Simpler initial development
- Easier cross-referencing

**Cons:**
- Slower invocation for specific tasks
- More context noise
- Harder to maintain
- Less targeted assistance

**Decision:** Multi-skill approach provides better user experience

---

## Skill 1: opentui (Core Development)

### Purpose
Provide comprehensive assistance for OpenTUI core development using the imperative API.

### Target Users
- Developers building TUIs with vanilla TypeScript/JavaScript
- Users who prefer imperative patterns
- Those building custom OpenTUI components
- Developers working with the core library directly

### Core Capabilities

#### 1. Project Setup & Installation
```yaml
Commands:
  - init: Initialize new OpenTUI project
  - install: Install OpenTUI dependencies
  - setup-dev: Configure development environment
```

**What it should do:**
- Guide users through installing Zig (required dependency)
- Install @opentui/core package
- Set up TypeScript configuration
- Create basic project structure
- Verify installation with test render

#### 2. Component Creation
```yaml
Commands:
  - create-component: Generate new OpenTUI component
  - add-box: Create BoxRenderable component
  - add-input: Create InputRenderable component
  - add-text: Create TextRenderable component
  - add-scrollbox: Create ScrollBoxRenderable component
  - add-select: Create SelectRenderable component
  - add-code: Create CodeRenderable component
```

**What it should do:**
- Generate component boilerplate code
- Provide common patterns for each component type
- Include proper typing (TypeScript)
- Add event handling examples
- Show styling options

#### 3. Layout Management
```yaml
Commands:
  - create-layout: Design flexbox layout with Yoga
  - add-group: Create GroupRenderable container
  - position-absolute: Configure absolute positioning
  - style-flexbox: Apply Yoga flexbox properties
```

**What it should do:**
- Explain Yoga layout system
- Generate flexbox layouts (flexDirection, justifyContent, etc.)
- Show absolute vs relative positioning
- Demonstrate nested layouts
- Provide responsive design patterns

#### 4. Input Handling
```yaml
Commands:
  - handle-keyboard: Add keyboard event handling
  - handle-mouse: Add mouse event handling
  - handle-paste: Add clipboard paste handling
  - create-keymap: Define key bindings
```

**What it should do:**
- Generate keyboard event handlers
- Show KeyEvent API usage
- Demonstrate modifier key handling (Ctrl, Shift, Alt)
- Implement mouse click, drag, scroll
- Handle clipboard paste events

#### 5. Styling & Colors
```yaml
Commands:
  - apply-colors: Use RGBA color system
  - add-theme: Create color theme
  - style-component: Apply component styles
  - parse-color: Demonstrate color parsing
```

**What it should do:**
- Explain RGBA color class
- Show color creation (fromInts, fromValues, fromHex)
- Demonstrate parseColor utility
- Apply styling to components
- Create reusable themes

#### 6. Animations
```yaml
Commands:
  - create-timeline: Setup Timeline animation
  - animate-property: Animate component property
  - add-easing: Apply easing function
  - loop-animation: Configure looping behavior
```

**What it should do:**
- Generate Timeline setup code
- Show property interpolation
- Demonstrate easing functions
- Implement looping and autoplay
- Attach animation engine to renderer

#### 7. Debugging
```yaml
Commands:
  - enable-console: Enable console overlay
  - debug-rendering: Debug rendering issues
  - debug-layout: Debug layout problems
  - profile-performance: Profile performance
```

**What it should do:**
- Enable console overlay
- Show debug rendering techniques
- Debug Yoga layout issues
- Profile rendering performance
- Display FPS and timing

#### 8. Testing
```yaml
Commands:
  - test-component: Create component tests
  - mock-input: Mock keyboard/mouse input
  - test-rendering: Test rendering output
```

**What it should do:**
- Generate test files
- Mock keyboard input
- Mock mouse interactions
- Test rendering output
- Use @opentui/core/testing utilities

### Knowledge Base Requirements
- OpenTUI core API reference
- Component rendering lifecycle
- Yoga layout engine documentation
- Event system architecture
- RGBA color system
- Timeline animation system
- Debug console API
- Testing utilities

### Example Interactions
```
User: "Create a login form with username and password inputs"
Skill: Generates BoxRenderable with two InputRenderables,
      proper layout with Yoga, keyboard navigation between fields

User: "Add animation to slide this box from left to right"
Skill: Generates Timeline with easing function, onUpdate callback

User: "Handle Ctrl+C to exit the application"
Skill: Adds keyboard event listener for Ctrl+C, calls renderer.destroy()
```

---

## Skill 2: opentui-react (React Integration)

### Purpose
Specialized assistance for building OpenTUI applications with React.

### Target Users
- React developers building terminal UIs
- Teams already using React for web apps
- Developers preferring declarative patterns
- Those using React ecosystem (Redux, React Query, etc.)

### Core Capabilities

#### 1. React Project Setup
```yaml
Commands:
  - init-react: Initialize React + OpenTUI project
  - setup-vite: Configure Vite for OpenTUI React
  - setup-webpack: Configure Webpack for OpenTUI React
```

**What it should do:**
- Install @opentui/react and dependencies
- Configure React rendering
- Set up TypeScript + React types
- Configure build tool (Vite/Webpack)
- Create example React component

#### 2. React Components
```yaml
Commands:
  - create-component: Generate React OpenTUI component
  - add-hooks: Add OpenTUI React hooks
  - create-layout: Build React layout with components
```

**What it should do:**
- Generate functional React components
- Use JSX syntax for TUI
- Apply styling via props
- Demonstrate component composition
- Show proper TypeScript typing

#### 3. React Hooks
```yaml
Commands:
  - use-keyboard: Add keyboard handling with useKeyboard
  - use-renderer: Access renderer with useRenderer
  - use-dimensions: Get terminal size with useTerminalDimensions
  - use-timeline: Create animations with useTimeline
  - use-focus: Manage focus state
```

**What it should do:**
- Explain each OpenTUI React hook
- Generate hook usage examples
- Show hook combinations
- Demonstrate custom hooks
- Handle hook dependencies properly

#### 4. State Management
```yaml
Commands:
  - add-state: Add React state for TUI
  - integrate-redux: Integrate Redux with OpenTUI
  - integrate-zustand: Integrate Zustand state
  - manage-focus: Manage component focus state
```

**What it should do:**
- Use React useState for components
- Integrate external state management
- Manage focus across components
- Handle form state
- Show state optimization patterns

#### 5. React Patterns
```yaml
Commands:
  - create-form: Build form with multiple inputs
  - create-list: Create scrollable list
  - create-modal: Build modal/overlay
  - create-tabs: Implement tabbed interface
  - create-menu: Build menu system
```

**What it should do:**
- Generate common UI patterns
- Show React-specific implementations
- Demonstrate component reuse
- Handle navigation between components
- Implement keyboard shortcuts

#### 6. Styling in React
```yaml
Commands:
  - apply-styles: Apply styles via props
  - create-theme: Create reusable theme object
  - dynamic-styles: Implement dynamic styling
  - conditional-styles: Apply conditional styles
```

**What it should do:**
- Show style prop usage
- Create theme objects
- Use conditional styling
- Apply styles based on state
- Demonstrate style composition

#### 7. Animation in React
```yaml
Commands:
  - animate-hook: Animate using useTimeline hook
  - transition-state: Animate state transitions
  - animate-layout: Animate layout changes
```

**What it should do:**
- Generate useTimeline implementations
- Animate component state changes
- Handle animation lifecycle
- Clean up animations properly
- Show animation composition

#### 8. Testing React Components
```yaml
Commands:
  - test-component: Test React OpenTUI component
  - mock-hooks: Mock OpenTUI hooks
  - test-events: Test event handling
```

**What it should do:**
- Generate React Testing Library tests
- Mock OpenTUI hooks
- Test keyboard/mouse events
- Test rendering output
- Test component interactions

### Knowledge Base Requirements
- React integration patterns
- OpenTUI React hooks API
- JSX for terminal UI
- React state management with OpenTUI
- React component lifecycle with TUI
- Testing React OpenTUI components
- Performance optimization for React

### Example Interactions
```
User: "Create a React component that lists files and handles selection"
Skill: Generates React component with <scrollbox>, <text> items,
      useKeyboard for navigation, useState for selection

User: "Add form validation to this input"
Skill: Adds React state for validation, error messages,
      onSubmit handler, visual feedback

User: "Integrate this with Redux"
Skill: Shows how to connect Redux to OpenTUI React components,
      use useSelector and useDispatch
```

---

## Skill 3: opentui-projects (Scaffolding & Examples)

### Purpose
Quick project creation and example exploration for OpenTUI.

### Target Users
- Developers starting new OpenTUI projects
- Those learning OpenTUI through examples
- Teams wanting to bootstrap quickly
- Developers exploring OpenTUI capabilities

### Core Capabilities

#### 1. Project Templates
```yaml
Templates:
  - minimal: Minimal OpenTUI setup
  - basic-cli: Basic CLI tool template
  - dashboard: Dashboard layout template
  - form-app: Form-based application template
  - editor: Text editor template
  - game: Simple game template
```

**What it should do:**
- Provide multiple project templates
- Generate complete project structure
- Include package.json, tsconfig.json
- Add example code for each template
- Include setup instructions

#### 2. Example Explorer
```yaml
Commands:
  - list-examples: List available examples
  - show-example: Display example code
  - run-example: Run example locally
  - explain-example: Explain how example works
```

**What it should do:**
- Catalog examples from opentui-examples repo
- Show example code with explanations
- Provide links to source
- Explain key concepts in each example
- Suggest learning paths

#### 3. create-tui Integration
```yaml
Commands:
  - create-project: Use create-tui CLI
  - select-template: Choose from create-tui templates
  - customize-template: Customize generated project
```

**What it should do:**
- Wrap create-tui CLI functionality
- Guide template selection
- Customize generated code
- Add additional features to templates
- Provide post-generation setup steps

#### 4. Component Library
```yaml
Commands:
  - list-components: List available components
  - show-component: Show component usage
  - copy-component: Copy component to project
  - customize-component: Customize component code
```

**What it should do:**
- Catalog all OpenTUI components
- Show usage examples
- Provide copy-paste ready code
- Show component props and events
- Demonstrate styling options

#### 5. Learning Path
```yaml
Commands:
  - beginner-path: Suggest beginner learning sequence
  - intermediate-path: Suggest intermediate projects
  - advanced-path: Suggest advanced projects
  - quiz: Test OpenTUI knowledge
```

**What it should do:**
- Suggest progressive learning path
- Recommend examples in order
- Provide challenges to solve
- Link to relevant documentation
- Test knowledge with quizzes

#### 6. Best Practices
```yaml
Commands:
  - show-patterns: Show common design patterns
  - performance-tips: Show performance optimizations
  - debugging-tips: Show debugging techniques
  - testing-tips: Show testing strategies
```

**What it should do:**
- Curate best practices from community
- Show common patterns with code
- Explain performance considerations
- Demonstrate debugging techniques
- Show testing strategies

#### 7. Project Migration
```yaml
Commands:
  - migrate-blessed: Migrate from blessed
  - migrate-ink: Migrate from ink
  - migrate-terminal: Migrate from other TUI libraries
```

**What it should do:**
- Compare OpenTUI with other libraries
- Show migration patterns
- Provide migration examples
- Highlight differences
- Suggest migration strategies

### Knowledge Base Requirements
- Project template library
- Example code catalog
- create-tui CLI documentation
- Component library reference
- Learning path design
- Best practices compilation
- Migration guides from other TUI libraries

### Example Interactions
```
User: "Create a new OpenTUI project with a dashboard layout"
Skill: Runs create-tui, generates dashboard template with
      sidebar, main content area, status bar

User: "Show me an example of a form with validation"
Skill: Displays form example from opentui-examples,
      explains validation approach, shows code

User: "What should I learn after basic components?"
Skill: Suggests learning path: layouts → input handling →
      animations → testing, with relevant examples
```

---

## Shared Components Across Skills

### Common Knowledge Base
All three skills should share access to:
- OpenTUI API reference
- Component documentation
- Styling guide
- Event handling patterns
- Testing approaches

### Cross-Skill Commands
```yaml
Shared Commands:
  - docs: Open relevant documentation
  - search: Search OpenTUI knowledge base
  - explain: Explain specific concept
  - debug: Help debug issue
  - optimize: Suggest optimizations
```

### Skill Integration
- Skills should reference each other when appropriate
- "Use /opentui-react for React-specific help"
- "Use /opentui-projects for quick scaffolding"
- Provide smooth transitions between skills

---

## Implementation Priority

### Phase 1: Core Foundation (Weeks 1-2)
1. **Skill: opentui** (Core Development)
   - Focus: Basic setup, core components, layout
   - Must-have: Project init, component creation, layout management
   - Nice-to-have: Advanced animations, testing

### Phase 2: React Integration (Weeks 3-4)
2. **Skill: opentui-react** (React Integration)
   - Focus: React setup, hooks, common patterns
   - Must-have: React project init, hooks, basic components
   - Nice-to-have: State management integration, advanced patterns

### Phase 3: Project Acceleration (Weeks 5-6)
3. **Skill: opentui-projects** (Scaffolding & Examples)
   - Focus: Templates, examples, learning paths
   - Must-have: Project templates, example explorer
   - Nice-to-have: Migration guides, quizzes

---

## Knowledge Source Strategy

### Primary Sources
1. **Context7 Documentation** (/sst/opentui)
   - Query documentation for API details
   - Always include source references
   - Update when documentation changes

2. **Official GitHub Repositories**
   - sst/opentui - Main repository
   - msmps/awesome-opentui - Curated resources
   - msmps/create-tui - Project scaffolding

3. **Example Code**
   - packages/core/src/examples/
   - packages/react/README.md
   - Community projects from awesome-opentui

### Secondary Sources
4. **Community Tutorials**
   - Blog posts and articles
   - YouTube videos
   - Community showcases

5. **NPM Packages**
   - @opentui/core
   - @opentui/react
   - @opentui/solid

### Source Maintenance
- Regularly update from Context7
- Track GitHub releases
- Monitor awesome-opentui for new resources
- Update examples from community

---

## Testing Strategy

### Skill Validation
For each skill, validate:
1. **Accuracy:** Code examples work with current OpenTUI version
2. **Completeness:** Covers main use cases
3. **Clarity:** Explanations are clear and actionable
4. **Source Attribution:** All information includes sources

### User Testing
- Test with real OpenTUI projects
- Get feedback from OpenTUI community
- Iterate based on usage patterns

### Continuous Improvement
- Track common questions
- Add missing capabilities
- Improve example quality
- Update with OpenTUI releases

---

## Documentation Requirements

### Skill Documentation
Each skill should have:
1. **Clear Purpose:** What problems it solves
2. **Target Users:** Who should use it
3. **Capabilities:** What it can do
4. **Examples:** Sample interactions
5. **Prerequisites:** What users need to know

### Internal Documentation
- Knowledge base structure
- Source references
- Update procedures
- Testing guidelines

---

## Success Metrics

### Adoption Metrics
- Number of users invoking each skill
- Frequency of use
- User satisfaction
- Community feedback

### Quality Metrics
- Accuracy of generated code
- Relevance of suggestions
- Source attribution completeness
- User-reported issues

### Learning Metrics
- User progression through learning paths
- Quiz completion rates
- Example exploration patterns
- Migration success rates

---

## Future Enhancements

### Potential Additional Skills
1. **opentui-solid** - SolidJS-specific assistance (if demand emerges)
2. **opentui-advanced** - Advanced patterns and optimization
3. **opentui-publishing** - Publishing and distribution guidance

### Skill Enhancements
1. **Interactive Tutorials** - Step-by-step guided learning
2. **Code Generation** - More sophisticated code generation
3. **Visual Preview** - Terminal rendering preview (if feasible)
4. **Performance Profiling** - Built-in performance analysis
5. **Collaboration Features** - Team workflow integration

---

## Conclusion

The recommended three-skill approach provides:

1. **Specialized Expertise** - Each skill focuses on specific needs
2. **Clear Use Cases** - Users know which skill to use
3. **Comprehensive Coverage** - All aspects of OpenTUI development
4. **Scalable Architecture** - Easy to extend and maintain
5. **Community Alignment** - Matches how developers work with OpenTUI

**Recommended Next Steps:**
1. Create /opentui skill first (core development)
2. Test with real OpenTUI projects
3. Gather feedback and refine
4. Create /opentui-react skill
5. Create /opentui-projects skill
6. Iterate based on usage

**Expected Impact:**
- Lower barrier to entry for OpenTUI
- Faster development time
- Better code quality
- Stronger community
- More OpenTUI adoption

---

**Research Sources:**
- OpenTUI GitHub: https://github.com/sst/opentui
- Context7: /sst/opentui (168 code snippets, High reputation, 86.4 benchmark)
- Awesome OpenTUI: https://github.com/msmps/awesome-opentui
- OpenCode: https://opencode.ai, https://github.com/opencode-ai/opencode
- Web search results for tutorials and examples (2025-2026)
- Community projects and discussions

**Documentation:**
- Overview: .search-data/research/opentui/overview.md
- Resources: .search-data/research/opentui/resources.md
- Recommendations: This document
