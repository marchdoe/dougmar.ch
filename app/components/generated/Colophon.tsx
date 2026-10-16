import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { LedgerRow } from './LedgerRow'

const hot = css({ color: 'accent', fontWeight: 'bold', fontVariantNumeric: 'tabular-nums' })

export function Colophon() {
  return (
    <footer
      className={css({
        bg: 'bg',
        paddingTop: { base: '6', md: '64px' },
        paddingBottom: { base: '56px', md: '72px' },
        paddingInline: { base: '4', md: '6vw' },
      })}
    >
      <hr
        className={css({
          border: '0',
          borderTop: '2px solid',
          borderTopColor: 'borderStrong',
          marginBottom: '28px',
        })}
      />
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
          columnGap: { base: '0', md: '56px' },
        })}
      >
        <LedgerRow label="Detroit" lead>
          Red Wings take it, <span className={hot}>2–1</span>, Oct 15.
        </LedgerRow>
        <LedgerRow label="Markets">
          SPY 771.79 <span className={hot}>▲ 0.28%</span>
        </LedgerRow>
        <LedgerRow label="Weather">Aldie, VA · light rain · 60.6°F</LedgerRow>
        <LedgerRow label="Sky">First-quarter moon, 33% · ↑ 07:28, ↓ 18:22</LedgerRow>
        <LedgerRow label="Golf">Butterfield Bermuda Championship · scheduled</LedgerRow>
        <LedgerRow label="On rotation">
          <span className={css({ color: 'textFaint' })}>
            The War on Drugs, My Morning Jacket, Radiohead
          </span>
        </LedgerRow>
      </div>
      <div
        className={css({
          marginTop: '5',
          fontSize: 'xs',
          letterSpacing: 'wide',
          color: 'textFaint',
        })}
      >
        {identity.name} · {identity.role} ·{' '}
        <a
          href={`mailto:${identity.email}`}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            color: 'text',
            textDecoration: 'underline',
            textDecorationColor: 'accent',
            textUnderlineOffset: '4px',
          })}
        >
          {identity.email}
        </a>
      </div>
    </footer>
  )
}
