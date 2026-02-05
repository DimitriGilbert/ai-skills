---
name: orchestrator-cli
description: Orchestrate multi-phase development workflows with strict role separation between implementers and validators. Automatically executes plans using separate subagents for implementation, validation, and fixing with auto-retry loops. Use when building complex systems requiring (1) Multi-step sequential or parallel development phases, (2) Automated validation with typecheck/build/tests after each phase, (3) Auto-retry fix loops until validation passes, (4) Complete execution after single user approval. Triggers include "implement this multi-phase plan", "build a system with phases", "create [complex system] following this architecture", "automate development workflow with validation", or any request for orchestrated development with multiple phases and quality checks. NOT for simple single-file tasks or exploratory coding.
---

# Orchestrator CLI

Orchestrate complex development workflows across multiple subagents with strict separation of implementation and validation roles.

## Core Principle

**User validates plan once at start, then orchestrator executes completely with no mid-flight stops.**

**YOU ARE THE ORCHESTRATOR**: You execute the plan by dispatching subagents through natural language. There is no code running this - you make all decisions about when to dispatch implementers, validators, and fixers based on the workflow described below.

## Execution Model

**YOU execute this workflow** by dispatching subagents at each step:

```
START
  │
  ▼
User validates and approves plan
  │
  ▼
YOU execute each phase:
  ├─ For each phase:
  │   ├─ YOU dispatch IMPLEMENTER subagent
  │   ├─ YOU dispatch VALIDATOR subagent (different one!)
  │   ├─ If validation FAILS:
  │   │   ├─ YOU dispatch FIXER subagent
  │   │   ├─ YOU dispatch VALIDATOR again
  │   │   └─ YOU REPEAT until validation PASSES (up to 3 attempts)
  │   └─ If validation PASSES:
  │       └─ YOU move to next phase
  │
  └─ After all phases:
      └─ YOU report completion to user
```

"Automatic" means you execute all phases without stopping to ask the user - not that code runs this.

## Quick Start

### 1. Prepare the Plan

Create a detailed plan document specifying:

- Numbered phases with clear requirements
- Inputs (files to read) and outputs (files to create)
- Validation criteria for each phase
- Dependencies between phases
- Phase type: Sequential or Parallel

See [references/plan-template.md](references/plan-template.md) for full template.

### 2. Get User Approval

Present plan to user and confirm:

- "Execute this plan automatically?"
- Once approved, begin execution
- No further user interaction needed

### 3. Execute Automatically

For each phase:

1. Dispatch implementer → create/modify files
2. Dispatch validator → check requirements, run tests
3. If fails → dispatch fixer → re-validate
4. If passes → next phase

### 4. Report Results

After all phases complete:

- Success summary with statistics
- Or failure report with diagnostics

## Concrete Example

**User request**: "Build a task manager API with database, services, and routes"

**Your execution**:

1. **Phase 1: Database Schema**
   - Dispatch implementer: "Create schema.ts with tasks table"
   - Implementer creates file
   - Dispatch validator: "Check schema, run type check"
   - Validator: PASS ✓

2. **Phase 2: Database Client**
   - Dispatch implementer: "Create client.ts using schema"
   - Implementer creates file
   - Dispatch validator: "Check client, verify connection logic"
   - Validator: FAIL (missing error handling)
   - Dispatch fixer: "Add error handling per validator report"
   - Dispatch validator again
   - Validator: PASS ✓

3. **Phase 3: Services (Parallel)**
   - Dispatch 3 implementers simultaneously:
     - Create task.service.ts
     - Create user.service.ts
     - Create auth.service.ts
   - Validate each independently → all PASS ✓
   - Integration check (type check + build all together) → PASS ✓

4. **Phase 4: API Routes**
   - Dispatch implementer: "Create routes using services"
   - Validator: PASS ✓

**Result**: Report to user "All 4 phases complete, 1 fix iteration in Phase 2"

This took 4 phases, 1 parallel phase, 1 fix loop - all executed without asking user.

## Critical Rules

### Rule 1: Strict Role Separation

**NEVER let one subagent do both implementation and validation.**

| Role            | Does                                        | Does NOT                |
| --------------- | ------------------------------------------- | ----------------------- |
| **Implementer** | Creates files, writes code                  | Validate their own work |
| **Validator**   | Checks implementation, runs typecheck/build | Modify code             |
| **Fixer**       | Repairs issues found by validator           | Validate the fix        |

### Rule 2: Complete Execution

Once user approves plan:

- Execute all phases automatically
- No user interaction during execution
- Only stop if a phase fails after max fix attempts (3)
- Report final result to user

### Rule 3: Validation Loop

For each phase:

1. Implementer creates the work
2. Validator checks the work
3. If validation PASSES → phase complete, continue
4. If validation FAILS:
   - Dispatch fixer with validator report
   - Dispatch validator again
   - REPEAT until pass or max attempts reached

