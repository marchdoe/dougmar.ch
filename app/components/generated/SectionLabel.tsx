import { css } from '../../../styled-system/css'

export function SectionLabel({ children }: { children: string }) {
  return (
    <h2
      className={css({
        fontFamily: 'body',
        textStyle: 'xs',
        fontWeight: 'bold',
        letterSpacing: 'widest',
        textTransform: 'uppercase',
        color: 'textMuted',
        paddingBottom: '10px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderColor: 'borderStrong',
      })}
    >
      {children}
    </h2>
  )
}
