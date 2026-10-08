---
type: spec
tags: [spec, area/taste]
created: 2026-09-28
updated: 2026-10-08
aliases: []
sources: []
status: in-progress
---

# 11. Better designs, lower cost (2026-09-28)

## Why

The 2026-09-28 night cost $5.08 and Doug called it "just not good design". Three causes, all read from `archive/2026-09-28/` on main:

- It repeats 2026-09-18 almost exactly: violet split, ruled lines, a nav card top left, the work list on the right. Its hero line "Buildable before the first line of code" was the 2026-09-22 hero. The Art Director reads only the last 5 briefs (`scripts/pipeline/context.js:105`), so it saw neither night. The uniqueness index looks back 7 builds and blocks nothing.
- The copy is hard to read. The build draws high-contrast white rules behind the label and the deck. No gate compares text against the pixels behind it (the gap #640 names).
- Nothing judges the mockup's taste. The mockup critic runs on Haiku as a floors check (`scripts/utils/models.js:63`). It approved a mockup with the hero word below the 1440 fold and an invented FishSticks description.

Cost: the Art Director was re-run in full over one invalid MOBILE field ($1.10). That happened on 2 of the last 5 nights.

## Decisions (Doug, 2026-09-28)

- Quality first, then cost. The Art Director and mockup designer set the ceiling.
- The Art Director and mockup designer get a clean A/B: Opus 5.5 against Opus 4.8. #672 now keeps user config out of pipeline calls, so the 09-23 result that sank 5.5 no longer counts.
- The mockup critic becomes a taste judge on Opus 5.5.
- The test runs locally on the Max plan, not API credits.
- Doug votes blind in a private artifact page. Votes are the verdict.
- Six nights: 09-22, 09-24, 09-25, 09-26, 09-27, 09-28. One pair per night.
- Repeats: a 14-night digest for the Art Director, and a code check that rejects a hero phrase used in the last 30 days.
- Legibility: a contrast probe against the real pixels. Failure forces a revision. If the fault survives the last round, the night does not ship. This one check overrides the lenient ship gate.

## Phase 0: check the plan against the code

Done before any PR. Stop and report if either answer is no.

1. Can a local CLI call see an image? `vision-router.js` drops images without an API key. Test whether `claude -p` with the Read tool allowed on a PNG path returns a description of the image, and what it bills.
2. How did arms B and C run on 2026-09-23 (`02f424d8`, `52b2556a`)? Find the replay entry point that runs the Art Director and mockup designer on a saved night's signals and stops before the engineer.

### Phase 0 results (2026-09-28)

1. Yes. A keyless `claude -p --tools Read --allowedTools Read --max-turns 3` call read the 09-28 mockup PNG and the mobile filmstrip JPG and reported what was on them correctly. `apiKeySource` was `none`, so the Max plan paid. Each image added about 1.5k to 2k input tokens, and the ledger's `total_cost_usd` is a list-price figure, not a bill. The pipeline passes `--tools '' --max-turns 1` today, so the local critic path needs `Read`, a turn limit of 3 or more, and the images written to disk.
2. No entry point exists. Arms A to C were full `PIPELINE_TIER=prod pnpm pipeline:canary` runs with `PROD_MODELS` edited in a commit before each one, and each collected live signals that morning. `RESUME_HANDOFF` refuses another day's handoff (`handoff.js:91`), plays back recorded replies, and runs on through the engineer. `PIPELINE_TIER` switches every agent at once. Mockup images reach disk only when a night is archived. The six nights archived `signals-brief.md`, not `signals/today.yml`. Doug chose to build the replay (1e) over running on fresh nights.
3. Found while checking 1c: a CSS-based text contrast gate already exists (#566, `text-contrast.js`, `text-contrast-page.js`). It reports text over a background image, a ruled line or an overlapping positioned element as `contrast-unresolved`, a warning with no ratio. That is exactly the 09-28 case. 1c builds on it and does not replace it.

## Phase 1: four independent PRs

Each ships on its own through the five-job gate.

**1a. Retry the failed block only.** `phase-art-director.js:249` re-runs the whole Art Director. Ask for the invalid block alone and splice it into the first reply, the way the mockup patch revisions work. Fall back to the full retry when the splice fails. Saves about $1 on a retry night.

**1b. Longer memory and a copy check.** Replace the five full briefs with a one-line digest for each of the last 14 nights: layout, primary hue, ground, type register, hero phrase. Add a code check on the Art Director reply. A hero phrase that matches one from the last 30 days, after normalising case and punctuation, is rejected and re-asked through 1a's block retry.

**1c. Legibility probe.** Extends #566: where the CSS walk reports `contrast-unresolved`, sample the pixels instead of warning. In the surface gate, for each such text element, render its box with the text hidden, sample the pixels behind it, and take the contrast of the text colour against the worst 10% of them. Body text needs 4.5:1, large text 3:1. A failure is a finding with the element chain and file, like `clipped`. It runs on the mockup pre-check too, so the designer fixes it before code exists. A survivor after the last round refuses the ship.

**1d. Mockup critic as a taste judge.** Rewrite its prompt to judge five things: freshness against the 14-night digest, legibility, hierarchy, hero in the first fold at 1440 and 360, and copy that matches the work records. Keep the measured floors in code, where #671 already put them. Move `PROD_MODELS['mockup-critic']` to `opus-5-5`. About $0.10 a round. Phase 0 showed the CLI can read images, so the local path gets the same images: write them to temp files, allow `Read`, raise the turn limit, and drop `NO_IMAGE_NOTICE` for that path.

**1e. Replay a saved night through the mockup loop.** A script that takes a night's date and a model for the Art Director and mockup designer, rebuilds that night's inputs, runs the Art Director, the mockup designer and the critic loop as production would, stops before the engineer, and writes the final mockup HTML plus PNGs at 1440 and 360 to an output dir. It needs a per-run model override for those two agents that does not edit `PROD_MODELS`. Before building it, check whether `signals-brief.md` plus the archive holds enough to rebuild the Art Director's input, and report if it doesn't.

1b re-asks through 1a's block retry, so 1b starts after 1a merges.

## Phase 2: the taste test

Runs on main after Phase 1 merges, so both models see the prompts that would ship.

- For each of the six nights, run the Art Director and mockup designer twice: once on Opus 4.8, once on Opus 5.5, with `PIPELINE_TIER=prod`, locally, no API key. The critic loop runs as it would in production. Save each final mockup at 1440 and 360.
- Publish a private artifact page with one pair per night, sides shuffled, model hidden. Doug picks A, B or tie and can add a note. Votes are saved on the page, and I read them from there.
- Rule (Doug, 2026-09-28): 5.5 replaces 4.8 when it loses at most 2 of the 6 pairs. Ties count as a pass. Otherwise 4.8 stays.

## Phase 3: later

Engineer revision rounds ($1.60 to $1.90 a night) and the screenshot critic's bare SHIP. Both wait for evidence from nights run on Phase 1.

## Expected cost

About $4.30 a night now. Phase 1 adds about $0.10 to $0.30 for the critic and removes about $1 on retry nights. If 5.5 wins, the Art Director and designer drop about 20%, roughly $0.35 a night.
