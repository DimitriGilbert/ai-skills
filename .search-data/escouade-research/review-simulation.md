# Escouade skill — simulation review (stress test vs. actual harness semantics)

Method: the five skill files were read in full, then three scenarios (A: auth-migration
stand-up → run → dissolve; B: implementer stall + out-of-OWN edit → checkpoint →
re-plan → rotation; C: 15-message budget hit + lead context compaction) were walked
step by step exactly as the skill instructs the lead, checking every instruction
against the harness facts:

- Agent(subagent_type ∈ {general-purpose, Explore, judge/document-skills:judge},
  prompt, run_in_background). No per-spawn model parameter. Returns agentId.
- SendMessage(to agent_<uuid>) is the ONLY peer channel; plain agent output is not
  visible to other agents. Messaging a COMPLETED agent resumes it (in background).
- TaskOutput(task_id, block) / TaskStop(task_id).
- No TeamCreate / TaskCreate / TaskList / mailbox / idle-hooks. Task lists must be files.
- Subagents have all tools, including SendMessage and Agent (they can spawn and
  message peers if they know the ids).

Severity: [P1] breaks execution / references abilities the harness does not have.
[P2] gap a real run will hit (dead end, contradiction with a run-visible consequence,
missing procedure). [P3] ambiguity a weaker model would misread.

---

## Scenario A — "migrate auth to new token system" (scout read-only research, mason
implements src/auth/, warden read-only verify), stand-up → run → dissolve

Walk narrative (where it breaks marked ✗):

1. Lead writes mission.md, seeds tasks.md (per operations.md order), spawns Forge
   (general-purpose, background) with the dispatch at operations.md:22-45.
   - ✗ The dispatch says "Follow the charter anatomy in [references/charters.md of the
     escouade skill] — read it first" — a non-self-contained reference with no path.
   - ✗ The dispatch tells the Forge to "Assign models per the cascade" — no per-spawn
     model exists; the caveat lives only in SKILL.md:36, not here.
2. Forge completes; lead TaskOutputs the charter-path list; spawns scout (Explore),
   mason (general-purpose), warden (Explore); records ids in roster.md.
   - ✗ scout's charter (charters.md:61-66) requires writing
     `.escouade/handoffs/<topic>-findings.md`, claiming tasks in tasks.md, and
     appending to log.md — Explore has no write tools.
   - ✗ warden's verification dispatch (operations.md:99) says "run the project's
     checks yourself (typecheck/build)" — Explore cannot execute commands.
   - ✗ The spawn template's PEERS block needs peer agentIds, but later-spawned
     teammates' ids don't exist yet when earlier prompts are assembled.
3. Run: mason claims T2, edits src/auth/, reports. scout/warden cannot update
   tasks.md (✗ above), so the "file decides" rule silently degrades to
   message-only status for every read-only agent.
4. Dissolve: shutdown exchange per teammate (SendMessage "confirm and stop" — this
   RESUMES each completed teammate one more time), TaskOutput confirmations,
   TaskStop stragglers, AAR, `mv .escouade .escouade-archive/<mission>-<date>`.
   - ✗ No method given to check "no roster agentId still running".

## Scenario B — implementer stalls silently, then edits outside its OWN set

1. "On stall (no progress on an in_progress task)" (operations.md:88) — ✗ no
   detection mechanism: a wedged agent emits no notification; no polling cadence.
2. Checkpoint message sent to the running mason — ✗ the harness only documents
   message delivery/resume for COMPLETED agents; mid-run delivery is unverified,
   and if the mason never answers there is no timeout, no repeat policy, and no
   authorization to TaskStop mid-mission (TaskStop appears only at dissolve).
3. Drift detected (charter example says "the lead caught it via git status", but the
   Run loop never schedules git checks) → recovery row (comms.md:40): git-check,
   revert, rotate.
4. Rotation: handoff request → ✗ a teammate being rotated *for confusion* may ignore
   or garble the handoff; procedure has no fallback and its completion criterion
   requires the handoff to exist. Refine via Forge (resume works — Forge completed
   at stand-up). Spawn successor. Mark old id `retired`.
   - ✗ "Retirement means never resumed again" is unenforceable: any peer still
     holding the old agentId can SendMessage it and the harness will happily resume
     the drifted teammate as a zombie. Rotation never notifies peers of the new id,
     and peers were told to read roster.md only once ("before your first action").

