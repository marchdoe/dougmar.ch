import { css, cva } from '../../styled-system/css'

// Styles shared across the /dev panel's panes and cards. Colours come from the
// `devPanel.*` tokens in panda.config.ts; a component's one-off styles live in
// its own file.
//
// Every value here is static. Panda extracts css() at build time, so a value
// computed at render produces a class with no rule behind it. State goes
// through cva variants or data attributes; the few truly data-driven values
// (a bar's share, a language's colour) are passed as CSS custom properties.

export const page = css({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: 'devPanel.bg',
  color: 'devPanel.text',
  fontFamily: 'devPanel.mono',
  fontSize: '13px',
  // The page's stylesheet is the site's, so body carries tonight's chassis
  // leading and the preset's font smoothing. The panel keeps the browser's
  // own: `initial` line-height is `normal` (the word `normal` itself would
  // resolve to the chassis token).
  lineHeight: 'initial',
  // Panda's name for -webkit-font-smoothing: auto and -moz-osx: auto.
  fontSmoothing: 'subpixel-antialiased',
  textRendering: 'auto',
  fontKerning: 'auto',
  '& :is(button, select, textarea, input)': { fontFamily: 'devPanel.mono' },
  '& :is(button, select, textarea, input):focus-visible': {
    outline: '2px solid',
    outlineColor: 'devPanel.cyan',
    outlineOffset: '2px',
  },
  '@media (prefers-reduced-motion: reduce)': {
    '& *': {
      animationDuration: '0.01ms !important',
      animationIterationCount: '1 !important',
    },
  },
})

/** `// SECTION` heading at the top of a pane. */
export const paneHeading = css({
  fontSize: '10px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '.12em',
  color: 'devPanel.dim',
  margin: '0 0 16px 0',
})

/** Small uppercase label above a block (Creative Weights, Step Timings). */
export const blockLabel = css({
  fontSize: '9px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '.12em',
  color: 'devPanel.dim',
})

/** The one-line "nothing here" message cards and panes use. */
export const emptyText = css({ fontSize: '11px', color: 'devPanel.muted' })

export const card = cva({
  base: {
    background: 'devPanel.card',
    border: '1px solid',
    borderColor: 'devPanel.border',
    borderRadius: '4px',
    padding: '14px',
    overflow: 'hidden',
  },
  variants: {
    unavailable: {
      true: { borderColor: 'devPanel.red/20', opacity: 0.6 },
    },
  },
})

export const cardHeading = css({
  fontSize: '10px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '.12em',
  color: 'devPanel.dim',
  marginBottom: '10px',
  marginTop: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

export const cardHeadingMeta = css({
  fontSize: '9px',
  color: 'devPanel.muted',
  fontWeight: 400,
  letterSpacing: '0',
  textTransform: 'none',
})

/** A row in a card's list: one item, its figures beside it. */
export const listRow = cva({
  base: { display: 'flex', gap: '8px', padding: '3px 0' },
  variants: {
    align: {
      center: { alignItems: 'center' },
      baseline: { alignItems: 'baseline' },
    },
  },
  defaultVariants: { align: 'center' },
})

/** Text that fills the row and truncates with an ellipsis. */
export const truncate = css({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const dot = cva({
  base: { borderRadius: '50%', flexShrink: 0 },
  variants: {
    size: {
      sm: { width: '5px', height: '5px' },
      md: { width: '6px', height: '6px' },
      lg: { width: '7px', height: '7px' },
    },
    tone: {
      green: { background: 'devPanel.green' },
      cyan: { background: 'devPanel.cyan' },
      orange: { background: 'devPanel.orange' },
      red: { background: 'devPanel.red' },
      ghost: { background: 'devPanel.ghost' },
    },
    pulse: {
      slow: { animation: 'devPanelPulseDot 2s ease-in-out infinite' },
      fast: { animation: 'devPanelPulseDot 1.5s ease-in-out infinite' },
    },
  },
  defaultVariants: { size: 'md' },
})

/** The green "18 / 19" providers capsule, in the header and the signals pane. */
export const healthCapsule = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  background: 'devPanel.green/8',
  border: '1px solid',
  borderColor: 'devPanel.green/20',
  borderRadius: '20px',
  padding: '3px 10px',
  fontSize: '11px',
  fontWeight: 700,
  color: 'devPanel.green',
})

/** The idle and running tracker: a phase column beside the log. */
export const tracker = {
  frame: css({
    border: '1px solid',
    borderColor: 'devPanel.border',
    borderRadius: '4px',
    overflow: 'hidden',
  }),
  titleBar: css({
    background: 'devPanel.card',
    borderBottom: '1px solid',
    borderBottomColor: 'devPanel.border',
    padding: '10px 14px',
    fontSize: '11px',
    fontWeight: 700,
  }),
  body: css({ display: 'grid', gridTemplateColumns: '240px 1fr' }),
  phases: css({
    padding: '14px',
    borderRight: '1px solid',
    borderRightColor: 'devPanel.border',
    display: 'flex',
    flexDirection: 'column',
    gap: '9px',
    background: 'devPanel.card',
  }),
  phaseRow: css({ display: 'flex', alignItems: 'center', gap: '9px' }),
  log: css({
    background: 'devPanel.log',
    padding: '14px',
    fontSize: '10px',
    lineHeight: '1.8',
    minHeight: '180px',
  }),
}
