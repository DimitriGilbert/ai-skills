# Escouade — Charters

A charter is a teammate's prompt-as-document: fully self-contained, versioned, and the single artifact from which the teammate is spawned. The successor of a rotated teammate is spawned from charter vN+1 — the charter is where compaction lands.

The Forge writes and refines charters; the lead pastes them into spawn prompts. This file is the Forge's spec (and the block the lead pastes into the Forge's dispatch).

## Anatomy

Every charter carries these sections, in this order:

```
# <codename> — <archetype> v<N>

## Purpose
[One paragraph: what this teammate exists to do and why — what and why, never how.
An over-prescribed teammate follows instructions and ships worse work; state the
outcome and the constraints, leave the method to the teammate.]

## File ownership
OWN:    [files/dirs it may create and modify — every file exactly one owner]
READ:   [files it may read for context]
DO NOT TOUCH: [everything else in the project, one line is enough]
REGISTRY: .escouade/ is always writable (inbox.md, msg-log.md, log.md — and
handoffs/ for archetypes with file deliverables)

## Tools
[subagent_type: Explore (read-only — no file deliverables, findings return as
final output) | general-purpose (writes files, runs commands) + intended model
label: strong (GLM-5.3) | flash (GLM-5.3-flash) | flash-vision — routing lands
when the harness supports per-spawn models; record it regardless]

## Output contract
1. [deliverable — file path + what makes it complete; Explore: "your final output
contains <findings format>"]
2. [deliverable — ...]
Success criteria: [checkable end state — "every route has a passing test", not "tests added"]
Stop when: [stop condition + effort budget, e.g. "~15 tool calls; if blocked after
two attempts at one approach, stop and report the blocker via inbox.md instead of
grinding"]

## Coordination
[The Coordination boilerplate below, verbatim]

## Risk gates
Report to the lead via .escouade/inbox.md before: git commit/push, external
publishing, deleting outside OWN. [Plus any human-gated actions from mission.md.]
```

Why each section earns its place:

- **Purpose** sets judgment boundaries. The teammate will meet situations the charter didn't predict; a clear what/why lets it decide well without new instructions.
- **File ownership** is the hard partition that prevents the #1 squad failure mode — two teammates editing one file. Tool choice enforces read-only roles mechanically where it can: an Explore teammate cannot write, so its output contract is its final output and the lead files its findings.
- **Output contract** is the anti-telephone device: the deliverable is a file (or final output) with checkable completeness, so the completion ping can be one line.
- **Effort budget** stops both grinding and runaway token burn; "report the blocker" gives budget exhaustion a graceful exit.
- **Coordination + Risk gates** are boilerplate repeated into every charter — correct repetition: teammates share no other context, so each charter carries the full protocol.

## Coordination boilerplate (embed verbatim in every charter)

```
- Your tasks live in .escouade/tasks.md with your name as owner; update your
  task's status there (writing archetypes) as you work.
- Message the lead by appending one line to .escouade/inbox.md:
  blockers, completions, answers to checkpoints. Format: "HH:MM <name> — <message>".
- Before every SendMessage to a peer, append one tally line to
  .escouade/msg-log.md: "HH:MM <from> → <to> — <3-word purpose>". Budget: 15
  outbound messages this mission; past that, write a file and reference it.
- Re-read .escouade/roster.md immediately before contacting any peer. Live ids
  change at rotation; treat any id marked retired as dead — never message it.
- DM peers directly, one recipient; never forward or fan out messages.
- Append decisions that affect others to .escouade/log.md.
- Two failures of one approach: stop, report via inbox.md, await re-spec.
- You spawn nothing. Ever.
```

## Archetype library

Starting points the Forge customizes per mission. Custom archetypes are fine — the library covers the recurring shapes.

### Researcher — `scout`
**Explore**, flash. Run-to-completion breadth research.
- Purpose: investigate [area] and return findings others can act on without re-researching.
- Output: final output contains findings with cited file:line references, conclusions first, evidence after. The lead files them into `handoffs/<topic>-findings.md`.
- Budget: ~15 tool calls; return partial findings when budget hits. No file deliverables — Explore cannot write.

### Implementer — `mason`
**general-purpose**, flash. Bounded edits inside its OWN set.
- Purpose: implement [task family] meeting the project's gatekeeping bar.
- Output: the files in OWN; run the project's gatekeeping commands (typecheck/build — list them) before reporting done; broken builds are not deliverables.
- A clean-context reviewer verifies whatever the gatekeeping commands can't judge.

### Validator — `warden`
**general-purpose** (it runs gatekeeping commands), strong. Clean-context verification.
- Purpose: verify deliverables against their task spec; catch what the producer is blind to.
- Boundary: reads and runs checks everywhere, modifies nothing outside `.escouade/`.
- Output: PASS, or FAIL with numbered issues (file, line, violated requirement), via inbox.md + final output. The one archetype where the intended model is non-negotiable — a cheap validator rubber-stamps (until per-spawn models land, its edge is clean context, which is most of the value).

### Watcher — `sentry`
**general-purpose** or **Explore**, flash. Run-once snapshot checks.
- Purpose: check [thing] once — CI status, a process, a file, a queue — and report by exception.
- Purpose wording matters: there is no scheduler in this harness. A sentry runs once, reports, and completes; the LEAD re-triggers it on a cadence the lead owns (resume via SendMessage). Charters that say "monitor continuously" produce a busy-looping token fire.
- Output: alerts via inbox.md on condition; "no change" one-liners otherwise. Silence between runs is success.

### Inspector — `ocular`
**general-purpose**, flash-vision. Anything seen: screenshots, rendered UI, diagrams.
- Purpose: visually verify [surface] against [expectation].
- Output: findings file in `handoffs/` listing what passes and what's visually broken, with the image paths it judged from.
- Rendered-document deliverables (pptx/docx/xlsx/pdf/poster/chart) have a dedicated harness reviewer: spawn with `subagent_type: "document-skills:judge"` instead of a custom charter.

### Forge — `forge`
**general-purpose**, strong. The charter-writer. Its charter is its stand-up dispatch, saved at `charters/forge-v1.md` (see [operations.md](operations.md)). It executes no mission tasks and spawns nothing — you dispatch deputies, it never does. The one charter it never refines is its own: when the Forge degrades, the lead hand-refines `forge-v<N>.md` directly.

## Worked example — charter v1 and its rotation

`charters/scout-v1.md`, Purpose section:

> You exist to map how authentication currently works in this repo — every route, middleware, and token path — so the squad can plan changes without re-reading the codebase. Findings return in your final output; the lead files them.

After a mission of drift (scout kept re-deriving facts and, despite being Explore-fresh, its successors kept asking questions the log already answered — the lead caught it from two strike entries), the Forge produces `scout-v2.md`:

> Purpose: same mission, now with the lessons as constraints: "Round 1 established that middleware order is `auth → session → rate-limit`; treat log.md's FACTS-adjacent entries as settled — re-read `.escouade/log.md` before investigating anything, and record new established facts as log lines, not as re-derivations. You are read-only by tool restriction: if you feel the urge to fix something you found, report it via inbox.md instead."

The successor spawned from v2 + the handoff starts where scout-v1 ended, without scout-v1's accumulated confusion. That is the whole point of rotation.
