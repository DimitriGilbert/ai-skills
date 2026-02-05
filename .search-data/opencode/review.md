# OpenCode Skill Draft Review

**Date**: 2026-02-03
**Reviewer**: Code Review Expert
**Status**: Needs significant improvements
**Target**: Production-quality skill

---

## Executive Summary

The opencode skill draft is a solid foundation but requires significant refinement before it can be considered production-quality. While it covers most essential features and maintains good brevity (201 lines vs 500-line limit), it lacks several critical elements:

- Missing installation section (critical for first-time users)
- Insufficient "when to use this skill" guidance
- Limited contextual examples for real-world workflows
- Some advanced configuration details are incomplete
- Missing key features from documentation (remote config, autoupdate, formatters, plugins, etc.)

**Overall Assessment**: 7.5/10 - Good foundation, needs targeted improvements

---

## Detailed Evaluation by Criterion

### 1. Completeness: 8/10

**Strengths:**
- Covers all major feature areas: TUI, CLI, custom commands, agents, tools, skills system, rules, configuration
- Includes both interactive (TUI) and non-interactive (CLI) usage patterns
- Documents file references, bash commands, and agent switching
- Includes skills system details

**Critical Gaps:**
1. **Missing Installation Section**
   - No coverage of installation methods (curl script, npm, brew, Docker, etc.)
   - This is a critical first step for any new user
   - Should include: prerequisites, installation commands, post-install verification

2. **Incomplete Configuration Coverage**
   Missing from plan but present in documentation:
   - Remote configuration (`.well-known/opencode`)
   - Autoupdate settings
   - Formatters configuration
   - Plugins system
   - Compaction settings
   - Provider-specific options (AWS Bedrock, etc.)
   - Keybinds configuration
   - Themes selection
   - Environment variable substitution (`{env:VARIABLE}`, `{file:path}`)

3. **Missing Agent Creation Examples**
   - Only mentions `opencode agent create <name>`
   - No examples of markdown-based agent configuration
   - No examples of agent options in JSON config
   - Missing subtask configuration details

4. **Incomplete Permission System**
   - Lists allow/deny/ask but no concrete examples
   - No pattern examples (wildcards)
   - No per-agent override examples
   - Missing tool-specific permissions

5. **Missing MCP Server Details**
   - Mentions MCP but no configuration examples
   - No explanation of what MCP servers are or how to set them up
   - Missing remote MCP configuration

6. **Missing Configuration Precedence**
   - Does not explain how configs merge
   - No mention of the precedence order (remote → global → custom → project → .opencode → inline)

**Recommendations:**
- Add installation section with all methods
- Expand configuration section to include missing topics (consider splitting to supplementary docs)
- Add at least one complete agent configuration example
- Include permission configuration with wildcards and agent overrides
- Consider adding MIGRATION.md for advanced configuration topics

---

### 2. Accuracy: 9/10

**Strengths:**
- All statements include source references with URLs
- Information matches documentation sources verified via webfetch
- Command syntax and options are accurate
- File locations and naming conventions are correct

**Minor Issues:**
1. **CLI Commands List** (Line 63)
   - Lists: `agent, attach, auth, github, mcp, models, run, serve, session, stats, export, import, web`
   - Documentation also mentions: `acp, uninstall, upgrade`
   - This is acceptable as "major commands" but should be more explicit

2. **Environment Variables** (Line 67)
   - Lists: `OPENCODE_AUTO_SHARE, OPENCODE_CONFIG, OPENCODE_DISABLE_CLAUDE_CODE`
   - Documentation also mentions: `OPENCODE_CONFIG_DIR, OPENCODE_CONFIG_CONTENT`
   - Missing: `OPENCODE_MODEL`, provider-specific variables

3. **Agent Switching** (Line 46)
   - States "Tab key: Cycle through primary agents (Build, Plan)"
   - Documentation confirms this but also mentions this switches between modes
   - Slightly imprecise - it switches between Build and Plan modes, not "agents" per se

**Recommendations:**
- Add "and more" qualifier to command lists to avoid incompleteness
- Clarify that Tab switches between Build/Plan modes, with @subagent for others
- Add note: "See full CLI documentation for all commands"

---

### 3. Clarity: 7/10

