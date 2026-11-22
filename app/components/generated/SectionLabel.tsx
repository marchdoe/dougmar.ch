import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

const plain = css({
  textStyle: 'sm',
  textTransform: 'lowercase',
  letterSpacing: 'wide',
  color: 'textFaint',
  fontWeight: 'bold',
  marginTop: '48px',
  marginBottom: '20px',
  textAlign: 'left',
  md: { marginTop: '56px', marginBottom: '24px' },
})

const ruledCss = css({
  textStyle: 'sm',
  textTransform: 'lowercase',
  letterSpacing: 'wide',
  color: 'textFaint',
  fontWeight: 'bold',
  marginTop: '112px',
  marginBottom: '20px',
  paddingTop: '28px',
  borderTop: '1px solid',
  borderColor: 'borderStrong',
  textAlign: 'left',
  md: { marginBottom: '24px' },
})

export function SectionLabel({
  ruled = false,
  children,
}: {
  ruled?: boolean
  children: ReactNode
}) {
  return <h2 className={ruled ? ruledCss : plain}>{children}</h2>
}
