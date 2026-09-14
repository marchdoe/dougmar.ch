import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Sidebar } from './Sidebar'
import { DatelineFooter } from './generated/DatelineFooter'
import { Section } from './generated/Section'
import { identity } from '../content/about'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({ minHeight: '100dvh', display: 'flex', flexDirection: 'column', bg: 'bg' })}
    >
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: '1fr 320px' },
          gridTemplateAreas: { base: `"sidebar" "main"`, lg: `"main sidebar"` },
          alignItems: 'start',
        })}
      >
        <div
          className={css({
            gridArea: 'sidebar',
            position: { lg: 'sticky' },
            top: { lg: '0' },
          })}
        >
          <Sidebar />
        </div>
        <div className={css({ gridArea: 'main', minWidth: 0 })}>{children}</div>
      </div>
      <Section>
        <DatelineFooter email={identity.email} />
      </Section>
    </div>
  )
}
