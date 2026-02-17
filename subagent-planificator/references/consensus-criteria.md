# Consensus Criteria - When is agreement reached?

## Consensus Levels

### Full Consensus
All specialists agree on:
- Core approach
- Major phases
- Dependencies
- Risk handling
- Timeline

**Signal:** No negative signals, all positive signals present.

### Partial Consensus
Agreement on most items, divergence on specific issues.

**Signal:** Most items agreed, some items have documented disagreements.

### No Consensus
Fundamental disagreement on approach.

**Signal:** Multiple negative signals, specialists standing firm.

## Consensus Signals

### Positive Signals

In specialist communications, look for:

| Phrase | Meaning |
|--------|---------|
| "Aligned with [other]'s approach" | Agreement on approach |
| "Incorporated [feedback]" | Willingness to adapt |
| "Converged on [decision]" | Movement toward agreement |
| "Agree with [other]'s assessment" | Validation of other's view |
| "This addresses my concern" | Conflict resolution |
| "No objections to [approach]" | Passive agreement |
| "Support this direction" | Active agreement |

### Negative Signals

| Phrase | Meaning |
|--------|---------|
| "Fundamentally disagree" | Core conflict |
| "Cannot proceed if [condition]" | Blocking position |
| "This conflicts with [requirement]" | Irreconcilable difference |
| "[Other]'s approach is unsafe" | Domain-specific veto |
| "I maintain my position" | Standing firm |
| "This doesn't address [concern]" | Unresolved issue |
| "Cannot support [approach]" | Opposition |

## Consensus Check Algorithm

### Per-Round Check

```yaml
consensus_check:
  inputs:
    - all refined plans from current round
    - all reviews from current round
    
  process:
    1. Count positive signals across all documents
    2. Count negative signals across all documents
    3. Identify unresolved conflicts
    4. Check if specialists are moving toward or away from agreement
    
  decision:
    if no_negative_signals and min_positive_signals_per_specialist >= 2:
      consensus: full
      
    elif negative_signals <= 2 and movement_toward_agreement:
      consensus: partial
      trigger_another_round: true
      
    else:
      consensus: none
      if rounds < max:
        trigger_another_round: true
        focus_areas: [conflict topics]
      else:
        document_divergence: true
```

### Movement Detection

Compare rounds to detect convergence or divergence:

```yaml
movement_detection:
  compare:
    - round[N-1] disagreements
    - round[N] disagreements
    
  patterns:
    convergence:
      - Fewer disagreements than previous round
      - Disagreements becoming more specific (narrowing)
      - Specialists acknowledging others' points
      
    divergence:
      - More disagreements than previous round
      - Positions hardening (same points repeated)
      - New disagreements emerging
      
    stalled:
      - Same disagreements across rounds
      - No new positive signals
      - Specialists not engaging with feedback
```

## Conflict Categories

### Resolvable Conflicts
Can be resolved through discussion:

| Type | Example | Resolution Path |
|------|---------|-----------------|
| Information gap | "Need more data on X" | Gather data, re-convene |
| Preference | "Prefer A over B" | Discuss trade-offs |
| Timing | "Phase 1 should be longer" | Adjust timeline |
| Scope | "Should we include X?" | Decide scope boundary |

### Irreconcilable Conflicts
Require escalation or decision authority:

| Type | Example | Resolution Path |
|------|---------|-----------------|
| Fundamental values | "Security > performance" | Escalate to decision maker |
| Resource constraints | "Can't do both A and B" | Prioritization decision |
| Domain veto | "This is unsafe" | Domain expert decides |
| External constraint | "Must comply with X" | Non-negotiable |

## Consensus Scoring

### Individual Specialist Score

```yaml
specialist_consensus_score:
  factors:
    - positive_signals: +1 each
    - negative_signals: -2 each
    - feedback_incorporated: +2
    - feedback_rejected_without_reason: -1
    - new_compromise_suggested: +3
    
  scoring:
    excellent: >= 8    # Fully aligned
    good: 4-7          # Generally aligned
    moderate: 0-3      # Some alignment
    poor: < 0          # Not aligned
```

### Overall Session Score

```yaml
session_consensus_score:
  formula: "average(all specialist scores) + convergence_bonus"
  
  convergence_bonus:
    rounds_1_to_2_improvement: +2
    rounds_2_to_3_improvement: +1
    stalled: 0
    regression: -2
    
  thresholds:
    full_consensus: >= 7
    partial_consensus: 3-6
    no_consensus: < 3
```

## Escalation Triggers

Auto-escalate if:

1. **Stalled for 3 rounds**: Same conflicts, no movement
2. **Negative score specialist**: Any specialist < 0 for 2 rounds
3. **New conflicts emerging**: More conflicts in later rounds
4. **Domain expert veto**: Security/safety expert says "unsafe"

Escalation actions:
- Document all positions clearly
- Identify what information would resolve
- Recommend decision authority
- Note risks of each path

## Documenting Divergence

When consensus cannot be reached:

```markdown
## Divergent Views

### Issue: [Topic]

**[Specialist A] Position:**
- [Their view]
- Rationale: [Why]
- Trade-offs accepted: [What they give up]
- Would accept: [What would change their mind]

**[Specialist B] Position:**
- [Their view]
- Rationale: [Why]
- Trade-offs accepted: [What they give up]
- Would accept: [What would change their mind]

**Impact of Each Path:**
- Path A ([Specialist A]'s preference): [Consequences]
- Path B ([Specialist B]'s preference): [Consequences]

**Recommendation:**
[Orchestrator's recommendation based on session goals]

**Decision Needed From:**
[Who has authority to decide]
```

## Quick Reference

### Consensus Checklist

Before declaring consensus, verify:

- [ ] No negative signals in latest round
- [ ] Each specialist has ≥2 positive signals
- [ ] All dependencies acknowledged
- [ ] No "fundamental disagreements"
- [ ] No "cannot proceed" statements
- [ ] Movement toward agreement (not stalled)

### Round Decision Tree

```
Check signals
    │
    ├─ No negative, positive ≥ 2 per specialist?
    │       │
    │       └─ YES → Full consensus → Create master plan
    │
    ├─ Negative ≤ 2, movement toward agreement?
    │       │
    │       └─ YES → Partial → Another round
    │
    ├─ Rounds < max?
    │       │
    │       ├─ YES → Another round, focus on conflicts
    │       │
    │       └─ NO → Document divergence, recommend escalation
```
