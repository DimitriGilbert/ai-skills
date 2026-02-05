# OpenCode Skill - Implementation Summary

**Date**: 2026-02-03
**Based on**: Detailed review in review.md
**Target**: Production-quality SKILL.md

---

## Quick Assessment

**Current Grade**: 7.5/10 (Code Review) / C+ (Skill-Creator)
**Target Grade**: A- (Production-Ready)
**Time Required**: 2-3 hours
**Status**: ❌ NOT READY FOR PRODUCTION

---

## Critical Fixes (Must Do - 1 hour)

### 1. Add "When to Use This Skill" Section (30 min)
**Location**: After YAML frontmatter, before "# OpenCode Agent Guide"

**Content to Add**:
```markdown
## When to Use This Skill

Use this skill when the user:
- Asks about OpenCode installation, setup, or configuration
- Mentions opencode.ai commands like /init, /connect, /undo
- Needs help with AGENTS.md or custom commands
- Asks about TUI features, agent switching, or tools
- Wants to create agents, skills, or custom commands
- References opencode configuration (opencode.json)
- Is working on a project with .opencode directory

This skill provides specialized knowledge for OpenCode workflows.
```

### 2. Add Installation to Quick Start (20 min)
**Location**: Line 14-16 (beginning of Quick Start)

**Content to Add**:
```markdown
### Installation
```bash
# Recommended: Install script
curl -fsSL https://opencode.ai/install | bash

# Or use npm
npm install -g opencode-ai

# Or use Homebrew (macOS/Linux)
brew install anomalyco/tap/opencode
```

### Setup
```bash
# Navigate to your project
cd /path/to/project

# Start OpenCode
opencode

# Configure your AI provider
/connect

# Initialize project (creates AGENTS.md)
/init
```
[Source: https://opencode.ai/docs]
```

### 3. Shift Tone to Agent-First (10 min)
**Approach**: Replace descriptive language with imperative instructions

**Examples**:
- "OpenCode provides file references" → "Use @ for file references"
- "You can run bash commands" → "Execute bash commands using !"
- "Tab key switches agents" → "Switch between modes using Tab"

---

## Quality Improvements (Should Do - 1.5 hours)

### 4. Fix Agent Mode Terminology (10 min)
**Location**: Lines 43-46, 106, 166-192

**Change**: Clarify Tab switches between Build mode and Plan mode, not "primary agents"

**Example**:
```markdown
### Agent Switching
- Tab key: Switch between Build mode (default) and Plan mode [Source: https://opencode.ai/docs/agents]
- @subagent: Invoke subagents (General, Explore) via @mention [Source: https://opencode.ai/docs/agents]
- Ctrl+x: Default leader key for shortcuts [Source: https://opencode.ai/docs/tui]
```

### 5. Add Tool Descriptions (20 min)
**Location**: Lines 110-120

**Change**: Add one-line description for each tool

**Example**:
```markdown
## Tools

**Built-in tools**:
- `bash` - Execute shell commands
- `edit` - Edit files in place
- `write` - Write new files
- `read` - Read file contents
- `grep` - Search file contents
- `glob` - Find files by pattern
- `list` - List directory contents
- `lsp` - Language Server Protocol (experimental)
- `patch` - Apply patches
- `skill` - Load agent skills
- `todowrite/todoread` - Task management
- `webfetch` - Fetch web content
- `question` - Interactive prompts
```

### 6. Improve Workflow Examples (40 min)
**Location**: Lines 164-200

**Change**: Replace generic examples with detailed, agent-actionable workflows

