# Decision Frameworks

This document covers structured approaches for making decisions based on council analysis and deliberation.

## Decision Context Framework

Before making any decision, establish the context:

### 1. Decision Classification

**Type A: Technical decisions**
- Primarily factual/technical
- Clear success metrics
- Can be reversed relatively easily
- Example: Choice of logging library

**Type B: Strategic decisions**
- Mix of technical and business factors
- Harder to reverse
- Multiple stakeholders affected
- Example: Monolith vs. microservices

**Type C: Critical decisions**
- High risk if wrong
- Very difficult or impossible to reverse
- Significant business impact
- Example: Complete architectural rewrite

### 2. Decision Constraints

Identify constraints upfront:

```markdown
## Decision Constraints

### Time Constraints
- [ ] Decision needed by: [date/deadline]
- [ ] Time available for research: [duration]

### Resource Constraints
- [ ] Budget: [amount or "unlimited"]
- [ ] Team capacity: [people available]
- [ ] Infrastructure: [limits or "flexible"]

### Quality Constraints
- [ ] Minimum performance: [specific metrics]
- [ ] Security requirements: [compliance, etc.]
- [ ] Reliability targets: [SLAs, SLOs]

### Stakeholder Constraints
- [ ] Must satisfy: [stakeholder]
- [ ] Must not break: [existing system/dependency]
- [ ] Approval required: [who needs to approve?]
```

### 3. Reversibility Assessment

**Reversible decisions:** Move fast, can correct later
- New feature flags
- A/B tests
- Experimental APIs
- Configuration changes

**Partially reversible:** Careful consideration, some exit cost
- Library choices (migration cost)
- API design changes (versioning overhead)
- Database schema changes (migration complexity)

**Irreversible:** Maximum deliberation, high consensus needed
- Architecture paradigm shifts
- Technology platform changes
- Major product direction changes

## Decision Frameworks

### Framework 1: Weighted Criteria

**Best for:** Decisions with multiple, comparable options

```
For each option, score against weighted criteria:

Criteria                 | Weight | Option A | Option B | Option C
-------------------------|--------|----------|----------|----------
Performance              | 30%    | [1-10]   | [1-10]   | [1-10]
Implementation complexity| 20%    | [1-10]   | [1-10]   | [1-10]
Maintenance burden       | 15%    | [1-10]   | [1-10]   | [1-10]
Security                 | 20%    | [1-10]   | [1-10]   | [1-10]
Cost                     | 15%    | [1-10]   | [1-10]   | [1-10]
-------------------------|--------|----------|----------|----------
TOTAL WEIGHTED SCORE     | 100%   | [score]  | [score]  | [score]
```

**Process:**
1. Identify criteria (from councillor analyses)
2. Assign weights based on priorities
3. Councillors provide scores (1-10) for their domain
4. Calculate weighted scores
5. Select highest-scoring option (or discuss if scores are close)

**When to use:**
- Multiple clear options
- Criteria can be quantified
- Councillors can provide objective scoring

### Framework 2: Risk-Based Decision

**Best for:** Security, reliability, or safety-critical decisions

```
For each option, assess:

1. Likelihood of failure: [Low/Medium/High]
2. Impact if failure occurs: [Low/Medium/High]
3. Risk mitigation available: [Yes/No/Partial]
4. Residual risk after mitigation: [Acceptable/Unacceptable]

Risk Matrix:
            Low Impact | Medium Impact | High Impact
Low Likelihood    | Accept  |  Accept     |  Consider
Medium Likelihood  | Accept  |  Consider   |  Reject
High Likelihood   | Consider |   Reject    |  Reject
```

**Process:**
1. Identify failure modes for each option
2. Assess likelihood and impact (with councillor input)
3. Identify mitigations
4. Classify residual risk
5. Reject options with unacceptable residual risk
6. Choose among acceptable options using other factors

