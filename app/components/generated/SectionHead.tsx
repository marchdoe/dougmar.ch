import { css } from '../../../styled-system/css'

export function SectionHead({ children }: { children: string }) {
  return (
    <h2
      className={css({
        fontFamily: 'body',
        textStyle: '2xs',
        textTransform: 'uppercase',
        letterSpacing: 'widest',
        color: 'textMuted',
        fontWeight: 'normal',
        marginBottom: '4',
      })}
    >
      {children}
    </h2>
  )
}
