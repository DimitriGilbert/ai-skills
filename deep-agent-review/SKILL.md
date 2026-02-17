---
name: deep-agent-review
description: Multi-agent deep code review orchestration. Use when you need an exhaustive, multi-perspective code review with area-specific specialists, progressive findings, verified claims, and actionable remediation plans.
---

# Deep Agent Review

Orchestrate exhaustive multi-agent code reviews with progressive findings, verified claims, and actionable remediation plans.

## Core Principle

**One approval at start, then complete autonomous execution with verified findings.**

**YOU ARE THE ORCHESTRATOR**: You coordinate review phases by dispatching specialized subagents. You never write findings yourself - you manage the review process.

## What Makes This Different

| Standard Review | Deep Agent Review |
|-----------------|-------------------|
| Single reviewer | Multiple domain specialists |
| End-of-review findings | Progressive findings (saved as you go) |
| Generic categories | Area-aware deep dives |
| Unverified claims | All claims verified before final report |
| One-size-fits-all | Severity-specific remediation plans |

## Execution Model

```
START
  │
  ▼
1. EXPLORER: Map codebase into semantic areas
   └─ Output: review/areas.yaml
  │
  ▼
2. USER APPROVAL: Review and approve areas
  │
  ▼
3. SPECIALISTS: Deep review each area (parallel)
   ├─ Save findings incrementally to review/[area].yaml
   └─ Classify: type, severity, file:line, fix plan
  │
  ▼
4. VERIFIERS: Verify all claims by severity
   ├─ Critical verifier → plans/review/critical-verified.yaml
   ├─ High verifier → plans/review/high-verified.yaml
   └─ Medium/Low verifier → plans/review/standard-verified.yaml
  │
  ▼
5. MASTER PLANS: Generate remediation roadmaps
   └─ Output: plans/review/master-plan.yaml
  │
  ▼
REPORT: Summary with statistics
```

## Quick Start

### 1. Initialize Review

```
Initialize deep agent review for this codebase.
```

You will:
- Dispatch an Explorer agent to map semantic areas
- Create `review/areas.yaml` with area definitions

### 2. Approve Areas

Review `review/areas.yaml` and confirm:
- Areas cover all important code
- Specializations are appropriate
- No blind spots

### 3. Execute Review

Once approved:
```
Execute the review.
```

All phases run automatically without further interaction.

## Phase Details

### Phase 1: Exploration

**Goal**: Map codebase into semantic areas, not generic layers.

**Explorer prompt template**:
```
ROLE: Codebase Explorer
MISSION: Map this codebase into semantic areas for deep review.

REQUIREMENTS:
- Go beyond "backend/frontend/database"
- Identify domain-specific areas (auth, payments, game-lifecycle, etc.)
- Understand HOW things work, not just WHERE they are
- Identify cross-cutting concerns
- Note any incomplete/broken features

OUTPUT: Create review/areas.yaml with:

areas:
  - name: "[semantic name]"
    description: "[what this area does and why it matters]"
    paths: ["glob/patterns/**"]
    focus: ["specific concerns for this area"]
    specialist: "[recommended agent type]"
    
cross_cutting:
  - name: "[concern name]"
    affects: ["area names"]
    
broken_incomplete:
  - feature: "[name]"
    evidence: "[what's missing/broken]"
    impact: "[user/business impact]"

SPECIALIST MAPPING:
- Security concerns → code-reviewer or general with security focus
- Frontend/UI → frontend-developer
- Backend/API → backend-security-coder
- Architecture → architect-review
- DevOps/Infra → devops-troubleshooter
- General exploration → explore agent

Save to: review/areas.yaml
```

**Semantic area examples**:
- `auth-flow` - Authentication, session management, tokens
- `game-lifecycle` - Game creation, publishing, state transitions
- `leaderboard-system` - Scoring, ranking, display
- `admin-controls` - Admin features, permissions, management
- `user-data` - User profiles, preferences, privacy
- `api-surface` - All endpoints, validation, responses
- `data-layer` - Schema, queries, migrations, caching

