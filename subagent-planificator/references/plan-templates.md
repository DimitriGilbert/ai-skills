# Plan Templates - Formats for each planning phase

## Context Template

File: `.plans/session-[id]/context.md`

```markdown
# Planning Context

## Topic
[What is being planned]

## Background
[Relevant context, constraints, history]

## Goals
1. [Primary goal]
2. [Secondary goal]
3. [Tertiary goal]

## Constraints
- [Constraint 1]
- [Constraint 2]
- [Constraint 3]

## Scope
In scope:
- [Item 1]
- [Item 2]

Out of scope:
- [Item 1]
- [Item 2]

## Timeline
[Any deadlines or time constraints]

## Resources
[Available resources, team size, budget considerations]

## Related Artifacts
- [Link to relevant docs]
- [Link to existing code]
- [Link to previous decisions]

## Success Criteria
[How will we know the plan succeeded]
```

## Draft Plan Template

File: `.plans/session-[id]/draft-[specialist].md`

```markdown
# [Specialist Name] Plan - Draft

## Metadata
- Specialist: [Name]
- Domain: [What domain this covers]
- Created: [Timestamp]

## Executive Summary
[2-3 sentences summarizing the approach]

## Problem Analysis
[How this specialist sees the problem]

## Proposed Approach
[High-level strategy]

## Detailed Plan

### Phase 1: [Phase Name]
**Type:** [Sequential/Parallel]
**Dependencies:** [What's needed first, or "None"]

**Requirements**:
- [Specific, actionable requirement]
- [Specific, actionable requirement]

**Inputs**:
- Read: [files this phase needs as context]
- Reference: [existing patterns to follow]

**Outputs**:
- Create: [files to create]
- Modify: [files to modify]

**Validation Criteria**:
- Type check: Zero errors
- Build: Success
- [Phase-specific criteria]

Steps:
1. [Step 1]
   - Details: [More info]
   - Risk: [Any risks]
    
2. [Step 2]
   - Details: [More info]
   - Risk: [Any risks]

### Phase 2: [Phase Name]
[Same structure]

### Phase 3: [Phase Name]
[Same structure]

## Dependencies on Other Specialists
- [Specialist B]: [What I need from them]
- [Specialist C]: [What I need from them]

## What Others Need From Me
- [Deliverable 1]: [For whom]
- [Deliverable 2]: [For whom]

## Risks
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk 1] | H/M/L | H/M/L | [How to handle] |
| [Risk 2] | H/M/L | H/M/L | [How to handle] |

## Open Questions
- [Question 1]
- [Question 2]

## Alternatives Considered
### [Alternative A]
[Description]
Why not chosen: [Reason]

### [Alternative B]
[Description]
Why not chosen: [Reason]

## Confidence Level
[High/Medium/Low] - [Why]
```

## Review Template

File: `.plans/session-[id]/review-[specialist].md`

```markdown
# [Specialist Name] Review - Round [N]

## Metadata
- Reviewer: [Name]
- Round: [N]
- Created: [Timestamp]

## Reviews

### Review of [Other Specialist A]'s Plan

**Overall Assessment:** [Positive/Mixed/Concerning]

**Strengths:**
1. [Strength 1]
2. [Strength 2]
3. [Strength 3]

**Concerns:**
1. **[Concern 1]**
   - Location: [Phase/Step reference]
   - Issue: [What's wrong]
   - Impact: [Why it matters]
   - Suggestion: [How to fix]

2. **[Concern 2]**
   [Same structure]

**Dependencies on My Plan:**
- [Where their plan depends on mine]
- [Any conflicts with my approach]

**Questions:**
- [Question about their approach]

---

### Review of [Other Specialist B]'s Plan

[Same structure as above]

---

## Cross-Cutting Observations

### Points of Agreement
- [Where all plans align]

### Points of Conflict
- [Where plans contradict]

| Topic | [Specialist A] | [Specialist B] | [My View] |
|-------|----------------|----------------|-----------|
| [Issue 1] | [Position] | [Position] | [Position] |
| [Issue 2] | [Position] | [Position] | [Position] |

### Integration Opportunities
- [Where plans could be combined]

### Missing Perspectives
- [What's not covered by any plan]

## Synthesis Suggestions

### Proposed Compromises
1. **[Conflict 1]**
   - Current positions: [A says X, B says Y]
   - Suggested resolution: [Z]
   - Rationale: [Why this works]

### Recommended Approach
[How to combine plans into unified approach]

## Confidence in Consensus
[High/Medium/Low] - [What would change this]
```