**Strengths:**
- Language is generally clear and concise
- Good use of formatting (headers, code blocks, lists)
- Each section is focused on a specific topic
- Quick Start provides immediate value

**Issues:**

1. **Missing Context for WHEN to Use Features**
   - Section headers tell you WHAT things are, not WHEN to use them
   - Example: "Custom Commands" section doesn't explain the problem they solve
   - No guidance on when to choose Plan vs Build agent
   - No guidance on when to use TUI vs CLI vs Web

2. **Ambiguous Terminology**
   - Line 43: "primary agents (Build, Plan)" vs "subagents (General, Explore)"
   - Line 46: "Tab key: Cycle through primary agents" - but actually cycles modes
   - Line 106: "options: description, temperature, max_steps..." - no context for what each does

3. **Insufficient Explanations**
   - Line 92: "Config options: template, description, agent, subtask, model"
   - Line 102: Lists agent options without explaining what they control
   - Line 120: Lists tools with no description of what each does

4. **Missing Explanatory Notes**
   - No explanation of what Git-based undo/redo means
   - No explanation of why you'd use `.ignore` patterns
   - No explanation of what "fuzzy file search" means in practice

**Recommendations:**
- Add a prominent "When to Use This Skill" section at the top (best practice from find-skills)
- Add one-sentence explanations for each tool in the tools section
- Clarify agent mode terminology: "Plan mode" vs "Build mode"
- Add context notes: "Git-based: requires initialized Git repo"
- Consider adding "Why/When" subtitles to major sections

---

### 4. Structure: 7/10

**Strengths:**
- Logical flow from Quick Start → Core Patterns → TUI → CLI → Advanced
- Related topics grouped together (agents together, tools together)
- Progressive disclosure generally works well

**Issues:**

1. **Configuration Basics Misplaced**
   - Section at line 152 "Configuration Basics" seems tacked on at the end
   - This section contains fundamental information that should be earlier
   - Conflicts with the "progressive disclosure" principle

2. **Missing "When to Use" Section**
   - Best practice from find-skills example is missing
   - Agents can't know when to load this skill vs using general knowledge
   - Description in frontmatter is generic, not guidance-specific

3. **Common Workflows Could Be Integrated**
   - Section starts at line 164 but feels disconnected
   - Would work better as practical examples integrated throughout
   - Debug example doesn't show actual file references or bash commands

4. **Skills System Section Placement**
   - Line 122: "Skills System" is fairly advanced but placed mid-document
   - Consider moving to end or having separate advanced section

5. **Inconsistent Detail Level**
   - Some sections are very detailed (Custom Commands with full frontmatter example)
   - Others are just lists (TUI Commands, CLI Usage)
   - Makes navigation inconsistent

**Recommended Reorganization:**

```markdown
# OpenCode Agent Guide

## When to Use This Skill
[NEW SECTION - critical for agent decision-making]

## Quick Start
[EXISTING - good as-is]

## Essential Workflows
[MOVE Common Workflows here, expand with more examples]
- Ask questions about codebase
- Add new features
- Debug issues
- Make code changes
- Work with Git

## Core Concepts
[RENAME from Core Usage Patterns]
- File References (@)
- Bash Commands (!)
- Agent Switching (Tab, @subagent)

## TUI Commands
[EXISTING - maybe expand slightly]

## CLI Usage
[EXISTING - add more context]

## Custom Commands
[EXISTING - good]

## Agents
[EXISTING - add mode selection guidance]

## Tools
[EXISTING - add tool descriptions]

## Skills System
[EXISTING - move to end]

## Configuration
[MOVE Configuration Basics here]
- Configuration files and precedence
- Agent configuration
- Tools permissions
- Advanced topics (see CONFIGURATION.md)
```

---

### 5. Examples: 7/10

**Strengths:**
- Good basic examples for file references, bash commands, agent switching
- Custom command example with frontmatter is excellent
- Workflow examples provide some context

**Issues:**

1. **Missing Real-World Context**
   - Debug example (line 167) is too generic: "Check console output, add breakpoints if needed"
   - No example showing a complete conversation flow
   - No multi-step examples showing plan → iterate → build workflow

