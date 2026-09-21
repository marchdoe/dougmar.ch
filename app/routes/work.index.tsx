import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { BrandLockup } from '../components/BrandLockup'
import { identity } from '../content/about'
import { experiments, featuredProject, selectedWork } from '../content/projects'

export const Route = createFileRoute('/work/')({ component: WorkIndex })

/**
 * The work index, hand-written and not on the engineer's slate.
 *
 * It followed the nightly redesign only by accident: nobody restyled it after
 * 2026-09-02, so it read as another site next to `/` and `/about`, clipped at
 * 320 (a 208px column under a 54px title) and had no tablet layout. See #561.
 * The same answer as the white paper and the home callout: a fixed layout that
 * takes the day's colour and type and nothing else.
 *
 * WHAT FOLLOWS THE DAY. Colour, from the frozen semantic set
 * (scripts/utils/semantic-contract.js), and the two font tokens `display` and
 * `body`, which every chassis defines. Weights go through the weight tokens.
 *
 * WHAT DOES NOT. Every size, gap and measure is a literal. The chassis ramp
 * and the spacing scale are derived from the night's chassis, so a step name
 * would hand the hierarchy back to it, and a title sized from the ramp is how
 * this page clipped in the first place. Accent is only a mark here (an
 * underline, a focus ring), never an ink, because nothing promises it clears
 * 4.5:1 on any ground.
 *
 * The masthead is drawn here, from the orchestrator's BrandLockup and the same
 * three nav entries as every other page. It does not import
 * generated/Masthead: that file is the engineer's and there is no promise it
 * exists tomorrow. It took `onField` on 2026-09-07, was swept on 2026-09-08,
 * was not there on 2026-09-19 and came back on 2026-09-20 taking
 * `heroContent`. A route off the slate cannot follow that.
 *
 * Every css() call is at module scope with literal values. Panda extracts at
 * build time, and a value that only exists at run time yields a class with no
 * rule behind it (2026-09-19, PR #525).
 */
