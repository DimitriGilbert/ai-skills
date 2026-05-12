---
name: subagent-orchestration
description: Orchestrate multi-phase development workflows with strict role separation between implementers and validators. Automatically executes plans using separate subagents for implementation, validation, and fixing with auto-retry loops. Use when building complex systems requiring (1) Multi-step sequential or parallel development phases, (2) Automated validation with typecheck/build/tests after each phase, (3) Auto-retry fix loops until validation passes, (4) Complete execution after single user approval. Triggers include "implement this multi-phase plan", "build a system with phases", "create [complex system] following this architecture", "automate development workflow with validation", or any request for orchestrated development with multiple phases and quality checks. NOT for simple single-file tasks or exploratory coding.
---

# Orchestrator CLI

Orchestrate complex development workflows across multiple subagents with strict separation of implementation and validation roles.

## Core Principle

**User validates plan once at start, then orchestrator executes completely with no mid-flight stops.**

**YOU ARE THE ORCHESTRATOR**: You execute the plan by dispatching subagents through natural language. There is no code running this - you make all decisions about when to dispatch implementers, validators, and fixers based on the workflow described below.

**🚨 CRITICAL**: As the orchestrator, you NEVER write or generate code yourself. You NEVER read files to review code. You NEVER execute commands. You NEVER do any task yourself. You ONLY dispatch subagents. Your entire job is coordination — deciding who does what and when.

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
  ├─ For SINGLE-SUB-PHASE phases:
  │   ├─ YOU dispatch IMPLEMENTER subagent with COMPLETE requirements + NO-SLOP policy
  │   ├─ IMPLEMENTER runs gatekeeping commands (check-types, build) BEFORE reporting done
  │   ├─ YOU dispatch VALIDATOR subagent (different agent!) with STRINGENT instructions
  │   ├─ If validation FAILS:
  │   │   ├─ YOU dispatch FIXER subagent with ALL validator errors (fix ALL at once)
  │   │   ├─ FIXER runs gatekeeping commands BEFORE reporting done
  │   │   ├─ YOU dispatch VALIDATOR again
  │   │   └─ YOU REPEAT until validation PASSES (up to 3 attempts)
  │   └─ If validation PASSES:
  │       └─ Phase complete, move to next
  │
  ├─ For MULTI-SUB-PHASE phases (phase split into multiple sub-phases):
  │   ├─ For EACH sub-phase:
  │   │   ├─ Dispatch 1 IMPLEMENTER with COMPLETE requirements + NO-SLOP policy
  │   │   ├─ Implementer runs gatekeeping commands
  │   │   ├─ Dispatch 1 VALIDATOR right after (per-sub-phase validation)
  │   │   └─ If FAIL → fixer → validator ... UNTIL PASSES
  │   └─ When ALL sub-phases pass individual validation:
  │       ├─ Dispatch PHASE-WIDE VALIDATOR to read ALL sub-phase code together
  │       ├─ Phase-wide validator checks: integration, shared types, imports, coherence
  │       └─ Fix loop applies to phase-wide validation
  │
  └─ After all phases:
      └─ YOU report completion to user
