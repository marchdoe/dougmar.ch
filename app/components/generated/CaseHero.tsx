import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CaseMeta } from './CaseMeta'
import { ClientChips } from './ClientChips'
import { Guides } from './Guides'

type Project = (typeof projects)[number]

export function CaseHero({ project }: { project: Project }) {
  return (
    <section
      className={css({
        bg: 'bgAlt',
        color: 'text',
        paddingTop: { base: '96px', lg: '120px' },
        paddingBottom: { base: '44px', lg: '76px' },
        paddingInline: { base: '20px', lg: '5vw' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        textAlign: 'right',
        gap: { base: '26px', lg: '34px' },
        overflow: 'hidden',
      })}
    >
      <p
        className={css({
          textStyle: 'sm',
          letterSpacing: 'wider',
          textTransform: 'lowercase',
          color: 'textMuted',
          '& em': { fontStyle: 'normal', color: 'accent' },
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        case study · set in dm serif display · <em>{project.type}</em>
      </p>
      <div
        className={css({
          position: 'relative',
          alignSelf: 'flex-end',
          maxWidth: '100%',
          paddingTop: '26px',
          paddingBottom: '22px',
        })}
      >
        <Guides />
        <h1
          className={css({
            position: 'relative',
            zIndex: 1,
            fontFamily: 'display',
            fontWeight: 'normal',
            fontSize: { base: '3xl', md: '5xl' },
            lineHeight: '0.95',
            letterSpacing: '-0.01em',
            color: 'text',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {project.title}
        </h1>
      </div>
      <CaseMeta project={project} />
      <ClientChips clients={project.clients ?? []} />
    </section>
  )
}
