import { css } from '../../../styled-system/css'
import { featuredProject } from '../../content/projects'
import { FeaturedLinks } from './FeaturedLinks'
import { WorkIndex } from './WorkIndex'

type Featured = NonNullable<typeof featuredProject>

function FeaturedBlock({ project }: { project: Featured }) {
  const sub = [project.role, String(project.year), project.type].filter(Boolean).join(' · ')
  const body = project.problem ?? project.description ?? ''
  return (
    <div>
      <div
        className={css({
          fontSize: 'xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'accent',
          fontWeight: 'bold',
          marginBottom: '0.9em',
        })}
      >
        The artifact, in full
      </div>
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: '2xl',
          lineHeight: '1',
          textTransform: 'uppercase',
          letterSpacing: '0.01em',
        })}
      >
        {project.title}
      </h2>
      <p
        className={css({
          fontSize: 'sm',
          letterSpacing: '0.02em',
          color: 'textMuted',
          marginTop: '0.7em',
          marginBottom: '1.3em',
          fontVariantNumeric: 'tabular-nums',
        })}
      >
        {sub}
      </p>
      <p className={css({ fontSize: 'base', lineHeight: '1.58', color: 'text', maxWidth: '58ch' })}>
        {body}
      </p>
      <FeaturedLinks
        slug={project.slug}
        title={project.title}
        external={project.externalUrl ?? project.liveUrl}
      />
    </div>
  )
}

export function FeaturedMeta() {
  return (
    <section
      aria-label="The work"
      className={css({
        paddingInline: 'clamp(28px, 6vw, 104px)',
        paddingTop: 'clamp(30px, 5vw, 52px)',
        paddingBottom: 'clamp(24px, 3vw, 32px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {featuredProject ? <FeaturedBlock project={featuredProject} /> : null}
      <WorkIndex />
    </section>
  )
}
