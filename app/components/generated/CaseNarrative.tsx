import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CaseLinks } from './CaseLinks'
import { StackChips } from './StackChips'

type Project = (typeof projects)[number]

export function CaseNarrative({ project }: { project: Project }) {
  const pairs: [string, string | undefined][] = [
    ['Summary', project.description],
    ['Problem', project.problem],
    ['Approach', project.approach],
    ['Outcome', project.outcome],
  ]
  const blocks = pairs.flatMap(([label, text]) => (text ? [{ label, text }] : []))
  return (
    <section
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingBlock: 'clamp(28px, 6vw, 72px)',
        paddingInline: 'clamp(20px, 6vw, 80px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontStyle: 'italic',
          fontVariant: 'all-small-caps',
          letterSpacing: '0.02em',
          fontSize: '2xl',
          color: 'fieldInk',
          paddingBottom: '16px',
          marginBottom: '24px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'fieldBorder',
        })}
      >
        The case, itemised
      </h2>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
          columnGap: 'clamp(32px, 5vw, 72px)',
          rowGap: '32px',
        })}
      >
        {blocks.map((b) => (
          <div key={b.label}>
            <span
              className={css({
                display: 'block',
                fontSize: 'sm',
                fontWeight: 'bold',
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                color: 'fieldInkMuted',
                marginBottom: '10px',
              })}
            >
              {b.label}
            </span>
            <p
              className={css({
                margin: '0',
                fontSize: 'base',
                lineHeight: '1.6',
                color: 'fieldInk',
                maxWidth: '50ch',
              })}
            >
              {b.text}
            </p>
          </div>
        ))}
      </div>
      <StackChips stack={project.stack} />
      <CaseLinks project={project} />
    </section>
  )
}
