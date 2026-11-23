import { css, cx } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { cell, label } from './styles'

const sky = [
  { fig: '99.9%', unit: 'Full moon' },
  { fig: '9.6h', unit: 'Daylight' },
]

export function SkyCell() {
  return (
    <div className={cx(cell, css({ gridColumn: { sm: 'span 4', lg: 'span 4' } }))}>
      <span className={label}>Overhead</span>
      <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '6' })}>
        {sky.map((s) => (
          <div key={s.unit} className={css({ flex: '1', minWidth: '90px' })}>
            <span
              className={css({
                display: 'block',
                fontFamily: 'display',
                fontWeight: 'bold',
                textStyle: 'xl',
                lineHeight: '0.95',
                fontVariantNumeric: 'tabular-nums',
                color: 'text',
              })}
            >
              {s.fig}
            </span>
            <div className={css({ textStyle: '2xs', color: 'textFaint', marginTop: '2' })}>
              {s.unit}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function QuoteCell() {
  return (
    <div className={cx(cell, css({ gridColumn: { sm: 'span 4', lg: 'span 5' } }))}>
      <span className={label}>Found text</span>
      <blockquote
        className={css({
          margin: '0',
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'normal',
          textStyle: 'md',
          lineHeight: 'snug',
          color: 'text',
          maxWidth: '46ch',
        })}
      >
        "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
      </blockquote>
      <div
        className={css({
          marginTop: '3',
          textStyle: '2xs',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'textMuted',
        })}
      >
        Aristotle
      </div>
    </div>
  )
}

const rows = [
  { k: 'Thanksgiving', v: '3 days out', hot: true },
  { k: 'On rotation', v: 'Guided by Voices · Tobin Sprout', hot: false },
  { k: 'Holes in one', v: `${personal.holesInOne}, and counting`, hot: false },
]

export function MiscCell() {
  return (
    <div className={cx(cell, css({ gridColumn: { sm: 'span 12', lg: 'span 3' } }))}>
      <span className={label}>Also today</span>
      <dl className={css({ margin: '0' })}>
        {rows.map((r) => (
          <div
            key={r.k}
            className={css({
              display: 'flex',
              justifyContent: 'space-between',
              gap: '3',
              paddingBlock: '2',
              textStyle: 'sm',
              '& + &': { borderTopWidth: '1px', borderTopStyle: 'solid', borderTopColor: 'border' },
            })}
          >
            <dt className={css({ color: 'textMuted' })}>{r.k}</dt>
            <dd
              className={css({
                margin: '0',
                textAlign: 'right',
                fontWeight: 'bold',
                color: r.hot ? 'accentAlt' : 'text',
              })}
            >
              {r.v}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
