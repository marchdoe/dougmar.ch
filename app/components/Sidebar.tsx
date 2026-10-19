import { css } from '../../styled-system/css'
import { identity } from '../content/about'

const signals = [
  { label: 'Detroit', value: 'Lions, Tigers, Pistons, Red Wings, off-season', note: '' },
  { label: 'Markets · SPY', value: '763.25', note: '▼1.1%' },
  { label: 'Moon', value: 'First quarter, 65% lit', note: '' },
  { label: 'On the tour', value: 'Butterfield Bermuda Championship, scheduled', note: '' },
  { label: 'On rotation', value: 'Tobin Sprout, Radiohead', note: '' },
  { label: 'Sky', value: 'Aldie, Virginia, 40°F, clear', note: '' },
]

const footLink = css({
  display: 'inline-block',
  minHeight: '44px',
  minWidth: '44px',
  paddingBlock: '10px',
  lineHeight: '24px',
  fontSize: 'sm',
  fontWeight: 'bold',
})

export function Sidebar() {
  return (
    <footer
      className={css({
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        paddingTop: '40px',
        paddingBottom: '56px',
        paddingInline: { base: '24px', sm: '6vw' },
        fontVariantNumeric: 'tabular-nums',
        fontFamily: 'body',
        bg: 'bg',
      })}
    >
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          rowGap: { base: '26px', lg: '34px' },
          columnGap: { base: '32px', lg: '40px' },
        })}
      >
        {signals.map((s) => (
          <div key={s.label}>
            <div
              className={css({
                fontSize: '2xs',
                letterSpacing: 'widest',
                textTransform: 'uppercase',
                color: 'textMuted',
                fontWeight: 'bold',
                marginBottom: '6px',
              })}
            >
              {s.label}
            </div>
            <p className={css({ textStyle: 'base', color: 'text', lineHeight: 'snug' })}>
              {s.value}{' '}
              <span className={css({ color: 'accent', fontWeight: 'bold' })}>{s.note}</span>
            </p>
          </div>
        ))}
        <div
          className={css({
            gridColumn: '1 / -1',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'border',
            paddingTop: '22px',
            marginTop: '4px',
          })}
        >
          <blockquote
            className={css({
              margin: '0',
              textStyle: 'base',
              lineHeight: 'normal',
              color: 'text',
              maxWidth: '56ch',
              fontStyle: 'italic',
            })}
          >
            Wise men speak because they have something to say; fools because they have to say
            something.
          </blockquote>
          <cite
            className={css({
              display: 'block',
              marginTop: '10px',
              fontSize: 'xs',
              color: 'textMuted',
              fontStyle: 'normal',
              letterSpacing: 'wide',
            })}
          >
            Plato
          </cite>
        </div>
      </div>
      <div
        className={css({
          marginTop: '34px',
          fontSize: 'xs',
          color: 'textFaint',
          letterSpacing: 'wide',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          columnGap: '4',
        })}
      >
        <span>
          {identity.name}, {identity.role}
        </span>
        <a href="/about" className={footLink}>
          about
        </a>
        <a href={`mailto:${identity.email}`} className={footLink}>
          {identity.email}
        </a>
      </div>
    </footer>
  )
}
