import { css } from '../../../styled-system/css'
import { experiments } from '../../content/projects'
import { WorkRow } from './WorkRow'

export function ExperimentsSection() {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingBlock: 'clamp(48px, 6vw, 112px)',
        paddingInline: 'clamp(24px, 5vw, 80px)',
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
          fontSize: 'sm',
          fontVariantCaps: 'all-small-caps',
          letterSpacing: 'widest',
          color: 'textMuted',
          marginBottom: '4',
        })}
      >
        Experiments
      </h2>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' },
          columnGap: { base: '0', md: '6' },
        })}
      >
        {experiments.map((p) => (
          <WorkRow
            key={p.slug}
            href={p.externalUrl ?? `/work/${p.slug}`}
            title={p.title}
            meta={`${p.type} · ${p.year}`}
          />
        ))}
      </div>
    </section>
  )
}
