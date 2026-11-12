# Signals Brief — 2026-11-12

## Hero Copy
Cut what doesn't matter. Ship what's left.

## Hero Rationale
Composed from two of today's signals that say the same thing: the Ueshiba line about losing the desire for things that do not matter, and the reading-list piece arguing that software is now closer to sculpture, where the hard part is seeing what to keep. I turned that into a working rule about Doug's own practice, two short imperatives with no adjectives, and it sets up a page where the work that is left is the largest thing on it. Lane is composed, yesterday's was signal-event, so no streak.
Owner's voice: I say what a thing does. Most of my job is deciding what comes out of a design before it gets built, then shipping the rest.

## Archetype
a mulberry work ledger, biggest first, one row lit mint

## Composition
columns: three
axis: horizontal
symmetry: left-weighted
hero_zone: edge-bound
density: measured
rhythm: accelerating
shell_posture: marginal
field_ratio: field-dominant
collapse: rail-to-band
hero_object: list

## Composition Rationale
"Ship what's left" makes the work index the object, so `hero_object` moves off statement to `list`, with the phrase as its standfirst. `shell_posture` moves to `marginal` because a left rail has not shipped in the window and it gives `rail-to-band` a real rail to collapse. `symmetry` moves onto the discouraged `left-weighted` because a ledger has to hang off one left edge, which is also a standing owner rule. The remaining starting values stay because the idea needs them: horizontal rows, a waterfall that speeds up as titles shrink, three tracks (rail, title, meta), and a mint band that runs off the right edge.

## Mobile
carrier: The mint Spaceman band running full-bleed directly under the hero phrase, followed by titles that step down in size, carries "what's left, biggest first" in one column.
first_fold: The header band with the mark and nav sentence, the eyebrow, the hero phrase "Cut what doesn't matter. Ship what's left." at 2xl, the deck, and the top of the mint Spaceman band.
order: header band, eyebrow, hero phrase, deck, Spaceman mint band, work ledger rows, site callout, day ledger, footer row
hero_step_360: 2xl
nav_360: The rail becomes a full-width dark band at the top, with the 40px mark at left on the first row and the nav sentence at sm on the second row, each link a 44×44 target.

## Chassis
anybody-franklin

## Visual Specification
## 1. Color Specification

- **Primary hue**: 304° mulberry. The open band in the mandate is 288–352°, and a deep red-violet matches a 4:52 sunset in November. It is dark enough that the original brand mark passes on it.
- **Second hue**: 150° mint. It is the only other colour on the page. It is the ink on mulberry and the flood behind the first ledger row.
- **Mulberry scale**: 50 `#FBEFFA`, 100 `#F6DDF3`, 200 `#EDBDE8`, 300 `#E09ADA`, 400 `#C95FC0`, 500 `#A8369E`, 600 `#86267E`, 700 `#661B60`, 800 `#4A1246`, 900 `#2E0A2C`
- **Mint scale**: 50 `#EEFDF5`, 100 `#D3F9E5`, 200 `#A9F2CC`, 300 `#74E6AD`, 400 `#42D48C`, 500 `#22B870`, 600 `#17935A`, 700 `#137349`, 800 `#115B3B`, 900 `#0C3D28`
- **Neutral palette (plum)**: 50 `#F8F2F7`, 100 `#EDE2EC`, 200 `#D9C7D7`, 300 `#BFA6BC`, 400 `#A0839D`, 500 `#806380`, 600 `#644B64`, 700 `#4B374B`, 800 `#332433`, 900 `#1F151F`. It is declared for completeness. No large plane uses it, because the page is duotone.
- **Accent color**: light `#A9F2CC`, default `#74E6AD`, dark `#22B870`, glow `#D3F9E5`
- **Secondary accent**: none beyond the mint. `accentAlt` is `#42D48C`, used for link hover only.
- **Background**: page bg `#4A1246`, rail bg (bgAlt) `#2E0A2C`, raised or hover plane (surface) `#661B60`, flooded field `#74E6AD`
- **Text colors**: primary `#D3F9E5` (12.6:1 on bg, 9.8:1 on surface), secondary `#EDBDE8` (8.6:1 on bg), faint `#E09ADA` (6.4:1 on bg, 5.2:1 on surface). On the mint field: ink `#2E0A2C` (11.4:1), muted ink `#661B60` (7.2:1).
- **Rules**: `border` `#86267E` hairlines on mulberry, `borderStrong` `#74E6AD`, `fieldBorder` `#4A1246` inside the mint band.

## 2. Typography (anybody-franklin)

