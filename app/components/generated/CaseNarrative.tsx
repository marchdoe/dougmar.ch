import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Proj = (typeof projects)[number]

function NarrativeBlock({ label, head, body }: { label: string; head: string; body: string }) {
  return (
    <div
      className={css({ paddingBlock: '6', borderBottom: '1px solid', borderBottomColor: 'border' })}
    >
      <div
        className={css({
          fontSize: 'xs',
          fontWeight: 'bold',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'accent',
          marginBottom: '2',
        })}
      >
        {label}
      </div>
      <h2
        className={css({
          textStyle: '3xl',
          fontFamily: 'display',
          fontWeight: 'bold',
          letterSpacing: 'tight',
          marginBottom: '4',
        })}
      >
        {head}
      </h2>
      <p className={css({ fontSize: 'base', lineHeight: '1.6', color: 'text', maxWidth: '56ch' })}>
        {body}
      </p>
    </div>
  )
}

export function CaseNarrative({ project }: { project: Proj }) {
  const blocks = [
    { label: 'Problem', head: 'The problem', body: project.problem ?? '' },
    { label: 'Approach', head: 'The approach', body: project.approach ?? '' },
    { label: 'Outcome', head: 'The outcome', body: project.outcome ?? '' },
  ].filter((b) => Boolean(b.body))
  return (
    <section
      className={css({
        bg: 'bg',
        paddingBlock: { base: '64px', md: '80px' },
        paddingInline: { base: '4', md: '6vw' },
        borderTop: '2px solid',
        borderTopColor: 'borderStrong',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {blocks.map((b) => (
        <NarrativeBlock key={b.label} label={b.label} head={b.head} body={b.body} />
      ))}
      {blocks.length === 0 ? (
        <p className={css({ fontSize: 'lede', color: 'textMuted', maxWidth: '54ch' })}>
          {project.description ?? `${project.title}, ${project.type}, ${project.year}.`}
        </p>
      ) : null}
    </section>
  )
}
