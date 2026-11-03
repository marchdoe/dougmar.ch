# Signals Brief — 2026-11-03

## Hero Copy
Four holes in one. The scorecard is the first experiment.

## Hero Rationale
This is one of Doug's own lines, and it carries today because the live golf signal (VidantaWorld Mexico Open, Andrew Novak closing at -25) puts a scorecard on the table, and Doug's answer to a scorecard is to turn it into product: TeeTurn in 2020, 15th Club in 2025. The line lets the work index lead with golf threading through it, a real number (four) and a real claim (the scorecard started the experiments), not a slogan. It beats a third Detroit scoreboard in a row, which the last two heroes already spent. Owner's voice: it's already one of my lines, four holes in one is a real number and the scorecard really was the first thing I turned into a product.

## Archetype
a foundry specimen of the work, scorecard-red, the aces circled

## Composition
columns: masonry
axis: horizontal
symmetry: right-weighted
hero_zone: interleaved
density: crowded
rhythm: accelerating
shell_posture: marginal
field_ratio: type-dominant
collapse: rail-to-band
hero_object: list

## Composition Rationale
The phrase is a standfirst, not a marquee, so the work index earns the scale and the page becomes a foundry specimen of Doug's seven projects, packed masonry, titles as texture, exactly what the starting tuple described. I moved `hero_zone` off the mandate's `full-bleed` to `interleaved` because full-bleed means the hero owns the whole first screen alone, which would stop the work index from leading; interleaved lets the two sentences bracket the index instead. I moved `collapse` off `split-to-sequence` to `rail-to-band` because there is no split field to sequence, the marginal rail is what collapses, so rail-to-band is the honest 360 strategy. Alignment is `right` though the mandate discourages it, because the only non-discouraged value is `justified`, which the owner has forbidden outright, and right serves the right-weighted index the FLOOR 2026-10-17 reference set.

## Mobile
carrier: The work index stacks full-width as a single ruled column, the standfirst phrase heading it and its closing line under the last project, the left rail having become a top band.
first_fold: The standfirst "Four holes in one. The scorecard is the first experiment." at 2xl, then the first project title, 15TH CLUB.
order: nav band (mark + 01/02/03), phrase standfirst, work index, timeline and capabilities, site callout, scarlet colophon
hero_step_360: 2xl
nav_360: The left rail folds to a full-width top band: mark top-left, 01 Work 02 About 03 Contact as a numbered row of 44px targets beneath it.

## Chassis
hanken-solo

## Visual Specification
### 1. Color Specification
- **Primary hue**: 14° (ace vermilion). It is the color a hole-in-one is circled in on a paper scorecard, and it reads completely apart from the green that has carried five recent golf-adjacent builds.
- **Neutral palette** (warm sand, light mode): 50 `#FCFAF3` is not used; the scale is 50 `#FAF5EC`, 100 `#F2EAD9`, 200 `#E6DAC4`, 300 `#D2C2A5`, 400 `#A8956F`, 500 `#6E5F46`, 600 `#574A37`, 700 `#3A3021`, 800 `#241D12`, 900 `#15100A`.
- **Accent color**: light `#C63C12`, dark `#DB4E24`, darker/glow `#882709`, lighter glow `#E87E57`.
- **Secondary accent**: none. One committed vermilion.
- **Background**: page bg cream `#FAF5EC` (dark `#15100A`); card/surface `#F2EAD9` (dark `#3A3021`); band bgAlt `#E6DAC4` (dark `#241D12`).
- **Text colors**: primary `#15100A` (dark `#F2EAD9`); secondary `#574A37` (dark `#D2C2A5`); faint `#6E5F46` (dark `#A8956F`).

### 2. Typography
- **Hero phrase rendering**: Hanken Grotesk `display`. Because `hero_object` is `list`, the phrase sits one step down as a standfirst at `3xl` (fluid clamp, roughly 40–64px at 1440), small-caps, right-aligned, bracketing the work index: "Four holes in one." heads the index, "The scorecard is the first experiment." closes beneath it. The project titles, not the phrase, take the marquee step.
- **Type treatment**: project titles at `hero`/`5xl`/`4xl` descending (accelerating, masonry differing heights). Years and roles as `sm`/`xs` labels in textFaint. A mid-register `lede`/`xl` standfirst sits between title and labels on each row so no row jumps from marquee straight to micro. Body (timeline, capabilities) at `base`, measure held 60–68ch, leading from the ramp. One family, three weights: the display face answers its own body by construction, no skeleton mismatch.