### Phase 2: Specialist Review

**Goal**: Deep dive into each area with progressive findings.

**Specialist prompt template**:
```
ROLE: [Area] Specialist
AREA: [area name]
MISSION: Conduct exhaustive review of [area name].

SCOPE:
- Paths: [glob patterns]
- Focus: [specific concerns]

FINDINGS FORMAT:
Save findings incrementally to review/[area-name].yaml

findings:
  - id: "[area]-[number]"
    type: "[security|quality|performance|correctness|maintainability|accessibility]"
    severity: "[critical|high|medium|low|nitpick]"
    title: "[brief description]"
    file: "[path]"
    line: [line number or range]
    description: |
      [detailed explanation of the issue]
    evidence: |
      [code snippet or behavior description]
    impact: |
      [what happens if not fixed]
    fix:
      approach: "[high-level fix strategy]"
      steps:
        - "[step 1]"
        - "[step 2]"
      effort: "[low|medium|high]"
    references:
      - "[URL or doc reference]"

REVIEW APPROACH:
1. Start with high-level understanding (read key files)
2. Find obvious issues, save immediately
3. Go deeper into edge cases, save incrementally
4. Check cross-cutting concerns (security, perf, etc.)
5. Review error handling and edge cases
6. Look for missing/incomplete features
7. Final pass for anything missed

SEVERITY GUIDELINES:
- CRITICAL: Security breach, data loss, system down
- HIGH: Feature broken, security risk, major perf issue
- MEDIUM: Feature degraded, quality issue, minor security concern
- LOW: Code smell, minor bug with workaround
- NITPICK: Style, minor improvement

TYPE GUIDELINES:
- security: Auth, injection, exposure, permissions
- quality: Code structure, patterns, duplication
- performance: Speed, memory, scalability
- correctness: Logic errors, wrong behavior
- maintainability: Documentation, complexity, tests
- accessibility: A11y compliance, screen readers

SAVE PROGRESSIVELY:
- Don't wait until end to save findings
- Save after each major discovery
- Update file as you find more
- This allows parallel progress tracking

Save to: review/[area-name].yaml
```

### Phase 3: Verification

**Goal**: Verify all claims before finalizing.

**Critical/High verifier template**:
```
ROLE: [Severity] Verifier
MISSION: Verify all [critical/high] severity findings are accurate.

INPUT FILES:
- review/*.yaml (all area findings)

VERIFICATION PROCESS:
For each [critical/high] finding:
1. Read the referenced file and line
2. Confirm the issue exists as described
3. Verify the severity is appropriate
4. Validate the fix approach is viable
5. Check for additional context that changes assessment

OUTPUT FORMAT:
Save to: plans/review/[severity]-verified.yaml

verified:
  - id: "[original finding id]"
    status: "[confirmed|adjusted|rejected]"
    adjusted_severity: "[if changed]"
    notes: "[verification notes]"
    additional_context: "[any new information]"

rejected:
  - id: "[original finding id]"
    reason: "[why this finding is incorrect]"
    explanation: "[what's actually happening]"

RULES:
- Be skeptical - verify don't trust
- Read actual code, don't assume
- If severity is wrong, adjust it
- If finding is wrong, reject with explanation
- If more context needed, note it

Save to: plans/review/[severity]-verified.yaml
```

**Standard verifier** (medium/low/nitpick):
```
ROLE: Standard Verifier
MISSION: Verify medium, low, and nitpick severity findings.

[Same process as above but for lower severities]

Save to: plans/review/standard-verified.yaml
```

### Phase 4: Master Plan Generation

**Goal**: Create actionable remediation roadmap.

