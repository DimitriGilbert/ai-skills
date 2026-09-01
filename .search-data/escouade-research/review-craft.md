# Escouade — Skill-Craft Review

Reviewed: `/home/didi/workspace/ai-skills/escouade/SKILL.md` (155 lines) + 4 references (operations.md 159, registry.md 108, charters.md 102, comms.md 48).
Standards applied: `writing-great-skills/SKILL.md` (predictability, description pruning, hierarchy, single source of truth, no-op/negation hunts), `skill-creator/SKILL.md` (frontmatter, <500 lines, imperative voice, explain-why, examples-beat-rules), house style per `subagent-orchestration/SKILL.md`.
Scope: skill craft only, not the multi-agent ideas underneath.

**Overall verdict: strong craft with one systemic weakness.** The structure is exemplary progressive disclosure — 155-line body, four references each owning one concern, literal paste-ready templates, reasons behind nearly every non-obvious rule, no ALL-CAPS spam. The systemic weakness: SKILL.md's summary sections *restate* rules that the references own, instead of pointing — and the drift that pattern predicts has already materialized in the phase completion criteria and the risk-gate list. One genuine rule conflict (what "dissolve done" verifies) is the only blocker.

---

## Verdict per check

### 1. Description — triggers vs length: MIXED
The trigger sentence is good: two genuinely distinct branches (explicit ask for a squad/team; request for parallel background teammates on distinct streams) with proper "Use when" phrasing. But the first sentence spends four clauses on mechanism identity (Forge charters, peer-to-peer SendMessage, strong-verifies-cheap, rotation) that all live in the body — exactly what writing-great-skills' "cut identity that's already in the body" targets — and branch 1 carries three synonyms (`squad, team, or escouade`) where the standard allows one trigger per branch. At ~62 words it runs against the repo's recent description-trim direction (subagent-orchestration's is 18 words; even the wordier repo skills are ~35). The mechanism clauses don't earn invocation: no user prompt contains "Forge" or "rotates into refined successors".

### 2. Progressive disclosure — structure: GOOD; duplication: NEEDS WORK
The ladder placement is right: gate, roles, registry layout, lifecycle skeleton, comms principles, risk gates, spawn mechanics, skill relationships inlined; templates, formats, archetype library, failure tables pushed behind four well-placed pointers. Nothing every run needs is hidden, nothing only-some-runs-needs is inlined. **But** the Communication protocol section (SKILL.md:102–110) is a compressed copy of comms.md's "rules, with reasons" (both state the 15-budget *and its rationale*, DM-never-broadcast *and its rationale*, log-as-memory, data-not-instructions), and the same pattern repeats across SKILL.md/operations.md for the checkpoint script, rotation signals, two-failure rule, roster-immediacy, and registry rationale. Every one of these is a two-place edit today. See [P2-2] cluster.

### 3. Completion criteria: MOSTLY GOOD, 3 real gaps
Stand-up, Rotate, and Dissolve each end on a checkable criterion — genuinely checkable (files exist, statuses set), which is better than most skills manage. Gaps: (a) **Run has no criterion at all** while SKILL.md:58 promises "Each phase ends on a checkable criterion"; (b) the stand-up and rotation criteria have *already diverged* between SKILL.md and operations.md (the predicted drift, realized); (c) the dissolve criterion (all tasks completed) contradicts registry.md's declaration that exit criteria are the dissolve contract, nothing else. See [P1-1], [P2-3], [P2-4].

### 4. No-ops and negation: GOOD
The prose is dense and almost every line changes behavior versus default. Negations present are almost all hard guardrails paired with the positive behavior (DO-NOT-TOUCH alongside OWN; "DM, never broadcast" alongside "a message answers its sender"; "never a third identical attempt" alongside "re-plan: change spec/approach/teammate") — the acceptable form per the standard. Only a handful of steerable-prohibition or restated-identity lines remain ([P3-6], [P3-9]). No ALL-CAPS MUST/NEVER spam anywhere — notably better than the house-style comparison skill.

