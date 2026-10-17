---
type: spec
tags: [spec, area/taste]
created: 2026-10-17
updated: 2026-10-17
aliases: []
sources: []
status: proposed
---

# 13. Better nights on $3.30 a day (2026-10-17)

## Why

Doug, 2026-10-17: happy with the flow, not happy with the design outputs. The budget is now $100 a month of API credit, about $3.29 a day.

A review of main at e362a4f0 covered the nights from 2026-09-25 to 10-17. It looked at the screenshots, the prompts and the cost ledgers. Its findings:

- The design is capped before the engineer starts. Against `signals/taste.md` the 20 nights average about 4.3 out of 10, and none reaches 7. That is Claude's eye, since no night after 09-22 has a rating. The drift gate has ended every night since 10-01 with zero drift errors, so the React build is no longer where the work gets lost.
- A stranger's quote was the hero on 14 of 20 nights. PR #535 (from #531, 09-20) made `signals.quote` the preferred hero source (`scripts/prompts/art-director.md:11-13`). `signals/taste.md:93-100` says the subject is Doug.
- The hero can't pass 160px. The 10rem cap (#530) is enforced in `scripts/utils/ad-spec-checks.js`, and six nights hit exactly 160. The gold standards were 178px (06-13) and about 280px (09-10).
- The first fold is crowded. Ledgers, weather and moon cards, the Spaceman card and logo walls share it with the hero on nine or more nights, driven by the required blocks in `scripts/prompts/react-engineer.md:361-372`.
- `mesh` became a mud gradient on all three nights that picked it (10-02, 10-06, 10-13). On 10-06 the hero measured 1.64:1 contrast.
- No step judges taste.
  - `scripts/prompts/mockup-critic.md:106` forbids a REVISE "for a taste preference". 13 of 20 mockups reached the engineer still on REVISE.
  - The screenshot critic hits its 16k output cap (`scripts/utils/budgets.js:49`) and comes back UNVERIFIED on most nights.
  - No taste agent sees an image of good work. `designReferenceImages` exists on the Art Director (`scripts/agents/art-director.js:368`) and nothing fills it.
  - The ratings window covers the last 10 build dates (`scripts/pipeline/context.js:124`), so today the Art Director sees no ratings.

Cost:

- A shipped night costs a mean of $4.96.
- Failed runs cost $26.84 over 30 nights and never reach the archive totals. Real spend is about $5.14 a day, or $155 a month.
- Revisions and retries are 40% of a night.
- Cache writes are 36% of a night and almost never read back. The CLI writes a 5-minute cache, and the first calls run 5 to 9 minutes.
- Since 10-08, engineer rounds 2 and 3 have been stuck on one 9px LiveRail clip at 820px, a component the engineer doesn't own.

## Decisions (Doug, 2026-10-17)

- Quotes come from a list Doug curates in `signals/voice.md`. The Art Director may use one of those lines. Nothing else from the quote API.
- The Message Batches API goes in for the Art Director and mockup stages first, proven against a control night, then extends to the rest of the chain.
- The Art Director and mockup designer stay on Opus 4.8.
- One PR per item. Each one runs a same-signals control before merge, as in [[Spec 11 - Taste And Cost]]. A cost change that weakens the design doesn't ship.

## Phase 1. Lift the ceiling

Expected cost change: about zero.

1. Hero source. Replace the quote preference with the curated list in `signals/voice.md`. The `quote` lane draws only from it.
2. Hero scale. Allow 290 to 380px when the lead object is one word, a figure, or three words or fewer. Longer lines keep the 160px cap.
3. First fold. The fold holds the mark, the nav, one object and one supporting line. Ledgers and cards move below it.
4. Materials. Retire `mesh`. The default material is none.
5. Translation leaks.
   - The engineer maps an accent to the nearest named token, which turned gold into lilac on 10-17. It should use the declared hex.
   - The pale light-mode example at `art-director.md:194` gave 09-30 pale mint instead of teal. Remove it.
   - The lane is picked after the fonts and colours, then forbids them (10-12, 10-14). Pick the lane first.
   - Remove the stale lines in the Art Director prompt: the Unified Designer, the removed spec critic, and "ten" chassis.

## Phase 2. Judge taste

Expected cost: about +$0.10 a night.

6. Gold-standard image pack. Render 04-28 and 06-13 from `public/archive/` and add `references/own-2026-09-06.png`. Pass the images to the Art Director, the mockup designer and the mockup critic.
7. The mockup critic gets one judgment: does this hold the bar the gold standards set? The floor checks it still runs (fold position, grain, header) move into code. `critique.md` stops being appended to the critics.
8. The mockup designer sees its own render once before handing off.
9. Feedback loop.
   - Key the ratings window on the date of the rating, so a batch-rating session reaches the Art Director.
   - Add a weekly two-minute pick-best, pick-worst page.
   - Finish pillars PR 2.
   - Back-test any automated judge against the 32 existing ratings first. Its picks are labelled as the machine's, never as Doug's.

## Phase 3. Fit the budget

10. Stop waste. About -$0.30 to -$0.55 a night.
    - Fix the LiveRail 820px clip.
    - Stop rounds that make no progress.
    - Run the screenshot critic at effort `medium`, which also ends the truncated verdicts.
    - Turn off cache writes on calls whose cache is never read.
    - Record failed-run spend in the ledger.
11. Message Batches API, 50% off every token.
    - The Art Director and mockup stages go first (about -$1.45), then the engineer and critics (about -$2.3 in total).
    - Set effort and thinking explicitly on every call. The API defaults differ from the CLI's: Opus 5.5 defaults to `medium`, and Opus 4.8 has thinking off unless it's turned on.
    - Use the 1-hour cache.
    - Fall back to normal calls when a batch runs long, and lengthen the job timeout.
    - `cost-ledger.js` needs batch pricing and the 2x write rate of the 1-hour cache.

## Phase 4. Spend the savings on taste

Only once Phases 1 to 3 hold.

12. Best of three. The Art Director writes three short concepts, and a judge armed with the image pack picks one before the full spec. About +$0.35 to +$0.65.
13. Imagery lane (#505).

## Budget

Per day, failed runs included.

| State | $/day | $/month |
|---|---|---|
| Today | 5.14 | ~155 |
| Phases 1 and 2 | ~5.25 | ~160 |
| Item 10 | ~4.45 | ~135 |
| Batch the Art Director and mockup stages | ~3.15 | ~96 |
| Batch the whole chain | ~2.45 | ~75 |
| Best of three | ~2.9 | ~88 |

These are estimates from the archive ledgers at list prices. Each step gets measured on its control night before the next one starts.

## Open

- #645, the engineer's one-week Opus 5.5 trial, is 25 days old. Close it as adopted or revert it.
- Spec 11 Phase 2 has no recorded result in the repo. Record the 09-23 result (Opus 5.5 lost on taste), then mark Spec 11 done.
