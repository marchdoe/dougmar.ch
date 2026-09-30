import { css } from '../../../styled-system/css'

export function ExtLink({ href, label }: { href?: string; label: string }) {
  if (!href) return null
  return (
    <a
      href={href}
      className={css({
        display: 'inline-flex',
        alignItems: 'center',
        gap: '2',
        marginTop: '3',
        minHeight: '44px',
        paddingBlock: '3',
        paddingInline: '1',
        textStyle: 'sm',
        fontWeight: 'bold',
        color: { base: 'accentAlt', _light: 'text' },
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'transparent',
        _hover: { borderBottomColor: 'accentAlt' },
        animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: '240ms',
      })}
    >
      {label} <span aria-hidden="true">↗</span>
    </a>
  )
}
