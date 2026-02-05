# Task 3: Template System Analysis

## Research Objective
Analyze the template system to understand how project templates are structured, organized, and used to generate projects.

## Context
You are researching the Better-T-Stack CLI tool to create comprehensive documentation for skill creation. The repository is located at `/home/didi/workspace/Code/skills/.search-data/better-t-stack/repo/`.

## Specific Tasks

### 1. Understand Template Structure
Explore the template generator in `packages/template-generator/`:
- Template directory structure
- Template file naming conventions
- Template organization by component
- Template inheritance and composition
- Handlebars helper functions

### 2. Analyze Template Categories

**Database Templates:**
- `templates/db/drizzle/` - Drizzle ORM templates
- `templates/db/prisma/` - Prisma ORM templates
- `templates/db/mongoose/` - Mongoose ODM templates
- `templates/db/base/` - Base database templates

**Database Setup Templates:**
- `templates/db-setup/` - Database provider setups (Docker, Turso, Neon, etc.)

**Frontend Templates:**
- `templates/frontend/` - Frontend framework templates
- Subdirectories for each framework (next, nuxt, svelte, solid, tanstack-router, etc.)

**Backend Templates:**
- `templates/backend/` - Backend framework templates
- Subdirectories for each backend (hono, express, fastify, elysia, convex)

**API Templates:**
- `templates/api/` - API layer templates (tRPC, oRPC)

**Auth Templates:**
- `templates/auth/` - Authentication templates (better-auth, clerk)

**Addon Templates:**
- `templates/addons/` - Addon templates (pwa, tauri, biome, etc.)

**Payment Templates:**
- `templates/payments/` - Payment integration templates

### 3. Understand Template Variables
Look for:
- How templates receive variables
- Available template variables
- Conditional logic in templates
- Template helpers and functions
- Data interpolation

### 4. Analyze Template Generation Logic
Investigate:
- How templates are selected
- How templates are combined
- How variables are substituted
- How file paths are generated
- How template precedence works

### 5. Find Template Examples
Examine actual template files to understand:
- Real template structure
- Common patterns
- Conditional logic usage
- Variable references

## Deliverables

Save your findings to `.search-data/better-t-stack/` as:

### `templates-structure.md`
Structure:
```markdown
# Template System Structure

## Template Organization
### Directory Structure
### Naming Conventions
### Template Categories

## Template Variables
### Available Variables
### Variable Scopes
### Variable Interpolation

## Template Logic
### Conditionals
### Loops and Iteration
### Template Helpers
### Custom Helpers

## Template Categories
### Database Templates
### Frontend Templates
### Backend Templates
### API Templates
### Auth Templates
### Addon Templates
### Payment Templates

## Template Generation
### Selection Logic
### Combination Rules
### Precedence Order
### File Generation

## Template Examples
### Example Template Files
### Common Patterns
### Best Practices
```

## Research Sources
- Repository: https://github.com/AmanVarshney01/create-better-t-stack
- Local clone: `/home/didi/workspace/Code/skills/.search-data/better-t-stack/repo/`
- Template directory: `packages/template-generator/templates/`
- Generator code: `packages/template-generator/src/`

## Instructions
1. Explore the template directory structure
2. Read template generator source code
3. Examine actual template files
4. Understand template variable system
5. Document template organization
6. Provide concrete examples
7. Reference source files for all findings

## Notes
- Focus on how templates work, not just listing them
- Include actual template examples
- Explain template variables and helpers
- Document how templates are combined
- Reference specific template files
- Be comprehensive but organized