```

**Key workflow rules**:
- **1 implementer per sub-phase → 1 validator per sub-phase → phase-wide validator → commit**
- **Validator right after each sub-phase** — do not batch validations
- **Fixers fix ALL validator errors at once** — not one at a time
- **check-types is MANDATORY** — every package created must have it, validators must verify

**Important**: "Automatic" means you execute all phases without stopping to ask the user - not that code runs this. YOU (the orchestrator) make all decisions and dispatch all subagents through natural language, but you NEVER write or generate code yourself.

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
    - Dispatch implementer with COMPLETE requirements + NO-SLOP policy: "Create src/db/schema.ts with tasks table following these exact requirements [paste complete requirements from plan]"
    - Implementer creates file, runs check-types + build
    - Dispatch validator: "Read and REVIEW src/db/schema.ts to verify all requirements are met, enforce NO-SLOP policy, then run check-types"
    - Validator: PASS ✓

2. **Phase 2: Database Client**
    - Dispatch implementer with COMPLETE requirements + NO-SLOP policy: "Create src/db/client.ts using schema, following these exact requirements [paste complete requirements from plan]"
    - Implementer creates file, runs check-types + build
    - Dispatch validator: "ACTUALLY READ src/db/client.ts, enforce NO-SLOP policy, check error handling, then run check-types and build"
    - Validator: FAIL (missing error handling in connection logic)
    - Dispatch fixer with ALL validator errors: "Fix all validator errors at once per validator report"
    - Fixer runs check-types + build
    - Dispatch validator again
    - Validator: PASS ✓

3. **Phase 3: Services (Parallel — each sub-phase gets its own validator)**
    - Dispatch 3 implementers simultaneously with COMPLETE requirements + NO-SLOP policy:
      - Implementer A: "Create task.service.ts following these exact requirements [paste from plan]"
      - Implementer B: "Create user.service.ts following these exact requirements [paste from plan]"
      - Implementer C: "Create auth.service.ts following these exact requirements [paste from plan]"
    - Each implementer runs check-types + build before reporting done
    - Dispatch validator RIGHT AFTER each implementer finishes:
      - Validator A checks task.service.ts → PASS ✓
      - Validator B checks user.service.ts → PASS ✓
      - Validator C checks auth.service.ts → PASS ✓
    - Phase-wide validator reads ALL three services together → checks integration, shared types, imports → PASS ✓

4. **Phase 4: API Routes**
    - Dispatch implementer with COMPLETE requirements: "Create API routes using services, following these exact requirements [paste from plan]"
    - Dispatch validator: "ACTUALLY READ all route files to verify requirements are met, then run type check and build"
    - Validator: PASS ✓

**Result**: Report to user "All 4 phases complete, 1 fix iteration in Phase 2"

This took 4 phases, 1 parallel phase, 1 fix loop - all executed without asking user.

## Critical Rules

### 🚨 CRITICAL: Orchestrator Code Generation Rule

**THE ORCHESTRATOR MUST NEVER WRITE OR GENERATE CODE**

The orchestrator's job is to:
- Dispatch subagents with the COMPLETE plan requirements
- Provide clear instructions on which part/phase to work on
- Coordinate the workflow and track progress
- **NOT write, modify, or generate any code yourself**

If you need code written, dispatch an implementer subagent with the complete requirements.

### 🚨 CRITICAL: Validator Code Review Rule

**THE VALIDATOR MUST ACTUALLY READ AND VALIDATE THE CODE**

The validator's job is to:
- **Read and understand every line of code created/modified**
- **Manually verify each requirement from the plan is met**
- Check code quality, patterns, and implementation details
- **NOT just run validation commands (typecheck, build, tests)**
- Report specific issues with file paths and line numbers

Running validation commands is important, but it's NOT enough. You MUST ACTUALLY REVIEW THE CODE by reading through it and verifying requirements.

### Rule 1: Strict Role Separation

**NEVER let one subagent do both implementation and validation.**

| Role            | Does                                        | Does NOT                |
| --------------- | ------------------------------------------- | ----------------------- |
| **Implementer** | Creates files, writes code, **runs gatekeeping commands** (typecheck, build) before reporting done | Skip gatekeeping checks |
| **Validator**   | **Reads code**, checks implementation, runs typecheck/build | Modify code             |
| **Fixer**       | Repairs issues found by validator, **runs gatekeeping commands** before reporting done | Validate the fix        |

### Rule 2: Implementers MUST Run Gatekeeping Commands

**Every implementer and fixer MUST run all gatekeeping commands (typecheck, build, etc.) on their own work BEFORE reporting completion.**

This is NOT validation — it is basic quality control. Implementers must:
1. Write the code
2. Run typecheck, build, and any other project-appropriate gatekeeping commands
3. Fix any errors found by those commands
4. Only report "done" once all gatekeeping commands pass cleanly

**Why**: No subagent should hand back broken code. Type errors and build failures are not acceptable deliverables. The validator's job is to review code quality and requirement compliance — not to catch basic compilation errors that the implementer should have caught themselves.

### Rule 3: Phase-Wide Validation for Multi-Sub-Phase Phases

**If a phase is split into multiple sub-phases with multiple implementers, per-sub-phase validation AND a phase-wide validator run are both MANDATORY.**

Flow for multi-sub-phase phases:
1. Dispatch sub-phase implementers (parallel or sequential)
2. Each implementer runs their own gatekeeping commands
3. **Dispatch 1 validator per sub-phase RIGHT AFTER each implementer finishes** (not batched)
4. Fix loop per sub-phase until each passes individually
5. **When ALL sub-phases pass**: dispatch a phase-wide validator that reads ALL code from ALL sub-phases together
6. The phase-wide validator checks: integration between sub-phases, shared types, imports, overall coherence
7. Fix loop applies to the phase-wide validation

**Why**: Individual sub-phase validators only check their slice. A phase-wide validator catches integration issues, mismatched interfaces, duplicate code, and inconsistencies across sub-phases that individual validators miss.

### Rule 4: Complete Execution

Once user approves plan:

- Execute all phases automatically
- No user interaction during execution
- Only stop if a phase fails after max fix attempts (3)
- Report final result to user

### Rule 5: Validation Loop

For each phase:

1. Dispatch implementer → create/modify files
2. Dispatch validator → **ACTUALLY READ AND REVIEW** the code, check requirements, run tests
3. If validation PASSES → phase complete, continue
4. If validation FAILS:
   - Dispatch fixer with **ALL** validator errors (fixer must fix ALL at once, not one at a time)
   - Dispatch validator again
   - REPEAT until pass or max attempts reached

### Rule 6: NO-SLOP Policy — MANDATORY for Every Dispatch

**Every dispatch to implementers and fixers MUST include the NO-SLOP policy. Every dispatch to validators MUST instruct them to enforce it.**

NO-SLOP rules — all of these are hard requirements, not suggestions:
- NO `any`, `as any`, `: any` ANYWHERE
- NO placeholder code, NO `// TODO`, NO `// FIXME`
- NO unused imports, NO unused variables — if a variable is not used, it must not exist
- NO console.log hacks to suppress errors. NO void hacks.
- Use `import type` for type-only imports (`verbatimModuleSyntax: true`)
- External imports first, blank line, then local imports
- ONE query/mutation per file, named export
- Do NOT start the dev server

