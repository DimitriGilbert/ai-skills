# AGENTS.md Verification Guide

This guide helps you systematically verify an existing AGENTS.md file for common issues.

## Verification Checklist

Use this checklist to audit an AGENTS.md file:

### Size & Scope

- [ ] **File length**: Is the file under 75 lines? (Longer files indicate potential bloat)
- [ ] **Token efficiency**: Does every line add value to every single task?
- [ ] **Root-level appropriateness**: Would each instruction be relevant to ANY task in this repo?

### Essential Elements

- [ ] **Project description**: Is there a clear one-sentence description of what the project is?
- [ ] **Package manager**: Is the package manager explicitly specified (if not npm)?
- [ ] **Build commands**: Are non-standard build/test/typecheck commands documented?
- [ ] **Progressive disclosure links**: Does the file point to other resources for domain-specific info?

### Anti-Patterns

- [ ] **File path documentation**: Are specific file paths documented (e.g., "auth is in src/auth/handlers.ts")?
- [ ] **Extensive style rules**: Are detailed coding style rules in the root instead of separate files?
- [ ] **Rigid language**: Does it use words like "ALWAYS", "MUST", "NEVER" instead of conversational tone?
- [ ] **Obvious advice**: Does it state things the agent already knows (e.g., "write clean code")?

### Contradictions

Look for conflicting instructions in these areas:

- [ ] **Code style**: "Use functional patterns" vs "Use classes for X"
- [ ] **Error handling**: "Always throw errors" vs "Return null for not found"
- [ ] **Testing**: "Test everything" vs "Don't test trivial getters"
- [ ] **Naming**: "Use descriptive names" vs "Short names for locals"
- [ ] **Comments**: "Comment everything" vs "Code should be self-documenting"

### Stale Information Risks

- [ ] **File structure**: Does it document specific files or directories that may be renamed?
- [ ] **Module lists**: Does it list specific modules or components?
- [ ] **Version-specific commands**: Are there version-pinned commands that may go stale?
- [ ] **Architecture details**: Does it describe implementation details rather than capabilities?

### Progressive Disclosures

- [ ] **Domain separation**: Are domain-specific rules in separate files?
- [ ] **Link quality**: Do links point to existing, relevant files?
- [ ] **Hierarchy**: Is there a logical organization to referenced files?
- [ ] **Navigation**: Can agents easily discover related information?

### Monorepo Considerations (if applicable)

- [ ] **Root focus**: Is root AGENTS.md focused on monorepo-level concerns only?
- [ ] **Package files**: Do packages have their own AGENTS.md files?
- [ ] **Scope separation**: Is each level appropriately scoped?

## Scoring Guide

**Score your AGENTS.md:**

| Category | Excellent | Good | Needs Improvement |
|----------|-----------|------|-------------------|
| **Size** | < 50 lines | 50-75 lines | > 75 lines |
| **Essentials** | All 4 present | 3 present | < 3 present |
| **Anti-patterns** | None found | 1-2 found | 3+ found |
| **Contradictions** | None | 1 minor | Multiple or major |
| **Stale risks** | None | 1-2 minor | 3+ or major |
| **Progressive** | Well-structured | Some structure | No structure |

**Overall assessment:**
- **Excellent**: Ready to use
- **Good**: Consider minor improvements
- **Needs Improvement**: Refactor using [REFACTORING.md](REFACTORING.md)

## Common Issues Found

### Issue: "Kitchen Sink" AGENTS.md

**Symptom:** File contains everything from git workflow to TypeScript style to deployment instructions.

**Solution:** Apply progressive disclosure. Create separate files for each domain.

### Issue: "Tour Guide" AGENTS.md

**Symptom:** File extensively documents file structure: "src/components/ contains React components, src/utils/ contains utilities..."

**Solution:** Remove file paths. Describe capabilities and let the agent explore.

### Issue: "Rule Book" AGENTS.md

**Symptom:** File uses rigid language: "ALWAYS use const", "NEVER use any", "MUST include tests..."

**Solution:** Use conversational tone. "Prefer const over let", "Avoid any when possible", "Write tests for non-trivial code."

### Issue: "Time Capsule" AGENTS.md

**Symptom:** File documents outdated architecture or renamed files.

**Solution:** Remove specific implementation details. Focus on stable concepts and capabilities.

## Verification Process

1. **Read through**: Read the entire AGENTS.md file
2. **Check against list**: Go through the checklist above
3. **Note issues**: Document each issue found
4. **Score**: Use the scoring guide to assess overall quality
5. **Recommend**: Suggest improvements or refactoring if needed
6. **Report**: Provide clear feedback to the user

## Example Verification Report

```markdown
# AGENTS.md Verification Report

## Summary
- File length: 87 lines (❌ exceeds recommended 75)
- Essentials: 3/4 present (⚠️ missing project description)
- Anti-patterns: 3 found (⚠️ file paths, rigid language, obvious advice)
- Contradictions: 1 found (⚠️ error handling approaches conflict)
- Stale risks: 2 found (⚠️ file structure, module lists)
- Progressive: Minimal structure (⚠️ no domain separation)

## Issues Found

### High Priority
1. **File is too long** (87 lines vs recommended 75)
   - Recommendation: Apply progressive disclosure

2. **Missing project description**
   - Impact: Agent lacks context about project purpose
   - Recommendation: Add one-sentence description at top

3. **Documents file structure extensively**
   - Example: "Authentication in src/auth/handlers.ts"
   - Risk: File paths go stale
   - Recommendation: Remove specific paths, describe capabilities

### Medium Priority
1. **Rigid language throughout**
   - Examples: "ALWAYS use const", "NEVER use any"
   - Recommendation: Use conversational tone

2. **Contradiction in error handling**
   - Line 15: "Always throw errors"
   - Line 45: "Return null for not found cases"
   - Recommendation: Clarify which approach to use

3. **Lists specific modules**
   - Example: Lists 12 specific components in docs/
   - Risk: List will go stale
   - Recommendation: Remove or describe capabilities

### Low Priority
1. **Obvious advice**
   - Example: "Write clean, readable code"
   - Recommendation: Remove (agent already knows this)

## Recommendations

1. Add one-sentence project description
2. Refactor using progressive disclosure (see REFACTORING.md)
3. Remove all file path documentation
4. Replace rigid language with conversational tone
5. Resolve error handling contradiction
6. Remove module lists and obvious advice

Estimated effort: 30-60 minutes
```

## Next Steps

After verification:

1. **If file is excellent**: No action needed
2. **If file has minor issues**: Make targeted improvements
3. **If file needs major work**: Follow the refactoring guide in [REFACTORING.md](REFACTORING.md)