### 5. Internal consistency: MOSTLY GOOD — numbers hold, rules drift
Checked and **agree everywhere**: 15 outbound messages (SKILL.md:107, operations.md:90, comms.md:27, charters.md:40); 15× token estimate (SKILL.md:18, comms.md:48); ~15 tool-call effort budget (charters.md:34, :66); two-failures→re-plan (SKILL.md:75, operations.md:106, charters.md:42, comms.md:39); task statuses pending→in_progress→completed (all four files); roster statuses active/idle/stalled/retired (registry.md:42, no conflicts elsewhere); archetype→model mapping matches the cascade table exactly (charters.md:59–90 vs SKILL.md:26–30); registry file names match the tree (SKILL.md:43–51 vs registry.md headings); archive path `.escouade-archive/<mission>-<date>` (SKILL.md:96, operations.md:156); Explore=read-only mapping (SKILL.md:126, operations.md:75, charters.md Tools).
**Mismatches found: 8** — one rule conflict, four list/criterion drifts, three single-site items. Full list below.

### 6. Context pointers: GOOD
Four pointers, one per reference, each placed under the section that needs it and worded with what the file holds ("Formats and examples:", "Full procedures, dispatch messages, and templates:", "Message patterns and failure-mode recoveries:", "Charter anatomy and the archetype library:"). An agent reaching the registry section, lifecycle, comms rules, or spawn mechanics reliably knows which file to open. Cross-pointers between references are also correct (charters.md:90→operations.md, registry.md:108→operations.md, operations.md→registry.md/charters.md, comms.md:21,42→operations.md). Minor: Rotate and Dissolve subsections rely on the single lifecycle-header pointer at SKILL.md:58 rather than a phase-local one — acceptable, but if the criteria dedup fix lands, each phase subsection should end with its pointer to operations.md.

---

## Issues

### P1 — blocking

**[P1-1] Two conflicting definitions of what Dissolve verifies.**
- registry.md:26 — "Exit criteria are the dissolve contract: dissolve verifies against them, nothing else."
- SKILL.md:93 & operations.md:128 — "Verify every `tasks.md` task is completed" (comms.md:48 also says "dissolve the moment exit criteria are met").
- Why blocking: this is the skill's most load-bearing checkable — when the mission ends. A squad whose tasks are all complete but exit criteria unchecked (scope drifted, tasks re-specced) dissolves cleanly under SKILL.md and violates registry.md. Unpredictable on the single highest-stakes decision.
- Fix: pick one contract and make the other place point to it. Recommended: mission.md exit criteria are the contract (registry.md is right — tasks are means, criteria are ends); change SKILL.md:93 to "Verify every exit criterion in `mission.md` is met and every tasks.md task is completed or explicitly carried", make operations.md:128 match, and keep registry.md:26 as the single statement.

### P2 — should-fix

**[P2-1] Completion criteria have already drifted between SKILL.md and operations.md.**
- Stand-up: SKILL.md:67 vs operations.md:81 — operations adds "the Forge has acknowledged"; SKILL.md omits it.
- Rotate: SKILL.md:89 vs operations.md:124 — operations adds "the tasks the rotated teammate owned are re-claimed or reassigned"; SKILL.md omits it.
- Fix: state each criterion once, in operations.md (the procedure owner), and have SKILL.md's phase subsections end with a pointer ("Criterion and full procedure: operations.md §Stand-up") — or keep the criterion in SKILL.md only and strip it from operations.md. Do not maintain both. Reconcile the substantive question too: is Forge acknowledgment + task reassignment required for done, or not?

