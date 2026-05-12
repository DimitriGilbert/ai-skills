---
name: gpt-design-bypass
description: Route design tasks to a competent model via opencode or claude CLI instead of Codex's default. Use when Codex needs to produce or evaluate UI design, visual styling, CSS, component layout, or any frontend visual output. Triggers on "design", "style", "UI", "CSS", "layout", "visual", "make it look", "beautify", "redesign", "theme".
---

# GPT Design Bypass

Codex's default model is bad at design. This skill forces design work through a competent model using `opencode run` or `claude -p` as non-interactive CLI calls, keeping Codex in control of the overall workflow.

## When to Activate

Route to the design model when the task involves:

- Writing CSS, Tailwind, or styling code
- Creating or modifying UI components for visual output
- Layout decisions (spacing, grids, typography, color)
- Designing pages, dashboards, landing pages, forms
- Evaluating or comparing visual designs
- "Make it look better", "beautify", "redesign"
- Any task where visual taste matters

Do NOT activate for:

- Backend logic, APIs, databases
- Testing, CI/CD, tooling
- Pure TypeScript/JavaScript logic with no visual output

## How It Works

Instead of Codex writing the design code itself, it shells out to `opencode run` or `claude -p` with the design task as a prompt. The external model writes the code, Codex incorporates the result.

```
Codex receives design task
  → Codex delegates to design model via CLI
  → Design model writes the code
  → Codex uses the output
```

## CLI Commands

### Option A: OpenCode CLI (non-interactive, recommended)

```bash
opencode run \
  --dangerously-skip-permissions \
  "Your design task prompt here"
```

Key flags:
- `run` — non-interactive execution, does not launch TUI
- `-m provider/model` — override model (e.g., `-m openrouter/anthropic/claude-sonnet-4.6`). **Only use this if the user explicitly specifies a model.** If the user does not specify, omit this flag entirely — opencode will use whatever model the user has configured.
- `--dangerously-skip-permissions` — auto-approve file writes
- `-f, --file` — attach files for context
- `-c, --continue` — continue previous session
- `--agent` — use a specific agent config
- `--variant` — reasoning effort (high, max, minimal)

**Model selection rule**: DO NOT pick a model yourself. Use whatever the user has configured. If the user says "use opus" or "use sonnet", then add `-m openrouter/anthropic/claude-opus-4.7` or similar. Otherwise, no `-m` flag.

### Option B: Claude CLI (non-interactive)

```bash
claude -p --allowed-tools "Read,Edit,Write,Bash,Glob,Grep" \
  --system-prompt "You are an expert frontend designer. Produce production-quality, visually polished code. Follow the design specifications exactly." \
  "Your design task prompt here"
```

Key flags:
- `-p` — print mode, non-interactive, outputs to stdout
- `--allowed-tools` — restrict what Claude can do (safer)
- `--system-prompt` — override system prompt for design focus
- `--model` — specify model if needed (e.g., `sonnet`, `opus`). **Only if user requests a specific model.**
- `--append-system-prompt` — add to existing system prompt instead of replacing
- `--dangerously-skip-permissions` — full autonomy (sandbox only)

**Model selection rule**: Same as above. DO NOT pick a model. If the user specifies one, use `--model`. Otherwise, let claude use its default.

## Workflow

### Step 1: Prepare the Design Prompt

Build a detailed prompt containing:
- What needs designing (specific components, pages)
- Design constraints (framework, existing styles, design system)
- Files to read for context (existing components, theme files)
- Exact files to create or modify
- Any design references or requirements

### Step 2: Delegate to Design Model

```bash
opencode run \
  --dangerously-skip-permissions \
  "Design and implement [specific task].
   
   Read these files for context:
   - src/styles/theme.css
   - src/components/Button.tsx
   
   Create: src/components/Card.tsx
   Modify: src/styles/theme.css (add card styles)
   
   Requirements:
   - [specific requirement 1]
   - [specific requirement 2]
   
   The design must be production-quality. Follow existing patterns."
```

If the user asked for a specific model, add `-m` to the command. Otherwise, do not.

### Step 3: Incorporate the Result

The design model will create/modify files directly. After it finishes:
1. Review the changes
2. Run typecheck and build to verify
3. Fix any integration issues if needed

## Prompt Templates

See [references/prompt-templates.md](references/prompt-templates.md) for design-specific prompts.

## Critical Rules

1. **Always use non-interactive mode** — `opencode run` or `claude -p`, never the TUI
2. **DO NOT pick a model** — use the user's configured default. Only add `-m`/`--model` if the user explicitly asks for one
3. **Be specific in the prompt** — vague prompts produce generic designs
4. **Include file paths** — tell the design model exactly what to read and write
5. **Specify the framework** — React, vanilla CSS, Tailwind, etc.
6. **Reference existing code** — point to theme files, design tokens, component patterns
7. **Keep Codex in control** — Codex orchestrates, design model executes
8. **Verify after delegation** — run typecheck/build after the design model finishes
