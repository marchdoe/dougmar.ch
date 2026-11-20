import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type CaseProject = (typeof projects)[number] & { timeline?: string; status?: string }

export function WorkFacts({ project }: { project: CaseProject }) {
  const facts = [
    { label: 'Stack', value: (project.stack ?? []).join(' · ') },
    { label: 'Timeline', value: project.timeline ?? '' },
    { label: 'Status', value: project.status ?? '' },
  ].filter((fact) => fact.value)
  return (
    <section
      aria-label="Facts"
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingBlock: '40px',
        paddingInline: 'clamp(40px, 6vw, 112px)',
        borderStyle: 'solid',
        borderColor: 'fieldBorder',
        borderTopWidth: '1px',
        borderBottomWidth: '1px',
        borderLeftWidth: '0',
        borderRightWidth: '0',
        display: { base: 'flex', sm: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: { sm: '1fr 1fr' },
        rowGap: '28px',
        columnGap: '48px',
      })}
    >
      {facts.map((fact) => (
        <div key={fact.label} className={css({ minWidth: '0' })}>
          <div
            className={css({
              textTransform: 'uppercase',
              letterSpacing: 'widest',
              fontSize: '2xs',
              fontWeight: 'bold',
              color: 'fieldInkMuted',
              marginBottom: '10px',
            })}
          >
            {fact.label}
          </div>
          <div
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: 'clamp(18px, 2.4vw, 21px)',
              lineHeight: 'snug',
            })}
          >
            {fact.value}
          </div>
        </div>
      ))}
      {project.liveUrl ? (
        <div>
          <a
            href={project.liveUrl}
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '44px',
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: 'lg',
              color: 'fieldInk',
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
              _hover: { color: 'fieldInkMuted', textDecorationColor: 'fieldInk' },
            })}
          >
            Visit the live project
          </a>
        </div>
      ) : null}
    </section>
  )
}
