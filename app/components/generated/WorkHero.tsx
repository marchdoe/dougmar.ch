import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function WorkHero({ project, children }: { project: Project; children?: ReactNode }) {
  const detail = [project.year, project.role].filter(Boolean).join(' · ')
  return (
    <section
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '1.55fr 1fr' },
        marginTop: { lg: '-128px' },
      })}
    >
      <div
        className={css({
          bg: 'field',
          color: 'fieldInk',
          minHeight: { base: '36vh', lg: '52vh' },
          paddingTop: { base: '40px', lg: '96px' },
          paddingBottom: { base: '40px', lg: '64px' },
          paddingInline: { base: '14px', lg: 'clamp(32px, 4vw, 64px)' },
        })}
      >
        <div
          className={css({ position: { lg: 'sticky' }, top: { lg: '64px' }, textAlign: 'right' })}
        >
          <p
            className={css({
              textStyle: 'sm',
              fontWeight: 'bold',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'fieldInkMuted',
              marginBottom: { base: '16px', lg: '24px' },
              animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '80ms',
            })}
          >
            {project.type}
          </p>
          <h1
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontVariant: 'small-caps',
              fontSize: 'clamp(48px, 8vw, 124px)',
              lineHeight: '0.9',
              letterSpacing: '-0.015em',
              color: 'fieldInk',
              marginBottom: { base: '20px', lg: '28px' },
              animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '0ms',
            })}
          >
            {project.title}
          </h1>
          <p
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontVariant: 'small-caps',
              textTransform: 'lowercase',
              fontSize: 'clamp(17px, 2.4vw, 22px)',
              letterSpacing: '0.04em',
              color: 'fieldInk',
              animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '160ms',
            })}
          >
            {detail}
          </p>
        </div>
      </div>
      <div
        className={css({
          _empty: { display: 'none' },
          paddingTop: { base: '26px', lg: '168px' },
          paddingInline: { base: '14px', lg: 'clamp(28px, 3vw, 52px)' },
          paddingBottom: { base: '40px', lg: '56px' },
        })}
      >
        {children}
      </div>
    </section>
  )
}
