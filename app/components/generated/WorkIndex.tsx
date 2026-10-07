import { css } from '../../../styled-system/css'
import { experiments, selectedWork } from '../../content/projects'
import { SectionLabel } from './SectionLabel'

type Item = { slug: string; title: string; type: string; year: number; href: string }

const work: Item[] = selectedWork.map((p) => ({ ...p, href: `/work/${p.slug}` }))
const lab: Item[] = experiments.map((p) => ({ ...p, href: p.externalUrl ?? `/work/${p.slug}` }))

function WorkList({ heading, items }: { heading: string; items: Item[] }) {
  return (
    <div className={css({ width: '100%' })}>
      <SectionLabel>{heading}</SectionLabel>
      {items.map((item) => (
        <a
          key={item.slug}
          href={item.href}
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            columnGap: '4',
            rowGap: '1',
            paddingBlock: '14px',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderColor: 'border',
            _hover: { color: 'accent' },
          })}
        >
          <span
            className={css({
              fontFamily: 'body',
              textStyle: 'base',
              fontWeight: 'bold',
              minWidth: '0',
            })}
          >
            {item.title}
          </span>
          <span
            className={css({
              display: 'flex',
              gap: '4',
              fontFamily: 'body',
              textStyle: '2xs',
              fontWeight: 'bold',
              letterSpacing: 'wider',
              textTransform: 'uppercase',
              color: 'textMuted',
              whiteSpace: 'nowrap',
            })}
          >
            <span>{item.type}</span>
            <span>{item.year}</span>
          </span>
        </a>
      ))}
    </div>
  )
}

export function WorkIndex() {
  return (
    <section
      aria-label="More work"
      className={css({
        bg: 'bg',
        paddingInline: '7vw',
        paddingBottom: '7',
        display: 'flex',
        justifyContent: 'center',
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
          width: '100%',
          maxWidth: '1040px',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '7',
          lg: { gridTemplateColumns: '1fr 1fr' },
        })}
      >
        <WorkList heading="Selected work" items={work} />
        <WorkList heading="Experiments" items={lab} />
      </div>
    </section>
  )
}
