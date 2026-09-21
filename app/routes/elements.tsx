import { createFileRoute } from '@tanstack/react-router'
import { SectionHead } from '../components/SectionHead'
import { FeaturedProject } from '../components/FeaturedProject'
import { ProjectRow } from '../components/ProjectRow'
import { MobileFooter } from '../components/MobileFooter'
import type { Project } from '../content/types'
import { collectPresetTokens, type TokenRow } from '../lib/preset-tokens'
import { elementsPreset } from '../../elements/preset'
import { chassisPreset } from '../../elements/chassis-preset'
import { css } from '../../styled-system/css'
import { styled } from '../../styled-system/jsx'

export const Route = createFileRoute('/elements')({
  component: Elements,
})

// The order matches `presets` in panda.config.ts: the chassis is last, so its
// type ramp and spacing win over anything the Art Director wrote.
const tokens = collectPresetTokens([elementsPreset, chassisPreset])

// ── Shared layout primitives ──────────────────────────────────────────────────

// The nightly Layout wraps this route and pins its Sidebar to the wrapper's
// left edge, absolutely, top to bottom. The page owns the gutter that clears it
// (the sidebar sits about 35px from the viewport edge) and the minimum height
// that gives it a full column to run down. See #552.
const Page = styled('div', {
  base: {
    minHeight: '100vh',
    minWidth: 0,
    paddingBlock: '6',
    paddingInline: { base: '3', md: '6' },
  },
})

const PageTitle = styled('div', {
  base: {
    fontSize: 'xl',
    fontWeight: 'bold',
    letterSpacing: 'tight',
    color: 'text',
    lineHeight: 'tight',
    marginBottom: '3',
  },
})

const PageDesc = styled('p', {
  base: {
    fontSize: 'base',
    color: 'textMuted',
    fontStyle: 'italic',
    lineHeight: 'normal',
    marginBottom: '6',
  },
})

const Section = styled('div', {
  base: {
    marginBottom: '6',
    // This page renders the nightly components directly, at whatever display
    // size the night's preset picks, so a single long heading can pin the
    // page open on a narrow screen. Breaking words is the right trade in a
    // specimen sheet. See #215.
    minWidth: 0,
    overflowWrap: 'anywhere',
  },
})

const SubHead = styled('div', {
  base: {
    fontSize: '2xs',
    fontWeight: 'bold',
    letterSpacing: 'widest',
    color: 'textMuted',
    marginBottom: '3',
    marginTop: '5',
  },
})

const Label = styled('div', {
  base: {
    fontSize: '2xs',
    color: 'textMuted',
    letterSpacing: 'wide',
    marginBottom: '2',
  },
})

const Note = styled('p', {
  base: { fontSize: '2xs', color: 'textMuted', letterSpacing: 'wide', marginBottom: '3' },
})

// ── Token tables ──────────────────────────────────────────────────────────────
//
// Every value below comes from the preset objects, never from this file. The
// swatch, the type sample and the spacing bar are painted by token name, which
// Panda cannot see at build time, so panda.config.ts pre-generates the classes
// for the five properties used here (`staticCss`).
// tests/app/elements-tokens.test.tsx fails if a table row is not in the preset.

const SwatchGrid = styled('div', {
  base: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
    gap: '3',
    marginBottom: '4',
  },
})

const SwatchItem = styled('div', {
  base: { display: 'flex', flexDirection: 'column', gap: '1', minWidth: 0 },
})

const SwatchBlock = styled('div', {
  base: {
    height: '44px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'border',
  },
})

// What a swatch shows when its token has no value tonight: a semantic name
// whose reference points at a colour the preset does not define. It says so
// instead of painting nothing.
const SwatchMissing = styled('div', {
  base: {
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: '1px',
    borderStyle: 'dashed',
    borderColor: 'textMuted',
    color: 'textMuted',
    fontSize: '2xs',
    textAlign: 'center',
    lineHeight: 'snug',
  },
})

const SwatchLabel = styled('div', {
  base: {
    fontSize: '2xs',
    color: 'textMuted',
    letterSpacing: 'wide',
    lineHeight: 'snug',
  },
})

const TypeRow = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'baseline',
    // A large step pushes its label onto the next line instead of squeezing
    // the sample until the section's `overflow-wrap: anywhere` breaks the word.
    flexWrap: 'wrap',
    columnGap: '3',
    paddingBlock: '2',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'border',
  },
})

const TypeSample = styled('div', {
  base: { color: 'text', flex: '1 1 auto', minWidth: 0, overflowWrap: 'normal' },
})

const TypeMeta = styled('div', {
  base: {
    fontSize: '2xs',
    color: 'textMuted',
    letterSpacing: 'wide',
    textAlign: 'end',
    marginInlineStart: 'auto',
  },
})

const SpacingRow = styled('div', {
  base: { display: 'flex', alignItems: 'center', gap: '3', marginBottom: '2' },
})

// The bar is the token's own width: an empty box with the token as left
// padding, painted by its background.
const SpacingBlock = styled('div', {
  base: { height: '12px', flexShrink: 0, background: 'accent', opacity: '0.4' },
})

// ── MobileFooter preview wrapper — forces the inner footer visible on desktop ──
// MobileFooter accepts no props, so override display via a CSS descendant selector.
// '& > footer' targets FooterRoot; the descendant rule is unlayered so it beats @layer base.