Validators must be **STRINGENT**. Only production-quality code passes. Any slop is rejected.

### Rule 7: Phase Sizing — Must Fit in Agent Context

**Every phase must fit comfortably inside a single agent's context window. If a phase is too large, it MUST be split into sub-phases.**

Signs a phase is too large:
- More than ~15 files to create or modify
- Requirements that would produce more than ~500 lines of new code
- Multiple unrelated concerns crammed into one phase

When a phase is too large:
1. Split it into sub-phases, each with a clear, focused scope
2. Each sub-phase gets its own implementer → validator → fixer loop
3. After all sub-phases pass, a phase-wide validator checks integration
4. This avoids context compaction which degrades code quality

**Why**: When an agent's context fills up, compaction kicks in and quality drops precipitously. Large phases produce worse code because the agent loses track of earlier context. Smaller, focused phases produce better code.

## Dispatching Subagents

Use the templates in [references/subagent-templates.md](references/subagent-templates.md) when dispatching.

**Quick reference**:

- **Implementer**: Gets **COMPLETE** phase requirements from plan, creates/modifies files, does NOT validate
- **Validator**: Gets implementation + requirements, **ACTUALLY READS AND REVIEWS** the code thoroughly, runs typecheck/build/tests, does NOT modify code
- **Fixer**: Gets validator report, fixes all issues, does NOT validate

### When dispatching implementers:

ALWAYS provide:
1. **The COMPLETE requirements section from the plan** (not a summary)
2. **Specific instructions on which part/phase to proceed with**
3. **List of files to read** for context
4. **List of files to create/modify**
5. **Clear boundaries** - what they should and should NOT do
6. **Instruction to run gatekeeping commands** (check-types, build) and fix any errors BEFORE reporting completion
7. **The NO-SLOP policy** (see Rule 6) — paste it verbatim

