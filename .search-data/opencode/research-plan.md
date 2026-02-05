# OpenCode Usage Patterns Research Plan

## Objective
Research common usage patterns, best practices, and real-world examples of opencode.ai usage to inform creation of a critical skill.

## Research Areas

### 1. Web Research (Web Search Agent)
- Search for opencode.ai tutorials, examples, and documentation
- Find blog posts, videos, and community discussions
- Look for "how to" guides and workflow patterns
- Identify popular use cases and scenarios

Search queries:
- "opencode.ai tutorial"
- "opencode examples"
- "opencode usage patterns"
- "opencode best practices"
- "opencode workflow"
- "opencode AGENTS.md examples"
- "opencode commands examples"

### 2. GitHub Repository Analysis (GitHub Search Agent)
- Search for repositories using opencode
- Find repositories with AGENTS.md files
- Analyze command definitions in .opencode/commands/
- Extract patterns from SKILL.md files
- Look for real-world configuration examples

Search targets:
- Repositories with "opencode" in description/README
- Repositories with .opencode/ directory
- Repositories with AGENTS.md files that mention opencode
- Repositories in .claude/skills/ directory

### 3. Documentation Pattern Extraction (Documentation Agent)
- Analyze existing documentation sources
- Extract command patterns from documentation-sources.md
- Identify workflow patterns from official docs
- Extract best practices from documentation
- Identify anti-patterns or pitfalls to avoid

### 4. Community Resources (Community Research Agent)
- Find Discord/Slack communities
- Look for Twitter/X threads about opencode
- Search Reddit for opencode discussions
- Find conference talks or presentations
- Identify influencers or thought leaders

## Deliverables

Each subagent should save findings to:
`.search-data/opencode/<agent-name>-findings.md`

Each finding must include:
- Source URL (with date accessed)
- Repository name (for GitHub sources)
- Pattern/example description
- Usage context
- Why it's notable

## Final Output
Compile all findings into:
`.search-data/opencode/usage-patterns.md`

Structure:
1. Executive Summary
2. Common Usage Patterns (with examples)
3. Best Practices (with rationale)
4. Anti-Patterns to Avoid
5. Real-World Examples (with references)
6. Community Tips and Tricks
7. Popular Configurations
8. Command Patterns
9. AGENTS.md Patterns
10. Skills Patterns
11. Tools and Integrations
12. References (all sources)

## Success Criteria
- At least 10 real-world examples from GitHub
- At least 5 web-based tutorials/guides
- Identification of at least 5 distinct usage patterns
- Identification of at least 5 best practices
- Identification of at least 3 anti-patterns
- All sources properly referenced with URLs and dates
