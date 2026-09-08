# Signals Brief — 2026-09-08

## Hero Copy
I rebuilt myself overnight.

## Hero Rationale
Today's loudest convergence isn't a score or a holiday — it's exhaustion. The sidebar runs three straight pieces on burnout and lost agency, Hacker News carries "we have a year to fix security everywhere," and Samuel Butler supplies the deck: "Life is one long process of getting tired." Against that tired internet, this portfolio's one honest, uncanny flex is that it literally tears itself down and rebuilds every night — so the machine speaks in the first person and answers the fatigue with a fact. It's productive irony, the gold-standard move: the whole web is worn out, and this page got up and remade itself anyway.

## Archetype
a nocturnal poster that argues with itself across a split

## Composition
columns: two-equal
axis: diagonal
symmetry: right-weighted
hero_zone: full-bleed
density: dense
rhythm: even
shell_posture: footer-only
field_ratio: field-dominant
collapse: split-to-sequence

## Composition Rationale
The phrase is a two-part argument — the tired world versus the page that remade itself — so I moved `columns` off the mandate's masonry start to `two-equal`, the split that lets the two halves need each other (the gold-standard irony). I moved `shell_posture` off the start value `none` to `footer-only` because the owner grades hard on a missing brand mark, and footer-only keeps the poster field pure above while still rendering the real circular mark. Diagonal/right-weighted/full-bleed/dense/even/field-dominant/split-to-sequence are kept because each genuinely serves the phrase — the reading path cuts across, mass resolves right on the defiant answer, and the drench field leads with type placed into it.

## Mobile
carrier: The two violet fields stack into a sequence — the exhausted-world thesis directly above the rebuilt answer — so the irony survives by adjacency once the diagonal split is gone.
first_fold: The hero "I rebuilt myself overnight." with Butler's tired-world deck immediately beneath it, the ironic pair held together in the first 640px.
order: hero statement + Butler deck, exhausted-internet evidence (burnout · security · market), rebuild log (Tigers W 5–4 · weather · moon), work index, footer colophon
hero_step_360: 3xl
nav_360: footer collapses to a full-width stack — mark + wordmark, then WORK · ABOUT · CONTACT uppercase, then stamps

## Chassis
unbounded-figtree

## Visual Specification
### 1. Color Specification
- **Primary hue** — 265° violet/indigo. The site rebuilds itself overnight; violet is the color of those hours, and the open hue window (242–298°) makes it the freshest committed choice available.
- **Neutral palette (violet-tinted)** — 50 `#f5f3fa`, 100 `#e9e5f2`, 200 `#d3cde3`, 300 `#b1a8c8`, 400 `#877da2`, 500 `#665c84`, 600 `#4d4466`, 700 `#38314c`, 800 `#261f3a`, 900 `#17122c`
- **Accent color (orchid pulse)** — light `#cbabff`, default `#ac81ff`, dark `#8149e0`, glow `#ddc6ff`
- **Secondary accent** — none. One orchid pulse carries all emphasis.
- **Background** — page bg `#17122c` (deepest night, left "tired-world" field), card/right-field bg `#201a34`, raised surface `#2a2246`
- **Text colors** — primary `#f2edfb`, secondary `#c6bce0`, muted/micro `#a99ec9`

### 2. Typography
- **Hero phrase rendering** — `display` (Unbounded) at the `hero` ramp step, `clamp(72px, 9vw, 128px)`, set in three short returns: "I rebuilt / myself / overnight." with the word **overnight** carried in the orchid accent (`accent`) — the blocky geometric letterforms read as things assembled block by block. The phrase bleeds full-width, crossing the two-equal split diagonally so it bridges the tired-left and defiant-right.
- **Type treatment** — Butler's deck at `2xl` (the tired-world thesis). Section heads / signal labels at `lg`. Body and cataloged rows at `base`, held to 60–68ch, leading 1.5–1.6. Micro labels and stamps at `xs`/`sm` in `textFaint`. At least one mid-register element per zone (a `2xl` standfirst, an `lg` head) so no page jumps title-to-body.

### 3. Layout Specification
- **Composition** — `two-equal / diagonal / right-weighted / full-bleed / dense / even / footer-only / field-dominant / split-to-sequence`. Two equal violet fields (deeper night left, brighter right) hold a two-part argument: left is the exhausted internet as evidence, right is the site's rebuilt log; the diagonal reading path and right-weighting resolve the page on the defiant answer, against reading direction.
- **CSS grid structure** — `display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh;` hero phrase absolutely positioned across both columns on a diagonal baseline.
- **Major dimensions** — hero field `min-height: 100vh`; no sidebar (footer-only shell); `max-width: none`, side padding `clamp(28px, 5vw, 88px)`; section spacing on the chassis rhythm base.
- **Nav placement** — footer-only band, full width, `~120px`, hairline top rule: horizontal-sm lockup left, three uppercase links right.
- **Hero phrase grid zone** — spans rows 1–4, columns 1–2 (full bleed), bridging the split; intended ~128px at 1440, bleeding top and bottom.

