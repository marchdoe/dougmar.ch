import { css } from '../../styled-system/css'
import { identity } from '../content/about'

const valCls = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  textStyle: 'md',
  color: 'text',
  fontVariantNumeric: 'tabular-nums',
})
const scoreCls = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  textStyle: 'md',
  color: 'accent',
  fontVariantNumeric: 'tabular-nums',
})
const softCls = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  textStyle: 'base',
  color: 'textFaint',
  fontVariantNumeric: 'tabular-nums',
})

const signals = [
  { label: 'Pistons · Win', value: '129–125', cls: scoreCls },
  { label: 'SPY', value: '763.25 ▼ 1.11%', cls: softCls },
  { label: 'Aldie, VA · Moderate rain', value: '52°F', cls: valCls },
  { label: 'Moon · First quarter', value: '43% lit', cls: valCls },
  { label: 'In rotation', value: 'Guided by Voices, Wet Leg', cls: softCls },
]

const navLink = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '12px',
  paddingBlock: '12px',
  paddingInline: '0',
  minHeight: '44px',
  minWidth: '44px',
  fontFamily: 'body',
  fontWeight: 'bold',
  textStyle: 'sm',
  letterSpacing: 'wider',
  textTransform: 'uppercase',
  color: 'text',
  _hover: { color: 'accent', textDecoration: 'none' },
})
const navNum = css({ color: 'accent', fontVariantNumeric: 'tabular-nums' })
const lblCls = css({
  fontFamily: 'body',
  fontWeight: 'bold',
  textStyle: '2xs',
  letterSpacing: 'wider',
  textTransform: 'uppercase',
  color: 'textMuted',
})
const sigCls = css({ display: 'flex', flexDirection: 'column', gap: '5px', minWidth: '0' })

export function Sidebar() {
  const mail = `mailto:${identity.email}`
  return (
    <footer
      className={css({
        bg: 'surface',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        paddingBottom: 'clamp(32px, 4vw, 56px)',
        borderTopWidth: '3px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
      })}
    >
      <nav
        aria-label="Primary"
        className={css({
          display: 'flex',
          flexDirection: { base: 'column', sm: 'row' },
          flexWrap: { sm: 'wrap' },
          gap: { base: '2px', sm: 'clamp(20px, 4vw, 56px)' },
          paddingBlock: 'clamp(22px, 3vw, 34px)',
        })}
      >
        <a href="/work" className={navLink}>
          <span className={navNum}>01</span> Work
        </a>
        <a href="/about" className={navLink}>
          <span className={navNum}>02</span> About
        </a>
        <a href={mail} className={navLink}>
          <span className={navNum}>03</span> Contact
        </a>
      </nav>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          rowGap: 'clamp(16px, 2.4vw, 28px)',
          columnGap: 'clamp(24px, 3vw, 48px)',
          paddingTop: 'clamp(22px, 3vw, 30px)',
          borderTopWidth: '2px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
        })}
      >
        <div className={sigCls}>
          <span className={lblCls}>{identity.name}</span>
          <span className={valCls}>{identity.role}</span>
        </div>
        <div className={sigCls}>
          <span className={lblCls}>Write</span>
          <a
            href={mail}
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              textStyle: 'md',
              color: 'accent',
              overflowWrap: 'anywhere',
              minHeight: '44px',
            })}
          >
            {identity.email}
          </a>
        </div>
        {signals.map((s) => (
          <div key={s.label} className={sigCls}>
            <span className={lblCls}>{s.label}</span>
            <span className={s.cls}>{s.value}</span>
          </div>
        ))}
      </div>
    </footer>
  )
}
