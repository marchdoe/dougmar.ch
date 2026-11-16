import { css } from '../../../styled-system/css'

export function CaseSection({ label, text }: { label: string; text?: string }) {
  if (!text) return null
  return (
    <div>
      {/* accentAlt in the light scheme clears the gold field better than accent at label size */}
      <h2
        className={css({
          marginTop: '6',
          marginBottom: '3',
          textStyle: 'sm',
          fontWeight: 'bold',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: { base: 'accent', _light: 'accentAlt' },
        })}
      >
        {label}
      </h2>
      <p
        className={css({
          textStyle: 'lede',
          lineHeight: 'normal',
          color: 'text',
          maxWidth: '50ch',
        })}
      >
        {text}
      </p>
    </div>
  )
}
