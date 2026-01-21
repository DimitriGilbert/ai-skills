# AGENTS.md Refactoring Guide

This guide helps you refactor bloated or problematic AGENTS.md files using progressive disclosure principles.

## When to Refactor

Refactor your AGENTS.md if you:
- File is longer than 75 lines
- Added rules reactively over time (the "ball of mud" problem)
- Have conflicting instructions from different developers
- Auto-generated the file (never do this!)
- File has stale file paths or structure documentation
- Agent seems confused or ignores instructions

## Refactoring Process

### Step 1: Find Contradictions

Identify conflicting instructions. For each contradiction, ask the user which version to keep.

**Common contradiction areas:**
- Code style: functional vs class-based
- Error handling: throw vs return null
- Testing: test everything vs test non-trivial
- Comments: comment everything vs self-documenting code
- Naming: descriptive vs concise

**Example:**
```markdown
❌ Line 15: "Always use functional patterns"
❌ Line 42: "Use classes for React components"
→ Ask user: Which approach do you prefer?
```

### Step 2: Identify the Essentials

Extract only what belongs in the root AGENTS.md:

**Keep in root:**
- ✅ One-sentence project description
- ✅ Package manager (if not npm)
- ✅ Non-standard build/typecheck commands
- ✅ Links to progressive disclosure files
- ✅ Anything relevant to EVERY single task

**Move to separate files:**
- ❌ Language-specific style rules
- ❌ Framework-specific patterns
- ❌ Testing conventions
- ❌ API design guidelines
- ❌ Git workflow instructions

**Delete entirely:**
- ❌ Specific file paths
- ❌ Lists of files or modules
- ❌ Obvious advice ("write clean code")
- ❌ Redundant instructions (agent already knows)
- ❌ Vague platitudes ("be professional")

### Step 3: Group the Rest

Organize remaining instructions into logical categories:

**Common categories:**
- TypeScript conventions
- Testing patterns
- API design / Backend patterns
- Frontend / UI patterns
- Git workflow
- Deployment / Release process
- Security considerations

### Step 4: Create the File Structure

Design a progressive disclosure hierarchy:

**Example structure:**
```
docs/
├── TYPESCRIPT.md       # TypeScript patterns
├── TESTING.md          # Testing conventions
├── API.md              # API design patterns
├── FRONTEND.md         # React/Next.js patterns
└── SECURITY.md         # Security guidelines
```

**Or monorepo structure:**
```
/AGENTS.md                          # Monorepo-level
packages/api/AGENTS.md              # API-specific
packages/web/AGENTS.md              # Web-specific
docs/
├── MONOREPO.md                     # Monorepo patterns
├── SHARED_TYPESCRIPT.md            # Shared TS conventions
└── DEPLOYMENT.md                   # Deployment patterns
```

### Step 5: Create Progressive Disclosure Files

Each file should:
- Focus on one domain
- Use conversational tone
- Include examples where helpful
- Link to related files
- Describe principles, not prescriptions

**Example TYPESCRIPT.md:**
```markdown
# TypeScript Conventions

## Type Definitions

Prefer `interface` for object shapes that might be extended:
```typescript
interface User {
  id: string;
  name: string;
}
```

Use `type` for unions, intersections, and utility types:
```typescript
type Status = 'pending' | 'approved' | 'rejected';
type UserWithStatus = User & { status: Status };
```

## Generics

Name generic parameters descriptively:
```typescript
// Good
function getById<T extends { id: string }>(items: T[], id: string): T | undefined

// Avoid
function getById<T>(items: T[], id: string): T | undefined
```

## Related

- For testing patterns, see [TESTING.md](TESTING.md)
- For API conventions, see [API.md](API.md)
```

### Step 6: Update Root AGENTS.md

Create a minimal root AGENTS.md that points to the progressive disclosure files:

```markdown
# AGENTS.md

This is a React component library for accessible data visualization.

## Package Manager

This project uses pnpm.

## Build & Test

- Build: `pnpm build`
- Test: `pnpm test`
- Typecheck: `pnpm typecheck`

## Conventions

- For TypeScript patterns, see [docs/TYPESCRIPT.md](docs/TYPESCRIPT.md)
- For testing conventions, see [docs/TESTING.md](docs/TESTING.md)
- For component patterns, see [docs/COMPONENTS.md](docs/COMPONENTS.md)
```

## Refactoring Prompt

Use this prompt to refactor a bloated AGENTS.md:

