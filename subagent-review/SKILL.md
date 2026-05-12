---
name: subagent-review
description: Deep multi-agent code review with exploration, review, verification, and fix plan generation. Use when the user asks for a deep review, security review, code audit, or wants to find real problems in a codebase. Produces a fix plan compatible with subagent-orchestration. Triggers on "deep review", "code review", "security review", "audit the code", "find problems", "review the project".
---

# Subagent Review

Orchestrate a deep multi-agent code review. You coordinate — you do NOT explore, run commands, write code, or review code yourself. You dispatch subagents for every step.

## Core Principle

**You are the orchestrator. You dispatch agents, collect their output, and move to the next phase. You never do the work yourself.**

```
EXPLORATION → REVIEW → VERIFICATION → FIX PLAN
     │            │            │             │
  1 agent     N agents      N agents     1 agent
  maps files  find issues   kill false    orchestration-
              produce       positives     compatible plan
              reports
```

## Execution Flow

```
START
  │
  ▼
Phase 1: EXPLORATION (1 agent)
  │  Maps codebase, identifies review targets, groups files
  │  Excludes: third-party deps, generated code, UI component libs
  │  Output: .review/session-[id]/exploration-map.md
  │
  ▼
Phase 2: REVIEW (N agents, max 5 concurrent, max 15 files each)
  │  Each agent reviews assigned files for security + logic problems
  │  Each agent produces a findings report
  │  Output: .review/session-[id]/review-report-[N].md
  │
  ▼
Phase 3: VERIFICATION (N agents, max 5 concurrent, same count as review)
  │  Each verification agent checks one review report for false positives
  │  Reads the original code to confirm or dismiss each finding
  │  Output: .review/session-[id]/verified-report-[N].md
  │
  ▼
Phase 4: FIX PLAN (1 agent)
  │  Loads all verified reports + subagent-orchestration SKILL.md
  │  Produces an orchestration-compatible fix plan
  │  Output: .review/session-[id]/fix-plan.md
  │
  ▼
DONE — present fix plan to user
```

## Phase 1: Exploration

Dispatch ONE `explore` agent to map the codebase.

```
ROLE: Codebase Explorer
MISSION: Map the project structure and identify files that need review.

RULES:
- EXCLUDE third-party dependencies (node_modules, vendor, etc.)
- EXCLUDE generated code (build output, auto-generated files)
- EXCLUDE UI component libraries that are deps (e.g., shadcn components in components/ui/)
- EXCLUDE formedible library code
- ONLY include project source code — the code the project authors wrote
- Group files into logical clusters (max 15 files per cluster)
- Each cluster should contain related files (same module, same feature area)

OUTPUT: .review/session-[id]/exploration-map.md

The map must contain:
1. Project structure overview
2. List of ALL reviewable files grouped into clusters
3. For each cluster: file paths, what the cluster does, dependencies
4. Total number of clusters (= number of review agents to dispatch)
5. Recommended review focus per cluster (security, logic, data flow, etc.)

Do NOT review the code. Only map it.
```

### Reading the Exploration Map

After the explorer finishes, read `exploration-map.md` yourself to determine how many review agents to dispatch and what files to assign each one.

## Phase 2: Review

Dispatch N review agents based on the exploration map. **Max 5 agents at a time.** If N > 5, dispatch in batches.

```
ROLE: Code Reviewer - Cluster [N]
MISSION: Deep review of your assigned files for REAL problems.

ASSIGNED FILES:
[List exact file paths from exploration map, max 15 files]

CONTEXT:
[Brief description of what this cluster does, from exploration map]

REVIEW FOCUS:
[Security / Logic / Data flow / API contracts — from exploration map]

YOU MUST:
1. READ every file thoroughly — understand what it does and WHY
2. Understand the context before flagging anything
3. Only flag issues that are ACTUALLY problematic

YOU MUST NOT:
1. Flag stylistic preferences as issues
2. Flag things that are intentional design decisions
3. Flag missing tests (this is not a test audit)
4. Flag trivial things (unused imports, minor naming)
5. Flag type assertions, any casts, or patterns common in the framework
6. Nitpick — this is a focused security + logic review, not a lint pass

WHAT TO FLAG:
- Security vulnerabilities (injection, auth bypass, data exposure, unsanitized input)
- Logic errors (wrong conditions, off-by-one, race conditions, dead code paths)
- Data integrity issues (missing validation, incorrect transformations)
- API contract violations (wrong request/response handling)
- State management bugs (stale state, missing cleanup, improper async handling)
- Error handling gaps (swallowed errors, missing catch, unhandled edge cases)

OUTPUT: .review/session-[id]/review-report-[N].md

Format each finding as:

### [SEVERITY: CRITICAL/HIGH/MEDIUM] Finding [N]: [Title]
**File**: path/to/file.ts:[line-number]
**Problem**: [What is wrong and why it matters]
**Evidence**: [The specific code that is problematic]
**Impact**: [What could go wrong if not fixed]
**Suggestion**: [How to fix it, be specific]

If you find NO real issues, say so. An empty report is a valid outcome.
```

### Batch Dispatch

If the exploration map produces more than 5 clusters:

```
Batch 1: Clusters 1-5 → dispatch simultaneously, wait for all
Batch 2: Clusters 6-10 → dispatch simultaneously, wait for all
...continue until all clusters are reviewed
```

## Phase 3: Verification

Dispatch the SAME NUMBER of verification agents as review agents. Each verification agent checks ONE review report. **Max 5 agents at a time.**

