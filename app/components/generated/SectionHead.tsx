import { css } from '../../../styled-system/css'

export function SectionHead({ label }: { label: string }) {
  return (
    <h2
      className={css({
        fontFamily: 'body',
        fontWeight: 'bold',
        textStyle: 'base',
        fontVariant: 'small-caps',
        letterSpacing: 'widest',
        color: 'textMuted',
        textAlign: 'center',
        marginBottom: '4',
      })}
    >
      {label}
    </h2>
  )
}
