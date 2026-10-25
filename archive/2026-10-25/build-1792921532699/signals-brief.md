# Signals Brief — 2026-10-25

## Hero Copy
Dreams have only one owner at a time. That's why dreamers are lonely.

## Hero Rationale
From `signals.quote`, William Faulkner. It beats a line about Doug's day because today has no Detroit win (the Red Wings lost) and no personal fact loud enough to carry a page, but it has a full moon at 100% illumination over a cold clear Sunday night, and this line is the exact register of ten years running Spaceman alone: every dream he's shipped, FishSticks, 15th Club, the studio itself, has had one owner, him. It reads as the solo builder's truth, not a borrowed poster. Faulkner's name renders under the quote and vertically down the rail, so the attribution is never out of view.
Owner's voice: Doug would say this because ten years independent means every vision he's carried has been his alone to carry, and he knows the quiet that comes with that.

## Archetype
a Faulkner line alone on a full-moon field

## Composition
columns: two-asymmetric
axis: vertical
symmetry: right-weighted
hero_zone: upper-left
density: sparse
rhythm: syncopated
shell_posture: standard
field_ratio: field-dominant
collapse: rail-to-band
hero_object: statement

## Composition Rationale
I moved hero_zone off the start (full-bleed) to the fresh value upper-left so the quote hangs top-left off one rail and the moon-glow gathers lower-right, the right-weighted mass sitting opposite the reading line. I took three discouraged values on fit, not laziness: density: sparse because a lonely-dreamer line on a moonlit void dies if crowded (owner gold standard 09-12: "no other furniture above the fold"); hero_object: statement because this is a quote and the quote must be the largest thing or it isn't a quote poster, and I defeat the templated feel by making it a two-sentence diptych with only its attribution for company, signals exiled to the colophon; collapse: rail-to-band because the composition genuinely has a rail (two-asymmetric meta column) and the honest phone behavior is that rail becoming a band under the quote.

## Mobile
carrier: At 360 the quote carries alone on the night field, the moon-glow still pooling beneath the trailing sentence; the right rail folds into a full-width band below it.
first_fold: "Dreams have only one owner at a time." at the 3xl step, the corner mark top-left, and the "William Faulkner" attribution.
order: hero quote, moon + attribution band (the folded rail), site callout, footer colophon
hero_step_360: 3xl
nav_360: Corner mark stays top-left; the work/about/contact sentence moves into the foot colophon.

## Chassis
spectral-albert

## Visual Specification
### 1. Color Specification
- **Primary hue**: 276° (amethyst / violet). A cold clear night under a 100%-illuminated full moon wants a cool, drenched dark, and 276° sits a clean 60°+ from every hue in the recent seven-build window (34, 46, 52, 80, 150, 212, 340). It is in the allowed 242–310 zone, deliberately off the warm 40–80 suggestion because the signal (full moon, 43°, clear night, a quiet Sunday, a loss) genuinely calls for cool stillness, not warm sun.
- **Neutral palette (night ink, violet-tinted)**: 50 `#f5f3f8`, 100 `#e8e5ee`, 200 `#cfcbd9`, 300 `#aaa4ba`, 400 `#7e788f`, 500 `#5d586f`, 600 `#443f55`, 700 `#302b40`, 800 `#1e1a2e`, 900 `#14101f`
- **Accent color (amethyst)**: light `#c69ce3`, default `#ad77d6`, dark `#8339ad`, glow `#dcc0ee`
- **Secondary accent**: none. One violet carries the whole page.
- **Background**: page bg `#14101f`, second ground `#1e1a2e`, raised surface `#2f153e`, flooded field `#4b2062`
- **Text colors**: primary `#f5f3f8` (moon silver), secondary `#cfcbd9`, muted/faint `#7e788f`

### 2. Typography
- **Hero phrase rendering**: `display` (Spectral) at the `hero` step, set `clamp(48px, 7vw, 96px)` at 1440, in the quiet literary register this chassis is built for. Two sentences stack: "Dreams have only one owner at a time." at full hero scale, then "That's why dreamers are lonely." one beat smaller at `4xl`, the word *lonely* carrying the amethyst glow (`accentAlt`). The whole thing leads in italic.
- **Type treatment**: `hero` for the quote, `4xl` for the trailing sentence, `lede` for the attribution caption and the moon/weather line in the rail, `base` for the footer colophon signals, `xs` small-caps for micro labels. No invented leading or tracking; the ramp steps carry it.

