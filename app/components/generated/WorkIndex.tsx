import { css } from '../../../styled-system/css'
import { experiments, featuredProject, selectedWork } from '../../content/projects'
import { FeaturedCard } from './FeaturedCard'
import { WorkRow } from './WorkRow'

const work = featuredProject ? [featuredProject, ...selectedWork] : selectedWork

export function WorkIndex() {
  return (
    <section
      className={css({
        paddingBlock: 'clamp(48px, 7vw, 112px)',
        paddingInline: 'clamp(24px, 6vw, 112px)',
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
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'borderStrong',
          paddingBottom: '14px',
          marginBottom: 'clamp(24px, 3vw, 40px)',
          gap: '16px',
          flexWrap: 'wrap',
        })}
      >
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: 'clamp(22px, 3vw, 34px)',
            letterSpacing: '-0.01em',
            textTransform: 'lowercase',
          })}
        >
          selected work
        </h2>
        <span
          className={css({
            fontSize: '2xs',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'textFaint',
            fontWeight: 'bold',
          })}
        >
          {work.length} projects
        </span>
      </div>

      {featuredProject ? <FeaturedCard project={featuredProject} /> : null}

      <div
        className={css({
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'border',
        })}
      >
        {work.map((p) => (
          <WorkRow
            key={p.slug}
            href={`/work/${p.slug}`}
            title={p.title}
            type={p.type}
            year={p.year}
          />
        ))}
      </div>

      <div
        className={css({
          fontSize: '2xs',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'accentAlt',
          fontWeight: 'bold',
          marginTop: 'clamp(32px, 4vw, 52px)',
          marginBottom: '6px',
        })}
      >
        Experiments
      </div>
      <div
        className={css({
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'border',
        })}
      >
        {experiments.map((p) => (
          <WorkRow
            key={p.slug}
            href={p.externalUrl ?? `/work/${p.slug}`}
            title={p.title}
            type={p.type}
            year={p.year}
          />
        ))}
      </div>
    </section>
  )
}
