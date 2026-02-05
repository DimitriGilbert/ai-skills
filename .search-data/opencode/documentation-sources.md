# OpenCode Documentation Research

## Sources

### Main Documentation
- URL: https://opencode.ai/docs
- Type: Main introduction and getting started guide
- Key Sections:
  - Installation (curl script, npm, brew, etc.)
  - Configuration (/connect command)
  - Initialization (/init command)
  - Usage (file references with @, bash commands with !)
  - TUI features

### Commands Documentation
- URL: https://opencode.ai/docs/commands
- Type: Custom command configuration
- Key Features:
  - Create custom commands in .opencode/commands/ or ~/.config/opencode/commands/
  - Markdown file format with YAML frontmatter
  - Support for arguments: $ARGUMENTS, $1, $2, etc.
  - Shell output injection: !`command`
  - File references: @filename
  - Configuration options: template, description, agent, subtask, model
  - Built-in commands: /init, /undo, /redo, /share, /help

### TUI Documentation
- URL: https://opencode.ai/docs/tui
- Type: Terminal User Interface commands
- Key Features:
  - File references with @ for fuzzy file search
  - Bash commands with !
  - Slash commands: /connect, /compact, /details, /editor, /exit, /export, /help, /init, /models, /new, /redo, /sessions, /share, /themes, /thinking, /undo, /unshare
  - Keybinds with ctrl+x as default leader key
  - Editor setup for /editor and /export commands
  - Configuration options: scroll_speed, scroll_acceleration

### CLI Documentation
- URL: https://opencode.ai/docs/cli
- Type: Command-line interface
- Key Features:
  - Default starts TUI
  - Commands: agent, attach, auth, github, mcp, models, run, serve, session, stats, export, import, web, acp, uninstall, upgrade
  - Global flags: --help, --version, --print-logs, --log-level
  - Environment variables: OPENCODE_AUTO_SHARE, OPENCODE_CONFIG, OPENCODE_DISABLE_CLAUDE_CODE, etc.
  - Experimental environment variables

### Skills Documentation
- URL: https://opencode.ai/docs/skills
- Type: Agent Skills
- Key Features:
  - SKILL.md files with YAML frontmatter
  - Location: .opencode/skills/<name>/SKILL.md, ~/.config/opencode/skills/<name>/SKILL.md, .claude/skills/<name>/SKILL.md, ~/.claude/skills/<name>/SKILL.md
  - Frontmatter: name (required), description (required), license (optional), compatibility (optional), metadata (optional)
  - Name validation: 1-64 chars, lowercase alphanumeric with hyphens, regex: ^[a-z0-9]+(-[a-z0-9]+)*$
  - Description: 1-1024 characters
  - Discovery: walks up from CWD to git worktree, loads from global configs
  - Permissions: pattern-based allow/deny/ask
  - Per-agent override
  - Skill tool: loads skill by name
  - Disable skill tool per agent

### Agents Documentation
- URL: https://opencode.ai/docs/agents
- Type: Agent configuration and usage
- Key Features:
  - Primary agents: Build (default), Plan
  - Subagents: General, Explore
  - Switch with Tab key or @ mention
  - Configuration via JSON or Markdown
  - Options: description, temperature, max steps, disable, prompt, model, tools, permissions, mode, hidden, task permissions, color, top_p
  - Create with: opencode agent create
  - Use cases: Build, Plan, Review, Debug, Docs

### Tools Documentation
- URL: https://opencode.ai/docs/tools
- Type: Available tools
- Key Features:
  - Built-in tools: bash, edit, write, read, grep, glob, list, lsp (experimental), patch, skill, todowrite, todoread, webfetch, question
  - Custom tools via config
  - MCP servers for external integrations
  - Permission system: allow, deny, ask
  - Ignore patterns with .ignore file

### Rules Documentation
- URL: https://opencode.ai/docs/rules
- Type: Custom instructions
- Key Features:
  - AGENTS.md file in project root
  - Create with /init command
  - Types: Project, Global, Claude Code Compatible
  - Custom instructions in opencode.json with instructions field
  - External file references
  - Precedence: local AGENTS.md > global AGENTS.md > Claude CLAUDE.md
