import { css } from '../../../styled-system/css'
import { Ground } from '../Material'
import type { Project } from '../../content/projects'

export function CaseStudyHero({ project }: { project: Project }) {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'field',
        color: 'fieldInk',
        padding: { base: '40px 20px 44px', lg: '64px 56px 56px' },
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
          {project.type} · {project.year}
        </p>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            textStyle: '4xl',
            color: 'fieldInk',
            maxWidth: '20ch',
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
            gap: '3 6',
            alignItems: 'baseline',
            borderTop: '1px solid',
            borderBottom: '1px solid',
            borderColor: 'fieldBorder',
            padding: '4 0',
            marginTop: '6',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '160ms',
          })}
        >
          {project.role && (
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: 'lg',
                color: 'fieldInk',
              })}
            >
              {project.role}
            </span>
          )}
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
          <span
            className={css({
              fontSize: 'xs',
              letterSpacing: 'wider',
              textTransform: 'uppercase',
              color: 'fieldInkMuted',
            })}
          >
            {project.year}
          </span>
        </div>
      </div>
    </section>
  )
}