function WorkIndex() {
  return (
    <>
      <header className={mastheadClass} data-page="work">
        <div className={innerClass}>
          <a href="/" aria-label={`${identity.name}, home`} className={brandClass}>
            <BrandLockup variant="horizontal-md" />
          </a>
          <h1 className={titleClass}>work</h1>
          <nav aria-label="Primary" className={navClass}>
            <a href="/work" aria-current="page" className={navLinkClass}>
              <span className={navNumberClass} aria-hidden="true">
                01
              </span>{' '}
              work
            </a>
            <a href="/about" className={navLinkClass}>
              <span className={navNumberClass} aria-hidden="true">
                02
              </span>{' '}
              about
            </a>
            <a href={`mailto:${identity.email}`} className={navLinkClass}>
              <span className={navNumberClass} aria-hidden="true">
                03
              </span>{' '}
              contact
            </a>
          </nav>
        </div>
      </header>

      <main className={pageClass} data-page="work">
        <div className={columnClass}>
          {featuredProject && (
            <section aria-labelledby="work-featured" className={sectionClass}>
              <h2 id="work-featured" className={sideHeadClass}>
                Featured
              </h2>
              <div>
                <h3 className={featuredTitleClass}>
                  <a href={`/work/${featuredProject.slug}`} className={featuredLinkClass}>
                    {featuredProject.title}
                  </a>
                </h3>
                {featuredProject.problem && <p className={ledeClass}>{featuredProject.problem}</p>}
                {featuredProject.externalUrl && (
                  <a href={featuredProject.externalUrl} className={visitClass}>
                    Visit ↗
                  </a>
                )}
              </div>
            </section>
          )}

          <section aria-labelledby="work-selected" className={sectionClass}>
            <h2 id="work-selected" className={sideHeadClass}>
              Selected work
            </h2>
            <ul className={listClass}>
              {selectedWork.map((project) => (
                <li key={project.slug} className={itemClass}>
                  <a href={`/work/${project.slug}`} className={rowClass}>
                    <span className={rowTitleClass} data-work-title="">
                      {project.title}
                    </span>
                    <span className={metaClass}>
                      {project.type} · {project.year}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="work-experiments" className={sectionClass}>
            <h2 id="work-experiments" className={sideHeadClass}>
              Experiments
            </h2>
            <ul className={listClass}>
              {experiments.map((project) => (
                <li key={project.slug} className={itemClass}>
                  <a href={project.externalUrl ?? `/work/${project.slug}`} className={rowClass}>
                    <span className={rowTitleClass} data-work-title="">
                      {project.title}
                    </span>
                    <span className={metaClass}>
                      {project.type} · {project.year}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </>
  )
}

// Padding steps: 20px on a phone, 40px from `md` (which clears the Sidebar's
// 10px-from-the-edge locator line), 64px from `lg`. The column inside them
// stops at 80rem, so 1440 gets the same measure as 1280. The header and the
// page repeat the values rather than share a constant, so Panda has nothing
// to evaluate.

const mastheadClass = css({
  bg: 'field',
  color: 'fieldInk',
  borderBottom: '3px solid',
  borderColor: 'fieldBorder',
  paddingTop: { base: '1.25rem', md: '2.5rem' },
  paddingBottom: { base: '2rem', md: '3.5rem' },
  paddingLeft: { base: '1.25rem', md: '2.5rem', lg: '4rem' },
  paddingRight: { base: '1.25rem', md: '2.5rem', lg: '4rem' },
})

const innerClass = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  maxWidth: '80rem',
  marginLeft: 'auto',
  marginRight: 'auto',
})

const brandClass = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  color: 'fieldInk',
  textDecoration: 'none',
  _focusVisible: { outline: '2px solid', outlineColor: 'fieldInk', outlineOffset: '4px' },
})

// Four letters: 165px at 3.5rem in Unbounded, the widest chassis, against a
// 264px column at 320. The steps are fixed.
const titleClass = css({
  margin: '0',
  marginTop: { base: '2rem', md: '3.5rem' },
  marginBottom: { base: '1rem', md: '2rem' },
  fontFamily: 'display',
  fontWeight: 'normal',
  fontSize: { base: '3.5rem', md: '5.5rem', lg: '7rem' },
  lineHeight: '1',
  letterSpacing: '-0.02em',
  textTransform: 'lowercase',
  color: 'fieldInk',
})

const navClass = css({
  display: 'flex',
  flexWrap: 'wrap',
  columnGap: { base: '1rem', md: '2.5rem' },
})

const navLinkClass = css({
  display: 'inline-flex',
  alignItems: 'center',
  minWidth: '44px',
  minHeight: '44px',
  fontFamily: 'display',
  fontWeight: 'normal',
  fontSize: { base: '0.875rem', md: '1rem' },
  lineHeight: '1.2',
  letterSpacing: '0.02em',
  textTransform: 'lowercase',
  color: 'fieldInk',
  textDecorationLine: 'underline',
  textDecorationColor: 'transparent',
  textDecorationThickness: '2px',
  textUnderlineOffset: '0.3em',
  transition: 'text-decoration-color 0.2s ease',
  _hover: { textDecorationColor: 'accent' },
  _focusVisible: { outline: '2px solid', outlineColor: 'fieldInk', outlineOffset: '4px' },
})

const navNumberClass = css({
  marginRight: '0.25rem',
  color: 'fieldInkMuted',
  fontVariantNumeric: 'tabular-nums',
})

const pageClass = css({
  display: 'block',
  bg: 'bg',
  color: 'text',
  fontFamily: 'body',
  fontWeight: 'normal',
  fontSize: '1rem',
  lineHeight: '1.5',
  letterSpacing: '0',
  textTransform: 'none',
  textAlign: 'left',
  paddingTop: { base: '2.5rem', lg: '4.5rem' },
  paddingBottom: { base: '3rem', lg: '6rem' },
  paddingLeft: { base: '1.25rem', md: '2.5rem', lg: '4rem' },
  paddingRight: { base: '1.25rem', md: '2.5rem', lg: '4rem' },
})

const columnClass = css({
  display: 'flex',
  flexDirection: 'column',
  rowGap: { base: '2.5rem', lg: '4rem' },
  maxWidth: '80rem',
  marginLeft: 'auto',
  marginRight: 'auto',
})

// One column on a phone, with the head above its list. From `md` the head
// sits in a rail beside it, 10rem wide and 12rem from `lg`, the way the white
// paper does it, and the first baselines line up.
const sectionClass = css({
  display: 'grid',
  gridTemplateColumns: {
    base: 'minmax(0, 1fr)',
    md: 'minmax(0, 10rem) minmax(0, 1fr)',
    lg: 'minmax(0, 12rem) minmax(0, 1fr)',
  },
  columnGap: { base: '2rem', lg: '3rem' },
  rowGap: '1rem',
  alignItems: { md: 'baseline' },
  paddingTop: { base: '1.25rem', lg: '1.5rem' },
  borderTop: '1px solid',
  borderColor: 'borderStrong',
})

const sideHeadClass = css({
  margin: '0',
  fontFamily: 'display',
  fontWeight: 'bold',
  fontSize: '0.875rem',
  lineHeight: '1.4',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'text',
})

// Fixed steps sized against the phone column, not the ramp. At 2rem "Spaceman"
// measures 219px in Unbounded, the widest of the fifteen chassis, and the
// column is 264px at 320 (the browser's 8px body margin is still in play).
const featuredTitleClass = css({
  margin: '0',
  fontFamily: 'display',
  fontWeight: 'bold',
  fontSize: { base: '2rem', md: '3.25rem', lg: '4.5rem' },
  lineHeight: '1.05',
  letterSpacing: '-0.02em',
  textTransform: 'none',
  color: 'text',
})

const featuredLinkClass = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  color: 'text',
  textDecorationLine: 'underline',
  textDecorationColor: 'accent',
  textDecorationThickness: '3px',
  textUnderlineOffset: '0.12em',
  _hover: { textDecorationThickness: '5px' },
  _focusVisible: { outline: '2px solid', outlineColor: 'accent', outlineOffset: '4px' },
})