## Dispatching Subagents

Use the templates in [references/subagent-templates.md](references/subagent-templates.md) when dispatching.

**Quick reference**:

- **Implementer**: Gets phase requirements, creates/modifies files, does NOT validate
- **Validator**: Gets implementation + requirements, checks thoroughly, does NOT modify code
- **Fixer**: Gets validator report, fixes all issues, does NOT validate

**Example dispatch** (see templates for full format):

```
You are the Implementer for Phase 2 - Database Client.

Requirements from plan:
- Create connection pool using Drizzle
- Export typed database client
- Load DATABASE_URL from environment

Read: src/db/schema.ts (to understand schema)
Create: src/db/client.ts

Do NOT validate your work - a validator will check it.
Report when complete.
```

See [references/subagent-templates.md](references/subagent-templates.md) for complete templates with all sections.

## Phase Types

### Sequential Phases

Execute one at a time in order:

- Phase 1 complete → Phase 2 → Phase 3...
- Each phase must validate before next starts

Example:

```
Phase 1: Database schema
  Implement → Validate → Pass

Phase 2: Environment setup
  Implement → Validate → Pass

Phase 3: API implementation
  Implement → Validate → Pass
```

### Parallel Phases

Execute multiple sub-tasks simultaneously:

- Dispatch all implementers at once
- Wait for all to complete
- Validate each independently
- Fix any failures
- All must pass before continuing

Example:

```
Phase 3: Core services (parallel)
  Dispatch simultaneously:
    - Implementer A: Git manager
    - Implementer B: Database manager
    - Implementer C: Manifest manager

  Wait for all three to complete

  Validate each:
    - Validator A checks Git manager
    - Validator B checks Database manager
    - Validator C checks Manifest manager

  If any fail, fix that specific one

  All pass → continue to Phase 4
```

See [references/workflow-patterns.md](references/workflow-patterns.md) for more examples.

## Error Handling

### Implementer Fails

If implementer cannot complete:

- Log the failure reason
- Retry implementer (up to 2 times)
- If still failing → HALT execution
- Report to user: "Phase X failed during implementation"

### Validation Fails (Normal Flow)

If validator finds issues:

- This is expected, enter fix loop
- Dispatch fixer with validator report
- Re-validate the fixes
- Loop until pass or max attempts (3)

### Validation Fails After Max Attempts

If still failing after 3 fix attempts:

- HALT execution
- Report to user with full details:
  - Which phase failed
  - Validator's issue report
  - Files with problems
  - Suggestion to revise plan

### Dependencies Missing

If required files from previous phase don't exist:

- Previous phase didn't complete properly
- HALT and report issue
- Don't try to continue

See [references/error-handling.md](references/error-handling.md) for detailed recovery strategies.

## Progress Reporting

### During Execution (Optional)

Can report progress without requiring response:

```
Progress: Phase 3 of 7 complete
Current: Phase 4 - API Layer
Status: Implementing...
```

### Final Report - Success

```
EXECUTION COMPLETE

All [N] phases completed successfully.

Phases:
✓ Phase 1: [Name]
✓ Phase 2: [Name]
✓ Phase 3: [Name]
...

Statistics:
- Total fix iterations: [N]
- Files created: [N]
- Files modified: [N]

Build: ✓
Type check: ✓

Execution complete.
```

### Final Report - Failure

```
EXECUTION FAILED

Failed at Phase [X]: [Name]

After 3 fix attempts, validation still failing.

VALIDATOR REPORT:
[Specific issues found]

FILES WITH ISSUES:
[List files with line numbers]

SUGGESTION:
Review and update the plan, then re-execute.
```

## Prerequisites

- Development environment with build tools
- Project with validation commands appropriate to the language/framework:
  - **Type checking** if applicable (e.g., `tsc --noEmit`, `mypy`, type checking tools)
  - **Build/compile** if applicable (e.g., `npm run build`, `cargo build`, compilation steps)
  - **Code quality checks** for any language (linting, formatting, tests)
- Plan document following the template format (see references/plan-template.md)
- Ability to dispatch multiple subagent instances

Validation should be adapted to the project's language and tooling, not limited to TypeScript.

## Summary

**YOU execute the workflow**:

1. User approves plan once
2. YOU dispatch subagents for each phase (implementer → validator → fixer if needed)
3. YOU continue through all phases without user input
4. YOU report results at the end

**Key rules**:

- Strict role separation: implementer ≠ validator ≠ fixer
- Auto-retry fixes up to 3 validation attempts per phase
- Halt only on max retry failures or environment issues

## Reference Documentation

- [Plan Template](references/plan-template.md) - Structure for multi-phase plans
- [Subagent Templates](references/subagent-templates.md) - Full dispatch instructions
- [Workflow Patterns](references/workflow-patterns.md) - Sequential and parallel examples
- [Error Handling](references/error-handling.md) - Recovery strategies and debugging
