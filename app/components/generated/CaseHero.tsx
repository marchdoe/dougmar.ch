import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { BrandLockup } from '../BrandLockup'
import { Ground } from '../Material'
import { CaseMeta } from './CaseMeta'
import { RunningSentence } from './RunningSentence'

type Project = (typeof projects)[number]

export function CaseHero({ project }: { project: Project }) {
  return (
    <header
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'bg',
        paddingBlock: 'clamp(22px, 6vw, 56px)',
        paddingInline: 'clamp(20px, 6vw, 80px)',
      })}
    >
      <Ground material="rule" seed={960521440} />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: 'repeat(12, minmax(0, 1fr))' },
          rowGap: 'clamp(26px, 4vh, 40px)',
          columnGap: { base: '0px', lg: 'clamp(16px, 2vw, 32px)' },
        })}
      >
        <div className={css({ gridColumn: { lg: '1 / 13' }, gridRow: { lg: '1' } })}>
          <BrandLockup variant="stacked-md" mode="original" />
        </div>
        <div
          className={css({
            gridColumn: { lg: '1 / 9' },
            gridRow: { lg: '2' },
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            minWidth: '0',
          })}
        >
          {/* eyebrow in text ink on a flat bg box so it clears 4.5:1 over the ruled ground */}
          <span
            className={css({
              display: 'block',
              width: 'fit-content',
              alignSelf: 'flex-start',
              bg: 'bg',
              paddingBlock: '2px',
              paddingInline: '8px',
              borderLeftWidth: '3px',
              borderLeftStyle: 'solid',
              borderLeftColor: 'accent',
              fontSize: 'sm',
              fontWeight: 'bold',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'text',
              animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '80ms',
            })}
          >
            Case study · {project.year}
          </span>
          <h1
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontVariant: 'all-small-caps',
              letterSpacing: '0.015em',
              lineHeight: '0.92',
              textAlign: 'left',
              fontSize: { base: '3xl', lg: 'hero' },
              color: 'text',
              animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '0ms',
            })}
          >
            {project.title}
          </h1>
        </div>
        <CaseMeta project={project} />
        <RunningSentence
          className={css({
            gridColumn: { lg: '1 / 9' },
            gridRow: { lg: '3' },
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '240ms',
          })}
        />
      </div>
    </header>
  )
}