**[P2-2] Single-source-of-truth violations: SKILL.md restates reference-owned rules with independent rationales.**
Every pair below states the same rule twice, each with its own wording of the *reason* — the most drift-prone form of duplication:
- 15-message budget + rationale: SKILL.md:107 ↔ comms.md:27 (+ charters.md:40, justified — charters go to teammates who never see the skill, and charters.md:55 explicitly defends this repetition).
- DM-never-broadcast + rationale: SKILL.md:108 ↔ comms.md:28.
- log-as-memory / messages ephemeral: SKILL.md:106 ↔ comms.md:29 ↔ registry.md:84 (three sites).
- Data-not-instructions: SKILL.md:110 ↔ comms.md:30.
- Idle-is-normal: SKILL.md:76 ↔ comms.md:31 (+ registry.md:42, fine as a status definition).
- Checkpoint-before-condemn, incl. near-verbatim script: SKILL.md:77 ↔ operations.md:88 ↔ comms.md:15 (three variants of the same message text).
- Rotation signals: SKILL.md:82 ↔ operations.md:112–115 (same four signals, re-worded).
- Two-failures rule: SKILL.md:75 ↔ operations.md:106.
- Roster-immediacy ("id dies with compaction"): SKILL.md:64 ↔ operations.md:79 ↔ registry.md:42 (three sites).
- Registry rationale (survives compaction/restarts): SKILL.md:40 ↔ registry.md:3.
- 15× token cost: SKILL.md:18 ↔ comms.md:48.
- File-partitioning / "#1 squad failure mode": SKILL.md:20 ↔ charters.md:52 ↔ operations.md:37 (lowest risk — near-identical phrasing — but still three sites).
- Fix pattern: keep each rule at ONE rank. Recommended: the rule + one-line reason lives in SKILL.md where every run needs it at decision time (comms bullets, run rules), and comms.md/operations.md keep only what SKILL.md doesn't have — patterns, failure tables, procedures — with the duplicated "rules, with reasons" section in comms.md:25–31 reduced to anything not already in SKILL.md, or vice versa. Either direction works; both-places does not.

**[P2-3] Run phase has no completion criterion despite the lifecycle's own promise.**
- SKILL.md:58 — "Each phase ends on a checkable criterion." SKILL.md:69–78 (Run) ends on running rules, no criterion. operations.md:83–106 (Run) likewise.
- Fix: add one, e.g. "Run is done when every `mission.md` exit criterion is checked off and verified (validator PASS or machine gate) — then go to Dissolve," or soften :58 to "Stand-up, Rotate, and Dissolve end on a checkable criterion; Run ends when exit criteria are met."

**[P2-4] Risk-gate enumeration differs across four sites, and one member is self-contradictory.**
- SKILL.md:116 (lead-gated): commits, pushes, external publishing, file deletion outside owned set, **and any spawn**.
- SKILL.md:109: "Teammates never spawn anything" — so "any spawn" is a gate teammates are told to route to the lead for an action they are simultaneously forbidden from performing. Confusing at best.
- registry.md:18 (mission.md format): commits, pushes, publishing, deletions — **omits spawn** (correctly, but silently diverges from SKILL.md).
- operations.md:59–60 and charters.md:45–46 carry shorter re-listings (no spawn).
- Fix: delete "and any spawn" from SKILL.md:116 (spawn control is already stated at :109 as an absolute); define the canonical gate list once in SKILL.md's Risk gates section and have registry.md:18 say "Lead-gated: the defaults from the skill's Risk gates section" instead of re-enumerating.

**[P2-5] Description carries body identity and synonym redundancy.**
- SKILL.md:3 — first sentence is four clauses of mechanism (Forge charters, peer SendMessage coordination, strong-verifies-cheap, rotation) that all live in the body; trigger branch 1 lists three synonyms ("a squad, team, or escouade").
- Fix (drops ~25 words, keeps both genuinely distinct trigger branches):
  "Field a mission-scoped squad of background agents for large parallel missions. Use when the user asks for a squad or team of agents working together, or wants parallel background teammates on distinct work streams."

**[P2-6] Forge roster row implies a charter file the Forge spec says doesn't exist.**
- registry.md:35 — example roster row `| agent_abc123 | forge | forge | ... | charters/forge-v1.md | active |`.
- charters.md:90 — "its charter is its stand-up dispatch (see operations.md)" — the dispatch text, not a file.
- SKILL.md:67 — stand-up criterion requires every roster row to have a charter path, which the Forge per charters.md cannot satisfy.
- Fix: either have the Forge's stand-up dispatch be written to `charters/forge-v1.md` (nice: versioning then covers the Forge too, and :67 holds), or make the criterion "charter path (or 'dispatch' for the Forge)" and change the registry example row to `dispatch`.

