import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import type { projects } from '../../content/projects'
import { BrandLockup } from '../BrandLockup'
import { Ground } from '../Material'

type Project = (typeof projects)[number] & { timeline?: string; status?: string }

const linkClass = css({
  fontFamily: 'display',
  fontSize: '15px',
  fontVariant: 'small-caps',
  letterSpacing: 'wide',
  color: 'text',
  display: 'inline-block',
  minHeight: '44px',
  minWidth: '44px',
  lineHeight: '44px',
  paddingInline: '4px',
  textAlign: 'center',
  textDecoration: 'underline',
  textDecorationColor: 'accent',
  textUnderlineOffset: '0.18em',
})

function caseFacts(project: Project): string[] {
  const raw = [project.timeline ?? String(project.year), project.role, project.status]
  const kept = raw.filter(
    (f): f is string => typeof f === 'string' && f !== '' && f !== project.type
  )
  return Array.from(new Set(kept))
}

export function CaseHero({ project }: { project: Project }) {
  const facts = caseFacts(project)
  return (
    <header
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'bg',
        paddingTop: 'clamp(34px, 6vw, 76px)',
        paddingInline: 'clamp(28px, 6vw, 112px)',
        paddingBottom: 'clamp(48px, 6vw, 96px)',
      })}
    >
      <Ground material="rule" seed={709202928} />
      <div className={css({ position: 'relative', zIndex: 1 })}>
        <BrandLockup variant="stacked-lg" mode="original" />
        <div
          className={css({
            marginTop: 'clamp(28px, 5vw, 60px)',
            fontFamily: 'display',
            fontSize: '13px',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            color: 'textMuted',
            bg: 'bg',
            width: 'fit-content',
            marginBottom: '10px',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          {project.type}
        </div>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            color: 'text',
            lineHeight: '0.9',
            letterSpacing: '-0.03em',
            fontSize: { base: 'clamp(40px, 11vw, 62px)', md: 'clamp(72px, 9.5vw, 148px)' },
            marginBottom: '20px',
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
            columnGap: '24px',
            rowGap: '6px',
            fontFamily: 'display',
            fontSize: '14px',
            color: 'text',
            bg: 'bg',
            width: 'fit-content',
            marginBottom: '20px',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '160ms',
          })}
        >
          {facts.map((fact) => (
            <span key={fact}>{fact}</span>
          ))}
        </div>
        <p
          className={css({
            fontFamily: 'body',
            fontSize: '16px',
            color: 'textMuted',
            bg: 'bg',
            width: 'fit-content',
            lineHeight: '2.5',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '240ms',
          })}
        >
          Back to the{' '}
          <a href="/#work" className={linkClass}>
            work
          </a>
          , read the{' '}
          <a href="/about" className={linkClass}>
            about
          </a>
          , or{' '}
          <a href={`mailto:${identity.email}`} className={linkClass}>
            get in touch
          </a>
          .
        </p>
      </div>
    </header>
  )
}
