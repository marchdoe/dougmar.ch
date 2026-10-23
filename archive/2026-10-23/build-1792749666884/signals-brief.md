# Signals Brief — 2026-10-23

## Hero Copy
Most golf apps are digital scorecards. This one is not.

## Hero Rationale
This is Doug's own line about 15th Club, pulled from his voice file, and today's live golf signal (the Butterfield Bermuda Championship in progress, Blanchet leading at −9) makes it the day's claim rather than a generic boast. It is a flat, confident product statement with a turn: setup, then the punchline "This one is not." It says what the thing does and refuses the lazy version of itself, which is exactly his register. Content-lifted won over the Gary Keller quote because the quote is abstract self-help and this is Doug talking about his own work on a day golf is on the wire.
Owner's voice: Doug wrote this line himself about 15th Club; it is golf, it is his product, it has an opinion, and a score is on the board today.

## Archetype
a scorecard that refuses to be one — cream card, green ink, the claim pinned to the left margin

## Composition
columns: single
axis: diagonal
symmetry: left-weighted
hero_zone: edge-bound
density: dense
rhythm: even
shell_posture: folded-into-hero
field_ratio: balanced
collapse: stack
hero_object: statement

## Composition Rationale
I moved hero_object off the mandate's `figure` start because today's figures (a golf leader at −9, a Red Wings 5–2) are not Doug's own, while a statement about his own project carries his voice; the live golf signal still earns poster treatment as the scorecard evidence beside the claim. I moved symmetry onto the discouraged `left-weighted` because the composition hangs the whole claim off a left spine and crops it against the edge (hero_zone edge-bound), which recreates the gold-standard Split's thesis/evidence logic inside one column — the right field is scored with signals, so the weight is a decision, not an empty gutter. axis stays `diagonal` to pull the eye from the small hollow setup down into the big solid punchline.

## Mobile
carrier: At 360 the left spine becomes the full column: the hollow setup stacks over the solid green punchline, with the scorecard markers as a ruled block directly beneath.
first_fold: The hero phrase — the outline "most golf apps are digital scorecards." over the solid green "this one is not." — plus the folded lockup above it.
order: lockup+nav, hero statement, golf scorecard + signal markers, work index, site callout, footer
hero_step_360: 3xl
nav_360: Lockup stays top-left; the three-link list sits directly under it, lowercase, green hairlines, full-width rows.

## Chassis
bricolage-manrope

## Visual Specification
**1. Color Specification**

- **Primary hue**: 150° fairway green. I deviate from the 40–80° warm mandate deliberately: every gold in that band (46, 48, 52, 80) shipped in the last two weeks, and green at 150° sits in the zone the forbidden-list leaves open (110–182°). More to the point, the line is about golf, and a cream-card-with-green-ink palette literally renders the scorecard the claim is arguing past. Fit beats the hue target here.
- **Neutral palette (scorecard cream, tinted warm ~55°)**: 50 `#FAF7F0`, 100 `#F3EEE3`, 200 `#E7DFCE`, 300 `#D4C9B1`, 400 `#AFA384`, 500 `#857A5E`, 600 `#6E6348`, 700 `#4A4332`, 800 `#2B2820`, 900 `#1A1813`
- **Accent color (fairway green)**: light `#3E9263`, default `#2A7048`, dark `#1F5637`, glow `#CFE6D6`
- **Secondary accent**: none. One hue carries the page.
- **Background**: page bg `#FAF7F0`, card/surface `#F4EFE4`, second ground (callout/band) `#EDE4D2`
- **Text colors**: primary `#2B2820`, secondary `#5E543D`, muted/faint `#7C7154`

**2. Typography**

- **Hero phrase rendering**: `display` (Bricolage Grotesque). The phrase is the one h1 and splits into two registers. The setup — "most golf apps are / digital scorecards." — is set at `4xl`, lowercase, as **outline** letterforms (hollow, stroked in `textMuted`), reading as the thin, generic digital scorecard. The punchline — "this one is not." — drops to the `hero` clamp, lowercase, **solid fairway green**, the largest and only filled thing in the hero. The turn is a tonal shift: hollow gray to solid green.
- **Type treatment**: `hero` for the solid punchline; `4xl` for the outline setup; `lede` for the one-line standfirst under the hero (the mid-register the page needs); `md` for section heads and the project titles; `base` (Manrope) at 60–68ch, leading 1.5, for any running copy; `sm` for nav and captions; `2xs`/`xs` tabular for signal figures. No size between the hero and body is skipped.

**3. Layout Specification**

