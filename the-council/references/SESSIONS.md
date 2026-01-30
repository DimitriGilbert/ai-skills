# Council Session Management

This document covers the practical mechanics of managing council sessions - file organization, session IDs, and council lifecycle.

## Session Structure

### Directory Layout

```
.council/
└── [session-id]/
    ├── CONTEXT.md              # Original question and context
    ├── CHAIR.md                # Chair's notes and synthesis
    ├── [specialist-1].md       # Councillor analyses
    ├── [specialist-2].md
    ├── [specialist-3].md
    └── DELIBERATION.md         # Optional: Facilitated discussion logs
```

### Session ID Format

Use descriptive, timestamp-based session IDs:

```
Format: [YYYY-MM-DD]-[topic-keyword]-[short-id]

Examples:
- 2025-01-23-graphql-migration-abc123
- 2025-01-23-auth-review-xyz789
- 2025-01-23-architecture-fff456
```

## Session Lifecycle

### 1. Initialization

```bash
# Create session directory
mkdir -p .council/[session-id]

# Create context file with the question
cat > .council/[session-id]/CONTEXT.md << 'EOF'
# Council Question

[The question being analyzed]

## Context
[Background information]

## Constraints
[Deadlines, budgets, technical limitations]

## Artifacts
[Links to relevant files, docs, PRs]

## Required Specialists
- [Specialist 1]: [role]
- [Specialist 2]: [role]
EOF
```

### 2. Summoning Councillors

For each specialist, launch a subagent with clear instructions:

```
You are [Specialist Name], a specialist in [domain].

You have been summoned to the council to analyze this question:
[Insert full question and context]

Your responsibilities:
1. Conduct thorough analysis from your specialist perspective
2. Research using all available tools (Context7, WebSearch, etc.)
3. Base your analysis on reality and the provided artifacts
4. Save your complete analysis to: .council/[session-id]/[specialist-name].md
5. Cite all sources (URLs, Context7 library+query, WebSearch terms)
6. Use relevant existing skills to help with analysis

Your analysis should follow the councillor file format in TEMPLATES.md

Begin your analysis now.
```

### 3. Monitoring Progress

Track councillor completion:

```bash
# List session files
ls -la .council/[session-id]/

# Expected output:
# CONTEXT.md          # Created by Chair
# security-analyst.md # Councillor 1
# perf-engineer.md    # Councillor 2
# ux-specialist.md    # Councillor 3
```

**Wait for all councillors to complete before synthesis.**

### 4. Chair Synthesis

Read all councillor files, then create `CHAIR.md`:

```markdown
# Chair Synthesis

## Question
[Restate the original question]

## Councillor Summaries
### [Specialist 1]
- Position: [Support/Oppose/Conditional]
- Key evidence: [Main finding]
- Confidence: [High/Medium/Low]

### [Specialist 2]
[...continue for each councillor...]

## Consensus Areas
[Where councillors agree]

## Areas of Dissent
[Where councillors disagree and why]

## Preliminary Decision
[Chair's initial synthesis]

## Need for Deliberation?
- If YES: See DELIBERATION.md
- If NO: Final decision follows

## Final Decision
[The council's decision with rationale]

## Dissenting Views
[If consensus wasn't reached, present alternative positions]
```

### 5. Deliberation (If Needed)

Create `DELIBERATION.md` to track facilitated discussions:

```markdown
# Council Deliberation

## Discussion 1: [Topic of disagreement]
**Participants:** [Specialist A], [Specialist B]
**Facilitator:** Chair

### Position A
[Specialist A's position and evidence]

### Position B
[Specialist B's position and evidence]

### Convergence Found
[Any common ground identified]

### Remaining Divergence
[What still differs and why]

### Outcome
[Consensus reached OR clear articulation of disagreement]
```

## Session Completion

### Completion Checklist

- [ ] All councillors submitted analyses
- [ ] Chair read all councillor files
- [ ] Consensus/dissent mapped
- [ ] Deliberations completed (if needed)
- [ ] Final decision documented in CHAIR.md
- [ ] Dissenting views acknowledged (if applicable)

### Session Archive

Completed sessions can be:
- Kept in `.council/` for reference
- Moved to `.council/archive/` for long-term storage
- Deleted after decision implementation (if no longer needed)

## Practical Tips

### Parallel Councillor Launch

Launch multiple councillors in parallel for efficiency:

```bash
# Launch all councillors simultaneously, then:
# - Monitor each agent's progress
# - Wait for all to complete before synthesis
```

### Session Persistence

Councillor files serve as:
- **Reference material**: Future councils can learn from past analyses
- **Decision audit trail**: Why was this decision made?
- **Research cache**: Sources and findings already gathered

### Reusing Sessions

When a similar question comes up, leverage past council work:

```bash
# Copy previous session as reference
cp -r .council/2025-01-23-graphql-abc123 .council/2025-01-25-graphql-refinement-xyz789

# Update CONTEXT.md with new question
# Councillors can reference previous findings
# Focus on what's different or new
```

**When to reuse sessions:**
- Follow-up questions on the same topic
- Refinement of previous decisions
- Related architecture decisions
- Iterative analysis (e.g., "what if we changed X?")

**How to instruct councillors on reused sessions:**
```
You are analyzing a follow-up to a previous council session.

Previous session context is available in: [reference old councillor files]

Focus your analysis on:
- What has changed since the previous session
- How the new question differs from the old one
- Whether previous conclusions still hold

You may reference previous analyses but conduct fresh research for the new question.
```

**Benefits of session reuse:**
- Build on previous research (faster analysis)
- Maintain consistency across related decisions
- Track decision evolution over time
- Learn from past councillor perspectives

## Troubleshooting

### Councillor files missing

**Problem:** Expected councillor file wasn't created

**Solutions:**
- Check if the agent encountered an error
- Verify the file path was correct
- Re-summon the councillor with clearer instructions

### Analysis quality issues

**Problem:** Councillor analysis is too shallow or lacks sources

**Solutions:**
- Provide more specific context in the original summons
- Ask the councillor to revise specific sections
- Summon an additional specialist for deeper analysis

### Deliberation going in circles

**Problem:** Discussion isn't converging

**Solutions:**
- Narrow the topic to specific points of disagreement
- Ask each councillor what evidence would change their mind
- Chair makes a decision with dissenting views documented