## Scenario C — 15-message budget hit mid-coordination; lead context compacted

1. Budget: operations.md:90 tells the lead to "check message budgets" — ✗ the lead
   cannot see peer-to-peer traffic at all, no counter exists in .escouade/, and a
   flash teammate cannot self-count 15 messages. The rule is unenforceable and the
   instruction references an ability that doesn't exist.
2. Compaction: registry files survive (roster carries agentIds — good design), but
   ✗ the skill has no re-entry procedure: what the compacted lead must do first
   (re-read registry, TaskOutput(block=false) every non-retired id to rebuild
   running/completed state), and several things it needs exist only in the lost
   context: message-budget counts, pending checkpoints and two-failure strike
   counts (unless the lead happened to log them), in-flight completion
   notifications that fired during compaction (gone forever), and the user dialog
   behind human-gated actions (log line "approved by user" is the only trace).
   SKILL.md:40 claims the registry "survives lead compaction and session restarts"
   — for session restart there is not even a discovery/adopt instruction.

---

## Findings

### P1 — breaks execution

- **[P1] (A) Read-only (Explore) archetypes cannot participate in the coordination
  plane or produce their deliverables.**
  Files: charters.md:61-66 (scout: "Explore (read-only) ... gathering into files",
  output `.escouade/handoffs/<topic>-findings.md`), charters.md:73-77 (warden:
  Explore, writes PASS/FAIL output refs), charters.md:37-39 (Coordination boilerplate
  in EVERY charter: claim tasks in tasks.md, append to log.md — pasted into
  read-only agents' charters too), registry.md:53 (T1 owned by scout "produces:
  handoffs/auth-findings.md"), comms.md:11 (completion example: report at
  `.escouade/handoffs/t3-review.md`), operations.md:75 ("Use subagent_type Explore
  for read-only archetypes (researcher, validator)").
  Why it breaks: Explore = no write tools. The scout literally cannot write its
  findings file, claim a task, or log a decision; the entire research and verify
  streams of scenario A dead-end at their first write.
  Fix: read-only agents report via their final output (or message), and the LEAD
  mirrors claims/completions/decisions into tasks.md/log.md and writes the
  findings file from their output; or accept instruction-over-restriction
  (general-purpose + DO-NOT-TOUCH list) for any archetype that must write files;
  or give read-only archetypes a message-only output contract with no file
  deliverables. The current mix (read-only toolset + file deliverables + file
  claiming) is impossible in this harness.

- **[P1] (A) The strong-validator dispatch orders an Explore agent to run the
  project's checks.**
  Files: operations.md:94-104 (verification dispatch: "GATEKEEPING: run the
  project's checks yourself ([typecheck/build commands])") vs operations.md:75 and
  charters.md:73-77 (validator = Explore, read-only, "Modifies nothing").
  Why it breaks: typecheck/build require executing commands and writing build
  artifacts; a read-only subagent cannot comply with its own dispatch. Every
  generator→verifier handoff (the skill's flagship loop) hits this.
  Fix: split the roles — the producer (mason) or the lead runs the gatekeeping
  commands and pastes results; the read-only validator only reviews files against
  the spec. Or spawn validators as general-purpose with "you modify nothing"
  (instruction, not restriction).

- **[P1] (A/B/C) The whole comms protocol assumes teammates can message the LEAD,
  but the harness only documents SendMessage between agents by agent_<uuid>.**
  Files: comms.md:3 ("invisible to peers — and even to you until it completes or
  replies"), comms.md:9-15 (Task claim / Completion / Blocker patterns, all
  "teammate → lead"), operations.md:71-72 ("report to the lead by message"),
  charters.md:38, SKILL.md:71/104.
  Why it breaks: the facts give SendMessage an agent_<uuid> target and say
  subagents can reach "other agents". Nothing says the main agent (lead) has an
  addressable id, and the skill never tells the lead to hand one over (the spawn
  template lists only PEER ids; registry.md has no lead-id field). If the lead is
  not addressable, mid-task blocker reports, claim messages, checkpoint replies,
  and shutdown confirmations are all impossible — teammates' only channel back is
  their final completion output via TaskOutput.
  Fix: specify the mechanism. Either (a) document that the lead's addressable id
  (if the build provides one) goes into roster.md and every spawn prompt, or
  (b) redesign lead-bound traffic as files: a `.escouade/lead-inbox.md` that
  teammates append blockers/completions to, which the lead polls — consistent with
  the skill's own "files carry substance" principle — with mid-run emergencies
  surfacing at completion.

- **[P1] (B) Rotation leaves peers holding resumable "retired" ids — zombie
  teammates.**
  Files: SKILL.md:87 ("Retirement means never resumed again — there is no delete,
  only abandonment"), operations.md:119-124 (rotation procedure: no peer
  notification step), charters.md:38/63-66 spawn template (peers get a one-time id
  list; roster read "before your first action" only).
  Why it breaks: the harness resumes ANY completed agent on any message to its id.
  After mason v1 is retired, scout still has agent_old in its prompt and its
  cached roster read; one coordination DM and the drifted mason is live again,
  editing files, in a registry state it doesn't know. TaskStop can't prevent this
  (it only halts running tasks).
  Fix: add rotation step 5: update roster.md, DM every active teammate the
  successor id, and put in the charter Coordination boilerplate: "re-read
  roster.md immediately before any peer DM; never message an id marked retired."

- **[P1] (C) The 15-message budget is unobservable and unenforceable.**
  Files: SKILL.md:107, comms.md:27 ("15 outbound messages per teammate per
  mission"), operations.md:90 ("check message budgets (a teammate over 15 outbound
  messages gets ...)").
  Why it breaks: the lead cannot see peer-to-peer messages (only the recipient
  can), so it cannot count any teammate's outbound traffic; no counter exists
  anywhere in .escouade/; and the flash teammates the budget targets are the least
  able to self-count. The lead is instructed to check a number that does not
  exist. Scenario C walks straight into this.
  Fix: make the budget observable — charter boilerplate "append one tally line to
  `.escouade/msg-log.md` before every outbound message" (the file IS the counter),
  or drop the numeric cap and rely on the consolidation request plus a norm of
  "one message per state change".

### P2 — gaps a run will hit

- **[P2] (A) Stand-up ordering contradicts itself: SKILL.md Lifecycle spawns
  teammates (step 3) BEFORE seeding tasks.md (step 4); operations.md:14 and the
  SKILL.md quick-reference (lines 146-148) seed tasks.md first.**
  A lead following the SKILL.md numbering sends teammates whose FIRST ACTION
  (operations.md:71-72: "read the registry files, claim a task") lands on an empty
  tasks.md. Fix: one canonical order everywhere — registry + mission + tasks.md
  before any teammate spawn.

- **[P2] (A) Peer-id chicken-and-egg in spawn prompts.** SKILL.md:134 requires the
  spawn prompt to include "the agentIds of peers it may contact", but peers spawned
  later have no ids when earlier prompts are assembled, and roster.md is likewise
  incomplete until all spawns return. Early-spawned flash agents can finish their
  whole charter before the roster is complete. Fix: spawn all teammates first,
  complete the roster, then resume each with a "go" message; or instruct
  "re-read roster.md immediately before contacting any peer".

- **[P2] (A/B) No stall-detection mechanism.** operations.md:87-90 defines "On
  stall" and "Periodically" but the only push signal the harness gives is a
  completion notification — a stalled agent produces nothing, ever. tasks.md
  timestamps exist in the format ("since 14:20", registry.md:58) but no polling
  cadence (read tasks.md + TaskOutput(block=false) over active ids every N
  minutes / M notifications) is ever prescribed. Fix: define the monitoring pass.

- **[P2] (B) No timeout or fallback when a checkpoint or handoff request goes
  unanswered.** operations.md:88 (checkpoint) and :119 (handoff request) assume a
  response; the rotation criterion (operations.md:124) REQUIRES the handoff to
  exist. A silent or wedged teammate stalls the procedure forever — TaskStop is
  only authorized at dissolve (operations.md:130, SKILL.md:94), and mid-run
  message delivery to a RUNNING agent is not documented by the harness at all
  (only resume-of-completed is). Fix: "checkpoint unanswered after one polling
  interval + one repeat → if running, TaskStop; rotate WITHOUT handoff (mark
  'rotated — no handoff'); if completed, spawn successor from charter + log."

- **[P2] (A/C) Two squads in one project collide on `.escouade/`.** The registry
  path is fixed (SKILL.md:38-42); mission.md/tasks.md/log.md/roster.md are
  singleton files; archive assumes a single live squad. Two concurrent missions
  interleave claims in one tasks.md. Fix: namespace per mission
  (`.escouade/<mission-slug>/`) or an explicit "one squad per project; archive
  before the next stand-up" rule with a marker file.

- **[P2] (A) Spawn-failure path undefined.** SKILL.md:64/operations.md:79 say
  "record every agentId the moment the spawn returns it" — nothing covers a spawn
  that errors immediately or returns no id (retry? drop the stream? merge into
  another teammate?). Fix: "spawn failed → retry once → re-plan the stream (merge
  or drop); log it."

- **[P2] (B/C) The Forge itself can degrade with no recovery path.** Refinement is
  a Forge monopoly (operations.md:47 "refinement always stays with the persistent
  Forge"; charters.md:90), so nobody can refine the Forge's charter when the Forge
  is the drifted one; no rotation procedure exists for it; and although
  registry.md:35 lists `charters/forge-v1.md`, no procedure ever writes the
  Forge's own charter file (its "charter is its stand-up dispatch" — which lives
  only in the lead's context and dies with compaction). Fix: stand-up step "write
  the Forge dispatch verbatim to charters/forge-v1.md"; name the explicit
  exception that the LEAD hand-refines the Forge's charter (or a deputy does)
  when the Forge degrades.

- **[P2] (A) Contradiction: who spawns the deputy forger?** SKILL.md:109
  ("Teammates never spawn anything; only the lead spawns") vs SKILL.md:63 ("the
  lead may also dispatch a deputy forger") vs charters.md:90 (Forge "never spawns
  — it writes charters, deputies excepted", implying the Forge spawns deputies).
  Fix: pick one — lead dispatches the deputy; delete "deputies excepted".

- **[P2] (C) No compaction/session-restart re-entry procedure.** SKILL.md:40 and
  registry.md:3 promise survival, but no section tells a context-wiped lead what
  to do: re-read mission/roster/tasks/log, then TaskOutput(block=false) every
  non-retired id to rebuild running/completed state (notifications that fired
  during compaction are gone). Not-on-disk items the lead needs: budget counts,
  pending checkpoints and two-failure strikes (only recoverable if logged — the
  log example logs the re-spec, not the strikes), in-flight notification
  contents, the user dialog behind human gates, and the lead's own messaging
  address (see P1 #3). Fix: add a "Re-entry" section to operations.md and a
  `state: running|awaiting X` convention in log.md.

- **[P2] (A) "Broadcast" does not exist as a primitive.** SKILL.md:108 and
  comms.md:28 ("only the lead may broadcast") — SendMessage is strictly 1:1 by
  agent id; there is no fan-out. A weaker lead will hunt for a broadcast tool.
  Fix: "to broadcast, the lead sends the same DM to each active teammate
  individually."

- **[P2] (A) The model cascade is fiction in this build, and the references
  forget.** SKILL.md:36 honestly says no per-spawn model exists, but
  operations.md:37-39 still orders the Forge to "Assign models per the cascade",
  charters.md:77 says warden "must always run strong", and the gate at SKILL.md:16
  (generator-verifier: "a cheap producer ... strong-model checker") invites
  missions whose premise cannot be realized — validator and producer run the SAME
  model, so "cheap-first with strong verification" is not what actually happens.
  The "(Settings → Subagents)" aside is speculative UI. Fix: repeat the caveat in
  operations.md and charters.md ("record intended model; actual model is whatever
  this build assigns"), and reframe the gate as machine-verification + clean-context
  review, not cheap-vs-strong.

- **[P2] (A) The Forge dispatch is not self-contained.** operations.md:33 tells the
  Forge to read "[references/charters.md of the escouade skill]" — no absolute
  path, and the squad's project is generally not the skills repo. This violates
  the skill's own rule (SKILL.md:134: spawn prompts must be fully
  self-contained). A Forge that cannot find the anatomy improvises charters.
  Fix: paste the charter anatomy into the dispatch, or give the absolute path to
  the installed skill.

- **[P2] (A) The sentry/watcher archetype assumes periodic wake-ups, which the
  harness does not have.** charters.md:79-83 ("Periodic monitoring ... alert on
  condition") — a background agent completes when its prompt is done; there is no
  scheduler or idle hook. A sentry must busy-loop inside one run (token burn, no
  sleep primitive guaranteed). Fix: redefine watcher as run-once snapshot checks
  that the LEAD re-triggers on a cadence it owns (resume via SendMessage), and say
  so in the archetype.

### P3 — ambiguities

- **[P3] (A) Roster statuses are incomplete.** registry.md:42 defines
  active/idle/stalled/retired; there is no terminal state at dissolve
  (dissolved/stopped), no rule for who clears `stalled` back to active/idle when a
  checkpoint IS answered, and `idle` conflates "completed, resumable" with
  "between tasks". Fix: add `stopped` (dissolve) and "lead clears stalled on
  answer".

- **[P3] (A) Inconsistent model labels.** registry.md roster example uses "flash"
  while the cascade table (SKILL.md:24-30) uses GLM-5.3-flash / flash-vision and
  the roster header says "model". Fix: one vocabulary.

- **[P3] (A) `handoffs/` namespace is overloaded.** SKILL.md:50 says
  "handoffs/ # <name>.md, written at rotation", but charters.md:64 puts research
  findings there, registry.md:53 puts task deliverables there, and comms.md:17
  puts status consolidations there. Suffixes disambiguate, but the tree comment
  and registry.md:88 ("Written by a teammate at rotation") contradict the other
  uses. Fix: either a `findings/` sibling dir or updated comments.

- **[P3] (A) tasks.md claiming has no race protection.** registry.md:66 ("One
  owner per task at a time") is a norm, not a protocol; two flash agents reading
  simultaneously can double-claim. Fix: lead pre-assigns owners at seeding;
  teammates may claim only `unclaimed` tasks and must re-read after writing.

- **[P3] (A) Dissolve criterion "no live agentIds from the roster remain running"
  (SKILL.md:98, operations.md:159) has no stated check method.** There is no
  list-tasks tool; the lead must TaskOutput(block=false) each id. Fix: say so.

- **[P3] (A) The shutdown exchange wakes every teammate one more time.**
  operations.md:129 messages completed agents "confirm and stop" — which RESUMES
  them in background per harness semantics; expect one extra completion
  notification per teammate, and a confused flash teammate may do "one more
  thing" instead of stopping. Fix: note the wake side-effect; consider skipping
  the message for agents already completed and just TaskOutput them.

- **[P3] (A) Judge subagent_type list drifts from the harness.** SKILL.md:127 says
  judge "renders pptx/docx/pdf/xlsx"; the build also gates poster/chart. Trivial,
  but keep the enumeration in sync.

- **[P3] (A) Terminology drift: "gap analysis" (SKILL.md:63) vs "WORK STREAMS
  NEEDED" (operations.md:29)** for the same input; a weaker lead may go looking
  for a gap-analysis artifact nobody defined. Fix: one term.

---

## Direct answers to the scenario-C questions

Does the skill still work after lead compaction? Structurally yes — the roster
preserves agentIds, log.md preserves decisions, charters preserve spawn sources,
and TaskOutput(block=false) over roster ids can rebuild running/completed state.
But nothing TELLS the compacted lead to do that (no re-entry procedure), and four
things the lead needs are not on disk: (1) message-budget counts (never persisted,
never even visible), (2) pending checkpoint / two-failure strike state (only
recoverable if the lead happened to log each strike — the log example logs the
re-spec decision, not the strikes), (3) completion notifications that fired during
compaction (their content is unrecoverable except via TaskOutput), (4) the user
dialogue behind human-gated approvals and the mission's origin (one log line is
the only trace), plus (5) the lead's own messaging address for teammates, which
the registry never records even in the uncompacted case.

## Summary counts

P1: 5 — P2: 13 — P3: 8 — total 26.
