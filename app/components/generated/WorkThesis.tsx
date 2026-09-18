import { css } from '../../../styled-system/css'
import { Ground } from '../Material'

type Client = { name: string; logo?: string }
type Project = {
  title: string
  type: string
  year: number
  role?: string
  liveUrl?: string
  clients?: Client[]
}

// mockup accentLt (#5CCB8C) has no exact token; using accentAlt as the nearest saturated accent register
export function WorkThesis({ project }: { project: Project }) {
  return (
    <section
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
              fontSize: 'sm',
              color: 'accentAlt',
              animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '80ms',
            })}
          >
            Case Study
          </p>
          <h1
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: { base: '2xl', md: '3xl', lg: '4xl' },
              lineHeight: 'tight',
              letterSpacing: 'tight',
              color: 'fieldInk',
              overflowWrap: 'anywhere',
              wordBreak: 'break-word',
              animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '0ms',
            })}
          >
            {project.title}
          </h1>
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
      </div>
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener"
          className={css({
            position: 'relative',
            zIndex: 1,
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
            animationDelay: '160ms',
          })}
        >
          Visit live &rarr;
        </a>
      ) : null}
      {project.clients ? (
        <div
          className={css({
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2',
            minWidth: 0,
          })}
        >
          {project.clients.map((c) => (
            <span
              key={c.name}
              className={css({
                bg: 'surface',
                color: 'text',
                borderRadius: 'sm',
                padding: '2',
                fontSize: 'xs',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
              })}
            >
              {c.logo ? (
                <img src={c.logo} alt={c.name} className={css({ maxHeight: '18px' })} />
              ) : (
                c.name
              )}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  )
}