2. **Incomplete Agent Examples**
   - No full agent configuration example
   - No example showing when to use Plan vs Build
   - No example of agent-specific tool restrictions

3. **Tool Usage Missing Examples**
   - Lists tools but no usage examples
   - No examples of grep vs glob vs list
   - No examples showing best practices like "use workdir instead of cd"

4. **Missing Progressive Examples**
   - Examples jump from basic to advanced without bridging steps
   - No "simple → complex" progression
   - Missing examples showing what happens when things go wrong

**Suggested Additional Examples:**

```markdown
## Complete Workflow Examples

### Example 1: Adding a New Feature
1. Switch to Plan mode (Tab)
2. Plan the feature with context
3. Review and refine the plan
4. Switch to Build mode (Tab)
5. Execute the plan
6. Test changes (!npm test)
7. If issues, use /undo and retry

### Example 2: Debugging an Issue
1. Reference the error file: @src/error.ts
2. Check related files: @src/components/*
3. Run debugging command: !npm run dev
4. Add breakpoints based on output
5. Test fix: !npm test
6. Commit changes: !git add . && git commit -m "fix: ..."
```

---

### 6. Progressive Disclosure: 7/10

**Strengths:**
- Quick Start section focuses on essentials
- Core patterns separated from advanced topics
- Generally good separation of basic vs advanced

**Issues:**

1. **Quick Start is Good But Incomplete**
   - Missing installation (absolute first step)
   - Missing project initialization (/init)
   - Missing configuration (/connect)

2. **Some Advanced Topics Mixed In**
   - Line 120: Tools section mentions "MCP servers" (advanced) alongside basic tools
   - Line 138: Skills system mentions permissions (advanced)
   - Configuration Basics at end contains fundamental info

3. **No "See Also" References**
   - Missing references to supplementary documentation for deep dives
   - No "Advanced Topics" section pointing to detailed docs
   - Examples don't show progression to advanced use cases

4. **Missing Depth Indicators**
   - No indication of which sections are "what you need 90% of the time"
   - No "for advanced users" markers
   - All sections treated equally in importance

**Recommendations:**
- Add installation and /connect to Quick Start
- Add "For most users, focus on these sections" note
- Move MCP servers, permissions, and advanced config to supplementary docs
- Add "Advanced" markers to sections that require deeper knowledge
- Add cross-references: "For advanced configuration, see CONFIGURATION.md"

---

### 7. Length: 10/10

**Status:** ✅ EXCELLENT

**Details:**
- Current length: 201 lines
- Requirement: Under 500 lines
- Usage: 40.2% of allowed budget
- Verdict: Excellent, ample room for improvements

**Opportunities:**
- Can add installation section (~20 lines)
- Can add "When to Use This Skill" section (~15 lines)
- Can expand examples and add more context (~50-80 lines)
- Still stay well under 500-line limit

---

### 8. Format: 9/10

**Strengths:**
- YAML frontmatter is complete and accurate
- Required fields present: `name`, `description`
- Optional fields used appropriately: `license`, `compatibility`, `metadata`
- Markdown formatting is consistent
- Source references included throughout

**Minor Issues:**

1. **Missing "When to Use This Skill" Section**
   - Best practice from find-skills example (lines 10-19)
   - Critical for agent decision-making
   - Should describe trigger phrases and scenarios

2. **Metadata Could Be More Descriptive**
   ```yaml
   metadata:
     version: 1.0.0
     author: opencode
     primary_use: agent_assistant
   ```
   - Could add: `trigger_phrases`, `related_skills`, `dependencies`

3. **Source Reference Formatting Inconsistent**
   - Some use: `[Source: https://opencode.ai/docs/tui]`
   - Some use: `[Source: https://opencode.ai/docs]`
   - Consider using footnotes for cleaner readability

**Suggested Frontmatter Update:**

```yaml
---
name: opencode
description: Expert guide for working with opencode.ai - TUI commands, CLI operations, custom commands, agents, tools, skills system, and AGENTS.md configuration. Use this skill when users ask about OpenCode features, commands, configuration, or when they need help with opencode.ai workflows.
license: MIT
compatibility: opencode
metadata:
  version: 1.0.0
  author: opencode
  primary_use: agent_assistant
  trigger_phrases:
    - "opencode"
    - "how do I use opencode"
    - "opencode command"
    - "opencode config"
    - "opencode agent"
    - "AGENTS.md"
  related_skills:
    - skill-creator
  dependencies:
    - node (for npm installation)
---
```

