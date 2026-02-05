# Orchestrator CLI Skill

Execute multi-phase development workflows by dispatching separate implementer and validator subagents.

## Purpose

This skill helps you orchestrate complex development tasks that require:

- Multiple sequential or parallel phases
- Strict separation between implementation and validation
- Automatic retry loops when validation fails
- Complete execution after single user approval

## How It Works

1. User provides or approves a detailed plan
2. You execute each phase by dispatching subagents
3. Each phase: implementer → validator → (fixer if needed) → pass/fail
4. You continue until all phases complete or one fails after max retries
5. You report final results to user

## File Structure

- **SKILL.md** - Core workflow and rules (start here)
- **references/plan-template.md** - How to structure multi-phase plans
- **references/subagent-templates.md** - Complete dispatch templates for each role
- **references/workflow-patterns.md** - Sequential and parallel execution patterns
- **references/error-handling.md** - How to handle failures and retry

## Key Concepts

### Role Separation

Never let the same subagent both implement AND validate:

- **Implementer**: Creates/modifies code, does NOT validate
- **Validator**: Checks code thoroughly, does NOT modify
- **Fixer**: Repairs issues, does NOT validate

### Execution Flow

You dispatch subagents and make decisions - there is no code running this orchestration. "Automatic execution" means you continue through all phases without asking the user for input, not that code executes the workflow.

### Validation Loop

When validation fails (normal and expected):

1. Dispatch fixer with validator's report
2. Re-validate the fixes
3. Repeat up to 3 total validation attempts
4. If still failing, halt and report to user

## When to Use This Skill

Use when the user requests:

- "Implement this multi-phase plan"
- "Build [complex system] with [architecture]"
- "Create [project] following these phases"
- Multi-step development requiring validation at each stage

Don't use for:

- Simple single-file tasks
- Exploratory coding without clear phases
- Tasks where user wants to review each step

## Quick Start

1. Read SKILL.md for core workflow
2. Review a plan (or help user create one using plan-template.md)
3. Get user approval: "Execute this plan automatically?"
4. Execute each phase using subagent-templates.md
5. Report completion or failure

The skill ensures quality through separation of concerns and automatic validation cycles.