**When to use:**
- Security-sensitive decisions
- Safety-critical systems
- High-reliability requirements
- Significant downside risk

### Framework 3: Cost-Benefit Analysis

**Best for:** Business or resource-constrained decisions

```
For each option:

Costs:
- Development time: [estimate]
- Infrastructure: [monthly/yearly cost]
- Maintenance: [ongoing effort]
- Risk exposure: [quantified if possible]
TOTAL COST: [sum]

Benefits:
- Business value: [revenue/impact estimate]
- Efficiency gains: [time saved, etc.]
- Risk reduction: [quantified if possible]
- Strategic value: [subjective but described]
TOTAL BENEFIT: [sum + description]

ROI = (Benefits - Costs) / Costs

Time to value: [how long until benefits realized]
```

**Process:**
1. Quantify costs (dev time, infrastructure, maintenance)
2. Quantify benefits (business value, efficiency, risk reduction)
3. Calculate ROI (or ROI range if uncertain)
4. Consider time to value
5. Choose option with best ROI (within acceptable time frame)

**When to use:**
- Resource-constrained situations
- Business-value decisions
- Cost-sensitive decisions
- When benefits can be reasonably estimated

### Framework 4: Constrained Optimization

**Best for:** Decisions with hard constraints and trade-offs

```
Hard constraints (must satisfy):
1. [Constraint 1]: [specific requirement]
2. [Constraint 2]: [specific requirement]
3. [Constraint 3]: [specific requirement]

For each option:
- [ ] Meets constraint 1?
- [ ] Meets constraint 2?
- [ ] Meets constraint 3?
Result: [PASS/FAIL - FAIL eliminates option]

Among PASS options, optimize for:
- [Primary optimization goal]
- [Secondary optimization goal]
```

**Process:**
1. Identify hard constraints (non-negotiables)
2. Eliminate options that don't meet constraints
3. Among remaining options, identify optimization goals
4. Select option that best optimizes primary goal
5. Use secondary goals as tiebreaker

**When to use:**
- Clear technical or business constraints
- Compliance requirements
- Must-satisfy criteria

### Framework 5: Evidence-Based Consensus

**Best for:** Complex decisions requiring councillor agreement

```
Consensus mapping:

For each option, tally councillor positions:

Option A:
- Support: [councillors]
- Oppose: [councillors]
- Neutral: [councillors]
- Strongest concerns: [summarize]

Option B:
[Repeat for each option]

Consensus categories:
- Unanimous: All councillors support
- Strong consensus: Majority support, minor concerns
- Weak consensus: Majority support, significant concerns
- No consensus: Split or no majority
```

**Process:**
1. Gather each councillor's position on each option
2. Map consensus level for each option
3. For strong consensus or unanimous: Select that option
4. For weak consensus: Address significant concerns, then decide
5. For no consensus: Use another framework or present diverging views

**When to use:**
- High-stakes decisions
- Multi-stakeholder situations
- When buy-in matters for implementation

### Framework 6: satisficing (Good Enough)

**Best for:** Low-stakes or time-constrained decisions

```
Satisficing criteria:
1. [Minimum requirement 1]: [specific threshold]
2. [Minimum requirement 2]: [specific threshold]
3. [Minimum requirement 3]: [specific threshold]

For each option:
- Does it meet all minimum requirements? [YES/NO]
- For YES options: Select the first one or simplest one
```

**Process:**
1. Define "good enough" criteria quickly
2. Find first option that meets all criteria
3. Select it and move on
4. Don't optimize beyond "good enough"

**When to use:**
- Low-stakes decisions
- Time-constrained situations
- reversible decisions
- When diminishing returns are clear

## Decision Documentation Template

After using any framework, document the decision:

