---
name: subagent-planificator
description: Collaborative multi-agent planning with iterative deliberation. Use when creating complex plans that benefit from multiple specialist perspectives, cross-review, and consensus-building through discussion rounds.
---

# Subagent Planificator

Orchestrate collaborative planning where specialist subagents create plans, critique each other's work, and iterate toward consensus through structured discussion rounds.

## Core Concept

**Multiple specialists plan together, not in isolation. They see each other's work and improve it through discussion.**

```
[DRAFT] → [WAIT] → [REVIEW] → [WAIT] → [REFINE] → [CONSENSUS?]
                                                      │
                                          ┌───────────┴───────────┐
                                          │                       │
                                     [CONSENSUS]           [MORE ROUNDS]
                                          │                       │
                                          ▼                       ▼
                                    [MASTER PLAN]          [Repeat refine]
```

## Quick Start

```
Plan: [what needs planning]

Specialists needed:
- [Specialist A]: [their focus]
- [Specialist B]: [their focus]
- [Specialist C]: [their focus]
```

Orchestrator creates `.plans/session-[id]/`, dispatches specialists through draft → review → refine rounds, checks consensus, generates master plan.

## Execution Model

**YOU ARE THE ORCHESTRATOR**: You coordinate rounds, dispatch specialists, manage waiting, synthesize results. You never write plans yourself.

### Phase Flow

| Phase | What | Output | Parallel |
|-------|------|--------|----------|
| draft | Initial plans | `draft-[specialist].md` | Yes |
| review | Cross-review | `review-[specialist].md` | Yes |
| refine | Refine from feedback | `refined-[specialist]-round[N].md` | Yes |
| consensus | Check agreement | (orchestrator action) | No |
| master | Combine plans | `master-plan.md` | No |

### Round Cycle

1. All specialists draft simultaneously → wait for all complete
2. All specialists review others' drafts → wait for all complete
3. All specialists refine based on reviews → wait for all complete
4. Check consensus
5. If not consensus and rounds < max: repeat from step 2
6. Generate master plan

## Coordination

### File-Based Waiting

Specialists wait for dependencies using file polling with sleep:

```bash
# Wait for all drafts
while [ $(ls draft-*.md 2>/dev/null | wc -l) -lt 3 ]; do
    sleep 5
done
```

**Critical**: Always sleep between checks. Never busy-wait.

See [waiting-script.md](references/waiting-script.md) for full implementation.

### Status File

`status.yaml` tracks progress:

```yaml
phase: "draft"
rounds:
  current: 1
  max: 5
status:
  backend-architect:
    draft: "complete"
    review: "pending"
    refine: "pending"
```

## Dispatching Specialists

### Draft Phase

```
ROLE: [Specialist]
PHASE: Draft
MISSION: Create initial plan for [topic] from your domain perspective.

CONTEXT: .plans/session-[id]/context.md
OUTPUT: .plans/session-[id]/draft-[your-name].md

Include:
- Summary and approach
- Detailed phases with steps (must include phase type, requirements, inputs, outputs, validation criteria — see Orchestration Compatibility below)
- Dependencies on other specialists
- Risks and alternatives

Update status.yaml when complete.
```

### Review Phase

```
ROLE: [Specialist]
PHASE: Review
MISSION: Review other specialists' drafts and provide feedback.

PLANS TO REVIEW:
- draft-[other-specialist-1].md
- draft-[other-specialist-2].md

WAIT: Before reviewing, poll for all draft files with 5s sleep.

OUTPUT: review-[your-name].md

For each plan:
- Strengths
- Concerns (specific, actionable)
- Alignment with your plan
- Conflicts identified

Update status.yaml when complete.
```

### Refine Phase

```
ROLE: [Specialist]
PHASE: Refine Round [N]
MISSION: Refine your plan based on reviews.

REVIEWS: review-[specialist-1].md, review-[specialist-2].md
WAIT: Poll for all review files with 5s sleep.

OUTPUT: refined-[your-name]-round[N].md

Include:
- Changes from previous version (with reasons)
- Addressed feedback (how, or why not)
- Convergence notes (where you now agree with others)
- Remaining concerns

Update status.yaml when complete.
```

See [plan-templates.md](references/plan-templates.md) for full formats.

## Consensus Checking

After each refine round, check for consensus:

### Positive Signals
- "Aligned with [other]'s approach"
- "Incorporated [feedback]"
- "Converged on [decision]"

### Negative Signals
- "Fundamentally disagree"
- "Cannot proceed if [condition]"
- "This conflicts with [requirement]"

### Decision

```
IF no_negative_signals AND min_positive_per_specialist >= 2:
    consensus = full
    
ELSE IF negative_signals <= 2 AND movement_toward_agreement:
    consensus = partial
    trigger_another_round
    
ELSE IF rounds < max:
    trigger_another_round
    
ELSE:
    document_divergence
    proceed_to_master
```

See [consensus-criteria.md](references/consensus-criteria.md) for full algorithm.

## Master Plan Generation

```
ROLE: Master Planner
MISSION: Combine refined plans into unified master plan that is ready for subagent-orchestration.

INPUTS: All refined plans, all reviews from final round
OUTPUT: master-plan.md

TEMPLATE: Use the Master Plan Template from references/plan-templates.md.
It MUST produce a plan compatible with subagent-orchestration — every phase needs:
- Type (Sequential/Parallel)
- Specific, actionable requirements
- Inputs (files to read) and Outputs (files to create/modify)
- Validation criteria
- Dependencies
- Gatekeeping commands for the project (typecheck, build)
- Phase-level Validation section for any parallel phase

Include:
- Executive summary
- Consensus decisions
- Integrated plan (orchestration-compatible phases)
- Resolved conflicts
- Open items
- Combined risk assessment
- Divergent views (if any)
- Success criteria with gatekeeping commands
```

