# Design System API Reference

This is the exact API available to you. Use ONLY what is documented here.

## Styled Components (from `../../styled-system/jsx`)

Available components: `Box`, `Flex`, `Grid`, `Stack`, `VStack`, `HStack`, `Container`, `Center`, `Divider`, `Spacer`, `VisuallyHidden`, `styled`

### `styled()` factory, create custom styled components:
```tsx
const Card = styled('div', {
  base: { padding: '4', background: 'surface', borderRadius: '8px' },
  variants: {
    size: {
      sm: { padding: '2' },
      lg: { padding: '6' },
    },
  },
})
```

### Layout component props:

{{PATTERN_PROPS}}

**All components** also accept CSS props directly: `fontSize`, `color`, `padding`, `margin`, `background`, etc.

## CSS Function (from `../../styled-system/css`)

```tsx
import { css } from '../../styled-system/css'
const className = css({ display: 'flex', gap: '4', color: 'text' })
<div className={className}>Content</div>
```

## Content Data: Exact Exports

### `../content/projects` (from components) or `'../content/projects'` (from routes)
```typescript
type Client = {
  name: string
  logo?: string        // root-relative path under /clients/, e.g. '/clients/rolex.svg'; absent for a name-only client
  url?: string
  description?: string
}
type Project = {
  slug: string; title: string; type: ProjectType; year: number;
  depth: 'full' | 'lightweight'; featured?: boolean; externalUrl?: string;
  role?: string; problem?: string; approach?: string; outcome?: string;
  stack?: string[]; liveUrl?: string; githubUrl?: string; description?: string;
  clients?: Client[];   // the client set behind a project: a mark where logo is set, the name where it is not
}
export const projects: Project[]
export const featuredProject: Project | undefined
export const selectedWork: Project[]    // depth === 'full' && !featured
export const experiments: Project[]      // depth === 'lightweight'
```

`<img src={client.logo} alt={client.name}>` is allowed, and it is the only image source that is: the files live in `public/clients/`, ship with the site, and pass the CSP and the URL gate. No other `<img>`, no external image URL, no generated picture.

### `../content/timeline`
```typescript
type TimelineEntry = { year: string; role: string; company: string; description: string; current?: boolean }
export const timeline: TimelineEntry[]
export const capabilities: string[]
```

### `../content/about`
```typescript
export const identity: { name: string; role: string; statement: string; email: string }
// Full-depth projects may also carry white-paper fields — all optional:
//   context?: string
//   constraints?: string[]
//   process?: { phase, does, produces }[]      // ORDERED; order must be legible
//   decisions?: { decision, why }[]            // never split the pair
//   references?: { title, url, note? }[]       // real outbound anchors
export const personal: { holesInOne: number; sport: string; teams: string[]; currentFocus: string }
```
**WARNING:** There is NO `bio` export. The identity statement comes from `identity`.

## PandaCSS Preset Structure

```typescript
import { definePreset } from '@pandacss/dev'
export const elementsPreset = definePreset({
  name: 'elements',
  globalCss: { /* selector: styles */ },
  conditions: { extend: { light: '.light &, [data-theme=light] &' } },
  theme: {
    tokens: {
      colors: { paletteName: { shade: { value: '#hex' } } },
      radii: { name: { value: 'px value' } },
      durations: { name: { value: 's value' } },
      easings: { name: { value: 'css timing fn' } },
      // fonts, fontSizes, fontWeights, lineHeights, letterSpacings and
      // spacing live in elements/chassis-preset.ts, generated from the
      // day's chassis and merged after this preset — values written here
      // for those groups are overridden.
    },
    semanticTokens: {
      colors: {
        tokenName: {
          DEFAULT: { value: { base: '{colors.palette.shade}', _light: '{colors.palette.shade}' } },
          variant: { value: { base: '...', _light: '...' } },
        },
      },
    },
  },
})
```

## Semantic Token Names (used in components)

Components reference token names, NOT raw color values. A name outside these sets ships as a bare identifier, the browser drops the declaration, and the element silently keeps its inherited value.

- **Fonts:** `display` and `body` come from the chassis. Anything else exists only if the preset defines it.
- **Font sizes:** `2xs`, `xs`, `sm`, `base`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `hero`. Nothing above `5xl` exists. `hero` and every step from `xl` up are fluid clamps that shrink to fit a {{NARROW_PX}}px column, so a heading set in one resizes on its own; `lg` and below are fixed.
- **Text styles:** every ramp step is also a `textStyle` token (`textStyle: 'hero'`) carrying size, line-height and letter-spacing together, tuned per step by the day's chassis. Prefer `textStyle` over setting `fontSize` alone.
- **Spacing:** `1`-`9`, derived from the chassis rhythm and landing close to 4, 8, 16, 24, 32, 48, 64, 96, 128px on every chassis. A bare number is a spacing token, so a literal size needs its unit (`width: '44px'`).
- **Line heights:** `tight`, `snug`, `normal`, `loose`, derived from the chassis step table. A step's own leading comes free with `textStyle`.
- **Letter spacings:** `tight`, `normal`, `wide`, `wider`, `widest`, also chassis-derived; `wide`+ are for caps labels and smallcaps.

### Colors

{{SEMANTIC_COLOR_CONTRACT}}

## Route Pattern

```tsx
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/path')({ component: MyPage })
function MyPage() { return <Layout>...</Layout> }
```

For parameterized routes: `const { slug } = Route.useParams()`

## Forbidden Imports

Do NOT import from: `@remix-run/react`, `react-router-dom`, `next/link`, `@emotion/*`, `styled-components`

For navigation links, use plain `<a href="/">` tags.
