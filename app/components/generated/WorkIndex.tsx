import { css } from '../../../styled-system/css'
import { featuredProject, projects, selectedWork } from '../../content/projects'
import { EntryMeta } from './EntryMeta'
import { FeaturedEntry } from './FeaturedEntry'
import { SectionLabel } from './SectionLabel'

export function WorkIndex() {
  const full = projects.filter((p) => p.depth === 'full')
  const years = full.map((p) => p.year)
  const note = `${Math.min(...years)}–${Math.max(...years)} · ${full.length} projects`
  return (
    <section
      id="work"
      className={css({
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionLabel title="Selected Work" note={note} />
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          lg: {
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            gridAutoFlow: 'dense',
            '& > :nth-child(1)': {
              gridColumn: 'span 8',
              borderRightWidth: '1px',
              borderRightStyle: 'solid',
              borderRightColor: 'border',
            },
            '& > :nth-child(2)': { gridColumn: 'span 4' },
            '& > :nth-child(3)': {
              gridColumn: 'span 5',
              borderRightWidth: '1px',
              borderRightStyle: 'solid',
              borderRightColor: 'border',
            },
            '& > :nth-child(4)': { gridColumn: 'span 7' },
            '& > :nth-child(n+5)': { gridColumn: 'span 6' },
          },
        })}
      >
        {featuredProject ? <FeaturedEntry project={featuredProject} /> : null}
        {selectedWork.map((p) => (
          <a
            key={p.slug}
            href={`/work/${p.slug}`}
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
                fontSize: 'clamp(30px, 12cqi, 76px)',
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
