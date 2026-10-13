import { css, cx } from '../../../styled-system/css'

type Tone = 'field' | 'plain' | 'faint'
type Tile = {
  id: string
  place: string
  tone: Tone
  label: string
  head: string
  meta: string
  sub?: string
}

const orbitCss = css({
  position: { base: 'relative', lg: 'absolute' },
  inset: { lg: '0' },
  zIndex: 2,
  width: '100%',
  boxSizing: 'border-box',
  display: { base: 'flex', lg: 'block' },
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
  pointerEvents: { lg: 'none' },
})

const tileCss = css({
  position: { base: 'relative', lg: 'absolute' },
  boxSizing: 'border-box',
  minWidth: '0',
  borderRadius: 'md',
  borderWidth: '1px',
  borderStyle: 'solid',
  paddingBlock: '5',
  paddingInline: '5',
  pointerEvents: { lg: 'auto' },
  textAlign: 'left',
})
const labelCss = css({
  display: 'block',
  fontFamily: 'body',
  fontWeight: 'bold',
  fontSize: 'xs',
  textTransform: 'uppercase',
  letterSpacing: 'wider',
  marginBottom: '2',
})
const headCss = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  lineHeight: 'tight',
  marginBottom: '2',
  whiteSpace: 'nowrap',
})
const metaCss = css({ fontFamily: 'body', fontSize: 'sm', lineHeight: 'snug' })
const subCss = css({ display: 'block', fontSize: 'sm', marginTop: '1' })

// Mockup sets the score at 48px on the phone and 80px on desktop, below the 92px featured title.
// Plain and faint heads step down at lg so they fit their 260 to 290px tiles.
const tones = {
  field: {
    box: css({ bg: 'field', borderColor: 'fieldBorder' }),
    label: css({ color: 'fieldInkMuted' }),
    head: css({
      fontSize: { base: '48px', lg: '80px' },
      color: 'fieldInk',
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: 'tight',
    }),
    meta: css({ color: 'fieldInkMuted', marginTop: '2' }),
  },
  plain: {
    box: css({ bg: 'surface', borderColor: 'border' }),
    label: css({ color: 'textMuted' }),
    head: css({ fontSize: { base: 'xl', lg: '26px' }, color: 'text' }),
    meta: css({ color: 'textMuted' }),
  },
  faint: {
    box: css({ bg: 'bgAlt', borderColor: 'border' }),
    label: css({ color: 'textFaint' }),
    head: css({ fontSize: { base: 'xl', lg: '26px' }, color: 'textFaint' }),
    meta: css({ color: 'textFaint' }),
  },
}

const tiles: Tile[] = [
  {
    id: 'lions',
    tone: 'field',
    label: 'Nearest finish · Win',
    head: '45–21',
    meta: 'Lions closed it out. A blowout is a finish.',
    place: css({
      width: { base: '100%', lg: '360px' },
      maxWidth: { base: '400px', lg: 'none' },
      top: { lg: '19%' },
      right: { lg: '12%' },
    }),
  },
  {
    id: 'golf',
    tone: 'plain',
    label: 'Baycurrent Classic · Final',
    head: '16 under',
    meta: 'Michael Brennan takes it.',
    sub: 'Keith Mitchell & Jacob Bridgeman, 15 under.',
    place: css({
      width: { base: '100%', lg: '270px' },
      maxWidth: { base: '340px', lg: 'none' },
      bottom: { lg: '20%' },
      left: { lg: '12%' },
    }),
  },
  {
    id: 'weather',
    tone: 'plain',
    label: 'Aldie, VA',
    head: '56°F',
    meta: 'Clear afternoon. Air good.',
    place: css({
      width: { base: '100%', lg: '220px' },
      maxWidth: { base: '340px', lg: 'none' },
      bottom: { lg: '14%' },
      right: { lg: '6%' },
    }),
  },
  {
    id: 'market',
    tone: 'faint',
    label: 'Furthest · Not a finish',
    head: 'SPY 778.10',
    meta: 'Down 0.06%. A soft day stays faint.',
    place: css({
      width: { base: '100%', lg: '290px' },
      maxWidth: { base: '340px', lg: 'none' },
      top: { lg: '6%' },
      left: { lg: '2%' },
    }),
  },
]

function SignalTile({ tile }: { tile: Tile }) {
  const t = tones[tile.tone]
  return (
    <article className={cx(tileCss, t.box, tile.place)}>
      <span className={cx(labelCss, t.label)}>{tile.label}</span>
      <div className={cx(headCss, t.head)}>{tile.head}</div>
      <p className={cx(metaCss, t.meta)}>
        {tile.meta}
        {tile.sub ? <span className={subCss}>{tile.sub}</span> : null}
      </p>
    </article>
  )
}

export function SignalOrbit() {
  return (
    <div className={orbitCss}>
      {tiles.map((tile) => (
        <SignalTile key={tile.id} tile={tile} />
      ))}
    </div>
  )
}
