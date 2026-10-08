import { css } from '../../../styled-system/css'

export function OutLink({ href, label }: { href?: string; label: string }) {
  if (!href) return null
  return (
    <a
      href={href}
      className={css({
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: '44px',
        paddingBlock: '10px',
        paddingInline: '0',
        fontWeight: 'bold',
        fontSize: 'sm',
      })}
    >
      {label}
    </a>
  )
}