### 4. Component Character
- **Border radius** — cards/panels 3px, buttons 3px, tags 2px, mark full. Corners stay hard (standing complaint).
- **Border treatment** — hairlines via `border` inside dark fields, `fieldBorder` inside the flooded violet plane; `borderStrong` for the section break above the footer.
- **Shadow** — none. Depth comes from surface lightness (drench dark-mode logic), not shadow.
- **Density** — dense on the left evidence field (packed signal rows at an even interval), spacious around the right statement.
- **Interactive states** — links shift `textMuted → accent` on `_hover`; no underlines except nav on hover.

### 5. Signal Integration
- **Signal home** — the left "exhausted internet" field: Butler's line as the anchor deck, then the burnout sidebar note, the "a year to fix security" HN line, and SPY 770.19 (−0.39%) as tired-world evidence rows.
- **Sports score** — Tigers 5–4 win lives in the right "rebuild log" as the one bright fact: `lg` tabular figure in `accent`, labeled DETROIT · W 5–4, the day's single triumph beside the statement.
- **Quote** — Butler's "Life is one long process of getting tired." set as the `2xl` deck under the left field head — supporting the hero, never the hero (avoids a back-to-back quote lane).
- **Holiday** — none today; omitted.
- **Music** — My Morning Jacket / Tobin Sprout in the footer colophon as ON ROTATION, taste not event, never beside the market line.
- **Weather / moon** — clear 63.9°F Aldie and the waning-crescent (8%) as micro stamps in the right log — near-new moon reinforces the overnight conceit.

## Self-Check
1. Hero quotability: Yes — "I rebuilt myself overnight." is a screenshot-worthy first-person machine flex, not descriptive copy.
2. Because-of chain: Yes — split argument, diagonal right-weighting, blocky Unbounded, violet drench and footer shell all trace to the phrase and its irony.
3. Render feasibility: Yes — four words at clamp(72–128px) across a full-bleed field render without overflow at 1440×900.
4. Canvas floor feasible: Yes — dense left evidence + field-dominant drench fills 82%.
5. Phone: Yes — split-to-sequence stacks the fields; hero at 3xl lands "overnight." on its own line inside the first fold without cutting a word.

## Rationale
The phrase came out of the day's densest lane — not a score, a burnout convergence. Three sidebar essays on lost agency and exhaustion, a Hacker News feed of security dread, and Samuel Butler's "Life is one long process of getting tired." all point one way, and the single true counter-fact this portfolio owns is that it demolishes and rebuilds itself every night. So the machine speaks: "I rebuilt myself overnight." — a first-person flex answering the tired internet, the same productive irony as the fairway split (the word for smallness rendered biggest). That decides the composition: a two-equal split where the left field is the exhausted world as evidence and the right is the rebuilt log, the two halves needing each other, with the marquee bleeding diagonally across both to bridge them, mass resolving right on the answer.

Chassis follows the payoff word, *rebuilt*. Unbounded is a blocky, expanded geometric display — letters that read as assembled blocks, confident and modern-loud, exactly the register a defiant construction claim wants — paired with Figtree, a warm geometric-adjacent grotesk that shares its skeleton for the dense evidence rows (answering the standing display/body-skeleton complaint). It sits outside the three recently-worn chassis and is not one of the condensed-caps trio I'm warned against defaulting to, and its 122px+ hero carries four words at marquee without shouting them off a billboard.

The palette commits one hue at volume. The warm 40–80° corridor is exhausted by recency and the forbidden zones close everything but green and violet, so I take 265° — the color of overnight, the hours the site actually works in. Drench is the formula (fresh against the recent light-ground/split-field/duotone run and the honest answer for a single-hue flood): a deep violet ground, deeper on the tired-left field, brighter on the rebuilt-right, one orchid pulse carrying the word *overnight* and the Tigers' lone bright 5–4 win. On a violet drench the green-and-blue mark would fight the field, so the lockup is single-color; the shell is footer-only so the poster field stays pure while the real circular mark still renders (never a gray box); corners stay hard; and every signal from the near-new moon to the My Morning Jacket rotation lands as tabular texture in one of the two fields, subordinate to the type, which is the image.