const MobileFooterPreview = styled('div', {
  base: {
    '& > footer': { display: 'flex' },
  },
})

function Swatch({ row, path }: { row: TokenRow; path: string }) {
  return (
    <SwatchItem data-token-path={path}>
      {row.defined ? (
        <SwatchBlock className={css({ background: row.name })} />
      ) : (
        <SwatchMissing>not defined tonight</SwatchMissing>
      )}
      <SwatchLabel>{row.name}</SwatchLabel>
      <SwatchLabel data-token-value>{row.value}</SwatchLabel>
      {row.ref && row.defined ? (
        <SwatchLabel>{row.ref.slice(1, -1).replace(/^colors\./, '')}</SwatchLabel>
      ) : null}
    </SwatchItem>
  )
}

function Empty({ rows }: { rows: readonly unknown[] }) {
  return rows.length === 0 ? <Note>Not defined in tonight's preset.</Note> : null
}

const demoRowFull: Project = {
  slug: 'demo-full',
  title: 'FishSticks',
  type: 'SaaS',
  year: 2025,
  depth: 'full',
}

const demoRowLight: Project = {
  slug: 'demo-light',
  title: 'Politweets',
  type: 'Experiment',
  year: 2008,
  depth: 'lightweight',
  externalUrl: 'https://example.com',
}

function Elements() {
  return (
    <Page data-page="elements">
      <PageTitle>ELEMENTS</PageTitle>
      <PageDesc>
        The building blocks of this site — design tokens and components from the elements/ preset.
      </PageDesc>

      {/* ── TOKENS ── */}
      <Section>
        <SectionHead label="TOKENS" />

        <SubHead>COLORS — SEMANTIC</SubHead>
        <Empty rows={tokens.semanticColors} />
        <SwatchGrid>
          {tokens.semanticColors.map((row) => (
            <Swatch key={row.name} row={row} path={`semantic.${row.name}`} />
          ))}
        </SwatchGrid>

        <SubHead>COLORS — PRIMITIVE</SubHead>
        <Empty rows={tokens.primitiveColors} />
        {tokens.primitiveColors.map(({ scale, steps }) => (
          <div key={scale}>
            <Label>{scale}</Label>
            <SwatchGrid>
              {steps.map((row) => (
                <Swatch key={row.name} row={row} path={`colors.${row.name}`} />
              ))}
            </SwatchGrid>
          </div>
        ))}

        <SubHead>TYPOGRAPHY — FONT SIZES</SubHead>
        <Empty rows={tokens.fontSizes} />
        {tokens.fontSizes.map(({ name, value }) => (
          <TypeRow key={name} data-token-path={`fontSizes.${name}`}>
            <TypeSample className={css({ fontSize: name })}>Doug</TypeSample>
            <TypeMeta>
              {name} / {value}
            </TypeMeta>
          </TypeRow>
        ))}

        <SubHead>TYPOGRAPHY — FONT WEIGHTS</SubHead>
        <Empty rows={tokens.fontWeights} />
        {tokens.fontWeights.map(({ name, value }) => (
          <TypeRow key={name} data-token-path={`fontWeights.${name}`}>
            <TypeSample className={css({ fontWeight: name })}>DOUG MARCH</TypeSample>
            <TypeMeta>
              {name} / {value}
            </TypeMeta>
          </TypeRow>
        ))}

        <SubHead>TYPOGRAPHY — LETTER SPACING</SubHead>
        <Empty rows={tokens.letterSpacings} />
        {tokens.letterSpacings.map(({ name, value }) => (
          <TypeRow key={name} data-token-path={`letterSpacings.${name}`}>
            <TypeSample className={css({ letterSpacing: name })}>DOUG MARCH</TypeSample>
            <TypeMeta>
              {name} / {value}
            </TypeMeta>
          </TypeRow>
        ))}

        <SubHead>SPACING SCALE</SubHead>
        <Empty rows={tokens.spacing} />
        {tokens.spacing.map(({ name, value }) => (
          <SpacingRow key={name} data-token-path={`spacing.${name}`}>
            <SpacingBlock className={css({ paddingInlineStart: name })} />
            <TypeMeta>
              {name} / {value}
            </TypeMeta>
          </SpacingRow>
        ))}
      </Section>

      {/* ── COMPONENTS ── */}
      <Section>
        <SectionHead label="COMPONENTS" />

        <SubHead>FEATUREDPROJECT</SubHead>
        <FeaturedProject />

        <SubHead>PROJECTROW — FULL (internal link)</SubHead>
        <ProjectRow project={demoRowFull} index={0} />

        <SubHead>PROJECTROW — LIGHTWEIGHT (external link)</SubHead>
        <ProjectRow project={demoRowLight} index={0} />

        <SubHead>SECTIONHEAD</SubHead>
        <SectionHead label="EXAMPLE SECTION" />

        <SubHead>MOBILEFOOTER (mobile-only — forced visible here)</SubHead>
        <MobileFooterPreview>
          <MobileFooter />
        </MobileFooterPreview>

        {/*
          The 404 is deliberately not previewed here. It reads no design token,
          so there is nothing on this page for it to demonstrate — see #199. It
          lives in public/404.html and in the root route's notFoundComponent,
          kept in step by tests/scripts/not-found-copy.test.js.

          A styled preview used to sit here under a comment claiming it matched
          __root.tsx. It had not for months. That drift is why the test exists.
        */}
      </Section>
    </Page>
  )
}