### When dispatching validators:

ALWAYS provide:
1. **Files that were created/modified** (complete list)
2. **The COMPLETE requirements section from the plan**
3. **Validation criteria** (check-types, build, code review)
4. **Instruction to ACTUALLY READ the code**, not just run commands
5. **Instruction to enforce the NO-SLOP policy** — validators must be STRINGENT, only production code passes

### When dispatching fixers:

ALWAYS provide:
1. **ALL validator errors at once** — fixers must fix everything, not one at a time
2. **The NO-SLOP policy** — fixes must meet the same quality bar
3. **Instruction to run gatekeeping commands** before reporting done

**Example dispatch** (see templates for full format):

```
You are the Implementer for Phase 2 - Database Client.

Requirements from plan:
- Create connection pool using Drizzle
- Export typed database client
- Load DATABASE_URL from environment

Read: src/db/schema.ts (to understand schema)
Create: src/db/client.ts

NO-SLOP POLICY (MANDATORY):
- NO `any`, `as any`, `: any` ANYWHERE
- NO placeholder code, NO `// TODO`, NO `// FIXME`
- NO unused imports, NO unused variables
- Use `import type` for type-only imports
- External imports first, blank line, then local imports

Run check-types and build before reporting done.
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
- Each implementer runs gatekeeping commands before reporting done
- Wait for all to complete
- Validate each independently
- **Run a phase-wide validator** that reads ALL sub-phase code together
- Fix any failures
- All must pass before continuing

Example:

```
Phase 3: Core services (parallel)
  Dispatch simultaneously:
    - Implementer A: Git manager (runs typecheck/build before done)
    - Implementer B: Database manager (runs typecheck/build before done)
    - Implementer C: Manifest manager (runs typecheck/build before done)

  Wait for all three to complete

  Validate each:
    - Validator A checks Git manager
    - Validator B checks Database manager
    - Validator C checks Manifest manager

  If any fail, fix that specific one

  PHASE-WIDE VALIDATION (mandatory):
    - Validator D reads ALL three services together
    - Checks: shared types, imports between services, interface consistency,
      no duplicates, overall integration coherence
    - If fails → fix loop on affected files

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

**🚨 CRITICAL RULES - READ CAREFULLY**:

1. **YOU (orchestrator) MUST NEVER WRITE, READ, OR EXECUTE ANYTHING**
   - You ONLY dispatch subagents. No coding, no reading files, no running commands.
   - Always dispatch implementers with COMPLETE plan requirements
   - Give clear instructions on which part/phase to work on

2. **Validators MUST ACTUALLY READ AND VALIDATE THE CODE**
   - Reading code line-by-line is REQUIRED
   - Running commands alone is NOT sufficient
   - Manual verification of each requirement is mandatory

3. **NO-SLOP POLICY is MANDATORY** — included in every implementer/fixer dispatch, enforced by every validator. No `any`, no TODOs, no unused imports, no placeholder code. Only production-quality code passes.

4. **Implementers MUST run gatekeeping commands** (check-types, build) on their own work BEFORE reporting done. Every package created must have check-types configured.

5. **Multi-sub-phase phases**: 1 implementer → 1 validator per sub-phase RIGHT AFTER → phase-wide validator when all pass.

6. **Fixers fix ALL errors at once** — not one at a time. If the validator lists 5 issues, the fixer fixes all 5.

7. **Phases must fit in agent context** — if too large, split into sub-phases. Compaction degrades quality.

8. **Strict role separation**: implementer ≠ validator ≠ fixer
9. **Auto-retry fixes** up to 3 validation attempts per phase
10. **Halt only** on max retry failures or environment issues

## Reference Documentation

- [Plan Template](references/plan-template.md) - Structure for multi-phase plans
- [Subagent Templates](references/subagent-templates.md) - Full dispatch instructions
- [Workflow Patterns](references/workflow-patterns.md) - Sequential and parallel examples
- [Error Handling](references/error-handling.md) - Recovery strategies and debugging