---

## Critical Issues Summary

### Must Fix Before Production

1. **❌ Missing Installation Section**
   - Impact: First-time users cannot get started
   - Fix: Add "Installation" section after Quick Start or merge into Quick Start
   - Content: Prerequisites, all installation methods, verification steps

2. **❌ Missing "When to Use This Skill" Section**
   - Impact: Agents don't know when to load this skill
   - Fix: Add prominent section after frontmatter
   - Content: Trigger phrases, scenarios, related commands

3. **❌ Configuration Section Misplaced and Incomplete**
   - Impact: Fundamental info buried at end, missing key config topics
   - Fix: Move to earlier section, add remote config, autoupdate, formatters, plugins
   - Consider: Split to supplementary CONFIGURATION.md

4. **❌ Insufficient Tool Documentation**
   - Impact: Agents can't use tools effectively
   - Fix: Add one-line description for each tool
   - Add: Best practices and when to use each tool

### Should Fix for Quality

5. **⚠️ Agent Mode Terminology Confusion**
   - Issue: "primary agents" vs "modes" inconsistency
   - Fix: Clarify: Tab switches between Build mode and Plan mode

6. **⚠️ Missing Real-World Workflow Examples**
   - Issue: Examples are too generic, don't show complete flows
   - Fix: Add 2-3 complete walkthrough examples

7. **⚠️ No Configuration Precedence Explanation**
   - Issue: Critical for understanding how configs merge
   - Fix: Add precedence order explanation

8. **⚠️ Permission System Examples Missing**
   - Issue: Lists allow/deny/ask with no examples
   - Fix: Add concrete permission configuration examples

### Nice to Have

9. **💡 Add Progressive Disclosure Markers**
   - Mark sections as "Essential", "Common", "Advanced"

10. **💡 Expand Common Workflows**
    - Add more workflows: testing, deployment, refactoring

11. **💡 Agent Configuration Examples**
    - Add full agent config example in JSON and Markdown

12. **💡 MCP Server Configuration**
    - Add basic MCP server setup example

---

## Specific Section Recommendations

### Quick Start (Lines 14-22)

**Current Grade:** B

**Issues:**
- Missing installation
- Missing /connect for configuration
- Missing /init for project setup
- Good for existing users, bad for new users

**Recommended Expansion:**

```markdown
## Quick Start

### Installation
```bash
# Recommended: Install script
curl -fsSL https://opencode.ai/install | bash

# Or use npm
npm install -g opencode-ai

# Or use Homebrew (macOS/Linux)
brew install anomalyco/tap/opencode
```
[Source: https://opencode.ai/docs]

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

**Essential Commands**: /help, /sessions, /new, /exit

**File references**: `@path/to/file` - fuzzy file search and content injection

**Bash commands**: `!npm install` - execute shell commands directly

**Undo/redo**: /undo (Git-based), /redo to restore changes
```

---

### Core Usage Patterns (Lines 24-45)

**Current Grade:** B+

**Issues:**
- Title should be "Core Concepts" or "Essential Patterns"
- Missing context on why these are core
- Agent switching terminology slightly imprecise

**Recommendations:**
- Rename to "Core Concepts"
- Add one-line context: "These are the patterns you'll use 90% of the time"
- Clarify: "Tab key switches between Build and Plan modes"

---

### TUI Commands (Lines 47-57)

**Current Grade:** B

**Issues:**
- Just a list, no descriptions
- No grouping by purpose
- Missing context on which are essential vs advanced

**Recommendations:**

```markdown
## TUI Commands

**Session Management**: /sessions, /new, /exit, /share, /unshare

**Configuration**: /connect (setup AI provider), /models, /editor, /themes

**View Options**: /compact, /details, /thinking (toggle AI reasoning)

**Git Integration**: /undo, /redo, /export, /import

**Help**: /help (list commands), /init (create AGENTS.md)

[Source: https://opencode.ai/docs/tui]
```

---

### CLI Usage (Lines 59-67)

**Current Grade:** B-

