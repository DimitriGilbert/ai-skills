# Escouade — Squad Operations

Full procedures for the four lifecycle phases plus re-entry. Each template is literal: paste, replace `[bracketed]` fields, send. Phase completion criteria live in SKILL.md — this file never restates them.

## Stand-up

### 1. Create the registry and seed it

```bash
mkdir -p .escouade/charters .escouade/handoffs
echo "*" > .escouade/.gitignore
touch .escouade/{mission,tasks,inbox,msg-log,log}.md
```

Write `mission.md` (format in [registry.md](registry.md)) and seed `tasks.md` with the initial breakdown, **owners pre-assigned** — a task without an owner at seed time becomes a claim race later. If the mission came from `subagent-planificator`'s master plan, derive tasks from its phases.

Squad sizing: the Forge plus 2–4 teammates covers most missions. Past ~4 worker teammates, coordination overhead and file-conflict risk grow faster than throughput — 3+-stream missions already sit at the top of this band, so split streams, not teammates.

### 2. Spawn the Forge

The Forge is a background teammate whose only job is chartering. Its dispatch must be self-contained — the Forge cannot read this skill. Paste the **Coordination boilerplate** from [charters.md](charters.md) where indicated, and save the dispatch verbatim as `charters/forge-v1.md`:

```
You are the Forge for an escouade (mission-scoped agent squad) in this project.

MISSION (from .escouade/mission.md):
[paste objective, exit criteria, risk gates]

WORK STREAMS NEEDED:
[one line per stream: what it produces, which files it touches, read-only or editing]

YOUR JOB: write one charter per stream. A charter is a fully self-contained spawn
prompt — the teammate it describes will see zero other context. Every charter
follows this skeleton:

# <codename> — <archetype> v1
## Purpose         — what this teammate exists to do and why; what and why, never how
## File ownership  — OWN / READ / DO-NOT-TOUCH; every file exactly one owner
## Tools           — subagent_type: Explore (read-only, final output is the deliverable)
                     or general-purpose (can write); plus intended model label:
                     strong | flash | flash-vision (routing lands when the harness
                     supports per-spawn models; record it regardless)
## Output contract — numbered deliverables with file paths (Explore: "final output
                     contains..."), success criteria, stop condition, tool-call budget
## Coordination    — the boilerplate below, verbatim
## Risk gates      — report to the lead (via inbox.md) before: git commit/push,
                     external publishing, deleting outside OWN

COORDINATION BOILERPLATE (embed verbatim in every charter):
[paste the block from the escouade skill's charters reference]

RULES:
- Partition the filesystem: every file exactly one owner; list DO-NOT-TOUCH for the rest.
- Explore archetypes get no file deliverables and no registry writes — their findings
  come back as final output; only you (the Forge) note that in the contract.
- Specify what and why, never how — over-prescribed teammates produce worse work.

Write each charter to .escouade/charters/<name>-v1.md and reply with the list of
charter paths. You execute no mission tasks; you charter them.
```

**Deputy forger** (bulk creation only, when many charters are needed at once or the Forge is busy): same dispatch plus "You are a deputy forger: creation only — you never refine existing charters." You dispatch the deputy; nobody but you ever spawns.

### 3. Spawn teammates

For each charter, assemble the spawn prompt — the teammate's entire world:

```
[charter body, pasted in full]

MISSION DIGEST:
- Objective: [one line]
- Exit criteria: [bullets]
- Risk gates: report via .escouade/inbox.md before committing, pushing,
  publishing, or deleting outside your owned files. Human-gated: [from mission.md]

REGISTRY (read these before your first action):
- .escouade/tasks.md — your tasks, with your name as owner
- .escouade/inbox.md — where you message the lead (blockers, completions, answers)
- .escouade/msg-log.md — one tally line before every peer message you send
- .escouade/roster.md — squadmates; re-read immediately before contacting any peer
- .escouade/log.md — decisions that affect others

PEERS (codenames; live agentIds live in roster.md — never trust a cached id):
- [name] ([archetype]) — [what to contact them for]

FIRST ACTION: read the registry files, confirm your first task, tell the lead
via inbox.md what you're starting.
```

Spawn with `run_in_background: true`. `general-purpose` for anyone who writes files or runs commands; `Explore` only for run-to-completion research archetypes. **A spawn that errors or returns no id: retry once, then re-plan the stream** (merge into another teammate or drop it) and log the decision.

### 4. Record the roster

Every agentId goes into `roster.md` the moment the spawn returns it (format in [registry.md](registry.md)).

## Run

Your standing loop:

1. **Sweep the squad** between notifications: read `tasks.md`, `inbox.md`, `msg-log.md`; `TaskOutput(block=false)` on active ids. Cadence: after every completion notification, plus whenever you're otherwise idle. A task `in_progress` with no inbox/msg-log activity across two sweeps is **stalled**.
2. **Answer inbox items** — blockers get a decision (re-spec, reassign, unblock yourself), logged.
3. **Count budgets** — a teammate's lines in `msg-log.md` + `inbox.md` over 15 → send the consolidation request: "Message budget hit. Write your status to `.escouade/handoffs/<name>-status.md` and reply in inbox.md with just the path."
4. **Route flash work through verification** (below) and append decisions to `log.md` as you make them.

