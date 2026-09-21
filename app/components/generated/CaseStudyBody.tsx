import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

function Block({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <span
        className={css({
          display: 'block',
          fontFamily: 'body',
          fontWeight: 'bold',
          fontSize: 'xs',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          color: 'textFaint',
          marginBottom: '4',
        })}
      >
        {label}
      </span>
      <p
        className={css({
          fontFamily: 'body',
          fontSize: 'sm',
          lineHeight: 'loose',
          color: 'text',
          maxWidth: '46ch',
        })}
      >
        {text}
      </p>
    </div>
  )
}

export function CaseStudyBody({ project }: { project: Project }) {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingInline: { base: '6vw', lg: '5vw' },
        paddingBlock: '9',
        display: 'flex',
        flexDirection: 'column',
        gap: '8',
      })}
    >
      {project.problem ? <Block label="Problem" text={project.problem} /> : null}
      {project.approach ? <Block label="Approach" text={project.approach} /> : null}
      {project.outcome ? <Block label="Outcome" text={project.outcome} /> : null}
      {project.stack && project.stack.length > 0 ? (
        <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '3' })}>
          {project.stack.map((tech) => (
            <span
              key={tech}
              className={css({
                fontFamily: 'body',
                fontWeight: 'bold',
                fontSize: 'xs',
                letterSpacing: 'wide',
                textTransform: 'uppercase',
                color: 'textFaint',
                border: '1px solid',
                borderColor: 'border',
                borderRadius: 'sm',
                paddingInline: '3',
                paddingBlock: '1',
              })}
            >
              {tech}
            </span>
          ))}
        </div>
      ) : null}
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          className={css({
            display: 'inline-block',
            fontFamily: 'body',
            fontWeight: 'bold',
            fontSize: 'sm',
            color: 'accent',
            paddingBlock: '2',
          })}
        >
          Visit the live project.
        </a>
      ) : null}
    </section>
  )
}
