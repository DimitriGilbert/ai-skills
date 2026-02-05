# Subagent Templates

Complete templates for dispatching implementer, validator, and fixer subagents.

## Implementer Template

### Full Template

```
ROLE: Implementer
PHASE: [number] - [name]

MISSION:
Implement exactly what the plan specifies for this phase. You are responsible for creating or modifying code files according to the requirements. Do NOT validate your own work - a separate validator will check it.

PLAN REQUIREMENTS:
[Copy the specific requirements from the plan document for this phase]
Example:
- Create User table with id, email, password_hash, created_at fields
- Add proper foreign key constraints
- Use Drizzle ORM syntax
- Export all table definitions

INPUTS:
- Read first: [list files to examine before starting]
  Example: src/db/schema-example.ts (to understand the pattern)

- Reference: [section of plan to reference]
  Example: "Database Schema" section of plan

- Patterns: [existing patterns to follow]
  Example: Follow the table definition pattern in existing schema files

WORK:
[Specific tasks to complete in this phase]
Example:
1. Create src/db/schema.ts file
2. Define User table with pgTable
3. Define Product table with proper relations
4. Export all table definitions
5. Add TypeScript types for insert/select

OUTPUTS:
- Create: [files to create]
  Example: src/db/schema.ts, src/db/types.ts

- Modify: [files to modify]
  Example: src/db/index.ts (add schema export)

RULES:
- Implement exactly according to requirements
- Follow existing code patterns in the codebase
- Use proper TypeScript types (no "any" types)
- Add error handling where appropriate
- Do NOT validate your own work (validator will check)
- Do NOT run tests yourself
- Focus only on implementation

REPORT BACK:
When complete, report:
- Files created: [list with paths]
- Files modified: [list with paths]
- Confirmation: "Implementation complete, ready for validation"
- Any blockers encountered: [describe any issues]
```

### Example: Database Schema Implementer

```
ROLE: Implementer
PHASE: 1 - Database Schema

MISSION:
Implement the database schema for the e-commerce system using Drizzle ORM.

PLAN REQUIREMENTS:
- Define User table with id (serial primary key), email (text unique), password_hash (text), created_at (timestamp)
- Define Product table with id, name, description, price (decimal), stock (integer)
- Define Order table with id, user_id (FK to User), total (decimal), status (enum), created_at
- Define OrderItem table with id, order_id (FK to Order), product_id (FK to Product), quantity, price
- All foreign keys must have onDelete actions defined
- All timestamps default to NOW()
- Export all tables and create TypeScript types

INPUTS:
- Read first: None (first phase)
- Reference: Drizzle ORM documentation for pgTable syntax
- Patterns: Standard Drizzle schema patterns

WORK:
1. Create src/db/schema.ts
2. Import necessary functions from drizzle-orm/pg-core
3. Define users table with all required fields
4. Define products table with all required fields
5. Define orders table with user_id foreign key
6. Define order_items table with order_id and product_id foreign keys
7. Create TypeScript types for each table (InsertUser, User, etc.)
8. Export all tables and types

OUTPUTS:
- Create: src/db/schema.ts

RULES:
- Use Drizzle ORM pgTable syntax
- No "any" types in TypeScript
- All foreign keys must specify onDelete behavior
- Timestamps use timestamp() with defaultNow()
- Export everything that will be needed by other modules
- Do NOT validate - validator will check

REPORT BACK:
- Files created: src/db/schema.ts
- Confirmation: Implementation complete, ready for validation
- Any blockers: [none expected]
```

## Validator Template

### Full Template

