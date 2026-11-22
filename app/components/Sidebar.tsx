import { css } from '../../styled-system/css'
import { identity } from '../content/about'

const sep = css({ color: 'textFaint', fontWeight: 'normal', paddingInline: '4px' })

const sigLink = css({
  color: 'accent',
  display: 'inline-block',
  paddingBlock: '10px',
  paddingInline: '6px',
  minHeight: '44px',
  lineHeight: '24px',
  _hover: { color: 'accentAlt' },
})

export function Sidebar() {
  return (
    <footer
      className={css({
        borderTop: '1px solid',
        borderColor: 'borderStrong',
        paddingTop: '28px',
        paddingInline: '20px',
        paddingBottom: '48px',
        textAlign: 'right',
        bg: 'bg',
        md: { paddingTop: '32px', paddingInline: '6vw', paddingBottom: '64px' },
      })}
    >
      <p
        className={css({
          textStyle: 'base',
          color: 'text',
          fontWeight: 'bold',
          letterSpacing: '-0.005em',
        })}
      >
        {identity.name}
        <span className={sep}>·</span>
        {identity.role}
        <span className={sep}>·</span>
        Ashburn, VA
        <span className={sep}>·</span>
        2026{' '}
        <a href="/about" className={sigLink}>
          about
        </a>
        <span className={sep}>·</span>
        <a href={`mailto:${identity.email}`} className={sigLink}>
          contact
        </a>
      </p>
      <p
        className={css({
          marginTop: '10px',
          textStyle: 'sm',
          color: 'textFaint',
          lineHeight: 'normal',
          maxWidth: '60ch',
          marginLeft: 'auto',
        })}
      >
        On rotation: Tobin Sprout, My Morning Jacket, The War on Drugs.
      </p>
    </footer>
  )
}