## Refined Plan Template

File: `.plans/session-[id]/refined-[specialist]-round[N].md`

```markdown
# [Specialist Name] Plan - Refined Round [N]

## Metadata
- Specialist: [Name]
- Round: [N]
- Previous: [Link to previous version]
- Created: [Timestamp]

## Changelog

### Changes from Round [N-1]
| Change | Reason | Feedback Source |
|--------|--------|-----------------|
| [Change 1] | [Why] | [Who suggested] |
| [Change 2] | [Why] | [Who suggested] |
| [Change 3] | [Why] | [Who suggested] |

### Feedback Not Incorporated
| Feedback | From | Why Not Incorporated |
|----------|------|---------------------|
| [Feedback 1] | [Specialist] | [Reason] |
| [Feedback 2] | [Specialist] | [Reason] |

## Updated Executive Summary
[2-3 sentences, updated from feedback]

## Refined Plan

### Phase 1: [Phase Name]
[Updated based on feedback]

### Phase 2: [Phase Name]
[Updated based on feedback]

## Updated Dependencies
- [Specialist B]: [Updated needs]
- [Specialist C]: [Updated needs]

## Convergence Notes
[Where this plan now aligns with others]

### Agreements Reached
- [With Specialist B]: [What was agreed]
- [With Specialist C]: [What was agreed]

### Remaining Differences
- [Issue where agreement not reached]

## Updated Confidence
[High/Medium/Low] - [What changed]
```

## Master Plan Template

File: `.plans/session-[id]/master-plan.md`

This template produces a plan directly consumable by **subagent-orchestration**. Every phase must be self-contained with enough detail for an implementer subagent to execute without asking questions.

**Phase sizing rule**: Each phase must fit comfortably in a single agent's context window (~15 files max, ~500 lines of output max). If a phase is too large, split it into sub-phases with a phase-wide validator.

