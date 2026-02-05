# Better-T-Stack CLI Research Plan

## Overview
Research the Better-T-Stack CLI tool to create comprehensive documentation for skill creation.

## Research Objectives

### Primary Goals
1. Understand the tool's architecture and purpose
2. Document all compatibility rules and constraints
3. Identify best practices and common patterns
4. Document edge cases and gotchas
5. Understand template structure and organization

### Specific Areas to Research

#### 1. Repository Structure
- Main directories and their purposes
- Entry points and core logic
- Configuration file handling
- Template system architecture

#### 2. Documentation Analysis
- All files in `web/content` directory
- README files (root and subdirectories)
- Any docs folder content
- Inline code documentation

#### 3. Compatibility Rules
Document all matrix of:
- Frontend frameworks (Next.js, Remix, SvelteKit, etc.)
- Backend frameworks (T3 Stack patterns)
- Database options (PostgreSQL, MySQL, SQLite, etc.)
- ORM options (Prisma, Drizzle, etc.)
- Authentication providers (NextAuth, Clerk, Lucia, etc.)
- Runtime environments (Node.js, Bun, Deno)

#### 4. Configuration Files
- bts.jsonc structure and all options
- Environment variable patterns
- Template-specific configurations
- Override mechanisms

#### 5. Template System
- How templates are organized
- Template inheritance and composition
- Variable interpolation
- Conditional logic in templates

#### 6. Usage Patterns
- `bts create` command workflows
- `bts add` command workflows
- Integration patterns
- Customization approaches

#### 7. Community Insights
- GitHub issues (common problems)
- GitHub discussions (best practices)
- Example projects
- Blog posts and tutorials

## Research Approach

### Phase 1: Repository Exploration
- Clone and explore repository structure
- Identify all documentation files
- Map out the codebase organization

### Phase 2: Documentation Deep Dive
- Read all README files
- Analyze web/content documentation
- Extract usage patterns and examples

### Phase 3: Compatibility Matrix
- Test command help outputs
- Analyze validation logic
- Document all supported combinations

### Phase 4: Template Analysis
- Understand template structure
- Identify template variables
- Document template inheritance

### Phase 5: Community Research
- Review GitHub issues
- Analyze discussions
- Find external resources

## Deliverables

Save findings to `.search-data/better-t-stack/`:
- `compatibility-rules.md` - Detailed compatibility matrix
- `best-practices.md` - Recommended patterns and approaches
- `common-patterns.md` - Common usage patterns and workflows
- `gotchas.md` - Edge cases and common pitfalls
- `templates-structure.md` - Template system documentation
- `research-sources.md` - Source references with URLs/file paths

## Research Sources

- Primary: GitHub repo - https://github.com/AmanVarshney01/create-better-t-stack
- Secondary: Context7 library search
- Tertiary: Web searches for examples and tutorials
