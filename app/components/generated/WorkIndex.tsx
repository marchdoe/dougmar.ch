import { css } from '../../../styled-system/css'
import { experiments, projects, selectedWork } from '../../content/projects'
import { FeaturedCase } from './FeaturedCase'
import { WorkList } from './WorkList'

const years = projects.map((p) => p.year)
const range = [Math.min(...years), Math.max(...years)].join('\u2013')

export function WorkIndex() {
  return (
    <section
      aria-labelledby="work-head"
      className={css({
        paddingTop: '28px',
        paddingBottom: '34px',
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
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          columnGap: '12px',
          borderBottom: '2px solid',
          borderBottomColor: 'borderStrong',
          paddingBottom: '10px',
        })}
      >
        <h2
          id="work-head"
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 'normal',
            textStyle: '2xl',
            color: 'text',
          })}
        >
          The Work
        </h2>
        <span
          className={css({
            fontFamily: 'body',
            textStyle: '2xs',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            color: 'textMuted',
            whiteSpace: 'nowrap',
          })}
        >
          {projects.length} filed · {range}
        </span>
      </div>
      <FeaturedCase />
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: '1fr 1fr' },
          columnGap: 'clamp(30px, 4vw, 56px)',
        })}
      >
        <WorkList heading="Selected Work" items={selectedWork} divided />
        <WorkList heading="Experiments" items={experiments} />
      </div>
    </section>
  )
}