### 3. Layout Specification
- **Composition**: two-asymmetric / vertical / right-weighted / full-bleed... corrected: hero_zone upper-left; density sparse; rhythm syncopated; shell_posture standard; field-dominant; collapse rail-to-band; hero_object statement. The quote hangs upper-left off a single rail, a narrow meta rail sits right, and the amethyst moon-glow pools lower-right so visual mass gathers against the reading direction, the way a moon sits opposite the text you're reading by.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(220px, 0.45fr); min-height: 100vh`
- **Major dimensions**:
  - Hero field: `min-height: 100vh`
  - Meta rail: `width: ~30%`, min 220px
  - Max content width: `max-width: none`; side padding `clamp(28px, 6vw, 112px)`
  - Section padding: vertical rhythm from the chassis base unit; generous (sparse)
- **Nav placement**: corner mark top-left of the hero field; work/about/contact run as one quiet lowercase sentence low in the right rail, violet links on the void. Not a top bar.
- **Hero phrase grid zone**: column 1, rows 1–3 of the hero (upper-left through mid-left); the trailing sentence and attribution rows 3–4; glow fills lower-right of the field.
- **Home callout slot**: on `/`, `<SiteCallout />` sits below the hero field and above the footer colophon, between the hero and the signal footer. No copy, no styling from me.

### 4. Component Character
- **Border radius**: cards/panels `none` (0), tags `sm` (1px), nothing rounded (owner complaint).
- **Border treatment**: hairline `border`; section breaks `borderStrong` (amethyst rule).
- **Shadow**: none. Depth comes from surface lightness on the dark field, not shadow.
- **Density**: spacious / sparse. Air is the point.
- **Interactive states**: links shift `accent` → `accentAlt` on hover, no underline bar.

### 5. Signal Integration
- **Where signal elements live**: the right rail carries moon + weather above the fold; the footer colophon carries golf, Red Wings, market, music under one hairline.
- **Sports scores**: Red Wings "Red Wings fall, 1–4." in `base`, tabular-nums, muted; no celebration for a loss.
- **Quote**: the quote IS the hero phrase. Attribution "William Faulkner" in `lede` under the line and set vertically (`texture: vertical`) down the rail edge.
- **Holiday**: Halloween is 6 days out; noted as one faint `xs` line in the colophon, "Halloween, 6 days.", nothing more.
- **Music**: `signals.music` as taste, a quiet rail/colophon line "On rotation: My Morning Jacket, The War on Drugs, Tobin Sprout.", never beside a score as if it happened today.
- **Moon/weather**: "Full moon over Aldie. 43° and clear." in the rail, `lede`.
- **Market**: "SPY 759.97, down 0.52%." in the colophon, tabular-nums.

## Self-Check
1. Hero quotability: Yes — a complete, resonant Faulkner line, quotable in isolation and screenshot-worthy.
2. Because-of chain: Yes — the lonely-dreamer line drove the moonlit indigo void, the quiet literary Spectral italic, the sparse upper-left hang, and the single violet glow.
3. Render feasibility: Yes — Spectral hero clamps to 96px at 1440, two sentences stack with air on a field-dominant canvas, no overflow.
4. Canvas floor feasible: Yes — field-dominant dark-void fills the viewport with the night field and glow; 70% is easily met even while element density stays sparse.
5. Phone: Yes — at 360 the first sentence leads at `3xl` within the first fold without cutting a word; the trailing sentence follows.

## Rationale
The phrase is Faulkner's "Dreams have only one owner at a time. That's why dreamers are lonely." It won today because the signals gave no Detroit triumph (the Red Wings lost) and no louder personal fact than a full moon at 100% over a cold clear Sunday, and this line is the precise register of a man who has run Spaceman alone for ten years: one owner per dream, FishSticks and 15th Club and the studio all his to carry. It passes the test, it is his, and it reads as voice, not borrowed poster, with the attribution kept in view both under the line and down the rail.

Because the line is a reflective, slightly lonely literary sentence, the composition has to be still, not loud: sparse density, the quote hung upper-left off one rail, a right-weighted amethyst moon-glow pooling opposite it so the eye resolves against the reading direction, the way the moon sits across the field from the words you read by. That demanded the quietest literary chassis in the catalog, spectral-albert, whose display italic is exactly right for a quote and whose 96px hero is poster-enough without shouting a melancholy line into parody. Italic lead, light weight, and a vertical attribution are the type moves that pull it off the eight-days-the-same template.

The palette is the night itself: a drenched violet-black void at 276°, a clean 60°+ off every recent hue and chosen cool against the warm suggestion because a clear 43° full-moon night genuinely calls for stillness, not sun. One luminous amethyst is the single saturated color, pooling under the word *lonely* as the glow the line asks for; moon-silver ink floats on the dark. Dark-void ground (off the recent drench/light/split run), a faint dot field reading as stars, and a slow drift plus a rise entrance give the page the quiet motion the owner keeps asking for. Signals live where they belong: moon and weather in the rail above the fold, the loss and the market and Doug's own rotation (My Morning Jacket, The War on Drugs, Tobin Sprout) in a hairline colophon at the foot.