```
ROLE: Validator
PHASE: [number] - [name]

MISSION:
Check that the implementation meets ALL requirements from the plan. You are NOT to modify any code - only validate it. If issues are found, report them clearly so a fixer can address them.

IMPLEMENTATION TO CHECK:
[Files that were created or modified by the implementer]
Example:
- src/db/schema.ts (created)
- src/db/index.ts (modified)

REQUIREMENTS FROM PLAN:
[Copy the exact requirements from the plan]
Example:
- User table must have id, email, password_hash, created_at
- Foreign keys must be defined with onDelete actions
- No "any" types allowed
- All tables must be exported

VALIDATION CHECKLIST:

□ STEP 1: Type Check (if applicable)
  Command: [project's type check command]
  Examples: pnpm run check-types, tsc --noEmit, mypy ., cargo check
  Expected: Zero type errors
  If fails: Note all type errors with file and line numbers

□ STEP 2: Build/Compile (if applicable)
  Command: [project's build command]
  Examples: pnpm run build, npm run build, cargo build, make
  Expected: Build succeeds
  If fails: Note all build errors

□ STEP 3: Code Quality (always applicable)
  Run: [project's quality checks]
  Examples: linting, formatting checks, unit tests if specified in plan
  Expected: All checks pass
  If fails: Note specific issues

□ STEP 4: Code Review (always applicable)
  Check each requirement:

  □ Requirement 1: [specific requirement]
     Status: [✓ Met / ✗ Not met]
     Notes: [if not met, explain what's wrong]

  □ Requirement 2: [specific requirement]
     Status: [✓ Met / ✗ Not met]
     Notes: [if not met, explain what's wrong]

  [Continue for all requirements...]

□ STEP 5: Code Quality Review
  □ Follows existing patterns in codebase?
  □ Proper types (no loose/any types if statically typed)?
  □ Proper error handling where needed?
  □ Correct exports (everything needed is exported)?
  □ Code is readable and well-organized?

OUTPUT FORMAT:

**Status**: PASS or FAIL

If PASS:
- All requirements met
- Type check: ✓
- Build: ✓
- Ready to proceed to next phase

If FAIL:
**Critical Issues** (must fix):
1. [File path:line] - [specific issue]
   Example: src/db/schema.ts:15 - Missing onDelete on user_id foreign key

2. [File path:line] - [specific issue]
   Example: src/db/schema.ts:23 - Using "any" type for created_at

**Warnings** (should fix):
1. [File path:line] - [specific issue]

**What needs to be fixed**:
- Add onDelete: 'cascade' to user_id foreign key in orders table
- Change created_at type from any to timestamp()
- Export OrderItem type (currently not exported)

RULES:
- Be thorough - check EVERY requirement
- Do NOT modify code - only report issues
- Provide specific file paths and line numbers
- Distinguish between critical issues and warnings
- If everything passes, clearly state PASS
```

### Example: Database Schema Validator

```
ROLE: Validator
PHASE: 1 - Database Schema

MISSION:
Validate that the database schema implementation meets all requirements.

IMPLEMENTATION TO CHECK:
- src/db/schema.ts (created by implementer)

REQUIREMENTS FROM PLAN:
- User table: id (serial PK), email (text unique), password_hash (text), created_at (timestamp)
- Product table: id, name, description, price (decimal), stock (integer)
- Order table: id, user_id (FK to User), total (decimal), status (enum), created_at
- OrderItem table: id, order_id (FK to Order), product_id (FK to Product), quantity, price
- All FKs have onDelete actions
- All timestamps default to NOW()
- All tables and types exported

VALIDATION CHECKLIST:

□ STEP 1: Type Check
  Command: pnpm run check-types
  Expected: Zero type errors

□ STEP 2: Build Check
  Command: pnpm run build
  Expected: Build succeeds

□ STEP 3: Code Review

  □ User table has all required fields
     Status: [check each field]

  □ Product table has all required fields
     Status: [check each field]

  □ Order table has FK to User with onDelete
     Status: [verify FK and onDelete present]

  □ OrderItem table has FKs to Order and Product
     Status: [verify both FKs]

  □ Timestamps use defaultNow()
     Status: [check all timestamp fields]

  □ All tables exported
     Status: [verify exports]

  □ TypeScript types created and exported
     Status: [verify InsertUser, User, etc.]

□ STEP 4: Code Quality
  □ No "any" types
  □ Proper Drizzle syntax
  □ Readable and organized

OUTPUT:
**Status**: [PASS or FAIL]

[If FAIL, list all issues with file:line numbers and specific fixes needed]
```

## Fixer Template

### Full Template

```
ROLE: Fixer
PHASE: [number] - [name]

MISSION:
Fix ALL issues reported by the validator. Your job is to make changes to the code so that it passes validation. Do NOT skip any issues - fix every single one.

VALIDATOR REPORT:
[Copy the FULL validator output here, including all issues]

ISSUES TO FIX:

Critical Issues:
1. [File:line] - [issue]
   Required fix: [what needs to be done]

2. [File:line] - [issue]
   Required fix: [what needs to be done]

[List ALL issues from validator report]

Warnings:
1. [File:line] - [issue]
   Required fix: [what needs to be done]

FILES TO MODIFY:
[List all files that have issues]
Example:
- src/db/schema.ts
- src/api/routes.ts

WORK:
For each issue:
1. Open the file
2. Locate the exact line
3. Make the fix
4. Verify the fix follows existing patterns
5. Move to next issue

RULES:
- Fix ALL issues - don't skip any
- Don't introduce new problems
- Match the existing code style
- Use the same patterns as existing code
- If a fix requires adding imports, add them
- Don't remove working code unnecessarily
- Make minimal changes - only fix what's broken

REPORT BACK:
When complete:
- Issues fixed: [list each one]
- Files modified: [list files]
- Changes made: [brief description of each change]
- Confirmation: "All issues fixed, ready for re-validation"
```