```markdown
# Council Decision: [Decision Title]

## Context
[What decision was being made and why it mattered]

## Constraints
- Time: [constraints]
- Resources: [constraints]
- Quality: [constraints]

## Options Considered
1. **[Option A]:** [Brief description]
2. **[Option B]:** [Brief description]
3. **[Option C]:** [Brief description]

## Analysis Summary

### Councillor Positions
- [Specialist 1]: [Position and key reason]
- [Specialist 2]: [Position and key reason]
- [Specialist 3]: [Position and key reason]

### Framework Applied
[Which framework was used and the results]

### Key Evidence
- [Critical source 1]: [What it showed]
- [Critical source 2]: [What it showed]

## Decision

**Choice:** [Option selected]

**Rationale:**
[Why this option was chosen over others]

## Trade-offs Accepted

[What was sacrificed or accepted with this choice]

## Dissenting Views
[If councillors disagreed, present their positions fairly]

## Implementation Considerations
- [What needs to happen next]
- [Risks to monitor]
- [Success criteria]

## What Would Change This Decision
[What new evidence or circumstances would cause reconsideration]

## Council Metadata
- Session ID: [session-id]
- Date: [decision date]
- Councillors: [list of specialists]
- Framework: [which framework]
- Consensus level: [unanimous/strong/weak/none]
```

## Presenting Divergent Views

When the council couldn't reach consensus:

```markdown
# Council Analysis: [Decision Title]

## Areas of Consensus
[Where councillors agreed]

## Areas of Divergence

### Position A: [Summary]
**Held by:** [Specialists supporting this]
**Key arguments:**
1. [Argument 1 with evidence]
2. [Argument 2 with evidence]

**Best for:** [When this approach shines]

### Position B: [Summary]
**Held by:** [Specialists supporting this]
**Key arguments:**
1. [Argument 1 with evidence]
2. [Argument 2 with evidence]

**Best for:** [When this approach shines]

## Chair's Assessment

Given the divergence, I recommend:

[Choose one:]
1. **[Position A]** because [rationale]
2. **[Position B]** because [rationale]
3. **A hybrid approach**: [describe hybrid]
4. **Defer to [stakeholder]** for final decision
5. **Gather more information** on [specific gap]

### Context for This Recommendation
[Why this recommendation despite the divergence]

### If We Choose Differently
[What would cause me to recommend the other position]
```

## Decision Quality Checklist

Before finalizing any decision:

- [ ] **All councillors heard from:** Did every specialist provide analysis?
- [ ] **Evidence cited:** Are claims supported by sources?
- [ ] **Constraints considered:** Are all constraints addressed?
- [ ] **Trade-offs explicit:** Are we clear on what's being sacrificed?
- [ ] **Dissent acknowledged:** If disagreement exists, is it documented?
- [ ] **Implementation feasible:** Can this actually be implemented?
- [ ] **Success defined:** How will we know if this was the right decision?
- [ ] **Reversibility understood:** If wrong, can we change course? At what cost?
- [ ] **Stakeholder alignment:** Will key stakeholders accept this decision?

## Framework Selection Guide

| Situation | Recommended Framework |
|-----------|----------------------|
| Multiple comparable options | Weighted Criteria |
| Security/safety concerns | Risk-Based Decision |
| Business/cost focus | Cost-Benefit Analysis |
| Hard constraints | Constrained Optimization |
| Need councillor buy-in | Evidence-Based Consensus |
| Low-stakes, time-constrained | Satisficing |
| High-stakes, complex | Combine: Risk + Consensus + Cost-Benefit |

## Tips for Better Decisions

1. **Choose framework before analyzing:** Avoids bias toward preferred outcome
2. **Make constraints explicit:** Hidden constraints cause bad decisions
3. **Quantify when possible:** Numbers beat feelings (but don't force quantification)
4. **Acknowledge uncertainty:** Perfect information is rare
5. **Document dissenting views:** "We disagreed about X" is valuable context
6. **Define success criteria:** How will you know if the decision was right?
7. **Set decision review:** "Revisit in Q2 if [metric] doesn't improve"
8. **Be decisive:** Analysis paralysis is also a risk