**Example**:
```markdown
## Common Workflows

### Add a New Feature
```
1. Switch to Plan mode (Tab key)
2. Plan: "Add user authentication to /settings route. Check @src/notes.ts for reference"
3. Review and iterate on the plan
4. Switch to Build mode (Tab key)
5. Build: "Go ahead and implement"
6. Test: !npm test
7. Commit: !git add . && git commit -m "feat: add authentication"
```

### Debug an Issue
```
1. Identify error location: @src/api/error.ts:42
2. Check related files: @src/components/*
3. Run with debug output: !npm run dev -- --verbose
4. Add breakpoints based on error
5. Test fix: !npm run test -- --watch
6. If issue persists: /undo to revert, refine prompt
```
```

### 7. Move and Expand Configuration (30 min)
**Action**:
- Move "Configuration Basics" section (lines 152-162) to earlier position
- Expand to include:
  - Configuration precedence order
  - Basic opencode.json structure
  - Note: "For advanced configuration, see CONFIGURATION.md"

**New Position**: After "CLI Usage" section

---

## Polish (Nice to Have - 30 min)

### 8. Add Progressive Disclosure Markers
**Approach**: Add emoji indicators or headings to show importance

**Example**:
```markdown
## 🎯 Essential Workflows
[Patterns used 90% of the time]

## 📚 Core Concepts
[Important but used less frequently]

## 🔧 Advanced Features
[For specialized use cases]
```

### 9. Improve Section Descriptions
**Approach**: Add one-sentence context to each major section

**Example**:
```markdown
## TUI Commands
[Interactive terminal commands for session management and configuration]

## CLI Usage
[Non-interactive commands for automation and scripting]
```

### 10. Add Cross-References
**Approach**: Add links to supplementary docs for advanced topics

**Example**:
```markdown
For advanced configuration (remote config, plugins, formatters), see [CONFIGURATION.md](CONFIGURATION.md)

For real-world workflow examples, see [EXAMPLES.md](EXAMPLES.md)
```

---

## Testing Checklist

After implementing fixes, test with these scenarios:

### Scenario 1: Installation
**Input**: "How do I install opencode?"
**Expected**: Agent loads skill and provides installation commands
**Verify**: ✅ Installation section is present and complete

### Scenario 2: Custom Command
**Input**: "Create a custom command for running tests"
**Expected**: Agent provides complete command template with frontmatter
**Verify**: ✅ Custom Commands section has template example

### Scenario 3: Configuration
**Input**: "How do I configure opencode to use a specific model?"
**Expected**: Agent explains opencode.json configuration
**Verify**: ✅ Configuration section covers model settings

### Scenario 4: Mode Selection
**Input**: "I want to plan a feature before implementing"
**Expected**: Agent explains Plan mode and Tab switching
**Verify**: ✅ Agent switching terminology is clear

### Scenario 5: When to Use
**Input**: [Any opencode-related question]
**Expected**: Agent correctly determines to load this skill
**Verify**: ✅ "When to Use This Skill" section exists

---

## Success Criteria

The skill is production-ready when:

✅ **Complete Coverage**
- Installation instructions present
- All major features documented
- Configuration covered (basics + reference to advanced)

✅ **Agent-Focused**
- "When to Use This Skill" section exists
- Tone is imperative (what agent should DO)
- Examples show agent actions

✅ **Clear and Actionable**
- Tool descriptions present
- Workflow examples are detailed
- Terminology is consistent

✅ **Well-Structured**
- Progressive disclosure evident
- Related topics grouped
- Easy to navigate

✅ **Within Limits**
- Under 500 lines (current: 201 lines, target: ~350 lines)
- All claims sourced
- No user-facing documentation

---

## Estimated Timeline

| Phase | Tasks | Time | Cumulative |
|-------|-------|------|------------|
| Phase 1 | Critical fixes (#1-3) | 1 hour | 1 hour |
| Phase 2 | Quality improvements (#4-7) | 1.5 hours | 2.5 hours |
| Phase 3 | Polish (#8-10) | 30 min | 3 hours |
| Phase 4 | Testing and validation | 30 min | 3.5 hours |

**Total Estimated Time**: 3-3.5 hours

---

## Next Steps

1. **Review Implementation Summary** (you are here)
2. **Read Detailed Review** - See review.md for complete analysis
3. **Implement Phase 1 Fixes** - Critical items only
4. **Implement Phase 2 Improvements** - Quality items
5. **Implement Phase 3 Polish** - Optional enhancements
6. **Test with Scenarios** - Validate agent behavior
7. **Iterate Based on Testing** - Refine as needed
8. **Finalize and Deploy** - Production-ready skill

---

## Resources

- **Detailed Review**: .search-data/opencode/review.md (comprehensive 900+ line analysis)
- **Original Draft**: .search-data/opencode/SKILL-draft.md (201 lines)
- **Documentation Sources**: .search-data/opencode/documentation-sources.md
- **Creation Plan**: .search-data/opencode/plan.md
- **Best Practice Example**: ~/.agents/skills/find-skills/SKILL.md (reference)

---

## Contact

For questions or clarification on the review:
- See detailed review.md for specific examples and rationale
- Review documentation-sources.md for verification of claims
- Consult plan.md for original requirements

---

**Remember**: The goal is a production-quality skill that enables agents to use opencode.ai impeccably. Focus on agent needs, progressive disclosure, and actionable instructions.