```
I want you to refactor my AGENTS.md file to follow progressive disclosure principles.

1. **Find contradictions**: Identify any instructions that conflict with each other.
   For each contradiction, ask me which version I want to keep.

2. **Identify the essentials**: Extract only what belongs in the root AGENTS.md:
   - One-sentence project description
   - Package manager (if not npm)
   - Non-standard build/typecheck commands
   - Anything truly relevant to every single task

3. **Group the rest**: Organize remaining instructions into logical categories
   (e.g., TypeScript conventions, testing patterns, API design, Git workflow).

4. **Create the file structure**: Output:
   - A minimal root AGENTS.md with markdown links to the separate files
   - Each separate file with its relevant instructions
   - A suggested docs/ folder structure

5. **Flag for deletion**: Identify any instructions that are:
   - Redundant (the agent already knows this)
   - Too vague to be actionable
   - Overly obvious (like "write clean code")
```

## Before & After Examples

### Before: Bloated AGENTS.md (87 lines)

```markdown
# AGENTS.md

## Project

This is a React component library...

## Code Style

- Always use const instead of let
- Always use interface instead of type
- No semicolons
- Single quotes only
- Use functional patterns
- Avoid classes unless necessary
- Prefer composition over inheritance
- Use arrow functions for callbacks
- [20 more lines of style rules]

## File Structure

- src/components/ - React components
- src/utils/ - Utility functions
- src/hooks/ - Custom hooks
- src/types/ - TypeScript types
- src/tests/ - Test files

## Testing

- Always write tests for new code
- Use Vitest for unit tests
- Use Testing Library for components
- Mock external dependencies
- Test user behavior, not implementation
- [15 more lines of testing guidelines]

## Git Workflow

- Commit messages should be descriptive
- Use conventional commits
- Never commit directly to main
- [10 more lines]

[... 30 more lines]
```

### After: Minimal AGENTS.md (18 lines)

```markdown
# AGENTS.md

This is a React component library for accessible data visualization.

## Package Manager

This project uses pnpm.

## Build & Test

- Build: `pnpm build`
- Test: `pnpm test`
- Typecheck: `pnpm typecheck`

## Conventions

- For TypeScript patterns, see [docs/TYPESCRIPT.md](docs/TYPESCRIPT.md)
- For testing conventions, see [docs/TESTING.md](docs/TESTING.md)
- For component patterns, see [docs/COMPONENTS.md](docs/COMPONENTS.md)
- For Git workflow, see [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)
```

**Benefits:**
- ✅ 80% reduction in lines (87 → 18)
- ✅ Root file only loads essential info
- ✅ Domain-specific rules load only when needed
- ✅ File paths removed (no stale info risk)
- ✅ Conversational tone throughout

## Common Refactoring Patterns

### Pattern 1: Extract Language Rules

**Before:**
```markdown
## Code Style

- Use const instead of let
- Use interface over type
- [15 more TypeScript rules]
```

**After:**
```markdown
## Conventions

- For TypeScript patterns, see [docs/TYPESCRIPT.md](docs/TYPESCRIPT.md)
```

### Pattern 2: Remove File Paths

**Before:**
```markdown
## File Structure

- src/auth/handlers.ts - Authentication handlers
- src/auth/middleware.ts - Auth middleware
- src/auth/routes.ts - Auth routes
```

**After:**
```markdown
## Architecture

Authentication uses JWT tokens with refresh token rotation.
Look for modules matching **/auth/**/*.ts for implementation.
```

### Pattern 3: Soften Rigid Language

**Before:**
```markdown
- ALWAYS use const
- NEVER use any
- MUST write tests
```

**After:**
```markdown
- Prefer const over let
- Avoid any when possible
- Write tests for non-trivial code
```

### Pattern 4: Delete Obvious Advice

**Before:**
```markdown
- Write clean, readable code
- Follow best practices
- Be professional in comments
- Use meaningful names
```

**After:**
```markdown
(Deleted - agent already knows this)
```

## Verification After Refactoring

After refactoring, verify the new AGENTS.md using [VERIFICATION.md](VERIFICATION.md).

## Tips for Success

1. **Start small**: It's better to under-extract than over-extract
2. **Iterate**: Refactor in stages if the file is very large
3. **Get feedback**: Test with actual tasks to see if agent behavior improves
4. **Document decisions**: Add comments in separate files explaining why certain patterns are used
5. **Review periodically**: AGENTS.md should evolve with the project

## Time Estimates

| File Size | Refactoring Time |
|-----------|------------------|
| < 50 lines | 15-30 minutes |
| 50-100 lines | 30-60 minutes |
| 100-200 lines | 1-2 hours |
| 200+ lines | 2+ hours (consider iterative approach) |
