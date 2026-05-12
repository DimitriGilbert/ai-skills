# Report Formats

Standard formats for each phase's output.

## Exploration Map

File: `.review/session-[id]/exploration-map.md`

```markdown
# Exploration Map - [Project Name]

## Project Overview
[Brief description of what the project does]

## Technology Stack
- Language: [TypeScript, Python, etc.]
- Framework: [React, Next.js, etc.]
- Build tool: [pnpm, cargo, etc.]

## Gatekeeping Commands
- Type check: [e.g., `pnpm run check-types`]
- Build: [e.g., `pnpm run build`]

## Excluded Paths
- [path]: [reason]
- [path]: [reason]

## Reviewable Files

### Cluster 1: [Name] (Security Focus)
- `src/path/file1.ts`
- `src/path/file2.ts`
- [max 15 files]
Dependencies: [other clusters this depends on]

### Cluster 2: [Name] (Logic Focus)
- `src/path/file3.ts`
- `src/path/file4.ts`
Dependencies: [other clusters this depends on]

[Continue for all clusters]

## Summary
- Total reviewable files: [N]
- Total clusters: [N] (= number of review agents)
- Review batches needed: [ceil(N/5)]
```

## Review Report

File: `.review/session-[id]/review-report-[N].md`

```markdown
# Review Report - Cluster [N]: [Cluster Name]

## Metadata
- Cluster: [N]
- Files reviewed: [count]
- Reviewer: subagent-[id]
- Created: [timestamp]

## Findings

### [SEVERITY: CRITICAL] Finding 1: [Title]
**File**: src/path/file.ts:42
**Problem**: [What is wrong and why it matters]
**Evidence**:
\`\`\`typescript
// the problematic code
\`\`\`
**Impact**: [What could go wrong]
**Suggestion**: [How to fix, specific]

### [SEVERITY: HIGH] Finding 2: [Title]
[Same format]

### [SEVERITY: MEDIUM] Finding 3: [Title]
[Same format]

## Summary
- Critical: [N]
- High: [N]
- Medium: [N]
- Total: [N]

[OR if no findings:]
## No Issues Found
After thorough review, no security or logic issues were identified in this cluster.
```

## Verified Report

File: `.review/session-[id]/verified-report-[N].md`

```markdown
# Verified Report - Cluster [N]: [Cluster Name]

## Metadata
- Cluster: [N]
- Original findings: [count]
- Confirmed: [count]
- Dismissed: [count]
- Verifier: subagent-[id]

## Verified Findings

### Finding 1: [Title] — CONFIRMED
**Original**: [summary]
**File**: src/path/file.ts:42
**Verification**: [Code evidence confirming this is real]
**Severity**: [CRITICAL/HIGH/MEDIUM]

### Finding 2: [Title] — DISMISSED
**Original**: [summary]
**Reason**: [Why this is a false positive]
**Evidence**: [Code showing why it's fine]

## Summary
- Confirmed findings: [N] ([list severities])
- Dismissed findings: [N] ([brief reasons])
```

## Fix Plan

File: `.review/session-[id]/fix-plan.md`

Must follow the subagent-orchestration plan template format exactly. See SKILL.md Phase 4 for the template.
