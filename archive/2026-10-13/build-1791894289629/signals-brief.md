# Signals Brief — 2026-10-13

## Hero Copy
It is not as important how we start, but how we finish.

## Hero Rationale
This is `signals.quote` (Joyce Meyer), and today's signals are a page full of finishes: the Lions closed out 45-21, Michael Brennan finished the Baycurrent Classic at 16 under, the moon is barely two days into its cycle. The quote lane is the preferred one and this quote carries because the day agrees with it. Doug judges work by the finish, not the pitch: buildable before the first line of code, faithful after the last. Owner's voice: Doug lives by the finish, a score is a score and a ship is a ship, and he'd point at a 45-21 blowout and a tournament won and say the same thing about shipping.

## Archetype
an orbit chart, the finish at dead center and the day's finishes circling it

## Composition
columns: masonry
axis: radial
symmetry: symmetric
hero_zone: full-bleed
density: crowded
rhythm: syncopated
shell_posture: footer-only
field_ratio: field-dominant
collapse: hero-only
hero_object: statement

## Composition Rationale
"How we finish" names a destination, so the finish sits at dead center as the gravitational anchor and the day's actual finishes (Lions 45-21 nearest, the Baycurrent win mid-ring, a down market furthest) orbit it at distances read as significance — radial is the one axis that renders that literally. I moved columns onto `masonry` (off the suggested two-asymmetric) because orbiting tiles want irregular packing, and `rhythm` onto `syncopated` because satellites at varying radii are the opposite of an even interval; I moved `collapse` onto `hero-only` (off rail-to-band) because there is no rail here and the phone wants the finish line to lead alone. Symmetric and full-bleed stayed because a centered radial genuinely balances about its center and the field should fill edge to edge.

## Mobile
carrier: At 360 the centered finish statement alone carries the first fold; the orbit collapses to a vertical stack of signal tiles below it, ordered nearest-finish first.
first_fold: The hero phrase at `3xl`, centered, with the cream mark top-left; nothing else inside the first 640px.
order: hero, Lions 45-21 tile, golf tile, weather tile, market tile, site callout, foot band
hero_step_360: 3xl
nav_360: No top bar; the foot band's vertical index and stacked mark hold the nav, mark repeated top-left of the hero.

## Chassis
anybody-franklin

## Visual Specification
**1. Color Specification**
- **Primary hue**: 48° (burnt gold). Fall, a clear 56°F afternoon, and a day of decisive finishes want a warm triumphant single hue, and 48° sits squarely inside the 40–80° mandate while stepping off the recent 44° saffron and 36° burnt amber by pushing to a deeper, more roasted gold.
- **Neutral palette** (roasted amber-brown): 50 `#F7F1E6`, 100 `#EADCC4`, 200 `#D4BE96`, 300 `#B99C68`, 400 `#9A7D44`, 500 `#78602E`, 600 `#5E4A20`, 700 `#45300F`, 800 `#35250B`, 900 `#241904`
- **Accent color** (gold): light `#EFC056`, default `#E6A82A`, dark `#A06B0C`, glow `#EFC056`
- **Secondary accent**: none. One hue carries the page at volume.
- **Background**: page bg `#45300F`, card/surface `#5E4A20`, second ground `#35250B`
- **Text colors**: primary `#F7F1E6`, secondary `#D4BE96`, muted `#B99C68`

**2. Typography** (chassis: anybody-franklin, wide squarish grotesk + Libre Franklin)
- **Hero phrase rendering**: `display` face at the `hero` ramp step, capped by MEASURABLES at `clamp(38px, 6vw, 92px)`. Caps, roman, heavy, centred on the field — the phrase wraps to four or five lines and sits as the gravitational anchor at the optical center. Libre Franklin answers the wide grotesk's construction for every supporting line (shared skeleton).
- **Type treatment**: hero at `hero`; the Lions figure `45-21` at `4xl` (the one poster figure besides the hero); orbit tile labels at `xl`/`2xl`; deck and body at `lg` (held to 60–68ch, leading 1.5); captions and attribution at `sm`; micro metadata at `xs`, never below 12px. The middle of the scale is spent: a `4xl` figure and `2xl` tile heads sit between the hero and the body so no page jumps from marquee to small.

