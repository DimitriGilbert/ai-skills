# Better-T-Stack Skill

Expert guidance for using the Better-T-Stack CLI to scaffold type-safe TypeScript projects.

## Overview

This skill provides comprehensive documentation for AI agents to use the Better-T-Stack CLI flawlessly. It covers:

- Complete CLI command reference with all flags and options
- Critical compatibility rules between frontend, backend, database, ORM, auth, and runtime
- Common stack patterns for different use cases (full-stack, backend-only, frontend-only, mobile, workers)
- Best practices and troubleshooting guidance
- Programmatic API usage for automation

## Skill Structure

```
better-t-stack/
├── SKILL.md                      # Main instructions for agents (254 lines)
├── references/
│   ├── COMPATIBILITY.md            # Complete compatibility rules (640 lines)
│   ├── OPTIONS.md                  # CLI options reference (274 lines)
│   └── BEST-PRACTICES.md          # Development best practices (495 lines)
└── examples/
    └── SETUPS.md                  # Example configurations (622 lines)

Total: 2,285 lines of documentation
```

## Critical Features Documented

### 1. Template System
Predefined stacks: `t3`, `mern`, `pern`, `uniwind`

### 2. Compatibility Rules
- Database × ORM pairing constraints
- Backend × Runtime compatibility (especially Cloudflare Workers)
- Frontend × API layer compatibility (tRPC vs oRPC)
- Addon frontend restrictions (PWA, Tauri)
- Auth provider compatibility

### 3. Astro Framework Support
Added complete Astro compatibility information:
- Not compatible with Convex backend
- Not compatible with tRPC API (use oRPC)
- Not compatible with Clerk + Convex
- Not compatible with AI example
- Supported by Self backend (fullstack)

### 4. Key CLI Commands
- `create` - New project with full customization
- `add` - Add features to existing projects
- `builder` - Visual stack builder
- `docs` - Open documentation
- `sponsors` - Show sponsors
- `history` - Creation history

## Usage

Load the skill to get expert guidance:
```bash
# In opencode
skill load better-t-stack
```

Or reference directly when working with Better-T-Stack CLI:
```
"Use the better-t-stack skill to create a full-stack TypeScript project"
```

## Review Status

**Reviewed by**: code-reviewer agent (2026-02-03)
**Score**: 8.5/10 (after fixes)
**Critical Issues Resolved**:
- ✅ Added template system documentation
- ✅ Fixed Astro compatibility gaps across all files
- ✅ Updated Self backend support (next, tanstack-start, nuxt, astro)

**Status**: Production-ready for agent use

## Sources

Based on:
- Official documentation: https://better-t-stack.dev/docs
- Source code: https://github.com/AmanVarshney01/create-better-t-stack
- CLI help: `npx create-better-t-stack@latest --help`

All claims reference specific file paths and line numbers for verification.

## Contributing

To improve this skill:
1. Test commands with actual Better-T-Stack CLI
2. Verify compatibility rules against source code
3. Add new patterns and examples
4. Update documentation for new CLI versions