const ledeClass = css({
  margin: '0',
  marginTop: '1.25rem',
  maxWidth: '40rem',
  fontSize: { base: '1.0625rem', md: '1.125rem' },
  lineHeight: '1.6',
  color: 'text',
  overflowWrap: 'break-word',
  textWrap: 'pretty',
})

const visitClass = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  marginTop: '0.75rem',
  fontFamily: 'display',
  fontSize: '0.875rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'text',
  textDecorationLine: 'underline',
  textDecorationColor: 'accent',
  textDecorationThickness: '2px',
  textUnderlineOffset: '0.3em',
  _focusVisible: { outline: '2px solid', outlineColor: 'accent', outlineOffset: '4px' },
})

const listClass = css({
  margin: '0',
  padding: '0',
  listStyle: 'none',
})

const itemClass = css({
  margin: '0',
  padding: '0',
  borderBottom: '1px solid',
  borderColor: 'border',
})

// The whole row is the target. Title over metadata on a phone, so neither
// competes for 280px; title left and metadata right from `md`.
const rowClass = css({
  display: 'grid',
  gridTemplateColumns: { base: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) auto' },
  columnGap: '2rem',
  rowGap: '0.375rem',
  alignItems: { md: 'baseline' },
  minHeight: '44px',
  paddingTop: { base: '1rem', md: '1.25rem' },
  paddingBottom: { base: '1rem', md: '1.25rem' },
  color: 'text',
  textDecoration: 'none',
  '&:hover [data-work-title]': { textDecorationColor: 'accent' },
  _focusVisible: { outline: '2px solid', outlineColor: 'accent', outlineOffset: '-2px' },
})

// Fixed at 1.5rem until `lg`, so "Twittertale", the longest title, fits its
// column in all fifteen chassis at every width from 320 up, beside its
// metadata from `md`.
const rowTitleClass = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  fontSize: { base: '1.5rem', lg: '1.75rem' },
  lineHeight: '1.15',
  letterSpacing: '-0.01em',
  textTransform: 'none',
  color: 'text',
  textDecorationLine: 'underline',
  textDecorationColor: 'transparent',
  textDecorationThickness: '2px',
  textUnderlineOffset: '0.18em',
  transition: 'text-decoration-color 0.2s ease',
})

const metaClass = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  fontSize: '0.8125rem',
  lineHeight: '1.4',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'textMuted',
  fontVariantNumeric: 'tabular-nums',
  textAlign: { md: 'right' },
})
