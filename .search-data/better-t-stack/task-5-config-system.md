# Task 5: Configuration System Analysis

## Research Objective
Analyze the configuration system to understand how bts.jsonc works, how it's used, and what information it contains.

## Context
You are researching the Better-T-Stack CLI tool to create comprehensive documentation for skill creation. The repository is located at `/home/didi/workspace/Code/skills/.search-data/better-t-stack/repo/`.

The bts-config documentation has already been read from `apps/web/content/docs/bts-config.mdx`, but you need to expand on this by examining the actual implementation.

## Specific Tasks

### 1. Understand bts.jsonc Structure
Analyze the bts.jsonc file format:
- All available fields and their purposes
- Field types and constraints
- Schema structure
- JSONC format features used
- Schema reference URL

### 2. Analyze Configuration Usage
Investigate:
- How the `init` command creates bts.jsonc
- How the `add` command reads and updates bts.jsonc
- How validation uses bts.jsonc
- How templates use bts.jsonc values
- How the schema file is used

### 3. Find Schema Definition
Locate and analyze:
- The schema file (referenced in $schema field)
- Schema validation rules
- Field descriptions and types
- Default values
- Required vs optional fields

### 4. Understand Configuration Flow
Trace how configuration is used:
- Creation during project init
- Reading during project detection
- Updating during add commands
- Validation of configuration
- Template variable injection

### 5. Document Configuration Fields
For each field in bts.jsonc, document:
- Field name and type
- Possible values
- Default value (if any)
- When it's used
- How it affects project generation

### 6. Find Configuration Examples
Look for:
- Example bts.jsonc files
- Test files with configuration
- Generated project examples

## Deliverables

Add configuration information to the appropriate deliverables (mainly compatibility-rules.md and best-practices.md):

**For `compatibility-rules.md`:**
Add a section on configuration-based validations

**For `best-practices.md`:**
Add a section on configuration management

**Create `config-system.md` if needed:**
```markdown
# Configuration System (bts.jsonc)

## Overview
### What is bts.jsonc
### Why it Exists
### When it's Used

## Configuration Structure
### File Format
### Schema Reference
### JSONC Features

## Configuration Fields
### version
### createdAt
### reproducibleCommand
### frontend
### backend
### runtime
### database
### orm
### api
### auth
### addons
### examples
### dbSetup
### webDeploy
### serverDeploy
### packageManager

## Configuration Lifecycle
### Creation
### Reading
### Updating
### Validation

## Configuration in Commands
### init Command
### add Command
### Other Commands

## Schema Definition
### Schema URL
### Validation Rules
### Type Definitions

## Configuration Examples
### Minimal Configuration
### Full-Stack Configuration
### Multi-Frontend Configuration
### Backend-Only Configuration

## Best Practices
### Managing Configuration
### Updating Projects
### Version Compatibility
```

## Research Sources
- Repository: https://github.com/AmanVarshney01/create-better-t-stack
- Local clone: `/home/didi/workspace/Code/skills/.search-data/better-t-stack/repo/`
- Config docs: `apps/web/content/docs/bts-config.mdx`
- Schema file: Check packages/types or schemas directory
- CLI code: Look for config reading/writing logic

## Instructions
1. Start with the bts-config documentation
2. Find and analyze the schema definition
3. Search codebase for config usage
4. Document all configuration fields
5. Understand the configuration lifecycle
6. Provide configuration examples
7. Reference source files for all information

## Notes
- Be thorough about all configuration fields
- Document the schema validation
- Explain when/how configuration is used
- Provide practical examples
- Reference the actual schema URL
- Include field types and constraints
