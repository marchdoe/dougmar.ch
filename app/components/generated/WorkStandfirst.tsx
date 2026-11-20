import { css } from '../../../styled-system/css'

export function WorkStandfirst({ text }: { text?: string }) {
  if (!text) return null
  return (
    <p
      className={css({
        fontSize: { base: 'lede', lg: 'lg' },
        lineHeight: 'snug',
        color: 'textMuted',
        maxWidth: '46ch',
        marginTop: '5',
        marginBottom: '0',
      })}
    >
      {text}
    </p>
  )
}