### Checkpoint ladder (stalled teammate)

1. Append to `inbox.md` and SendMessage: "Status? Check `.escouade/tasks.md` and report via inbox.md."
2. If running: delivery may queue until completion — treat non-answer as blockage, not refusal. If completed: the message resumed it; expect a reply.
3. Unanswered across one more sweep: repeat once.
4. Still silent: **TaskStop if running, then rotate without handoff** (roster: `retired — no handoff`; successor spawns from charter + log slice). A wedged agent produces nothing ever; don't wait it out.

### Verification dispatch (clean-context reviewer)

The reviewer spawns `general-purpose` — it runs the gatekeeping commands — but its charter boundary is read-the-code, modify-nothing:

```
You are a validator with clean context. Verify the following work.

TASK SPEC (what was asked): [paste the task from tasks.md — what and why]
DELIVERABLES: [file paths]
GATEKEEPING: run the project's checks yourself: [typecheck/build/test commands].

Read every deliverable and check it against the task spec — running the commands
is necessary but not sufficient. Report PASS, or FAIL with a numbered issue list
(file, line, what violates the spec), by appending to .escouade/inbox.md and
finishing. You modify nothing outside .escouade/.
```

Two failures of the same approach from the same teammate → re-plan: change the task spec, rotate the teammate, or change the approach. Log strikes as they happen (`state: <name> strike 1/2 — <approach> failed`) so the record survives your compaction.

## Rotate

Rotation is a response to observed degradation (signals in SKILL.md §Rotate), never a schedule.

1. **Handoff request** — SendMessage: "You're being rotated. Write `.escouade/handoffs/<name>.md` — current state of your tasks, open threads anyone must pick up, lessons a successor needs. Start nothing new after writing it."
2. **Fallback**: a teammate being rotated *for confusion* may ignore or garble the request. After two unanswered or incoherent exchanges, rotate without handoff; the successor starts from charter vN + the log slice.
3. **Refine** — send the Forge: handoff (or strike record), charter vN, the log slice, and the degradation you observed. It returns charter vN+1 with lessons baked into the prompt itself.
4. **Successor spawn** — charter vN+1 plus "Read `handoffs/<name>.md` first" (when a handoff exists). Same codename; roster notes the succession.
5. **Retire and announce** — mark the old id `retired`; TaskStop it if still running; then **DM every active teammate**: "<name> was rotated; successor id is agent_<new>. Re-read roster.md before your next peer message." A retired id stays resumable in this harness forever — only roster discipline and peer announcements keep it dead.

The Forge itself can degrade — the one charter the Forge never refines is its own. Hand-refine `charters/forge-v<N>.md` directly, resume the Forge from it, log that you did.

## Dissolve

1. **Verify against `mission.md` exit criteria** — they are the contract. Open tasks are completed-or-carried: each gets a line in the AAR with a one-line reason.
2. **Collect**: TaskOutput every teammate. Skip the shutdown message for already-completed ones (messaging resumes them); for still-running ones send "Mission complete. Confirm your last deliverable paths and stop." and expect one extra notification each.
3. **Confirm down**: `TaskOutput(block=false)` every non-retired id — all completed or stopped. TaskStop stragglers. Mark roster entries `stopped`.
4. **Write `.escouade/AAR.md`**:

```
# After-action report — [mission name], [date]

## Outcome
[objective vs. what was delivered]

## Per teammate
| name | archetype | charter | tasks done | notes |

## What the next squad should keep
[charters that worked well — copy forward verbatim]

## What to change
[charter provisions that failed, coordination friction, sizing mistakes]

## Unfinished — carried to next squad
[task + one-line reason each]
```

5. **Archive**:

```bash
mkdir -p .escouade-archive
mv .escouade .escouade-archive/<mission>-<date>
```

## Re-entry (after lead compaction or session restart)

The registry survived; your memory of the mission didn't. In order:

1. Read `.escouade/mission.md`, `roster.md`, `tasks.md`, `log.md`, `inbox.md`, `msg-log.md`.
2. Rebuild live state: `TaskOutput(block=false)` on every non-`retired` id — running vs. completed. Completion notifications that fired while you were down are unrecoverable except through TaskOutput; their content (deliverable claims) is re-derivable from tasks.md + handoffs.
3. Recover pending state from the log's `state:` lines — open checkpoints, strike counts, awaited human-gate approvals (re-confirm with the user if any approval was in flight; the log line is the only trace).
4. Resume the standing loop in §Run.

If the registry itself is gone (wrong directory, never stood up), there is no squad to recover — stand up a new one.