- **Hero phrase (h1)**: `display` face, textStyle `2xl`, caps, italic, heaviest loaded weight, colour `text`. Two lines at 1024 and up, one sentence per line, with a hard break after "MATTER." Below 1024 it wraps freely with `text-wrap: balance`. It is the page's only h1.
- **The object (work ledger titles)**: `display` face, caps, italic, heavy, stepping down the ramp row by row. Spaceman is set at `hero`, FishSticks and 15th Club at `4xl`, dougmar.ch at `3xl`, TeeTurn, Politweets and Twittertale at `2xl`. Each title is an h2 inside a link. Titles never wrap and never clip: `white-space: nowrap` on a `min-width: 0` track.
- **Deck**: body face, textStyle `lede`, colour `textMuted`, max-width 52ch.
- **Eyebrow and ledger meta**: body face, textStyle `xs`, uppercase, `textFaint`, tabular numerals. Nothing under 12px.
- **Mid register**: the Ueshiba pull quote is display italic at `xl`, mixed case. The day-ledger values are display at `lg`.
- **Body**: body face, textStyle `base`, measure capped at 65ch on every route.
- **Label spacing**: every small label carries at least twice the space above it as below it.

## 3. Layout Specification

- **Composition**: three / horizontal / left-weighted / edge-bound / sparse / accelerating / marginal / field-dominant / rail-to-band / list. A dark rail carries the shell. The work index is the hero object and hangs off one left edge. Row sizes shrink down the page, so the biggest thing left standing is the first project.
- **Grid (≥1024)**: `display: grid; grid-template-columns: 220px minmax(0, 1fr) 300px; max-width: none`.
  - Column 1 is the rail: `bgAlt`, full page height, with a 1px `border` rule on its right edge.
  - Columns 2–3 are the content, padded `48px 4vw 96px`. Everything in them hangs from one left edge, the column 2 start.
  - Ledger rows are their own grid, `grid-template-columns: minmax(0, 1fr) 300px; align-items: baseline`, with the title in track 1 and the meta in track 2, left-aligned at the track start.
- **Hero zone (columns 2–3, top)**, in this order:
  1. Eyebrow: "Thursday, November 12. 44°F, partly cloudy. Aldie, Virginia." 32px gap below.
  2. h1: "Cut what doesn't matter. Ship what's left." at `2xl`, about 56px at 1440, two lines.
  3. Deck, 20px below: "Seven projects, 2008 to 2026. I designed and built each one. Biggest first."
  4. 56px gap, then the ledger.
- **Work ledger (the object)**:
  - Row 1, Spaceman: flooded `field` mint. It bleeds from the column 2 left edge to the right viewport edge, using a negative right margin equal to the content padding. Padding `40px 4vw 36px 32px`, with a negative left margin of 32px so the title still sits on the shared left edge. Title `SPACEMAN` at `hero` (128px at 1440) in `fieldInk`. Meta track in `fieldInkMuted`: "2018", "Founder", then the client set in body `sm`, one per line: Zeldman, Rolex, The Nature Conservancy, Intuit, LastPass. Min-height 240px.
  - Rows 2–7 sit on `bg` with a 1px `border` top rule each. Title in `text`, meta in `textFaint` (year, then kind). Vertical padding shrinks with the type: 32px for `4xl` rows, 24px for `3xl`, 16px for `2xl`.
  - A whole row is one link to `/work/<slug>`.
- **First fold at 1440×900** (the fold starts 44px lower under the site rail): eyebrow, h1, deck, the full mint Spaceman band, and the FishSticks row. About 75% of the canvas is occupied.
- **Section order on `/`**: hero zone, work ledger, `<SiteCallout />`, day ledger, footer.
- **Home callout slot**: `<SiteCallout />` sits in columns 2–3 between the work ledger and the day ledger, with 96px above and below.
- **Day ledger**: same two-track row grid, 1px `border` rules, label in track 2 and value in track 1. See section 5.
- **Nav placement**: the left rail. The header block is the top 320px of the rail, padded `32px 24px`, sticky at `top: 0`. The mark is 48px at the top, with the nav sentence 40px below it. At the foot of the rail, in `sm` `textMuted`: "Doug March. Product designer and developer. Ashburn, Virginia."
- **Inner pages (`/about`, `/work/*`)**: same rail. The title is at `4xl` caps italic, with a standfirst at `xl` beneath it so the middle of the scale is used. Body is at `base` in a 65ch column in column 2. Column 3 carries year, role and client set, or the capabilities list on `/about`, so the third track is never empty. No running copy above the `lede` step.

## 4. Component Character

- **Border radius**: 0 on everything. `full` is reserved for the brand mark's own geometry.
- **Borders**: hairline 1px `border` between rows. A single 2px `borderStrong` rule heads the day ledger. `fieldBorder` is used inside the mint band.
- **Shadow**: none.
- **Density**: spacious at the top, tightening as rows shrink.
- **Interactive states**: a ledger row on hover or focus takes `surface` as its background and its top rule turns `borderStrong`, with a 120ms colour transition only. The Spaceman band on hover swaps its title ink to `fieldInkMuted`. Text links are underlined in `accent`, 2px, offset 4px, and go to `accentAlt` on hover. Focus-visible is a 2px `accent` outline, offset 3px.

