# Escouade — Registry Formats

The registry (`.escouade/`) is the squad's shared brain: it survives lead compaction and session restarts, and it is the only context a freshly spawned teammate can be handed. Every file is deliberately plain markdown — any teammate on any model can read and append to it without tooling.

Model labels everywhere: `strong` (GLM-5.3), `flash` (GLM-5.3-flash), `flash-vision`.

## mission.md

```markdown
# Mission: [name]

## Objective
[1–3 sentences: what done looks like. Written so a stranger can verify it.]

## Exit criteria
- [ ] [checkable outcome]
- [ ] [checkable outcome]

## Risk gates
Lead-gated: the default set (commits, pushes, publishing, deletion outside OWN).
Human-gated (this mission): [e.g. push to main, PR creation, anything deleting migrations]

## Squad
Size: [Forge + N teammates]
Streams: [one line each — what it produces, files it owns]
```

Exit criteria are the dissolve contract (SKILL.md §Dissolve). A mission without checkable exit criteria isn't ready to field.

## roster.md

```markdown
# Roster — [mission]

| agentId | codename | archetype | model | charter | status |
|---|---|---|---|---|---|
| agent_abc123 | forge | forge | strong | charters/forge-v1.md | active |
| agent_new456 | scout (v2, successor of agent_old999) | researcher | flash | charters/scout-v2.md | active |
| agent_def789 | mason | implementer | flash | charters/mason-v1.md | active |
| agent_ghi012 | warden | validator | strong | charters/warden-v1.md | idle |
| agent_old999 | scout (v1) | researcher | flash | charters/scout-v1.md | retired 2026-09-01 — rotated, see handoffs/scout.md |
```

Status values: `active` (working), `idle` (completed its tasks, resumable — normal), `stalled` (checkpoint out; the lead clears it back to active/idle when the checkpoint is answered), `retired` (rotation — never resume, never message), `stopped` (dissolve). Record the agentId the moment a spawn returns it; an id that lives only in the lead's context dies with its compaction.

## tasks.md

The coordination plane. Task state is decided here, reported elsewhere.

```markdown
# Tasks

## Open
- [ ] **T1: Map auth surface** — owner: scout
      produces: handoffs/auth-findings.md (lead files scout's output) · check: every route+middleware accounted for
- [ ] **T2: Implement token refresh** — owner: mason
      produces: src/auth/refresh.ts (+test) · check: gatekeeping passes, warden PASS

## In progress
- [ ] **T3: Verify refresh implementation** — owner: warden (since 14:20)

## Completed
- [x] **T0: Registry + mission written** — owner: lead · done 13:58
```

Rules that keep it usable:

- The lead seeds tasks **with owners pre-assigned**; a task without an owner at seed time becomes a claim race later.
- Writing teammates update their own task's status; read-only (Explore) teammates report via inbox.md and the lead updates tasks.md for them.
- A writing teammate may pick up an `unclaimed` task: move it to In progress with your name, re-read the file, and yield to whichever name appears first if two claimed — first name in the file wins.
- Completed requires the deliverable to exist at its path (or, for Explore, the lead to have filed the output); a completed task without its artifact is not completed.
- The task description is the delegation contract: objective + deliverable path + check. Written cheap, verified dear — a vague task here becomes a wasted dispatch there.

## inbox.md

Teammate → lead channel: blockers, completions, checkpoint answers. One line each, appended:

```markdown
# Inbox

- 14:22 scout — starting T1 (auth surface map)
- 15:04 mason — T2 blocker: refresh endpoint needs a session-store interface nobody owns. Stopped after two attempts per my charter. Suggest: assign session-store owner; I resume after.
- 15:31 warden — T3 PASS. Issues none. Detail: handoffs/t3-review.md
```

The lead reads this on every sweep (operations.md §Run). It works regardless of whether this build can route SendMessages to the main agent, it makes lead-bound traffic countable (budget), and it survives compaction.

## msg-log.md

One tally line per outbound peer SendMessage — this file is the only place peer traffic is visible to the lead, and it is how the 15-message budget is counted:

```markdown
# Message tally

- 14:26 scout → mason — findings location
- 14:27 mason → scout — ack
```

## log.md

Append-only, newest last. Two kinds of lines — decisions, and pending state:

```markdown
# Decision log

- 13:58 lead — mission filed, exit criteria approved by user
- 14:05 lead — spawned forge (agent_abc123)
- 14:31 scout — auth findings: middleware order is auth → session → rate-limit (affects T2)
- 15:02 lead — state: mason strike 1/2 — intercept approach failed build
- 15:06 lead — state: mason checkpoint sent (stalled on T2)
- 15:40 lead — scout rotated to v2 (re-deriving settled facts); successor agent_new456; peers notified
```

`state:` lines record pending things the lead is tracking — strike counts, open checkpoints, awaited human-gate approvals. After lead compaction they are the only record; write them as they happen, and resolve them when done (`state resolved: mason checkpoint answered — active`).

## handoffs/&lt;name&gt;.md

Rotation handoffs (written by the teammate) plus teammate reports and findings (completion reports, status consolidations, filed research — the tree's annotation covers all of them):

```markdown
# Handoff — [codename], [date]

## State
[What I finished, with deliverable paths]

## Open threads
[What someone must pick up, with enough context to start without asking]

## Lessons
[What worked, what didn't, pitfalls — the parts a successor would otherwise rediscover]

## What I'd change in my own charter
[The teammate's suggestion; the Forge weighs it for vN+1]
```

## AAR.md

Written by the lead at dissolve — template in [operations.md](operations.md) §Dissolve. The AAR plus archived charters are the input the next mission's Forge starts from; a squad that archives well makes the next squad cheap.