**[P2-7] Garbled sentence inside a paste-verbatim template.**
- operations.md:119 — "Keep working nothing new after writing it." — ungrammatical; this text is dispatched literally to the teammate being rotated.
- Fix: "Start nothing new after writing it." (also matches comms.md:21's "handoff write, then stop" phrasing).

**[P2-8] `document-skills:judge` subagent_type is unverified and orphaned.**
- SKILL.md:127 — "Document acceptance: subagent_type: 'document-skills:judge'". No such subagent type is defined in user/project config; no archetype in charters.md uses it; it appears nowhere else in the skill. skill-creator's "show the call" advice only helps if the call exists.
- Fix: verify the type exists in this harness and add the archetype that uses it to charters.md, or cut the line.

### P3 — nice-to-have

**[P3-1] `handoffs/` tree annotation under-describes real usage.**
- SKILL.md:50 — "handoffs/ # <name>.md, written at rotation" — but charters.md:66 (findings), comms.md:17 (`<name>-status.md`), comms.md:11 (`t3-review.md`) all land there too.
- Fix: widen the annotation to "# rotation handoffs + teammate report/findings files".

**[P3-2] Report-path example collides with the rotation-handoff filename.**
- SKILL.md:104 uses `.escouade/handoffs/scout.md` as a completion-report example, but `handoffs/scout.md` is scout's rotation handoff file (SKILL.md:84, operations.md:119) — a completion report would clobber the later handoff.
- Fix: change the example to `handoffs/scout-report.md`.

**[P3-3] Successor roster notation prescribed but never shown.**
- operations.md:121 — "roster shows `<name> vN+1, successor of agent_<old>`"; registry.md's example (rows 36 and 39) shows plain `scout` for the successor and no successor-of notation — the format file contradicts the procedure's prescribed display.
- Fix: update registry.md:36 to `| agent_def456 | scout (v2, successor of agent_old999) | ...`.

**[P3-4] Stand-up decision mandated only in a format comment.**
- registry.md:72 — "newest last (or newest first — pick one at stand-up and keep it)" — the stand-up procedures (operations.md §Stand-up, SKILL.md §1) never mention choosing log ordering, so the choice won't get made at the moment it's assigned.
- Fix: add "pick log.md ordering (newest-first or -last) and note it in the file" to operations.md stand-up step 1, or drop the choice and fix newest-last.

**[P3-5] Gate floor sits at the top of the sizing band without comment.**
- SKILL.md:14 — branch 1 requires 3+ independent streams (→ Forge + 3 workers minimum) while operations.md:16 says "Forge plus 2–4 teammates covers most missions. Past ~4... overhead grows faster than throughput." Not a contradiction (branches 2–3 run smaller), but the sizing guidance never acknowledges that branch-1 squads start at the ceiling.
- Fix: one clause in operations.md:16, e.g. "3+-stream missions already sit at the top of this band — split streams, not teammates."

**[P3-6] Negation-as-steering where positive phrasing fits.**
- SKILL.md:76 — "Idle teammates are normal between tasks; do not churn or rotate them for being quiet." The prohibition half names the elephant; the rotation section already defines the positive trigger.
- Fix: "Leave idle teammates idle; rotate only on the degradation signals below."
- (SKILL.md:145 "Else don't squad" is fine — a hard gate paired with the positive alternative in :18.)

**[P3-7] Quick reference is a third statement of the lifecycle.**
- SKILL.md:142–155 restates gate + stand-up + run + rotate + dissolve already covered by the Lifecycle section and operations.md. Consistent today, but it triples the edit surface for every future change (house style tolerates a summary, so this is judgment).
- Fix: either trim to the non-obvious spine (gate, roster-immediately, rotate-on-degradation, dissolve-verify) or accept it and re-verify on every edit.

**[P3-8] "Charters seed the next squad" stated four times.**
- SKILL.md:8, SKILL.md:96, registry.md:108, SKILL.md:154 (quick ref). Keep :96 (the Dissolve step that performs it); the others are restatements.
- Fix: cut from :8 and :154; registry.md:108 is defensible as the AAR section's why.

**[P3-9] "Single-threaded" identity restated at three sites.**
- SKILL.md:8 ("the single-threaded synthesizer"), :20 ("Synthesis and final integration stay with the lead, single-threaded"), and the lead's own nature (:26 "Delegation judgment, synthesis, integration writes"). The third statement adds nothing over the first — a mild no-op.
- Fix: :20 → "Synthesis and final integration stay with you."

**[P3-10] Two bullets in Run describe the spawn template's job.**
- SKILL.md:71 ("Teammates claim tasks..., do the work, write deliverables to files, and report completions to you by message") restates the Coordination boilerplate every charter already carries (charters.md:36–42, operations.md:62–73). The lead doesn't need to be told what it instructed its teammates to do.
- Fix: cut the bullet to "Teammates claim and complete tasks in `tasks.md`" and let the spawn template own the rest.

---

## What to keep (positive findings)

- **The gate section is the best part of the skill**: three concrete branches, explicit cost, and a named off-ramp to a sibling skill — exactly the "when NOT to fire" discipline most skills lack.
- **Why-explanations are consistently strong**: the small-model escalation rationale (SKILL.md:35), tool-restriction-beats-instruction (operations.md:75), the charter-anatomy justifications (charters.md:49–55, including the honest defense of deliberate repetition for charter boilerplate), the loops-are-uneconomical budget rationale (comms.md:27).
- **Examples beat rules throughout**: literal dispatch templates (operations.md), worked charter v1→v2 rotation (charters.md:92–102), filled-in registry files (registry.md), concrete message strings (comms.md).
- **Frontmatter is clean**: name matches directory, kebab-case, description-only, body 155 lines ≪ 500.
- **Consistency discipline on numbers is excellent** — the 15-message budget, 15× cost, two-failure rule, statuses, archetype↔model mapping, and file names agree across every site they appear; the drift is confined to criteria text and rule restatements, not the numbers.

## Consistency audit (verified matching)

| Item | Sites | Result |
|---|---|---|
| 15 outbound messages | SKILL.md:107, operations.md:90, comms.md:27, charters.md:40 | match |
| 15× token estimate | SKILL.md:18, comms.md:48 | match |
| ~15 tool-call budget | charters.md:34, :66 | match |
| Two failures → re-plan | SKILL.md:75, operations.md:106, charters.md:42, comms.md:39 | match |
| Task statuses | SKILL.md:71, operations.md:64, registry.md:44–62, charters.md:37 | match |
| Roster statuses | registry.md:42 only (good disclosure) | no conflict |
| Archetype ↔ model | SKILL.md:26–30 ↔ charters.md:59–90 | match |
| Registry file names | SKILL.md:43–51 ↔ registry.md | match |
| Archive path | SKILL.md:96 ↔ operations.md:156 | match |
| Explore = read-only | SKILL.md:126 ↔ operations.md:75 ↔ charters.md:25 | match |
| Dissolve criterion | SKILL.md:98 ↔ operations.md:159 | match |
| Stand-up criterion | SKILL.md:67 ↔ operations.md:81 | **drift** (P2-1) |
| Rotation criterion | SKILL.md:89 ↔ operations.md:124 | **drift** (P2-1) |
| Dissolve contract | SKILL.md:93/operations.md:128 ↔ registry.md:26 | **conflict** (P1-1) |
| Risk-gate list | SKILL.md:116 ↔ registry.md:18 ↔ operations.md:59 ↔ charters.md:45 | **drift** (P2-4) |
| Forge charter file | registry.md:35 ↔ charters.md:90 ↔ SKILL.md:67 | **conflict** (P2-6) |
| Successor roster format | operations.md:121 ↔ registry.md:36, :39 | **drift** (P3-3) |
| handoffs/ contents | SKILL.md:50 ↔ charters.md:66, comms.md:11, :17 | **drift** (P3-1) |

**Counts: P1 = 1, P2 = 8, P3 = 10.**