**3. Layout Specification**
- **Composition**: masonry / radial / symmetric / full-bleed / crowded / syncopated / footer-only / field-dominant / hero-only / statement. The finish is the center of gravity; the day's finishes orbit it at distances read as significance, which is exactly what a radial field with the statement at dead center does for a line about finishing.
- **CSS grid/flex structure**: `display: grid; place-items: center; min-height: 100vh` for the hero field, with signal tiles absolutely positioned on concentric radii at ≥1024px and a `grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))` masonry fallback below that.
- **Major dimensions**:
  - Hero field: `min-height: 100vh`, full-bleed
  - Max content width: `max-width: none`; `padding: 7vh 6vw`
  - Central statement block capped at ~22ch so it wraps tall, not wide
  - Section padding: 7vh vertical, 6vw horizontal
- **Nav placement**: footer-only. The nav lives as a vertical index in the foot band (Work / About / Contact, one rule per row).
- **Hero phrase grid zone**: the optical center of the first viewport, a centered column ~22ch wide, rows spanning the middle third, at `clamp(38px, 6vw, 92px)`.
- **Home callout slot**: on `/`, place `<SiteCallout />` below the radial orbit section and above the footer nav band, between the signal orbit and the footer. No copy or styling from me.

**4. Component Character**
- **Border radius**: cards 4px, buttons 4px, tags 2px. Tight, grounded, athletic.
- **Border treatment**: hairlines in `border`; the strong orbit-ring rule and foot rule in `borderStrong`.
- **Shadow**: none. Depth comes from surface lightness (surface is lighter than bg).
- **Density**: crowded in the orbit ring, airy at the center.
- **Interactive states**: links in `accent`, hover to `accentAlt` with a 2px underline offset; tiles lift 2px on hover.

**5. Signal Integration**
- **Where signal elements live**: the orbit ring around the hero; nearest/largest is the decisive finish, furthest/faintest is the non-finish.
- **Sports scores**: Lions `45-21` is the nearest tile, set on the gold `field` plane, `fieldInk` dark, figure at `4xl` — the biggest orbiting object. Caption "Lions 45-21. Win."
- **Golf**: a mid-distance tile. "Baycurrent Classic, final. Michael Brennan, 16 under." with runners "Keith Mitchell and Jacob Bridgeman, 15 under." at `sm`.
- **Weather / air**: a smaller tile. "Aldie, clear. 56°F. Air good."
- **Market**: furthest, faintest tile in `textFaint`. "SPY 778.10, down 0.06%." A down day is not a finish worth lighting.
- **Quote**: it IS the hero; "Joyce Meyer" renders as the attribution caption at `sm` directly beneath the centered line.
- **Music**: rotation, so it sits quiet in the foot band as taste, not an event. "In rotation: Radiohead, My Morning Jacket."
- **Moon**: foot band. "Waxing crescent, 9% lit."

## Self-Check
1. Hero quotability: Yes — a complete attributed aphorism, screenshot-ready in isolation.
2. Because-of chain: Yes — finish-as-anchor drove radial center, which drove the orbiting-finishes signal treatment, the warm triumphant gold, and the full-bleed field.
3. Render feasibility: Yes — 92px cap sits well under anybody-franklin's 160px ceiling; 12 words centered wrap to ~5 lines in a 22ch column without overflow.
4. Canvas floor feasible: Yes — a full-bleed amber-brown field with a crowded orbit ring clears 80%.
5. Phone: Yes — hero-only first fold sets the phrase at `3xl` (~40px), ~6 wrapped lines plus the mark land inside 640px with no cut word.

## Rationale
The phrase is Joyce Meyer's line about finishing, and the day handed it three real finishes: a Lions blowout, a tournament won at 16 under, a market that just slipped. So the composition makes the finish the thing everything revolves around. The statement sits at dead center of a full-bleed field and the day's finishes orbit it at radii that mean significance, the decisive win nearest and largest, the down market furthest and faintest. Radial is the only axis that renders "how we finish" as a destination rather than a sequence.

anybody-franklin carries it because the signals are athletic and the register is confident, not fashion-elegant: a wide squarish grotesk set in heavy caps reads like a scoreboard, and Libre Franklin answers its construction for every tile, caption and the foot index so the body never reads as a default page pasted under a poster. It is off the recent-three chassis, and its width gives the centered marquee presence without reaching for another condensed-caps face.

The palette commits one hue at volume: a roasted amber-brown ground with a single burnt gold turned on for the wins. Triumph wants a saturated single hue, so there is no second accent; the Lions figure gets the one bright gold plane, the down market gets the faintest ink. Duotone and mesh keep it off the recent light-ground/drench/dark-void formulas, and the mesh blooms drift slowly so the gravitational center quite literally breathes. The single-color cream mark sits top-left of the field where it clears the ground, and the nav defers to a foot index so nothing competes with the finish at the center.
