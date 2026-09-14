import { css } from '../../../styled-system/css'
import { Ground } from '../Material'
import type { Project } from '../../content/projects'

export function HeroThesis({ project }: { project?: Project }) {
  const clientNames = project?.clients?.map((c) => c.name).join(', ')
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'field',
        color: 'fieldInk',
        padding: { base: '40px 20px 44px', lg: '64px 56px 56px' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      })}
    >
      <Ground material="rule" seed={2143888891} />
      <div className={css({ position: 'relative', zIndex: 1 })}>
        <p
          className={css({
            fontWeight: 'bold',
            fontSize: 'base',
            letterSpacing: 'widest',
            textTransform: 'uppercase',
            color: 'accent',
            marginBottom: '5',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          Featured · Studio
        </p>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            textStyle: '4xl',
            color: 'fieldInk',
            letterSpacing: 'tight',
            maxWidth: '20ch',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          <span className={css({ display: 'block' })}>
            Buildable before the first line of code.
          </span>
          <span className={css({ display: 'block' })}>Faithful after the last.</span>
        </h1>
        {project && (
          <p
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              textStyle: 'hero',
              lineHeight: 'tight',
              color: 'fieldInk',
              margin: '6 0 5',
              animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '160ms',
            })}
          >
            {project.title.toUpperCase()}
          </p>
        )}
        {project && (
          <div
            className={css({
              display: 'flex',
              flexWrap: 'wrap',
              gap: '3 6',
              alignItems: 'baseline',
              borderTop: '1px solid',
              borderBottom: '1px solid',
              borderColor: 'fieldBorder',
              padding: '4 0',
              marginBottom: '5',
              animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '240ms',
            })}
          >
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: 'lg',
                color: 'fieldInk',
              })}
            >
              {project.role ?? 'Founder'}
            </span>
            <span
              className={css({
                fontSize: 'xs',
                letterSpacing: 'wider',
                textTransform: 'uppercase',
                color: 'fieldInkMuted',
              })}
            >
              Est. {project.year}
            </span>
            <span
              className={css({
                fontSize: 'xs',
                letterSpacing: 'wider',
                textTransform: 'uppercase',
                color: 'fieldInkMuted',
              })}
            >
              {project.type}
            </span>
          </div>
        )}
        {project?.problem && (
          <p
            className={css({
              fontSize: 'md',
              lineHeight: 'normal',
              color: 'fieldInkMuted',
              maxWidth: '52ch',
              animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '240ms',
            })}
          >
            {project.problem}
            {clientNames ? (
              <>
                {' '}
                Clients carried through include{' '}
                <strong className={css({ color: 'fieldInk', fontWeight: 'bold' })}>
                  {clientNames}
                </strong>
                .
              </>
            ) : null}
          </p>
        )}
        {project && (
          <a
            href={`/work/${project.slug}`}
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2',
              marginTop: '5',
              fontWeight: 'bold',
              fontSize: 'base',
              color: 'accent',
              minHeight: '44px',
              animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '240ms',
            })}
          >
            <span
              className={css({
                borderBottom: '2px solid',
                borderColor: 'accent',
                paddingBottom: '1',
              })}
            >
              Open the case study
            </span>{' '}
            →
          </a>
        )}
      </div>
    </section>
  )
}
