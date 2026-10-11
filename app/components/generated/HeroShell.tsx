import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'
import { Ground } from '../Material'

type HeroShellProps = { lead: ReactNode; aside?: ReactNode; tall?: boolean }

export function HeroShell({ lead, aside, tall = false }: HeroShellProps) {
  return (
    <header
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'bg',
        minHeight: tall ? '88vh' : 'auto',
        paddingTop: 'clamp(28px, 6vw, 56px)',
        paddingBottom: 'clamp(40px, 6vw, 64px)',
        paddingInline: 'clamp(28px, 6vw, 108px)',
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      <Ground material="rule" seed={960374345} />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(30px, 5vw, 44px)',
          lg: {
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            columnGap: '24px',
            rowGap: '0',
            alignItems: 'stretch',
          },
        })}
      >
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            lg: { gridColumn: '1 / 8' },
          })}
        >
          <BrandLockup
            variant="stacked-lg"
            mode="single-color"
            className={css({ alignSelf: 'flex-start', color: 'text' })}
          />
          {lead}
        </div>
        {aside ? (
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              lg: { gridColumn: '8 / 13' },
            })}
          >
            {aside}
          </div>
        ) : null}
      </div>
    </header>
  )
}