```markdown
# Master Plan - [Topic]

## Metadata
- Session: [ID]
- Created: [Timestamp]
- Rounds: [N]
- Consensus: [Full/Partial/None]

## Prerequisites
- Tools required (e.g., pnpm, TypeScript)
- Files that must exist before starting
- Environment setup needed

## Gatekeeping Commands
List the commands implementers must run before reporting done:
- Type check: [e.g., `pnpm run check-types`]
- Build: [e.g., `pnpm run build`]

## Executive Summary
[3-5 sentences on the unified approach]

## Consensus Decisions
These decisions were agreed upon by all specialists:

1. **[Decision 1]**
   - What: [The decision]
   - Why: [Rationale]
   - Specialists: [Who agreed]

2. **[Decision 2]**
   [Same structure]

## Integrated Plan

### Overview Timeline
```
Phase 1: [Name]     [Sequential]
Phase 2: [Name]     [Sequential]
Phase 3: [Name]     [Parallel: Sub-task A, Sub-task B, Sub-task C]
Phase 4: [Name]     [Sequential]
```

---

### Phase 1: [Phase Name]
**Type**: Sequential
**Owner:** [Lead specialist]
**Dependencies:** [Prerequisites, or "None" for first phase]

**Requirements**:
- [Specific requirement 1]
- [Specific requirement 2]
- [Specific requirement 3]

**Inputs**:
- Read: [file1.ts, file2.ts]
- Reference: [existing patterns to follow]

**Outputs**:
- Create: [new-file1.ts, new-file2.ts]
- Modify: [existing-file.ts]

**Validation Criteria**:
- Type check: Zero errors
- Build: Success
- [Specific criteria for this phase]

---

### Phase 2: [Phase Name]
**Type**: Sequential
**Dependencies:** Phase 1 must complete

[Same structure as Phase 1]

---

### Phase 3: [Phase Name]
**Type**: Parallel
**Dependencies:** Phase 2 must complete

#### 3.1: [Sub-task A Name]
**Requirements**:
- [Specific requirement 1]
- [Specific requirement 2]

**Inputs**:
- Read: [files]

**Outputs**:
- Create: [fileA1.ts, fileA2.ts]

**Validation**:
- [Criteria for sub-task A]

#### 3.2: [Sub-task B Name]
**Requirements**:
- [Specific requirement 1]
- [Specific requirement 2]

**Inputs**:
- Read: [files]

**Outputs**:
- Create: [fileB1.ts, fileB2.ts]

**Validation**:
- [Criteria for sub-task B]

#### 3.3: [Sub-task C Name]
**Requirements**:
- [Specific requirement 1]

**Inputs**:
- Read: [files]

**Outputs**:
- Create: [fileC1.ts]

**Validation**:
- [Criteria for sub-task C]

**Phase-level Validation**:
- All sub-tasks pass individual validation
- Integration: Sub-tasks work together (shared types, imports)
- No circular dependencies
- Type check: Zero errors across all files
- Build: Success

---

### Phase 4: [Phase Name]
**Type**: Sequential
**Dependencies:** Phase 3 must complete

[Same structure as Phase 1]

---

## Resolved Conflicts

### [Conflict 1]
- Original positions:
  - [Specialist A]: [Position]
  - [Specialist B]: [Position]
- Resolution: [How resolved]
- Rationale: [Why this resolution]

## Open Items

### Decisions Needed
- [ ] [Decision 1] - Owner: [Who]
- [ ] [Decision 2] - Owner: [Who]

### Information Needed
- [ ] [Info 1] - From: [Source]
- [ ] [Info 2] - From: [Source]

## Risks and Mitigations

| Risk | Likelihood | Impact | Owner | Mitigation |
|------|------------|--------|-------|------------|
| [Risk 1] | H/M/L | H/M/L | [Who] | [Strategy] |
| [Risk 2] | H/M/L | H/M/L | [Who] | [Strategy] |

## Success Criteria

Overall success requires:
- All phases complete and validate successfully
- Gatekeeping commands pass: [typecheck command], [build command]
- All requirements from all phases met

## Appendix

### Divergent Views
[If partial consensus, document remaining disagreements]

### Alternatives Considered
[Combined alternatives from all specialists]
```

## Status YAML Template

File: `.plans/session-[id]/status.yaml`

```yaml
session:
  id: "session-[id]"
  created: "[timestamp]"
  topic: "[planning topic]"
  
specialists:
  - name: "[specialist-1]"
    agent_type: "[agent-type]"
    focus: "[domain focus]"
    
  - name: "[specialist-2]"
    agent_type: "[agent-type]"
    focus: "[domain focus]"

rounds:
  current: 1
  max: 5
  completed: []

phase: "draft"  # draft | review | refine | consensus | master

status:
  "[specialist-1]":
    draft: "pending"      # pending | in_progress | complete
    review: "pending"
    refine_round1: "pending"
    refine_round2: "pending"
    
  "[specialist-2]":
    draft: "pending"
    review: "pending"
    refine_round1: "pending"
    refine_round2: "pending"

files:
  context: "context.md"
  drafts:
    - "draft-[specialist-1].md"
    - "draft-[specialist-2].md"
  reviews:
    - "review-[specialist-1].md"
    - "review-[specialist-2].md"
  refined:
    round1:
      - "refined-[specialist-1]-round1.md"
      - "refined-[specialist-2]-round1.md"
  master: "master-plan.md"

consensus:
  reached: false
  round: null
  divergent_views: []
```
