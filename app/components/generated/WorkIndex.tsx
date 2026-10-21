import { css } from '../../../styled-system/css'
import { experiments, featuredProject, projects, selectedWork } from '../../content/projects'
import { FeaturedEntry } from './FeaturedEntry'
import { IndexRow } from './IndexRow'

export function WorkIndex() {
  const years = projects.map((p) => p.year)
  const span = `${Math.min(...years)}\u2013${Math.max(...years)}`
  const count = String(projects.length).padStart(2, '0')
  return (
    <section
      aria-label="Selected work"
      className={css({
        paddingInline: '5vw',
        minWidth: '0',
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
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: '16px',
          paddingTop: 'clamp(14px, 3vw, 40px)',
          paddingBottom: '8px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderColor: 'borderStrong',
          fontSize: '14px',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
        })}
      >
        <span className={css({ color: 'textMuted' })}>Index of work</span>
        <span className={css({ color: 'textFaint' })}>{`${count} entries · ${span}`}</span>
      </div>
      {featuredProject ? <FeaturedEntry project={featuredProject} /> : null}
      <div>
        {selectedWork.map((project) => (
          <IndexRow key={project.slug} project={project} />
        ))}
      </div>
      <div
        className={css({
          fontSize: '13px',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textFaint',
          paddingTop: 'clamp(22px, 2.6vw, 34px)',
          paddingBottom: '2px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderColor: 'borderStrong',
        })}
      >
        Experiments
      </div>
      <div>
        {experiments.map((project) => (
          <IndexRow key={project.slug} project={project} />
        ))}
      </div>
    </section>
  )
}