**Planner template**:
```
ROLE: Remediation Planner
MISSION: Create master remediation plan from verified findings.

INPUTS:
- plans/review/critical-verified.yaml
- plans/review/high-verified.yaml
- plans/review/standard-verified.yaml

OUTPUT: plans/review/master-plan.yaml

structure:
meta:
  generated: "[timestamp]"
  total_findings: [count]
  by_severity:
    critical: [count]
    high: [count]
    medium: [count]
    low: [count]
    nitpick: [count]
  by_type:
    [type]: [count]

remediation:
  immediate:  # Critical issues
    - id: "[finding id]"
      title: "[brief title]"
      files: ["[affected files]"]
      effort: "[estimated effort]"
      dependencies: ["[blocking issues]"]
      
  short_term:  # High issues
    - id: "[finding id]"
      title: "[brief title]"
      files: ["[affected files]"]
      effort: "[estimated effort]"
      
  medium_term:  # Medium issues
    - id: "[finding id]"
      title: "[brief title]"
      files: ["[affected files]"]
      effort: "[estimated effort]"
      
  backlog:  # Low and nitpick
    - id: "[finding id]"
      title: "[brief title]"

execution_order:
  - phase: 1
    focus: "[what to fix]"
    findings: ["[ids]"]
    estimated_effort: "[total]"
  - phase: 2
    focus: "[what to fix]"
    findings: ["[ids]"]
    estimated_effort: "[total]"

Save to: plans/review/master-plan.yaml
```

## File Structure

```
review/
├── areas.yaml           # Phase 1: Area definitions
├── auth-flow.yaml       # Phase 2: Area findings
├── game-lifecycle.yaml
├── leaderboard.yaml
└── ...

plans/review/
├── critical-verified.yaml   # Phase 3: Verified critical
├── high-verified.yaml       # Phase 3: Verified high
├── standard-verified.yaml   # Phase 3: Verified medium/low
└── master-plan.yaml         # Phase 4: Remediation roadmap
```

## Dispatching Agents

### Parallel Dispatch (Specialists)

```javascript
// Dispatch all area specialists simultaneously
areas.forEach(area => {
  dispatchAgent({
    type: area.specialist, // code-reviewer, frontend-developer, etc.
    prompt: specialistPrompt(area),
    async: true
  });
});

// Wait for all to complete
await allComplete();

// Verify all review/*.yaml files exist
```

### Sequential Dispatch (Verification)

```javascript
// Verify in severity order
await dispatchAgent({
  type: 'code-reviewer',
  prompt: criticalVerifierPrompt()
});

await dispatchAgent({
  type: 'code-reviewer', 
  prompt: highVerifierPrompt()
});

await dispatchAgent({
  type: 'code-reviewer',
  prompt: standardVerifierPrompt()
});

// Generate master plan
await dispatchAgent({
  type: 'architect-review',
  prompt: plannerPrompt()
});
```

## Severity Classification

| Severity | Definition | Example |
|----------|------------|---------|
| **Critical** | System compromised, data loss, security breach | SQL injection, auth bypass, data exposure |
| **High** | Feature broken, major security risk, severe perf | Broken payment flow, missing auth check, N+1 at scale |
| **Medium** | Feature degraded, quality issue, minor security | Missing input validation, poor error handling, code duplication |
| **Low** | Minor bug with workaround, code smell | Off-by-one edge case, missing null check in rare path |
| **Nitpick** | Style, naming, minor improvement | Variable naming, comment clarification |

## Type Classification

| Type | Scope | Focus Areas |
|------|-------|-------------|
| **security** | Auth, data, access | Injection, auth bypass, exposure, permissions |
| **quality** | Code health | Duplication, patterns, complexity, coupling |
| **performance** | Speed, resources | N+1, memory leaks, blocking ops, caching |
| **correctness** | Logic, behavior | Wrong calculations, missing cases, race conditions |
| **maintainability** | Long-term health | Documentation, tests, complexity, dependencies |
| **accessibility** | A11y compliance | Screen readers, keyboard nav, contrast, ARIA |

## Critical Rules

### Rule 1: Progressive Saving
**Specialists MUST save findings incrementally, not at the end.**
- Find something → Save immediately
- Find more → Append/update
- This enables progress tracking and recovery

