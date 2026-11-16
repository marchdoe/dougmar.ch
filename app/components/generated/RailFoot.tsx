import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

export function RailFoot() {
  return (
    <footer
      className={css({
        marginTop: 'auto',
        paddingTop: '20px',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'fieldBorder',
        textStyle: 'xs',
        lineHeight: 'normal',
        // fieldInk in the dark scheme, where fieldInkMuted misses 4.5:1 on the gold field
        color: { base: 'fieldInk', _light: 'fieldInkMuted' },
      })}
    >
      <strong
        className={css({
          display: 'block',
          color: 'fieldInk',
          letterSpacing: 'wide',
          marginBottom: '3px',
        })}
      >
        {identity.name}
      </strong>
      {identity.role} · 2026
    </footer>
  )
}
