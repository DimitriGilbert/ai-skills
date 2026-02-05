# Task 2: CLI Implementation Analysis

## Research Objective
Analyze the CLI implementation to understand how the tool works internally, including validation logic, command handling, and project generation.

## Context
You are researching the Better-T-Stack CLI tool to create comprehensive documentation for skill creation. The repository is located at `/home/didi/workspace/Code/skills/.search-data/better-t-stack/repo/`.

## Specific Tasks

### 1. Understand CLI Structure
Explore the CLI code structure in `apps/cli/`:
- Entry points and main files
- Command definitions and handlers
- Validation logic
- Project generation pipeline
- Add command implementation

### 2. Analyze Key CLI Files

**Main Entry Point:**
- `apps/cli/src/index.ts` or similar - Main CLI entry
- `apps/cli/src/commands/` - Command implementations
- `apps/cli/src/utils/` - Utility functions
- `apps/cli/src/validations/` - Validation logic

**Key Areas to Investigate:**
- How `init` command is implemented
- How `add` command is implemented
- How compatibility validation works
- How project generation happens
- How prompts are structured

### 3. Extract Validation Logic
Look for:
- All validation rules (beyond what's in docs)
- Error messages and their triggers
- Compatibility checks implementation
- Edge case handling
- Default values and their logic

### 4. Understand Command Flow
Trace the flow for:
- `init` command execution
- `add` command execution
- Validation pipeline
- Template application
- Configuration file generation

### 5. Find Test Files
Analyze test files to understand:
- Expected behavior
- Edge cases
- Common use cases
- Error handling

## Deliverables

Save your findings to `.search-data/better-t-stack/` as:

### `gotchas.md`
Structure:
```markdown
# Common Gotchas and Edge Cases

## Common User Errors
### Database/ORM Mismatches
### Backend/Runtime Incompatibilities
### Frontend/API Issues
### Configuration Problems

## Edge Cases
### Empty Projects
### Multi-Frontend Projects
### Convex Special Cases
### Cloudflare Workers Constraints

## Validation Errors
### Error Messages and Solutions
### Common Triggers
### How to Fix

## Command-Specific Gotchas
### init Command
### add Command
### Other Commands

## Upgrade/Migration Issues
### Version Compatibility
### Breaking Changes
### Migration Paths
```

## Research Sources
- Repository: https://github.com/AmanVarshney01/create-better-t-stack
- Local clone: `/home/didi/workspace/Code/skills/.search-data/better-t-stack/repo/`
- CLI directory: `apps/cli/`
- Test directory: `apps/cli/test/`

## Instructions
1. Start by exploring the directory structure
2. Read key implementation files
3. Trace command flows
4. Extract validation logic
5. Analyze test files for edge cases
6. Document common gotchas with solutions
7. Reference source files for all findings

## Notes
- Focus on practical information that helps users
- Include actual error messages where found
- Provide concrete solutions to common problems
- Reference specific file paths and line numbers
- Organize by problem type for easy lookup
