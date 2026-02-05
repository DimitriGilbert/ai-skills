# OpenCode Skill Creation Plan

## Objective
Create a comprehensive skill for opencode.ai that enables agents to use it impeccably. This is a critical skill that should cover all major features and workflows.

## Scope Analysis

### Core Areas to Cover

1. **Getting Started**
   - Installation methods (curl, npm, brew, etc.)
   - Initial configuration (/connect)
   - Project initialization (/init)
   - AGENTS.md creation and purpose

2. **TUI Operations**
   - File references with @
   - Bash commands with !
   - All slash commands (/init, /undo, /redo, /share, /help, etc.)
   - Keybinds (ctrl+x leader key)
   - Mode switching (Tab key for agents)

3. **CLI Usage**
   - Running opencode non-interactively (opencode run)
   - CLI commands: agent, auth, models, serve, web, etc.
   - Global flags
   - Environment variables

4. **Custom Commands**
   - Creating commands in commands/ directory
   - YAML frontmatter format
   - Arguments: $ARGUMENTS, $1, $2, etc.
   - Shell output injection: !`command`
   - File references: @filename
   - Configuration options

5. **Agents**
   - Primary vs Subagent types
   - Built-in agents: Build, Plan, General, Explore
   - Switching between agents
   - @ mention syntax for subagents
   - Agent configuration (JSON or Markdown)
   - Agent options: temperature, model, tools, permissions, etc.

6. **Tools**
   - Built-in tools: bash, edit, write, read, grep, glob, list, skill, todowrite, todoread, webfetch, question
   - Permission system (allow/deny/ask)
   - Custom tools
   - MCP servers

7. **Skills System**
   - SKILL.md format with frontmatter
   - Skill locations and discovery
   - Name validation rules
   - Loading skills via skill tool
   - Permissions for skills

8. **Rules/Instructions**
   - AGENTS.md for project-specific rules
   - Global rules in ~/.config/opencode/AGENTS.md
   - Custom instructions in opencode.json
   - External file references

9. **Configuration**
   - opencode.json format
   - Per-project vs global config
   - Claude Code compatibility

10. **Advanced Features**
    - Session management (/sessions)
    - Share/unshare (/share, /unshare)
    - Export/import conversations
    - Undo/redo with Git
    - Plan mode (Tab key)
    - Multi-agent workflows

## Skill Structure

### Main SKILL.md (under 500 lines)
- Quick start guide
- Core workflows
- Most common patterns
- References to detailed documentation

### Possible Supplementary Files (if needed)
- COMMANDS.md - Detailed command reference
- AGENTS.md - Agent configuration patterns
- CONFIGURATION.md - Advanced configuration options

## Progressive Disclosure Strategy

1. **Quick Start** - Essential commands for immediate use
2. **Core Workflows** - Common patterns (ask questions, add features, make changes, undo)
3. **Advanced Features** - Links to detailed docs for complex topics

## Key Patterns to Document

1. **File References Pattern**
   ```
   Use @ for fuzzy file search: @path/to/file.ts
   ```

2. **Bash Command Pattern**
   ```
   Use ! for shell commands: !npm install
   ```

3. **Command Arguments Pattern**
   ```
   In custom commands:
   $ARGUMENTS - all arguments
   $1, $2, $3 - positional arguments
   ```

4. **Shell Output Injection**
   ```
   In custom commands: !`command`
   Example: !`git log --oneline -10`
   ```

5. **Agent Switching**
   - Tab key to cycle through primary agents
   - @subagent to invoke subagents
   - Ctrl+x keys for command shortcuts

6. **Git-based Undo/Redo**
   - /undo reverts file changes via Git
   - /redo restores changes
   - Requires Git repository

## Research Tasks

1. ✅ Gathered main documentation
2. ⏳ Identify common usage patterns from examples
3. ⏳ Extract best practices
4. ⏳ Search for opencode examples online (GitHub, etc.)
5. ⏳ Review existing skills for reference patterns

## Creation Steps

1. Create detailed outline
2. Draft main SKILL.md (keep under 500 lines)
3. Create supplementary documentation if needed
4. Validate skill structure and naming
5. Test with subagent feedback
6. Refine based on review

## Validation Checklist

- [ ] SKILL.md has proper YAML frontmatter
- [ ] Name follows validation rules (lowercase alphanumeric with hyphens)
- [ ] Description is 1-1024 characters
- [ ] File structure: opencode/SKILL.md
- [ ] Content is concise and actionable
- [ ] Progressive disclosure used effectively
- [ ] No README or user-facing docs included
- [ ] All claims can be verified from documentation sources

## Next Steps

1. Create the skill structure
2. Use subagents for review and refinement
3. Test skill with example scenarios
4. Finalize and save to current directory