- **Composition**: single / diagonal / left-weighted / edge-bound / dense / even / folded-into-hero / balanced / stack / statement. One column pinned to a left spine; the claim is cropped against the left edge and the eye runs diagonally from the small hollow setup down into the big solid green punchline, with the day's signals held as marginalia in the right field so the open side reads as a scored margin, not a void.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: minmax(0, 7fr) minmax(220px, 3fr); column-gap: 5vw`. Left spine carries lockup, statement, standfirst, work index; right field carries the signal markers. Below the hero, zones stack full-width.
- **Major dimensions**:
  - Hero zone `min-height: 88vh`
  - Right signal field `width: ~28%` (the 3fr track), top-aligned
  - Max content width: `max-width: none`; side padding `clamp(24px, 6vw, 112px)`. Running copy capped at 66ch inside the left spine.
  - Section padding: vertical `clamp(48px, 7vw, 112px)`, one even interval throughout
- **Nav placement**: folded into the hero. Horizontal lockup (mark + wordmark) top-left of the left spine; nav is a small vertical **list** of three links beneath the lockup, one green hairline per row. Not a top bar.
- **Hero phrase grid zone**: left spine, rows 2–4 (under the lockup), occupying roughly columns 1–7 of the grid; punchline at the `hero` clamp (to ~148px at 1440).
- **Home callout slot**: `<SiteCallout />` sits below the work index and above the footer, between the work index and the footer, full width, in `bgAlt`.

**4. Component Character**

- **Border radius**: cards `4px`, buttons `2px`, tags `2px`. Deliberately near-square; the owner has flagged rounded corners.
- **Border treatment**: hairline `border` (`#DCD3BE`) for row rules in the index; `borderStrong` (`#4A4332`) for the one rule under the hero and the index head. Green `fieldBorder` inside any flooded plane.
- **Shadow**: none. Depth comes from value, not shadow.
- **Density**: dense but ruled — a specimen, packed and aligned, never messy.
- **Interactive states**: links shift to `accent` and gain a 2px green underline on hover; project rows raise their title to `accent` on hover.

**5. Signal Integration**

- **Where signals live**: the right field of the hero, as a vertical stack of tabular markers, plus a music line in the footer colophon.
- **Golf** (thematically central): the Butterfield Bermuda leaderboard set as scorecard rows, green ink on cream, tabular-nums — Blanchet −9, then Kohles / Silverman / Walker / Conners at −8. Styled as the literal scorecard the hero argues past.
- **Sports scores**: Red Wings 5–2 win as a single marker, `DET 5 · OPP 2 · W`, tabular, green W.
- **Quote**: not used as hero; Keller line omitted (no attribution furniture needed).
- **Weather**: micro-label, `47°F clear · Aldie VA`, in `textFaint`.
- **Moon**: `waxing gibbous · 95%`, `textFaint`.
- **Market**: `SPY 763.96 ▼1.18%`, tabular, in the footer strip.
- **Music**: footer colophon only, as taste — `in rotation: Radiohead, My Morning Jacket, Tobin Sprout`. Never beside a score as an event.

## Self-Check
1. Hero quotability: Yes — "Most golf apps are digital scorecards. This one is not." is a flat claim with a turn, screenshot-worthy on its own.
2. Because-of chain: Yes — the claim's two registers drive the outline/solid split, the scorecard subject drives the cream-and-green palette, and the left-pinned spine stages setup-then-punchline.
3. Render feasibility: Yes — Bricolage at the hero clamp sets "this one is not." (15 chars) on one line well under 160px at 1440.
4. Canvas floor feasible: Yes — a left spine of statement + index plus a populated right signal field fills ~74% without a dead column.
5. Phone: Yes — at 360 the setup and solid punchline stack full-width at `3xl`, "this one is not." lands inside the first fold uncut.

## Rationale
The phrase is Doug's own flat claim about 15th Club: "Most golf apps are digital scorecards. This one is not." It is a setup and a turn, and everything on the page serves that turn. The setup is the generic thing, so it renders as hollow outline letterforms in muted ink; the punchline is the real thing, so it renders as the one solid, fairway-green, largest element on the page. The statement is the object, not a number, because today's numbers belong to other people (a golfer at −9, a hockey win), while the claim belongs to Doug.

The composition pins the claim to a left spine and crops it against the edge — edge-bound, left-weighted — because a confident refusal wants to hang off a margin, not float in the center. That left weight is earned by scoring the right field with the day's live golf leaderboard set as literal scorecard rows: the evidence the claim argues past sits right beside it, which also makes the golf signal thematically central instead of decorative. Bricolage Grotesque carries the register: expressive, modern, brand-driven, with a variable range that lets the hollow-to-solid shift read as intent rather than accident, and Manrope answers it with a clean humanist body that shares its construction.

The palette is the argument made in color. A paper scorecard is cream card stock with green ink, so the ground is warm scorecard cream and the one committed hue is fairway green at 150° — a deliberate step outside the warm 40–80° mandate, justified because every gold in that band shipped in the last two weeks and because green is the subject's own color. Light-ground keeps the page honest and clean, away from the overused accent-on-void formula; the green appears where it counts — the punchline, the leaderboard, the rules, the mark's own blue holds its contrast on cream so the brand stays full-color. Motion is a gentle settle on the hero, a slow drift in the mesh, and on-scroll reveals below the fold, because the owner keeps pointing at sites that move and nothing here ever has.
