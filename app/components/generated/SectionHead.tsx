import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function SectionHead({ children, spaced }: { children: ReactNode; spaced?: boolean }) {
  return (
    <h2
      className={css({
        fontFamily: 'body',
        fontSize: 'xs',
        fontWeight: 'bold',
        letterSpacing: 'widest',
        textTransform: 'uppercase',
        color: 'textFaint',
        marginTop: spaced ? '8' : '0',
        marginBottom: '5',
        paddingBottom: '3',
        borderBottom: '1px solid',
        borderColor: 'fieldBorder',
      })}
    >
      {children}
    </h2>
  )
}