### Example: Database Schema Fixer

```
ROLE: Fixer
PHASE: 1 - Database Schema

MISSION:
Fix all issues found in the schema validation.

VALIDATOR REPORT:
**Status**: FAIL

**Critical Issues**:
1. src/db/schema.ts:42 - Missing onDelete on user_id foreign key in orders table
2. src/db/schema.ts:58 - Using "any" type for created_at in order_items table
3. src/db/schema.ts:75 - OrderItem type not exported (needed by other modules)

**Warnings**:
1. src/db/schema.ts:12 - Consider adding index on email field for faster lookups

**What needs to be fixed**:
- Add onDelete: 'cascade' to user_id foreign key
- Change created_at from any to timestamp().defaultNow()
- Export OrderItem type
- (Optional) Add index to email field

ISSUES TO FIX:

Critical Issues:
1. src/db/schema.ts:42 - Missing onDelete
   Fix: Add .references(() => users.id, { onDelete: 'cascade' })

2. src/db/schema.ts:58 - Wrong type for created_at
   Fix: Change to timestamp('created_at').defaultNow()

3. src/db/schema.ts:75 - OrderItem type not exported
   Fix: Add "export type OrderItem = typeof orderItems.$inferSelect"

Warnings:
1. src/db/schema.ts:12 - Add email index
   Fix: Add .index() to email field

FILES TO MODIFY:
- src/db/schema.ts

WORK:
1. Fix line 42: Add onDelete to user_id FK
2. Fix line 58: Change created_at to proper timestamp type
3. Fix line 75: Export OrderItem type
4. Fix line 12: Add index to email field

RULES:
- Fix all 4 issues
- Don't change anything else
- Match the Drizzle syntax used elsewhere
- Keep the same formatting style

REPORT BACK:
Issues fixed:
1. Added onDelete: 'cascade' to user_id FK in orders table (line 42)
2. Changed created_at to timestamp().defaultNow() in order_items (line 58)
3. Added export for OrderItem type (line 75)
4. Added index() to email field in users table (line 12)

Files modified:
- src/db/schema.ts

Changes made:
- Fixed foreign key reference to include onDelete behavior
- Corrected TypeScript type for timestamp field
- Exported missing type
- Added performance index

Confirmation: All issues fixed, ready for re-validation
```

## Dispatch Guidelines

### When to Dispatch Implementer

Dispatch implementer when:

- Starting a new phase
- Creating new files
- Adding new functionality
- Implementing requirements from plan

Provide implementer with:

- Clear requirements from plan
- List of files to read/reference
- List of files to create/modify
- Any existing patterns to follow

### When to Dispatch Validator

Dispatch validator when:

- Implementer reports completion
- After fixer makes changes
- Before moving to next phase

Provide validator with:

- Files to check
- Original requirements from plan
- Validation criteria (type check, build, code review)

### When to Dispatch Fixer

Dispatch fixer when:

- Validator returns FAIL status
- Specific issues identified

Provide fixer with:

- Complete validator report
- List of all issues
- Files that need modification

### Iteration Flow

```
Implementer
    ↓
Validator
    ↓
  PASS? ──Yes──> Next phase
    ↓
   No
    ↓
Fixer
    ↓
Validator
    ↓
  PASS? ──Yes──> Next phase
    ↓
   No
    ↓
[Repeat up to 3 times total]
    ↓
Still FAIL? ──> HALT and report to user
```

## Tips for Effective Dispatch

### 1. Be Specific

Don't say "implement the feature" - list exactly what needs to be done.

### 2. Reference the Plan

Always include the relevant section of the plan in the dispatch.

### 3. Set Clear Boundaries

Tell implementer: "Do NOT validate"
Tell validator: "Do NOT modify code"
Tell fixer: "Fix ALL issues, not just some"

### 4. Include Context

Provide enough context that the subagent can work independently.

### 5. Request Detailed Reports

Ask for specific confirmation of what was done, not just "done."

### 6. Handle Parallel Dispatches

When dispatching parallel implementers:

- Make sure each has independent tasks
- Each gets their own validator
- Track each one separately
