# Task 4: Compatibility Rules Extraction

## Research Objective
Extract and document all compatibility rules from the CLI code and documentation to create a comprehensive compatibility matrix.

## Context
You are researching the Better-T-Stack CLI tool to create comprehensive documentation for skill creation. The repository is located at `/home/didi/workspace/Code/skills/.search-data/better-t-stack/repo/`.

The compatibility documentation has already been partially read from `apps/web/content/docs/cli/compatibility.mdx`, but you need to verify and expand upon this by examining the actual implementation.

## Specific Tasks

### 1. Extract All Compatibility Rules
From both documentation and code, document all compatibility rules for:

**Database & ORM:**
- SQLite × ORMs
- PostgreSQL × ORMs
- MySQL × ORMs
- MongoDB × ORMs
- No database scenarios

**Backend & Runtime:**
- Bun × Backend frameworks
- Node.js × Backend frameworks
- Cloudflare Workers × Backend frameworks
- No backend scenarios

**Frontend & API:**
- All frontend frameworks × tRPC
- All frontend frameworks × oRPC
- No API scenarios

**Database Setup Providers:**
- Each provider × Database types
- Each provider × ORM types
- Each provider × Backend/Runtime

**Authentication:**
- Better-Auth × Backend options
- Better-Auth × Database options
- Clerk × Backend options
- No auth scenarios

**Addons:**
- Each addon × Frontend compatibility
- Each addon × Backend compatibility
- Addon interactions

**Examples:**
- Todo example × Stack requirements
- AI example × Stack requirements
- No example scenarios

**Deployment:**
- Web deploy × Frontend options
- Server deploy × Backend/Runtime options

### 2. Analyze Implementation
Search the codebase for:
- Validation functions
- Compatibility checks
- Error messages for invalid combinations
- Default value logic
- Automatic option setting (like with Convex)

### 3. Create Compatibility Matrices
Document all valid combinations in matrix format:
- Database × ORM matrix
- Backend × Runtime matrix
- Frontend × API matrix
- Database Setup × Database matrix
- Auth × Backend matrix
- Addon × Framework matrix

### 4. Document Automatic Adjustments
Find cases where the CLI automatically adjusts options:
- Convex backend automatic settings
- No backend automatic settings
- Other automatic adjustments

### 5. Identify Edge Cases
Find special compatibility cases:
- Frontend + Native combinations
- Multiple frontends (if allowed)
- Special runtime constraints
- Database-specific constraints

## Deliverables

Save your findings to `.search-data/better-t-stack/` as:

### `compatibility-rules.md`
Structure:
```markdown
# Compatibility Rules Reference

## Database & ORM Compatibility
### SQLite Combinations
### PostgreSQL Combinations
### MySQL Combinations
### MongoDB Combinations
### No Database Scenarios

## Backend & Runtime Compatibility
### Bun Runtime
### Node.js Runtime
### Cloudflare Workers Runtime
### No Backend Scenarios

## Frontend & API Compatibility
### tRPC Support Matrix
### oRPC Support Matrix
### No API Scenarios

## Database Setup Providers
### Turso
### Neon
### Supabase
### Cloudflare D1
### Docker
### MongoDB Atlas
### PlanetScale
### Prisma PostgreSQL

## Authentication Compatibility
### Better-Auth Requirements
### Clerk Requirements
### No Auth Scenarios

## Addon Compatibility
### PWA Support
### Tauri Support
### Other Addons
### Addon Interactions

## Example Compatibility
### Todo Example
### AI Example

## Deployment Compatibility
### Web Deployment
### Server Deployment

## Automatic Adjustments
### Convex Backend
### No Backend
### Other Automatics

## Validation Strategy
### Validation Order
### Error Messages
### Common Issues

## Compatibility Matrices
### Quick Reference Tables
### Decision Trees
### Flow Charts
```

## Research Sources
- Repository: https://github.com/AmanVarshney01/create-better-t-stack
- Local clone: `/home/didi/workspace/Code/skills/.search-data/better-t-stack/repo/`
- Compatibility docs: `apps/web/content/docs/cli/compatibility.mdx`
- CLI code: `apps/cli/src/`
- Validation code: Search for validation functions

## Instructions
1. Start with the compatibility documentation
2. Search codebase for validation logic
3. Extract all compatibility checks
4. Create comprehensive matrices
5. Document automatic adjustments
6. Provide examples of valid/invalid combos
7. Reference source files for all rules

## Notes
- Be exhaustive - document ALL rules
- Use tables and matrices for clarity
- Include examples of valid/invalid combos
- Reference specific code locations
- Document the WHY behind rules
- Keep information organized and easy to lookup
