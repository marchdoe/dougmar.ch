import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

const items = [
  { b: 'LIONS', t: '19–15 Final' },
  { b: 'GOLF', t: 'Novak −25' },
  { b: 'SPY', t: '755.72 ▼1.77%' },
  { b: 'MOON', t: 'Last quarter 42%' },
  { b: 'ALDIE VA', t: 'Overcast 51°' },
]

const itemCss = css({
  paddingInline: '8px',
  '&:first-child': { paddingLeft: '0' },
  '&:not(:first-child)': {
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderLeftColor: 'borderStrong',
  },
})

const footLink = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  minWidth: '44px',
  paddingInline: '4px',
})

export function TickerFooter() {
  return (
    <footer
      className={css({
        bg: 'bgAlt',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        paddingTop: '18px',
        paddingBottom: '24px',
        paddingInline: { base: '6vw', lg: '5vw' },
      })}
    >
      <div
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: '2xs',
          textTransform: 'uppercase',
          letterSpacing: 'widest',
          color: 'textMuted',
          marginBottom: '10px',
        })}
      >
        Scoreboard Ticker
      </div>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          rowGap: '6px',
          fontSize: 'xs',
          color: 'textMuted',
          lineHeight: '1.7',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'border',
          paddingTop: '10px',
        })}
      >
        {items.map((i) => (
          <span key={i.b} className={itemCss}>
            <b
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                letterSpacing: 'wide',
                color: 'text',
              })}
            >
              {i.b}
            </b>{' '}
            {i.t}
          </span>
        ))}
        <span className={itemCss}>
          <span className={css({ fontStyle: 'italic' })}>
            “It’s kind of fun to do the impossible.”
          </span>{' '}
          Walt Disney
        </span>
      </div>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          columnGap: '16px',
          rowGap: '0',
          marginTop: '12px',
          fontSize: 'sm',
        })}
      >
        <span className={css({ color: 'text', fontWeight: 'bold' })}>{identity.name}</span>
        <span className={css({ color: 'textMuted' })}>{identity.role}</span>
        <a href="/#work" className={footLink}>
          Work
        </a>
        <a href="/about" className={footLink}>
          About
        </a>
        <a href={`mailto:${identity.email}`} className={footLink}>
          {identity.email}
        </a>
      </div>
    </footer>
  )
}
