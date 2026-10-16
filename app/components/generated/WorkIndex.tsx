import { css } from '../../../styled-system/css'
import { experiments, selectedWork } from '../../content/projects'
import type { projects } from '../../content/projects'

type Proj = (typeof projects)[number]

function IndexRow({ project }: { project: Proj }) {
  return (
    <a
      href={`/work/${project.slug}`}
      className={css({
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: '16px',
        paddingBlock: '16px',
        borderBottom: '1px solid',
        borderBottomColor: 'border',
        minHeight: '44px',
        color: 'text',
        _hover: { '& > span:first-child': { color: 'accent' } },
      })}
    >
      <span
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: { base: 'md', lg: 'xl' },
          letterSpacing: 'tight',
          lineHeight: 'snug',
          minWidth: '0',
        })}
      >
        {project.title}
      </span>
      <span
        className={css({
          fontSize: 'sm',
          color: 'textFaint',
          whiteSpace: 'nowrap',
          fontVariantNumeric: 'tabular-nums',
        })}
      >
        {project.type} ·{' '}
        <span className={css({ color: 'text', fontWeight: 'bold' })}>{project.year}</span>
      </span>
    </a>
  )
}

function IndexColumn({ heading, items }: { heading: string; items: Proj[] }) {
  return (
    <div className={css({ minWidth: '0' })}>
      <h3
        className={css({
          fontSize: 'xs',
          fontWeight: 'bold',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'accent',
          paddingBottom: '12px',
          borderBottom: '1px solid',
          borderBottomColor: 'borderStrong',
        })}
      >
        {heading}
      </h3>
      {items.map((p) => (
        <IndexRow key={p.slug} project={p} />
      ))}
    </div>
  )
}

export function WorkIndex() {
  return (
    <section
      id="work"
      className={css({
        bg: 'bg',
        paddingBlock: { base: '64px', md: '80px' },
        paddingInline: { base: '4', md: '6vw' },
        borderTop: '2px solid',
        borderTopColor: 'borderStrong',
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
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: { base: '30px', md: '44px' },
          lineHeight: '1',
          letterSpacing: 'tight',
          marginBottom: '2',
          maxWidth: '20ch',
        })}
      >
        The rest of the evidence.
      </h2>
      <p
        className={css({
          fontSize: 'lede',
          color: 'textMuted',
          maxWidth: '54ch',
          marginBottom: '40px',
        })}
      >
        Work defines, so it is catalogued, not described. Each is a thing acted on and shipped.
      </p>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
          gap: { base: '44px', md: '64px' },
        })}
      >
        <IndexColumn heading="Selected Work" items={selectedWork} />
        <IndexColumn heading="Experiments" items={experiments} />
      </div>
    </section>
  )
}
