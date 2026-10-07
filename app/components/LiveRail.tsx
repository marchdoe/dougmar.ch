import { css, cx } from '../../styled-system/css'
import { liveRail } from '../content/rail'

/**
 * The live rail (#702): the archive's top rail, adapted for the live site.
 *
 * Without it a first-time visitor sees a portfolio and has no way to know it
 * was a different portfolio yesterday. The callout says so at the bottom of
 * home (#532), below everything a visitor may never scroll to. The rail says
 * it at the top of `/`, `/about` and `/work/*`, in the same shape as the rail
 * sealed onto every archived page (buildFrame in scripts/utils/archive-seal.js),
 * so the live site and the archive read as one system.
 *
 * Hand-written. __root.tsx renders it outside <Layout>, so no agent can delete
 * or restyle it, and the words are in app/content/rail.ts, which no agent can
 * write.
 *
 * COLOURS. Fixed `archive.*` tokens from panda.config.ts, never the day's
 * semantic set: a rail that turned olive on an olive night would be part of the
 * design, and the point is that it is not. The outlines and the hover wash are
 * the archive rail's white-alpha literals. tests/app/live-rail.test.tsx pins
 * every colour here and checks each text colour clears 4.5:1 on its ground.
 *
 * STATIC STYLES. Every value below is a literal. Panda extracts at build time,
 * so a runtime value passed to css() emits a class with no rule behind it
 * (PR #525). The two widths are written as `@media` keys rather than props.
 *
 * IN FLOW. 44px tall at the top of <body>, no fixed or sticky positioning: it
 * scrolls away with the page and never covers the design. A day's header that
 * pins itself with `position: fixed` would sit on top of it; the surface gate
 * fails that build, and the engineer prompt says top bars are sticky.
 *
 * THE MARKER. The root is `<div data-live-frame="<date>">` and holds no nested
 * `<div>`, only spans and anchors. `stripLiveFrame` in archive-seal.js cuts at
 * the first `</div>` after the marker, so a snapshot captured from the live
 * site loses this rail and gets the archive's instead. The unit test enforces
 * the no-div rule.
 *
 * WIDTHS. Over 640px: the whole sentence. 640px and under: the note goes, as on
 * the archive rail, and the two buttons take their short labels, because the
 * long ones and the count do not fit beside each other at 480px. Under 480px:
 * the home link and the date shorten too and the arrow goes, which leaves
 * `Archive  Today  [White paper] [How]` and fits 320px. Every link is the
 * rail's full 44px tall at every width; the outline is drawn inside it.
 */

const root = css({
  display: 'flex',
  alignItems: 'stretch',
  gap: '4px',
  boxSizing: 'border-box',
  width: '100%',
  height: '44px',
  margin: '0',
  paddingInline: '16px',
  overflow: 'hidden',
  background: 'archive.bg',
  color: 'archive.text',
  boxShadow: 'inset 0 -1px 0 rgba(255, 255, 255, 0.14)',
  fontFamily:
    'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontSize: '13px',
  fontWeight: '500',
  fontStyle: 'normal',
  lineHeight: '1',
  letterSpacing: '0.01em',
  textAlign: 'left',
  textTransform: 'none',
  whiteSpace: 'nowrap',
  textRendering: 'optimizeLegibility',
  '@media (max-width: 640px)': {
    paddingInline: '8px',
    fontSize: '12px',
  },
})

/**
 * What every link shares: the full rail height, with its wash and outline drawn
 * inside it. Each link's own class sets the rest. The two never name the same
 * property, because `cx` only joins class names and two atomic classes for one
 * property win by stylesheet order, not by the order they are passed in.
 */