## 5. Signal Integration

All signals live in the day ledger below the callout, under the heading "Thursday" (h2, display caps italic, `3xl`). Rows in order:

- **Weather**: "44°F, partly cloudy". Meta: "Aldie, Virginia. Humidity 93%. Wind S 2 mph."
- **Sun**: "Sunset 4:52 PM". Meta: "9.9 hours of daylight."
- **Moon**: "Waxing crescent, 12%".
- **Market**: "SPY 759.81, up 1.32%". The figure is in `accent`, tabular.
- **Golf**: "Austin Championship". Meta: "Scheduled. No leaders yet."
- **Detroit**: "No scores today." Meta: "Lions, Tigers, Pistons, Red Wings." It is stated plainly at the same weight as the other rows, with no scoreboard treatment because there is no score.
- **Hacker News**: "Tim Peters, 1952–2026". Meta: "He wrote the Zen of Python. Top story, 1,257 points." It gets one quiet row and no accent.
- **Quote**: a pull quote after the rows, display italic `xl`, mixed case, `text`, max-width 28ch: "When you lose your desire for things that do not matter, you will be free." The attribution "Morihei Ueshiba" sits directly beneath in `xs` caps `textMuted`. It is not the hero.
- **Reading**: the five sidebar links as a plain list at `base`, title linked, source in `textFaint`. "By taking away" goes first because it shares the day's idea. The engineer pulls the URLs from the signals data.
- **Music**: one row labelled "In rotation", value "Tobin Sprout, Guided by Voices". The label says rotation and the row sits last, apart from the dated facts.
- **Holidays**: none today, so no row.

## 6. Phone (360)

- The rail becomes a full-width `bgAlt` band at the top: mark 40px at left, nav sentence at `sm` on the row beneath it. Each link is `inline-flex`, min 44×44. The band is about 120px tall.
- The row grid drops to one column, with the meta beneath the title at `xs`.
- h1 is at `2xl`.
- Title steps: Spaceman at `3xl`, FishSticks, 15th Club and dougmar.ch at `2xl`, the three experiments at `xl`. No title wraps or clips at 328px.
- The mint band goes full-bleed.
- The identity line from the rail foot moves into the footer.

## Self-Check
1. Hero quotability: Yes — two imperatives, seven words, readable with nothing around them.
2. Because-of chain: Yes — cutting gives a duotone with no neutrals, no texture and no motion, and "what's left" gives the work index as the object, biggest first.
3. Render feasibility: Yes — SPACEMAN at 128px is about 670px wide in an 800px track, and the h1 at `2xl` sets one sentence per line inside 1100px.
4. Canvas floor feasible: Yes — rail, hero zone, a 240px mint band and the next row fill about 75% of 1440×900.
5. Phone: Yes — band 120px plus the h1 at `2xl` in five short lines lands by about 420px, and the longest word, DOESN'T, fits 328px.

## Rationale
The phrase is "Cut what doesn't matter. Ship what's left." It comes from the Ueshiba quote and the reading-list piece about software as sculpture, put in Doug's terms. The second sentence promises something, so the page shows what's left: seven projects, set as the largest object, biggest first. That makes it a `list` day. The phrase sits above the list as a standfirst h1 at `2xl`, and the first project title takes marquee scale. Row sizes step down the ramp from `hero` to `2xl`, which is where the accelerating rhythm comes from. It is the terracotta specimen's type waterfall applied to work titles.

A ledger has to hang off one edge, so the shell moves out of the way into a left rail. That placement has not shipped in the window and it avoids the rejected top bar. The rail carries the mark at 48px in original colours on the darkest mulberry, and a one-sentence nav. The chassis is anybody-franklin, which has not shipped in fourteen builds. Wide heavy italic caps make short project names read as built objects, and the italic gives "ship" forward lean without tipping into parody at `2xl`. Franklin answers Anybody's square grotesk skeleton in the body. Caps, italic and heavy are the type moves. Alignment stays left and texture stays none despite recency, because a ledger reads from one rail and a decorative texture would contradict the phrase. Motion is none for the same reason.

The palette follows the cut: two hues, no neutral plane. Mulberry at 304° takes the only band the mandate leaves open and suits a 4:52 sunset. Mint at 150° sits inside the mandate's target range as the ink and as the one flooded field, the Spaceman row, which runs off the right edge. Duotone is off the recent-formula list, and no ground material is used. At 360 the rail becomes a top band, the mint row goes full-bleed under the phrase, and the titles keep stepping down.