### 3. Layout Specification
- **Composition**: `masonry / horizontal / right-weighted / interleaved / crowded / accelerating / marginal / type-dominant / rail-to-band / list`. The phrase is a standfirst, so the work index earns the scale and packs as a specimen; the phrase brackets it top and bottom (interleaved), mass gathering right the way the FLOOR 2026-10-17 index set POLITWEETS huge and right-aligned.
- **CSS grid/flex structure**: outer `display: grid; grid-template-columns: 96px 1fr` (left rail + field). Field `display: grid; grid-template-columns: repeat(12, 1fr); column-gap: 24px` with project blocks spanning varied column counts and heights for the masonry pack.
- **Major dimensions**:
  - Hero/index first band: `min-height: 92vh`.
  - Left rail: `width: 96px` at 1440.
  - Max content width: `max-width: none; padding: 80px 5vw 80px 0` (full-width specimen, not a centered column).
  - Section padding: 80px top band, shrinking to 40px between the last packed rows (accelerating).
- **Nav placement**: left rail (marginal), full height, mark at top, numbered index below. See Header.
- **Hero phrase grid zone**: standfirst "Four holes in one." rows 1–2, columns 6–12 (right-weighted); closing line "The scorecard is the first experiment." rows 11–12, columns 7–12, right-aligned, after the packed titles.
- **Home callout slot**: `<SiteCallout />` sits on `/` below the work index + timeline/capabilities section and above the scarlet colophon footer, in today's bgAlt. I place it; I write none of its copy.

### 4. Component Character
- **Border radius**: 0 on the index rows and labels; 2px on any tag; the circular mark is the only curve (it is fixed). Owner has rejected rounded brand corners, so the chrome stays crisp.
- **Border treatment**: hairline rules between index rows, `border` (`#D2C2A5`); section breaks `borderStrong` (`#A8956F`).
- **Shadow**: none. Depth comes from value and the rules, not shadow.
- **Density**: crowded, packed to the edge of legibility, treated as texture.
- **Interactive states**: index row hover tints the title to accent and slides the year label 8px toward it; links underline on hover.

### 5. Signal Integration
- **Where signal elements live**: the scarlet colophon flood at the foot (field token), reversed out.
- **Sports scores**: Lions 19-15, Red Wings 5-3, Pistons 124-91 set as tabular figures in fieldInk inside the flood, one ruled row, scores emphatic, labels in fieldInkMuted. The Pistons' 33-point margin gets the largest figure.
- **Golf**: Mexico Open, Novak -25, set beside the scores; the hero's "four holes in one" is the human counterpart to the tournament line.
- **Quote**: James Allen's line is a footnote in the colophon tail, attributed small (fieldInkMuted). It is not the hero.
- **Holiday elements**: none today.
- **Music**: My Morning Jacket and Tobin Sprout named once in the colophon as "in rotation," in fieldInkMuted, not dated beside a score.
- **Market**: SPY 752.10, down 0.48%, one figure in the colophon row.

## Self-Check
1. Hero quotability: Yes — "Four holes in one. The scorecard is the first experiment." is a self-contained flex plus thesis, screenshot-worthy without context.
2. Because-of chain: Yes — a work-leading standfirst drove list object → masonry specimen → single-voice Hanken index → vermilion ace-red on cream → left-rail marginal shell.
3. Render feasibility: Yes — Hanken project titles clamp to 120px (under its 128px hero) and the standfirst sits at `3xl`, no overflow at 1440×900.
4. Canvas floor feasible: Yes — seven projects plus timeline and capabilities packed crowded fill 82% of the viewport easily.
5. Phone: Yes — standfirst at `2xl` lands both sentences inside the first 640px above the first title, no cut word.

## Rationale
The hero is one of Doug's own lines, "Four holes in one. The scorecard is the first experiment." It is a claim and a number, not a scoreboard, and today's live golf signal (the Mexico Open closing at -25) gives it a reason to lead while sidestepping a third straight Detroit hero. Because the phrase is a standfirst and not a shout, the work has to be the biggest thing on the page, so the object is `list`: the project titles lead, packed as a foundry specimen, with the two sentences bracketing them top and bottom.

That decision chooses the rest. A specimen of seven projects wants one committed voice doing display and labels and body alike, so the chassis is Hanken Grotesk alone, which also answers the owner's standing complaint that display and body must share a skeleton. It sets the titles at marquee and the standfirst a step below, small-caps and right-aligned the way the FLOOR 2026-10-17 index set its project titles huge against the right edge. The palette is vermilion on cream because the scorecard is a paper object and an ace is circled in red; it reads apart from the five greens the recent window already spent on golf, which is why I leave the mandate's 140-180 target and say so in the color story.

Layout follows: a marginal left rail carries the mark-only mark and a numbered nav whose 01 02 03 echo scorecard holes, the field stays type-dominant with no texture because type is the image here, and the day's signals flood out of a single vermilion colophon at the foot, a field reversal the recent shells all avoided. Nothing moves on load, the one non-recent entrance and the right call for a specimen that arrives whole, while sections rise on scroll to give the packed index life as it enters.
