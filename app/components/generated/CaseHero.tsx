import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { HeroTopbar } from './HeroTopbar'

type Project = (typeof projects)[number]

export function CaseHero({ project, full }: { project: Project; full: boolean }) {
  const meta = [project.type, String(project.year), project.role].filter(Boolean).join(' · ')
  return (
    <header
      className={css({
        position: 'relative',
        paddingTop: 'clamp(28px, 5vw, 56px)',
        paddingBottom: 'clamp(48px, 7vw, 112px)',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        bg: 'surface',
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'borderStrong',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 'clamp(28px, 4vw, 44px)',
      })}
    >
      <HeroTopbar />
      <div
        className={css({ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2vw, 24px)' })}
      >
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: 'clamp(44px, 9vw, 140px)',
            lineHeight: '0.9',
            letterSpacing: '-0.03em',
            textTransform: 'lowercase',
            textAlign: 'left',
            color: 'text',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {project.title}
        </h1>
        <div
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '16px',
            fontSize: '2xs',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'textMuted',
            fontWeight: 'bold',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          <span>{meta}</span>
          {(project.clients ?? []).map((c) =>
            c.logo ? (
              <img
                key={c.name}
                src={c.logo}
                alt={c.name}
                className={css({
                  height: '28px',
                  width: 'auto',
                  maxWidth: '120px',
                  objectFit: 'contain',
                })}
              />
            ) : (
              <span key={c.name} className={css({ color: 'textMuted' })}>
                {c.name}
              </span>
            )
          )}
        </div>
        {full && project.problem ? (
          <p
            className={css({
              fontFamily: 'display',
              fontWeight: 'normal',
              fontSize: 'clamp(20px, 2.4vw, 32px)',
              lineHeight: '1.2',
              color: 'textMuted',
              maxWidth: '40ch',
              animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '160ms',
            })}
          >
            {project.problem}
          </p>
        ) : null}
      </div>
    </header>
  )
}