### Rule 2: Verified Claims
**No finding appears in final report without verification.**
- Verifiers read actual code
- Verifiers confirm or reject claims
- Only verified findings go to master plan

### Rule 3: Orchestrator Doesn't Review
**You coordinate, you don't review.**
- Dispatch specialists
- Collect their outputs
- Dispatch verifiers
- Generate reports
- Never write findings yourself

### Rule 4: Semantic Areas
**Areas reflect domain, not architecture.**
- "game-lifecycle" not "backend"
- "auth-flow" not "database"
- Understand HOW things work

### Rule 5: Actionable Plans
**Every finding has a fix plan.**
- Approach described
- Steps outlined
- Effort estimated

## Progress Reporting

### During Review (Optional)
```
Progress: [N]/[M] areas complete
Current: [area name]
Findings so far: [count] ([critical] critical, [high] high)
```

### Final Report

```markdown
# Deep Agent Review Complete

## Summary
- Areas reviewed: [N]
- Total findings: [N]
- Critical: [N]
- High: [N]
- Medium: [N]
- Low: [N]
- Nitpick: [N]

## Verification Status
- Critical findings: [N] verified, [N] adjusted, [N] rejected
- High findings: [N] verified, [N] adjusted, [N] rejected
- Standard findings: [N] verified, [N] adjusted, [N] rejected

## Immediate Actions Required
[List critical findings with file:line]

## Files
- Areas: review/areas.yaml
- Findings: review/*.yaml
- Verification: plans/review/*-verified.yaml
- Master Plan: plans/review/master-plan.yaml
```

## Common Patterns

### Pattern: Incomplete Features

When explorer identifies incomplete features:
```yaml
broken_incomplete:
  - feature: "Game publishing"
    evidence: "Publish endpoint exists but never called, no tests"
    impact: "Users cannot publish games"
```

Create a specialist area for it:
```yaml
areas:
  - name: "game-publishing"
    description: "Incomplete publishing feature"
    paths: ["**/publish*", "**/game*state*"]
    focus: ["Why incomplete?", "What's missing?", "Can it be fixed?"]
```

### Pattern: Cross-Cutting Concerns

When multiple areas share concerns:
```yaml
cross_cutting:
  - name: "Error handling"
    affects: ["auth-flow", "game-lifecycle", "api-surface"]
```

Instruct specialists to:
```
For cross-cutting concern "Error handling":
- Check how errors are handled in your area
- Note inconsistencies with other areas
- Identify missing error cases
```

### Pattern: Area Dependencies

When areas interact:
```yaml
areas:
  - name: "leaderboard"
    dependencies: ["game-lifecycle", "user-data"]
    focus: ["How does it get scores?", "What happens when game ends?"]
```

## Integration with Other Skills

### Use code-review skill for:
- Standard review checklist
- Security vulnerability patterns
- Performance anti-patterns

### Use subagent-orchestration for:
- Implementation after review
- Multi-phase remediation

### Use the-council for:
- Architectural decisions
- Complex trade-off analysis

## Quick Reference

### Minimal Review Setup
```
1. Explorer → review/areas.yaml
2. Approve areas
3. Specialists (parallel) → review/[area].yaml
4. Verifiers → plans/review/*-verified.yaml
5. Planner → plans/review/master-plan.yaml
```

### Specialist Dispatch Template
```
You are the [Area] Specialist.
Review [paths] focusing on [concerns].
Save findings incrementally to review/[area].yaml.
Format: YAML with type, severity, file:line, fix plan.
```

### Verifier Dispatch Template
```
You are the [Severity] Verifier.
Verify all [severity] findings in review/*.yaml.
Read actual code at file:line.
Save to plans/review/[severity]-verified.yaml.
```

## Reference Documentation

- [Finding Schema](references/finding-schema.yaml) - Complete YAML schema for findings
- [Area Examples](references/area-examples.yaml) - Semantic area patterns
- [Specialist Profiles](references/specialist-profiles.md) - Agent type mapping