**Issues:**
- Missing context on when to use CLI vs TUI
- Commands not grouped
- "and more" should be explicit

**Recommendations:**

```markdown
## CLI Usage

Use `opencode run <prompt>` for non-interactive scripting and automation.

**Commands**:
- `opencode agent` - Agent management
- `opencode auth` - Authentication setup
- `opencode run <prompt>` - Non-interactive execution
- `opencode serve` - Start local server
- `opencode web` - Open web interface
- And more: attach, github, mcp, models, session, stats, export, import

**Global flags**: --help, --version, --print-logs, --log-level

**Environment**: OPENCODE_AUTO_SHARE, OPENCODE_CONFIG, and more

[Source: https://opencode.ai/docs/cli]
```

---

### Tools (Lines 108-120)

**Current Grade:** C+

**Issues:**
- Lists tools but no descriptions
- No guidance on when to use each
- "Best practices" section has good info but not integrated

**Recommendations:**

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

**Permissions**: allow, deny, ask per tool

**Custom tools**: Configure in opencode.json or via MCP servers

**Best practices**:
- Use `workdir` parameter instead of `cd` patterns
- Batch independent tool calls together
- Prefer `grep` over bash grep for performance

[Source: https://opencode.ai/docs/tools]
```

---

### Common Workflows (Lines 164-200)

**Current Grade:** B

**Issues:**
- Generic, not specific enough
- Missing complete flow examples
- Debug workflow is too simplistic

**Recommendations:**

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

### Code Review with Agent
```
1. Create review command in .opencode/commands/review.md
2. Run: /review @src/components/Button.tsx
3. Review suggestions
4. Apply changes: !npm run lint -- --fix
```

### Multi-Agent Task
```
1. @plan-agent: Create implementation plan for new feature
2. Review and refine the plan
3. Tab to Build agent
4. Execute plan
5. @review-agent: Review changes
```
```

---

## Recommended Supplementary Files

Given the 500-line limit and complexity of opencode, consider creating:

### 1. CONFIGURATION.md (Optional)
**Purpose**: Deep dive into advanced configuration options
**Content**:
- Configuration precedence order
- Remote configuration
- Autoupdate settings
- Formatters configuration
- Plugins system
- MCP servers
- Compaction settings
- Provider-specific options
- Environment variable substitution

### 2. EXAMPLES.md (Optional)
**Purpose**: Real-world workflow examples
**Content**:
- Complete project setup from scratch
- Feature development workflow
- Debugging complex issues
- Multi-agent collaboration
- Custom command development
- Agent configuration examples

### 3. TROUBLESHOOTING.md (Optional)
**Purpose**: Common issues and solutions
**Content**:
- Installation problems
- Configuration issues
- Permission errors
- Tool failures
- Agent behavior issues

**Note**: Only create supplementary files if needed. The main SKILL.md should remain complete for essential use cases.

---

## Comparison to Best Practice Example

Comparing to find-skills example:

| Aspect | find-skills | opencode draft | Verdict |
|--------|-------------|----------------|---------|
| "When to Use" section | ✅ Lines 10-19 | ❌ Missing | Must add |
| Clear examples | ✅ Multiple | ⚠️ Basic | Improve |
| Progressive disclosure | ✅ Good | ⚠️ Mixed | Improve |
| Length (lines) | 134 | 201 | Good |
| Actionable instructions | ✅ Very | ⚠️ Somewhat | Improve |
| Source references | ❌ None | ✅ Throughout | Better |

**Key Lesson from find-skills:**
The "When to Use This Skill" section is critical. It gives agents clear guidance on when to invoke the skill. Without it, agents may struggle to know when this skill is needed vs. using general knowledge.

---

## Implementation Priorities

### Phase 1: Critical Fixes (Required for Production)
1. ✅ Add "When to Use This Skill" section
2. ✅ Add installation section
3. ✅ Fix agent mode terminology
4. ✅ Move and expand configuration section

### Phase 2: Quality Improvements
5. ✅ Add tool descriptions
6. ✅ Expand workflow examples
7. ✅ Add configuration precedence explanation
8. ✅ Add permission configuration examples

### Phase 3: Polish
9. ✅ Add progressive disclosure markers
10. ✅ Improve section descriptions
11. ✅ Add cross-references to supplementary docs
12. ✅ Review and refine all examples

---

## Testing Recommendations

Before finalizing, test the skill by:

1. **Scenario Testing**
   - Agent receives: "How do I install opencode?"
   - Expected: Agent loads skill and provides installation instructions

2. **Workflow Testing**
   - Agent receives: "Create a custom command for running tests"
   - Expected: Agent provides complete command template with frontmatter

3. **Configuration Testing**
   - Agent receives: "How do I configure opencode to use a specific model?"
   - Expected: Agent explains opencode.json configuration

4. **Mode Selection Testing**
   - Agent receives: "I want to plan a feature before implementing"
   - Expected: Agent explains Plan mode and Tab switching

---

## Final Recommendation

**Status**: ❌ NOT READY FOR PRODUCTION

**Required Actions**:
1. Add "When to Use This Skill" section
2. Add installation instructions
3. Fix terminology and clarity issues
4. Expand configuration coverage

**Estimated Effort**: 2-3 hours for all critical fixes

**Result After Fixes**: Should be production-ready with excellent coverage

**Confidence Level**: High - All identified issues are addressable and well-defined

---

## Positive Aspects to Preserve

1. ✅ Excellent brevity - well under line limit
2. ✅ Comprehensive source references
3. ✅ Good coverage of major features
4. ✅ Solid Quick Start foundation
5. ✅ Good custom command example
6. ✅ Well-structured YAML frontmatter
7. ✅ Logical overall organization
8. ✅ Actionable examples where present

**Keep These Aspects**: They represent strong foundations to build upon.

---

## Conclusion

The opencode skill draft is a promising foundation with good coverage of major features and excellent source documentation. However, it requires targeted improvements in several critical areas before it can be considered production-quality:

**Most Critical**: Missing installation section and "When to Use This Skill" guidance
**Most Time-Consuming**: Expanding configuration coverage with advanced topics
**Most Impactful**: Improving examples with real-world workflows

With focused effort on the prioritized fixes (estimated 2-3 hours), this skill can become an excellent, production-quality resource for agents working with opencode.ai.

**Next Step**: Address Phase 1 critical fixes, then validate with agent testing scenarios.

---

## Skill-Creator Perspective

Based on the skill-creator best practices, here's additional feedback from a skill creation specialist:

### Alignment with Core Principles

**✅ Concise is Key**
- Line count (201) is excellent - uses only 40% of 500-line budget
- Most content is essential for agents to know
- Source references are necessary, not redundant

**✅ Proper Format**
- YAML frontmatter is correct
- Name follows validation rules (`opencode` matches `^[a-z0-9]+(-[a-z0-9]+)*$`)
- Description is within 1-1024 character limit (297 characters)

**⚠️ Missing Critical Elements**
- **"When to Use This Skill" section** - This is the MOST important missing piece for agents
  - Without this, agents cannot determine when to load this skill vs. using general knowledge
  - Should list trigger phrases and scenarios
  - Example from find-skills shows this is standard practice

**⚠️ Progressive Disclosure Could Be Improved**
- Quick Start is good but missing installation (absolute first step)
- No "Advanced Features" section pointing to supplementary docs
- Missing markers indicating essential vs. advanced content

**⚠️ Agent-Focus Needs Improvement**
- Skills are "for AI agents, not humans" per skill-creator principles
- Current draft reads more like human documentation than agent instructions
- Need more "DO this" statements vs "This is what X does"
- Examples should show what the AGENT should do, not what the USER sees

### Specific Skill-Creator Recommendations

**1. Add "When to Use This Skill" Section** (CRITICAL - Priority 1)

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
```

This is the single most important section for agent decision-making. Without it, agents won't know when to invoke this skill.

**2. Shift Tone to Agent-First** (Priority 1)

Current examples:
- "OpenCode provides X" → "Use X to help the user..."
- "You can do Y" → "Help the user Y by..."
- "File references allow fuzzy search" → "Use @ for fuzzy file search"

Add specific agent actions:
- "Read the file" vs "The file contains..."
- "Run this command" vs "This command does..."
- "Switch to Plan mode" vs "Plan mode is available"

**3. Add Progressive Disclosure Structure** (Priority 2)

```markdown
## Quick Start
[Essential info - installation, basic commands]

## Essential Workflows
[Patterns used 90% of the time - file references, bash commands, agent switching]

## Core Concepts
[More detail on TUI, CLI, custom commands]

## Advanced Features
For detailed configuration topics, see [CONFIGURATION.md](CONFIGURATION.md):
- Remote configuration
- Provider-specific options
- Plugins and formatters
- MCP servers
```

**4. Remove User-Facing Content** (Priority 2)

- Remove README-style content ("What is OpenCode?")
- Focus on actionable instructions for agents
- Remove marketing language
- Make every sentence contribute to agent capability

### What the Skill-Creator Would Change

**Priority 1 (Must Fix - 1 hour):**
1. Add "When to Use This Skill" section with trigger phrases
2. Add installation instructions to Quick Start
3. Shift tone from descriptive to imperative (what agent should DO)

**Priority 2 (Should Fix - 1 hour):**
4. Add progressive disclosure markers (Essential/Common/Advanced)
5. Move advanced config to supplementary docs
6. Make examples agent-actionable ("Read the file", not "The file contains...")

**Priority 3 (Nice to Have - 30 min):**
7. Add more "DO this" patterns
8. Add cross-references to supplementary docs
9. Add troubleshooting tips for common agent errors

### Comparison to Ideal SKILL.md Structure

```markdown
---
name: opencode
description: [Clear description of what this skill does and when to use it]
---

# OpenCode

## When to Use This Skill
[CRITICAL - missing from draft - MUST ADD]

## Quick Start
[Installation + essential commands - partial in draft]

## Essential Workflows
[Agent-actionable patterns - partially present in draft]

## Core Concepts
[Present as "Core Usage Patterns" - good]

## Advanced Features
[Missing - should reference supplementary docs]
```

### Verdict from Skill-Creator Perspective

**Grade**: C+ (Good foundation, missing agent-focused design)

**Why Not Higher**:
- Missing the single most important section: "When to Use This Skill"
- Tone is more documentation than instruction
- Progressive disclosure is incomplete
- Some content is user-facing rather than agent-facing

**Fixing Makes It Production-Ready**: Yes, with focused effort on agent-first design

**Time to Fix**: 1-2 hours (adding "When to Use" section + tone adjustment)

---

## Combined Assessment

### Summary Table

| Perspective | Grade | Key Issues | Time to Fix |
|------------|-------|------------|-------------|
| Code Review | 7.5/10 | Missing installation, incomplete config, weak examples | 2-3 hours |
| Skill-Creator | C+ (7/10) | Missing "When to Use", wrong tone, incomplete progressive disclosure | 1-2 hours |

### Overall Verdict

**Current Status**: ❌ NOT READY FOR PRODUCTION

**Critical Path** (2-3 hours total, addressing both perspectives):

**From Skill-Creator (Priority - 1 hour):**
1. ✅ Add "When to Use This Skill" section (30 min)
2. ✅ Shift tone to agent-first (20 min)
3. ✅ Add progressive disclosure markers (10 min)

**From Code Review (Priority - 2 hours):**
4. ✅ Add installation to Quick Start (20 min)
5. ✅ Fix agent-mode terminology (10 min)
6. ✅ Add tool descriptions (20 min)
7. ✅ Improve workflow examples (40 min)
8. ✅ Move/expand configuration (30 min)

**Expected Result**: Production-ready skill (Grade: A-)

**Confidence**: Very High - All gaps are clearly identified and actionable

### Final Thoughts

This skill draft has excellent potential. It covers the right topics, maintains good brevity, and has solid source documentation. The main issues are structural and tonal rather than content gaps. With focused effort on the prioritized fixes (2-3 hours), this can become an excellent, production-quality resource.

**Next Steps**:
1. Review the detailed recommendations in this review
2. Prioritize Phase 1 fixes
3. Implement fixes systematically
4. Test with agent scenarios
5. Iterate based on testing results

**Success Criteria**:
- Agent can correctly identify when to use this skill
- Agent can help users install and configure opencode
- Agent can guide users through common workflows
- Examples are agent-actionable
- Tone is imperative and instruction-focused
- Content is progressively disclosed (essential → common → advanced)
