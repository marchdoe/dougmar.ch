import { css } from '../../../styled-system/css'
import { heroProject } from './heroProject'

export function MetaLine() {
  const f = heroProject
  const parts = f ? [f.type, String(f.year), f.role ?? ''] : []
  const line = parts.filter(Boolean).join(' · ')
  return (
    <p
      className={css({
        textStyle: 'sm',
        fontWeight: 'normal',
        letterSpacing: 'wider',
        textTransform: 'uppercase',
        lineHeight: '1.6',
        maxWidth: '38ch',
        color: 'textMuted',
        animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: '80ms',
      })}
    >
      {line}
      {line ? <br /> : null}
      <span className={css({ color: 'accentAlt' })}>
        Hero World Challenge. Field set, no card yet.
      </span>
    </p>
  )
}
