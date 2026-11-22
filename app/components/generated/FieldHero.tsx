import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'

type FieldHeroProps = { label: string; place?: ReactNode; children: ReactNode }

export function FieldHero({ label, place, children }: FieldHeroProps) {
  return (
    <section
      className={css({
        position: 'relative',
        bg: 'field',
        color: 'fieldInk',
        minHeight: '62vh',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '28px',
        paddingInline: '20px',
        paddingBottom: '44px',
        md: { paddingTop: '48px', paddingInline: '6vw', paddingBottom: '64px' },
      })}
    >
      <span
        className={css({
          position: 'absolute',
          left: '12px',
          bottom: '40px',
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          textStyle: '2xs',
          letterSpacing: 'wider',
          textTransform: 'lowercase',
          color: 'fieldInkMuted',
          fontWeight: 'bold',
          md: { left: '6vw', bottom: '64px' },
        })}
      >
        {label}
      </span>
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          paddingLeft: '28px',
          md: { paddingLeft: '40px' },
        })}
      >
        <a
          href="/"
          aria-label="Doug March, home"
          className={css({ display: 'inline-flex', alignSelf: 'flex-start', color: 'fieldInk' })}
        >
          <BrandLockup variant="mark-only-md" mode="original" />
        </a>
        {place}
      </div>
      {children}
    </section>
  )
}
