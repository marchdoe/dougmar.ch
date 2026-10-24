import { css } from '../../../styled-system/css'

const cells = [
  { label: 'Final', value: '128–111', sub: 'Pistons, +17', reverse: true },
  { label: 'Golf', value: '−13', sub: 'Hirata / Blanchet', reverse: false },
  { label: 'Moon', value: '98.8%', sub: 'Full', reverse: false },
  { label: 'SPY', value: '759.97', sub: '−0.52%', reverse: false },
  { label: 'Aldie', value: '41.7°F', sub: 'Clear', reverse: false },
]

const dark = {
  cell: css({ bg: 'field', padding: '4', minWidth: '0' }),
  label: css({
    textStyle: '2xs',
    fontWeight: 'bold',
    letterSpacing: 'widest',
    textTransform: 'uppercase',
    color: 'fieldInkMuted',
    marginBottom: '6px',
  }),
  value: css({
    fontFamily: 'display',
    textStyle: { base: 'md', sm: 'lg' },
    lineHeight: '1',
    color: 'fieldInk',
  }),
  sub: css({ textStyle: '2xs', color: 'fieldInkMuted', marginTop: '5px' }),
}

// the one field reversal: amber 300 maps to fieldInkMuted used as a fill
const lit = {
  cell: css({ bg: 'fieldInkMuted', padding: '4', minWidth: '0' }),
  label: css({
    textStyle: '2xs',
    fontWeight: 'bold',
    letterSpacing: 'widest',
    textTransform: 'uppercase',
    color: 'textMuted',
    marginBottom: '6px',
  }),
  value: css({
    fontFamily: 'display',
    textStyle: { base: 'md', sm: 'lg' },
    lineHeight: '1',
    color: 'text',
  }),
  sub: css({ textStyle: '2xs', color: 'textMuted', marginTop: '5px' }),
}

export function BoxScore() {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: {
          base: 'repeat(2, minmax(0, 1fr))',
          sm: 'repeat(3, minmax(0, 1fr))',
          lg: 'repeat(5, minmax(0, 1fr))',
        },
        gap: '1px',
        bg: 'fieldBorder',
        border: '1px solid',
        borderColor: 'fieldBorder',
        minWidth: '0',
      })}
    >
      {cells.map((c) => {
        const tone = c.reverse ? lit : dark
        return (
          <div key={c.label} className={tone.cell}>
            <div className={tone.label}>{c.label}</div>
            <div className={tone.value}>{c.value}</div>
            <div className={tone.sub}>{c.sub}</div>
          </div>
        )
      })}
    </div>
  )
}
