import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CaseLinks } from './CaseLinks'

type Project = (typeof projects)[number]

export function CaseBody({ project }: { project: Project }) {
  const blocks = [
    { label: 'Summary', text: project.description },
    { label: 'Problem', text: project.problem },
    { label: 'Approach', text: project.approach },
    { label: 'Outcome', text: project.outcome },
  ].filter((block) => Boolean(block.text))
  const stack = project.stack ?? []
  return (
    <section
      className={css({
        bg: 'bg',
        paddingInline: 'clamp(24px, 5vw, 88px)',
        paddingBottom: 'clamp(44px, 6vw, 72px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div
        className={css({
          borderLeftWidth: '2px',
          borderLeftStyle: 'solid',
          borderLeftColor: 'borderStrong',
          paddingLeft: { base: '4', lg: '6' },
          display: 'flex',
          flexDirection: 'column',
          gap: '6',
        })}
      >
        {blocks.map((block) => (
          <div key={block.label}>
            <div
              className={css({
                fontFamily: 'body',
                fontWeight: 'bold',
                textStyle: '2xs',
                textTransform: 'uppercase',
                letterSpacing: 'wider',
                color: 'accent',
                marginBottom: '2',
              })}
            >
              {block.label}
            </div>
            <p
              className={css({
                fontFamily: 'body',
                textStyle: 'base',
                lineHeight: '1.5',
                color: 'text',
                maxWidth: '50ch',
              })}
            >
              {block.text}
            </p>
          </div>
        ))}
        {stack.length > 0 ? (
          <ul
            className={css({
              listStyle: 'none',
              margin: '0',
              padding: '0',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2',
            })}
          >
            {stack.map((item) => (
              <li
                key={item}
                className={css({
                  fontFamily: 'body',
                  textStyle: 'sm',
                  fontVariant: 'small-caps',
                  letterSpacing: 'wide',
                  color: 'text',
                  bg: 'bgAlt',
                  paddingBlock: '1',
                  paddingInline: '3',
                })}
              >
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        <CaseLinks project={project} />
      </div>
    </section>
  )
}