## File Structure

```
.plans/
└── session-[id]/
    ├── context.md              # Planning brief
    ├── status.yaml             # Coordination
    ├── draft-[spec].md         # Initial plans
    ├── review-[spec].md        # Cross-reviews
    ├── refined-[spec]-r[N].md  # Refined plans
    └── master-plan.md          # Final combined plan
```

## Specialist Selection

| Domain | Agent Type |
|--------|------------|
| Architecture | `architect-review` |
| Security | `code-reviewer` |
| Frontend | `frontend-developer` |
| Backend | `backend-security-coder` |
| DevOps | `devops-troubleshooter` |

**Counts**: 2-3 for simple plans, 3-5 for standard, 5-7 for complex.

## Critical Rules

1. **Orchestrator coordinates, never plans** - You manage, not write
2. **Specialists must wait** - Poll with sleep before dependencies
3. **Incremental saving** - Save progress as you go
4. **Constructive review** - Improve, don't attack
5. **Explicit disagreement** - Explain why, don't stay silent
6. **Max rounds cap** - Stop at 5 even without full consensus

## Progress Reporting

```
Session: [id]
Round: [N]/5
Phase: [draft|review|refine]
Status:
  - [Specialist A]: [complete|in_progress|pending]
  - [Specialist B]: [complete|in_progress|pending]
```

Final: Consensus level, divergent views (if any), output path.

## Integration

- **deep-agent-review**: Use planificator to plan remediation after review
- **subagent-orchestration**: Master plan feeds directly into orchestration as input. See [Orchestration Compatibility](#orchestration-compatibility) below.
- **the-council**: Council for decisions, Planificator for comprehensive plans

## Orchestration Compatibility

The master plan produced by this skill is the direct input for **subagent-orchestration**. The master plan MUST be structured so the orchestrator can dispatch implementers without ambiguity.

### Required Plan Structure

Every phase in the master plan MUST include:

| Field | Required | Why |
|-------|----------|-----|
| Phase type (Sequential/Parallel) | Yes | Orchestrator dispatches parallel sub-phases simultaneously |
| Requirements (specific, not vague) | Yes | Dispatched verbatim to implementers |
| Inputs (files to read) | Yes | Implementers need context |
| Outputs (files to create/modify) | Yes | Validators check these |
| Validation criteria | Yes | Validators check against these |
| Dependencies | Yes | Orchestrator enforces ordering |
| Gatekeeping commands | Yes | Implementers must run check-types/build before reporting done |

### Phase Sizing — Must Fit in Agent Context

**Every phase must fit comfortably inside a single agent's context window. If a phase is too large, it MUST be split into sub-phases.**

A phase is too large if:
- It creates or modifies more than ~15 files
- Its requirements would produce more than ~500 lines of new code
- It covers multiple unrelated concerns

When a phase is too large, split it into focused sub-phases. Each sub-phase gets its own implementer → validator flow, followed by a phase-wide validator.

**Why**: Agent context windows are finite. When context fills up, compaction discards earlier information and code quality drops precipitously — the agent loses track of patterns, conventions, and decisions made earlier. Smaller phases produce better code.

### Parallel Phases

If a phase has multiple sub-tasks that can run simultaneously:

1. Mark it as **Type: Parallel**
2. Define each sub-task with its own requirements, inputs, outputs, and validation
3. Include a **Phase-level Validation** section for the mandatory phase-wide validator
4. The phase-wide validator checks: integration between sub-phases, shared types, imports, no circular dependencies, overall coherence

### Handoff Contract

When the master plan is handed to the orchestrator:

1. **Orchestrator reads the master plan** and extracts phases
2. **Each phase's requirements section** is dispatched verbatim to implementers
3. **Validation criteria** are given to validators
4. **Implementers run gatekeeping commands** (typecheck, build) on their own before reporting done
5. **Multi-sub-phase phases get a phase-wide validator** after individual validations pass

This means the master plan must be **self-contained** — the orchestrator should never need to ask clarifying questions. If a requirement is vague, the plan is not ready.

### Plan Checklist

Before declaring the master plan complete, verify:

- [ ] Every phase has a type (Sequential or Parallel)
- [ ] Every phase has specific, actionable requirements (not "make it work")
- [ ] Every phase lists exact files to create/modify
- [ ] Every phase has explicit validation criteria
- [ ] Every phase states its dependencies
- [ ] Gatekeeping commands for the project are listed (check-types, build)
- [ ] Parallel phases have a Phase-level Validation section
- [ ] No vague or ambiguous requirements remain
- [ ] Every phase fits in a single agent context (~15 files max, ~500 lines of code max). If not, it's split into sub-phases.

## Quick Reference

```
1. Create .plans/session-[id]/ with context.md, status.yaml
2. Draft: dispatch all specialists in parallel, wait for files
3. Review: dispatch all specialists, each waits for all drafts
4. Refine: dispatch all specialists, each waits for all reviews
5. Check consensus → if not and rounds < 5, goto 3
6. Master: dispatch agent to synthesize
7. Report to user
```

## Reference Documentation

- [Waiting Scripts](references/waiting-script.md) - File-based coordination
- [Plan Templates](references/plan-templates.md) - Full format for each phase
- [Consensus Criteria](references/consensus-criteria.md) - Agreement detection