const hit = css({
  position: 'relative',
  isolation: 'isolate',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: '0',
  color: 'archive.text',
  fontFamily: 'inherit',
  fontStyle: 'normal',
  letterSpacing: 'inherit',
  lineHeight: 'inherit',
  textDecoration: 'none',
  textTransform: 'none',
  background: 'transparent',
  border: '0',
  borderRadius: '0',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '8px',
    bottom: '8px',
    left: '0',
    right: '0',
    zIndex: '-1',
    borderRadius: '5px',
    pointerEvents: 'none',
    transition: 'background 120ms ease',
  },
  '&:hover::before': { background: 'rgba(255, 255, 255, 0.14)' },
  '&:focus-visible': { outline: '2px solid #f4f4f5', outlineOffset: '-4px' },
})

const home = css({
  display: 'flex',
  minWidth: '44px',
  paddingInline: '9px',
  marginLeft: '-9px',
  fontSize: 'inherit',
  fontWeight: '600',
  '@media (max-width: 640px)': { marginLeft: '0' },
})

const arrow = css({
  display: 'flex',
  width: '32px',
  fontSize: '15px',
  fontWeight: '500',
  '@media (max-width: 479px)': { display: 'none' },
})

const today = css({
  display: 'flex',
  alignItems: 'center',
  flexShrink: '0',
  paddingInline: '5px',
  fontVariantNumeric: 'tabular-nums',
})

const note = css({
  display: 'block',
  alignSelf: 'center',
  flex: '0 1 auto',
  minWidth: '0',
  paddingInline: '5px',
  color: 'archive.dim',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  '@media (max-width: 640px)': { display: 'none' },
})

const button = css({
  display: 'flex',
  minWidth: '44px',
  paddingInline: '10px',
  fontSize: 'inherit',
  fontWeight: '500',
  '&::before': { border: '1px solid rgba(255, 255, 255, 0.24)' },
})

/** Pushes the two buttons to the right edge. */
const push = css({ marginLeft: 'auto' })

/** Long and short labels for the home link and the date, swapped under 480px. */
const long = css({ '@media (max-width: 479px)': { display: 'none' } })
const short = css({ display: 'none', '@media (max-width: 479px)': { display: 'inline' } })

/** The buttons' labels, swapped at 640px, where the note goes. */
const buttonLong = css({ '@media (max-width: 640px)': { display: 'none' } })
const buttonShort = css({ display: 'none', '@media (max-width: 640px)': { display: 'inline' } })

export function LiveRail({
  date,
  prevDate,
  archiveCount,
}: {
  /** The design's date, YYYY-MM-DD. The run's, never the visitor's clock. */
  date: string
  /** The newest captured design before `date`, or null for no `‹`. */
  prevDate: string | null
  archiveCount: number
}) {
  return (
    <div data-live-frame={date} className={root}>
      <a href={liveRail.archive.href} className={cx(hit, home)}>
        <span className={long}>{liveRail.archive.long(archiveCount)}</span>
        <span className={short}>{liveRail.archive.short}</span>
      </a>
      {prevDate ? (
        <a
          href={`/archive/${prevDate}/`}
          className={cx(hit, arrow)}
          rel="nofollow"
          title={`${liveRail.prevTitle}, ${prevDate}`}
          aria-label={`${liveRail.prevTitle}, ${prevDate}`}
        >
          ‹
        </a>
      ) : null}
      <span className={today}>
        <span className={long}>{liveRail.today.long(date)}</span>
        <span className={short}>{liveRail.today.short}</span>
      </span>
      <span className={note}>{liveRail.note}</span>
      <a
        href={liveRail.whitePaper.href}
        className={cx(hit, button, push)}
        aria-label={liveRail.whitePaper.long}
      >
        <span className={buttonLong}>{liveRail.whitePaper.long}</span>
        <span className={buttonShort}>{liveRail.whitePaper.short}</span>
      </a>
      <a href={liveRail.how.href(date)} className={cx(hit, button)} aria-label={liveRail.how.long}>
        <span className={buttonLong}>{liveRail.how.long}</span>
        <span className={buttonShort}>{liveRail.how.short}</span>
      </a>
    </div>
  )
}
