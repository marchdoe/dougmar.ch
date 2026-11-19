import { css } from '../../../styled-system/css'
import { experiments, selectedWork } from '../../content/projects'
import { SectionHead } from './SectionHead'

type Row = { slug: string; title: string; type: string; year: number; href: string }

const workRows: Row[] = selectedWork.map((p) => ({
  slug: p.slug,
  title: p.title,
  type: p.type,
  year: p.year,
  href: `/work/${p.slug}`,
}))
const expRows: Row[] = experiments.map((p) => ({
  slug: p.slug,
  title: p.title,
  type: p.type,
  year: p.year,
  href: p.externalUrl ?? `/work/${p.slug}`,
}))
const workTypes = ['Index', ...new Set(selectedWork.map((p) => p.type))].join(' · ')

function WorkRow({ row }: { row: Row }) {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) auto',
        alignItems: 'baseline',
        columnGap: '4',
        paddingBlock: '4',
        borderBottom: '1px solid',
        borderColor: 'border',
      })}
    >
      <a
        href={row.href}
        className={css({
          display: 'inline-block',
          justifySelf: 'start',
          fontFamily: 'display',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: { base: '26px', lg: '44px' },
          lineHeight: '0.98',
          letterSpacing: '0.01em',
          paddingBlock: '2',
          color: 'text',
          _hover: { color: 'accent' },
        })}
      >
        {row.title}
      </a>
      <span
        className={css({
          display: 'flex',
          flexDirection: { base: 'column', sm: 'row' },
          alignItems: { base: 'flex-end', sm: 'baseline' },
          columnGap: '4',
          rowGap: '1',
          fontSize: 'xs',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'textMuted',
          whiteSpace: 'nowrap',
        })}
      >
        <span>{row.type}</span>
        <b className={css({ color: 'text', fontWeight: 'bold' })}>{row.year}</b>
      </span>
    </div>
  )
}

export function WorkSection() {
  return (
    <section
      id="work"
      className={css({
        bg: 'bg',
        color: 'text',
        paddingInline: '6vw',
        paddingTop: { base: '52px', lg: '72px' },
        paddingBottom: { base: '44px', lg: '60px' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionHead title="Selected work" tag={workTypes} />
      <div className={css({ display: 'grid', gridTemplateColumns: '1fr' })}>
        {workRows.map((r) => (
          <WorkRow key={r.slug} row={r} />
        ))}
      </div>
      <div className={css({ marginTop: '40px' })}>
        <SectionHead title="Experiments" tag="Index · older threads" />
      </div>
      <div className={css({ display: 'grid', gridTemplateColumns: '1fr' })}>
        {expRows.map((r) => (
          <WorkRow key={r.slug} row={r} />
        ))}
      </div>
    </section>
  )
}
