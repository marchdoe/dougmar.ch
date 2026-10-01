import { css } from '../../../styled-system/css'
import { experiments } from '../../content/projects'
import { EntryMeta } from './EntryMeta'
import { SectionLabel } from './SectionLabel'

export function ExperimentIndex() {
  const years = experiments.map((p) => p.year)
  const note = `${Math.min(...years)}–${Math.max(...years)} · the old toys`
  return (
    <section
      className={css({
        marginTop: '64px',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionLabel title="Experiments" note={note} />
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          lg: {
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            '& > *': {
              gridColumn: 'span 4',
              borderRightWidth: '1px',
              borderRightStyle: 'solid',
              borderRightColor: 'border',
            },
            '& > :last-child': { borderRightWidth: '0' },
          },
        })}
      >
        {experiments.map((p) => (
          <a
            key={p.slug}
            href={p.externalUrl ?? `/work/${p.slug}`}
            className={css({
              display: 'block',
              containerType: 'inline-size',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
              paddingTop: '18px',
              paddingBottom: '20px',
              paddingInline: '2px',
              _hover: { bg: 'bgAlt' },
              '&:hover h3': { color: 'accent' },
              lg: { paddingTop: '26px', paddingBottom: '30px', paddingInline: '18px' },
            })}
          >
            <EntryMeta year={p.year} items={[p.type]} />
            <h3
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                fontVariant: 'small-caps',
                letterSpacing: 'normal',
                lineHeight: 'tight',
                color: 'text',
                fontSize: 'clamp(26px, 10cqi, 44px)',
                whiteSpace: 'nowrap',
              })}
            >
              {p.title}
            </h3>
          </a>
        ))}
      </div>
    </section>
  )
}
