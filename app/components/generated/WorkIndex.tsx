import { css } from '../../../styled-system/css'
import { experiments, featuredProject, projects, selectedWork } from '../../content/projects'
import { FeaturedCard } from './FeaturedCard'
import { ProjectCard } from './ProjectCard'

const gridStyle = css({
  display: 'grid',
  gap: '14px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
})

export function WorkIndex() {
  const years = projects.map((p) => p.year)
  const first = Math.min(...years)
  const last = Math.max(...years)
  return (
    <section
      id="work"
      className={css({
        paddingBlock: 'clamp(48px, 8vh, 112px)',
        paddingInline: 'clamp(24px, 6vw, 96px)',
        bg: 'bg',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
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
          gap: '4',
          flexWrap: 'wrap',
          marginBottom: 'clamp(28px, 4vh, 48px)',
        })}
      >
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            fontSize: 'clamp(26px, 3.4vw, 38px)',
            color: 'text',
          })}
        >
          Selected Work
        </h2>
        {/* mockup eyebrow #cf9a33 has no token; accent is the nearest brass */}
        <span
          className={css({
            fontFamily: 'body',
            fontWeight: 'bold',
            fontSize: '2xs',
            textTransform: 'uppercase',
            letterSpacing: 'wider',
            color: 'accent',
          })}
        >
          Index · {first}–{last}
        </span>
      </div>
      {featuredProject ? <FeaturedCard project={featuredProject} /> : null}
      <div className={gridStyle}>
        {selectedWork.map((p) => (
          <ProjectCard
            key={p.slug}
            title={p.title}
            type={p.type}
            year={p.year}
            href={`/work/${p.slug}`}
          />
        ))}
      </div>
      <h3
        className={css({
          fontFamily: 'body',
          fontWeight: 'bold',
          fontSize: '2xs',
          textTransform: 'uppercase',
          letterSpacing: 'wider',
          color: 'accent',
          marginTop: 'clamp(32px, 5vh, 56px)',
          marginBottom: '4',
        })}
      >
        Experiments
      </h3>
      <div className={gridStyle}>
        {experiments.map((p) => (
          <ProjectCard
            key={p.slug}
            title={p.title}
            type={p.type}
            year={p.year}
            href={p.externalUrl ?? `/work/${p.slug}`}
          />
        ))}
      </div>
    </section>
  )
}
