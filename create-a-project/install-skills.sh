#!/usr/bin/env bash
# Install every skill required by the create-a-project skill.
# Global install into ~/.agents/skills, CLI defaults for harnesses (no agent selection).
set -euo pipefail

command -v npx >/dev/null 2>&1 || { echo "error: npx not found" >&2; exit 1; }

SKILLS="npx -y skills"

# mattpocock/skills: grilling, to-spec, tdd, research
$SKILLS add mattpocock/skills -g -y -s "grilling" -s "to-spec" -s "tdd" -s "research"

# own repo: better-t-stack, subagent-orchestration, subagent-review, not-ai-writer
$SKILLS add DimitriGilbert/ai-skills -g -y -s "better-t-stack" -s "subagent-orchestration" -s "subagent-review" -s "not-ai-writer"

# design-taste-frontend
$SKILLS add Leonxlnx/taste-skill -g -y -s "design-taste-frontend"

echo "done. installed skills are in ~/.agents/skills"