```
ROLE: Verification Agent - Report [N]
MISSION: Verify the findings in review-report-[N].md to eliminate false positives.

REVIEW REPORT: .review/session-[id]/review-report-[N].md

YOU MUST:
1. Read the review report
2. For EACH finding in the report, READ THE ACTUAL SOURCE CODE at the referenced file:line
3. Verify the finding is REAL — does the code actually do what the report claims?
4. Understand the context — is this actually a problem given what the code is trying to do?
5. Check if the finding is a false positive based on:
   - Framework conventions (some patterns are normal in certain frameworks)
   - Intentional design decisions visible from context
   - Code that looks dangerous but is properly guarded elsewhere
   - Issues already handled in other parts of the codebase

OUTPUT: .review/session-[id]/verified-report-[N].md

For each finding, output one of:

### Finding [N]: [Title] — CONFIRMED
**Original**: [summary from review]
**Verification**: [Why this is a real issue, with code evidence]

### Finding [N]: [Title] — DISMISSED
**Original**: [summary from review]
**Reason**: [Why this is a false positive, with code evidence]

If ALL findings are dismissed, the report should say so clearly.
```

### Batch Dispatch

Same batch rules as Phase 2 — max 5 verification agents at a time.

## Phase 4: Fix Plan

Dispatch ONE agent to synthesize all verified findings into an orchestration-compatible fix plan.

```
ROLE: Fix Plan Generator
MISSION: Create a fix plan from verified review findings that is compatible with subagent-orchestration.

INPUTS:
- All verified reports: .review/session-[id]/verified-report-*.md
- Load the subagent-orchestration SKILL.md to understand the plan format
- Load the orchestration plan template to understand the required structure

OUTPUT: .review/session-[id]/fix-plan.md

RULES:
1. Only include CONFIRMED findings from verified reports — skip dismissed ones
2. Group related fixes into phases (fixes that touch the same files = same phase)
3. Each phase must follow the orchestration plan template:
   - Type: Sequential or Parallel
   - Requirements: Specific, actionable fix instructions
   - Inputs: Files to read
   - Outputs: Files to create or modify
   - Validation Criteria: How to verify the fix works
   - Dependencies: What must complete first
4. Include gatekeeping commands (typecheck, build) in the plan
5. Order phases by: security fixes first, then logic fixes, then lower priority
6. If there are no confirmed findings, produce a minimal plan that says "No fixes needed"

The fix plan MUST be directly executable by subagent-orchestration without modification.
```

### Fix Plan Format

The output must match the orchestration plan template:

```markdown
# Fix Plan - [Project Name] Review

## Overview
[Summary of findings and fixes]

## Prerequisites
- [Project tooling: pnpm, TypeScript, etc.]
- [Gatekeeping commands: typecheck, build]

## Gatekeeping Commands
- Type check: [command]
- Build: [command]

## Phase 1: [Fix Group Name]
**Type**: Sequential
**Dependencies**: None

**Requirements**:
- [Specific fix instruction with file:line reference]
- [Specific fix instruction]

**Inputs**:
- Read: [files needed]

**Outputs**:
- Modify: [files to change]

**Validation Criteria**:
- [How to verify fix]
- Type check: Zero errors
- Build: Success

---

[More phases as needed]

## Success Criteria
- All confirmed findings addressed
- Gatekeeping commands pass
- No new issues introduced
```

## File Structure

```
.review/
└── session-[id]/
    ├── exploration-map.md          # Phase 1 output
    ├── review-report-1.md          # Phase 2 outputs
    ├── review-report-2.md
    ├── ...
    ├── verified-report-1.md        # Phase 3 outputs
    ├── verified-report-2.md
    ├── ...
    └── fix-plan.md                 # Phase 4 output (orchestration-compatible)
```

## Critical Rules

1. **You NEVER do the work yourself** — explore, review, verify, or plan. You ONLY dispatch subagents.
2. **Max 5 subagents at a time** — batch everything above 5.
3. **Max 15 files per review agent** — split larger clusters.
4. **Exclude third-party code** — only review project source.
5. **No nitpicking** — the review prompt is explicit: security and logic problems only. Trivial findings waste everyone's time.
6. **Same number of verification agents as review agents** — one verification agent per review report.
7. **Fix plan must be orchestration-compatible** — follows the subagent-orchestration plan template exactly.
8. **The fix plan agent must load subagent-orchestration SKILL.md** — it needs to understand the plan format.

## Exclusion Patterns

When telling the exploration agent what to skip, reference these patterns:

- `node_modules/` — dependencies
- `components/ui/` — shadcn components (deps)
- `*.generated.*` — generated code
- `dist/`, `build/`, `.next/` — build output
- `formedible/` or any lib code that is a dependency
- Lock files, config files with no logic
- Type declaration files from deps (`*.d.ts` unless project-authored)

Adapt per project — ask the user if unsure what's deps vs source.

## Agent Types

| Phase | Agent Type | Purpose |
|-------|-----------|---------|
| Exploration | `explore` | Map codebase, identify clusters |
| Review | `code-reviewer` | Deep code review, produce findings |
| Verification | `code-reviewer` | Verify findings, kill false positives |
| Fix Plan | `general` | Synthesize findings into orchestration plan |

## Progress Reporting

```
Review Session: [id]
Phase: [exploration|review|verification|fix-plan]
Progress: [N]/[total] agents complete
Batch: [N] of [total batches] (if applicable)

Findings so far: [N] total, [N] critical, [N] high, [N] medium
```

Final report to user:
- Number of findings (before and after verification)
- Number of false positives caught
- Fix plan location: `.review/session-[id]/fix-plan.md`
- Whether the fix plan is ready for orchestration
