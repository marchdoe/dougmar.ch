import { css } from '../../../styled-system/css'
import { Ground } from '../Material'
import { ClientChips } from './ClientChips'

type Client = { name: string; logo?: string }
type FeaturedProject = {
  title: string
  type: string
  year: number
  role?: string
  problem?: string
  externalUrl?: string
  clients?: Client[]
}

// mockup accentLt (#5CCB8C) has no exact token; using accentAlt as the nearest saturated accent register
export function ThesisPanel({ project }: { project: FeaturedProject }) {
  return (
    <section
      aria-labelledby="phrase"
      className={css({
        position: 'relative',
        overflow: 'hidden',
        minWidth: 0,
        bg: 'field',
        color: 'fieldInk',
        display: 'flex',
        flexDirection: 'column',
        gap: '5',
        justifyContent: 'space-between',
        padding: { base: '5', md: '7' },
      })}
    >
      <Ground material="rule" seed={1942557463} />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '5',
          minWidth: 0,
        })}
      >
        <div className={css({ minWidth: 0 })}>
          <p
            className={css({
              fontFamily: 'body',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 'wider',
              fontSize: 'xs',
              color: 'accentAlt',
              animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '80ms',
            })}
          >
            Featured Work &middot; The Argument
          </p>
          <div
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: { base: 'xl', md: '2xl', lg: '3xl' },
              lineHeight: 'tight',
              letterSpacing: 'tight',
              color: 'fieldInk',
              overflowWrap: 'anywhere',
              wordBreak: 'break-word',
              animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '160ms',
            })}
          >
            {project.title}
          </div>
          <div
            className={css({
              display: 'flex',
              flexWrap: 'wrap',
              gap: '4',
              fontSize: 'sm',
              color: 'fieldInkMuted',
              borderTop: '1px solid',
              borderBottom: '1px solid',
              borderColor: 'fieldBorder',
              padding: '3',
              marginTop: '3',
            })}
          >
            <span>
              <b>{project.type}</b>
            </span>
            <span>
              <b>{project.year}</b>
            </span>
            {project.role ? (
              <span>
                Role &middot; <b>{project.role}</b>
              </span>
            ) : null}
          </div>
        </div>

        <div className={css({ minWidth: 0 })}>
          <h1
            id="phrase"
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: { base: 'lg', md: 'xl', lg: '2xl' },
              lineHeight: 'tight',
              letterSpacing: 'tight',
              color: 'fieldInk',
              maxWidth: '20ch',
              overflowWrap: 'anywhere',
              animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '0ms',
            })}
          >
            Most golf apps are digital scorecards. This one is not.
          </h1>
          {project.problem ? (
            <p
              className={css({
                marginTop: '3',
                maxWidth: '60ch',
                color: 'fieldInkMuted',
                fontSize: 'base',
                lineHeight: 'loose',
              })}
            >
              {project.problem}
            </p>
          ) : null}
        </div>

        {project.externalUrl ? (
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener"
            className={css({
              alignSelf: 'flex-start',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2',
              bg: 'accent',
              color: 'fieldInk',
              fontWeight: 'bold',
              fontSize: 'sm',
              padding: '3',
              borderRadius: 'sm',
              minHeight: '44px',
              animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '240ms',
            })}
          >
            Visit {project.title} &rarr;
          </a>
        ) : null}

        {project.clients ? (
          <div className={css({ display: 'flex', flexDirection: 'column', gap: '3', minWidth: 0 })}>
            <p
              className={css({
                fontFamily: 'body',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: 'wide',
                fontSize: 'sm',
                color: 'fieldInkMuted',
              })}
            >
              Built with, and for, teams like
            </p>
            <ClientChips clients={project.clients} />
          </div>
        ) : null}
      </div>
    </section>
  )
}
