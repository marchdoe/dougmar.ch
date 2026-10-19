import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

// Carries the body face for route content only, so the shell's font no longer
// cascades into anything rendered beside the route inside Layout.
export function PageFrame({ children }: { children: ReactNode }) {
  return <div className={css({ fontFamily: 'body', color: 'text', minWidth: '0' })}>{children}</div>
}
