import { css } from '../../styled-system/css'
import { identity } from '../content/about'

// Baseline identity row. The shell is folded into the hero, so this
// component carries the single mono footer line beneath the index.
const item = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  _before: {
    content: '""',
    display: 'inline-block',
    width: '4px',
    height: '4px',
    bg: 'textFaint',
    marginRight: '14px',
  },
  _first: { _before: { display: 'none' } },
})

const link = css({
  color: 'accent',
  paddingBlock: '12px',
  paddingInline: '4px',
  lineHeight: '20px',
  _hover: { textDecoration: 'underline' },
})

export function Sidebar() {
  return (
    <footer id="contact" className={css({ bg: 'bg', paddingInline: 'clamp(20px, 5vw, 72px)' })}>
      <div
        className={css({
          borderTopWidth: '2px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
          paddingTop: 'clamp(20px, 3vw, 32px)',
          paddingBottom: 'clamp(28px, 4vw, 40px)',
          fontFamily: 'display',
          fontVariant: 'small-caps',
          textStyle: 'sm',
          letterSpacing: 'wide',
          color: 'textMuted',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          rowGap: '4px',
          columnGap: '14px',
        })}
      >
        <span className={item}>{identity.name}</span>
        <span className={item}>{identity.role}</span>
        <span className={item}>Ashburn, Virginia</span>
        <span className={item}>2026</span>
        <span className={item}>
          <a href={`mailto:${identity.email}`} className={link}>
            {identity.email}
          </a>
        </span>
        <span className={item}>
          <a href="/about" className={link}>
            About
          </a>
        </span>
      </div>
    </footer>
  )
}
