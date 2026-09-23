import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { Band } from './Band'

type CaseProject = (typeof projects)[number]

function NarrativeLabel() {
  return (
    <div
      className={css({
        fontSize: 'xs',
        letterSpacing: 'widest',
        textTransform: 'uppercase',
        color: 'fieldInkMuted',
        fontWeight: 'bold',
        marginBottom: '4',
      })}
    >
      The work
    </div>
  )
}

export function CaseNarrative({ project }: { project: CaseProject }) {
  const items = [
    { label: 'Overview', text: project.problem ? undefined : project.description },
    { label: 'Problem', text: project.problem },
    { label: 'Approach', text: project.approach },
    { label: 'Outcome', text: project.outcome },
  ].filter((i) => Boolean(i.text))
  if (items.length === 0) return null
  return (
    <div
      className={css({
        display: 'flex',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <Band label={<NarrativeLabel />}>
        <div
          className={css({ display: 'flex', flexDirection: 'column', gap: '6', textAlign: 'left' })}
        >
          {items.map((i) => (
            <div key={i.label}>
              <h2
                className={css({
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  textStyle: '2xl',
                  lineHeight: '1',
                  color: 'fieldInk',
                  marginBottom: '3',
                })}
              >
                {i.label}
              </h2>
              <p
                className={css({
                  fontSize: 'base',
                  lineHeight: '1.58',
                  color: 'fieldInk',
                  maxWidth: '56ch',
                })}
              >
                {i.text}
              </p>
            </div>
          ))}
        </div>
      </Band>
    </div>
  )
}
