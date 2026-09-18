import { css } from '../../../styled-system/css'

type Project = {
  problem?: string
  approach?: string
  outcome?: string
  stack?: string[]
}

function NarrativeBlock({ label, text }: { label: string; text?: string }) {
  if (!text) return null
  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '2', minWidth: 0 })}>
      <p
        className={css({
          fontFamily: 'body',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          fontSize: 'xs',
          color: 'accent',
        })}
      >
        {label}
      </p>
      <p
        className={css({ maxWidth: '62ch', color: 'text', fontSize: 'base', lineHeight: 'loose' })}
      >
        {text}
      </p>
    </div>
  )
}

export function WorkNarrative({ project }: { project: Project }) {
  return (
    <section
      className={css({
        bg: 'bg',
        color: 'text',
        minWidth: 0,
        padding: { base: '5', md: '7' },
        display: 'flex',
        flexDirection: 'column',
        gap: '5',
      })}
    >
      <NarrativeBlock label="Problem" text={project.problem} />
      <NarrativeBlock label="Approach" text={project.approach} />
      <NarrativeBlock label="Outcome" text={project.outcome} />
      {project.stack ? (
        <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '2' })}>
          {project.stack.map((tech) => (
            <span
              key={tech}
              className={css({
                bg: 'surface',
                color: 'textMuted',
                fontSize: 'xs',
                padding: '2',
                borderRadius: 'sm',
              })}
            >
              {tech}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  )
}
