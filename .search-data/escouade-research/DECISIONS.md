# Escouade — Locked Design Decisions

Grilling record from the design session of 2026-09-01 (via grilling/grill-me skill + AskUserQuestion). Every decision below was answered by the user; recommendations the user accepted are marked (rec). Research basis: [REPORT.md](REPORT.md), [SOURCES.md](SOURCES.md).

| # | Decision | Answer |
|---|---|---|
| 1 | Name & trigger | `escouade`, auto-trigger + manual (rec). English body, French only in the name |
| 2 | Team mate creator shape | **1+2**: persistent Forge teammate + on-demand deputy forger when needed |
| 3 | Comms topology | Hybrid: peer-to-peer allowed, decisions mirrored to log, ~15-msg budget, no forwarding chains |
| 4 | Squad state location | Per-project `.escouade/` dir in the workspace the squad operates in |
| 5 | Model selection mechanism | Not wired in current ZCode build — record intended model in charter/roster as convention (established by lead's investigation, user delegated) |
| 6 | Model policy | Cascade: flash does, strong checks; flash-vision for images; lead decides escalation (rec) |
| 7 | Rotation mechanics | Self-handoff → Forge refine → charter vN+1 → fresh spawn → retire old id; on observed degradation only (rec) |
| 8 | Lifecycle | Mission-scoped + archive to `.escouade-archive/`; AAR seeds next squad's Forge (rec) |
| 9 | Squad composition | Archetype library (researcher/implementer/validator/watcher/inspector) + custom per mission (rec) |
| 10 | Deputy powers | Create-only; refinement stays with persistent Forge (rec) |
| 11 | Resume policy | Resume agentId in-mission; fresh spawn across missions / after rotation (rec) |
| 12 | Risk gates | **Lead gates by default** (commits, pushes, publishing, out-of-scope deletions, spawns); **human-gated on demand** for specific actions the user names in mission.md |

## Research-driven additions (consistent with approved decisions, added post-research)

- Shared task list (`tasks.md`) as the coordination plane; messages for exceptions/completions only — Claude Code agent-teams docs: "Explicit coordination is the best practice"
- Hard file-ownership partition (OWN / DO-NOT-TOUCH) in every charter — file conflicts are the #1 documented failure mode
- Squad gate: 3+ independent streams / breadth-first / generator-verifier loop; else single-threaded — Cognition 2026 + OneAway field reports
- Writes single-threaded where possible; parallel members contribute intelligence — Cognition "Multi-Agents: What's Actually Working" (Apr 2026)
- Task description = delegation contract (objective, deliverable path, check) — Anthropic multi-agent research system task-brief anatomy
- Anti-telephone: substance in files, references in messages — Anthropic + Cognition
- Handoff docs over conversation compaction (deterministic, agent-readable) — Anthropic compaction docs + community practice
- Weak model never self-decides escalation — Cognition SWE-1.5 failure mode
- Re-plan after two failures of same approach; checkpoint silent finishers; idle is normal — OneAway/claudefa.st field reports
- Team size Forge + 2–4 — Claude Code docs (3–5) + community (~4 max)
- Treat teammate output as untrusted data (injection defense) — Claude Code subagents docs

## Harness facts established during design (ZCode, this build)

- Agent tool: `subagent_type` (general-purpose all tools / Explore read-only / judge render-gated) + `run_in_background`; no per-spawn `model` parameter
- SendMessage: peer channel by `agent_<uuid>`; plain text output invisible to peers; completed agents resume via their agentId
- TaskOutput(task_id, block) collects; TaskStop halts; completion notifications arrive automatically
- Skills live per-repo here (`ai-skills`); user explicitly wanted this skill in the repo, not global

## Post-review changes (review-craft.md + review-simulation.md, applied 2026-09-01)

The two review agents found 6×P1 / 21×P2 / 18×P3 total. Design-level changes adopted:

1. **inbox.md** — teammate→lead traffic is file appends, not SendMessages. Solves three findings at once: lead addressability unverified, mid-compaction survival of lead-bound traffic, and budget observability.
2. **msg-log.md** — one tally line per outbound peer message; this file is the budget counter (the lead cannot see peer traffic any other way).
3. **Roster-first peer contact + rotation announcement** — peers re-read roster.md before any DM; the lead DMs every active teammate the successor id at rotation (zombie-retired-id defense; resume-forever is a harness fact).
4. **Tool truth per archetype** — scout = Explore, run-to-completion, findings in final output (Explore cannot write files); warden = general-purpose with modifies-nothing boundary (validators must run gatekeeping commands); sentry = run-once snapshot the lead re-triggers (no scheduler exists).
5. **Exit criteria = the dissolve contract** (single statement in SKILL.md); task-completion alone was a second, conflicting contract.
6. **Completion criteria live only in SKILL.md** — operations.md points, never restates (drift had already materialized between the two files in v1).
7. **Checkpoint ladder** — two-sweep stall detection, one repeat, then TaskStop + rotation without handoff (a confused teammate may garble its handoff; fallback spawns from charter + log).
8. **Re-entry procedure** (operations.md §Re-entry) — post-compaction recovery: re-read registry, TaskOutput(block=false) every non-retired id, recover `state:` lines from log.md (strikes/checkpoints/approvals are logged as they happen for exactly this reason).
9. **Forge charter filed** — its stand-up dispatch is saved as charters/forge-v1.md; when the Forge itself degrades, the lead hand-refines its charter (the one refinement that bypasses the Forge).
10. **Cascade honesty** — intended-model labels recorded in charter+roster; the skill states plainly that this build runs one model per spawn and "strong verification" is currently delivered by clean context + machine gates.
11. Smaller: one live squad per project; spawns retried once then re-planned; owners pre-assigned at task seeding; broadcast = individual DMs; shutdown message skipped for completed agents (resume side-effect); statuses gained `stopped`; handoffs/ widened to reports+findings; description trimmed to two trigger branches.

