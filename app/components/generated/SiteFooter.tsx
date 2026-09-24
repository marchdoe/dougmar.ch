import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

export function SiteFooter() {
  return (
    <footer
      className={css({
        paddingBlock: '28px',
        paddingInline: '6vw',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        rowGap: '14px',
        columnGap: '22px',
        fontFamily: 'body',
        fontSize: 'xs',
        color: 'textFaint',
        bg: 'bg',
      })}
    >
      <span
        className={css({
          fontFamily: 'display',
          fontWeight: 600,
          letterSpacing: 'tight',
          color: 'text',
          fontSize: 'sm',
        })}
      >
        {identity.name}
      </span>
      <span>{identity.role}</span>
      <span>© 2026</span>
      <a
        href={`mailto:${identity.email}`}
        className={css({
          color: 'accent',
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
        })}
      >
        {identity.email}
      </a>
      <span className={css({ marginLeft: 'auto' })}>Ashburn, Virginia</span>
    </footer>
  )
}
