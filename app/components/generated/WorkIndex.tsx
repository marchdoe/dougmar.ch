import { css } from '../../../styled-system/css'
import { experiments, featuredProject, selectedWork } from '../../content/projects'
import { IndexRow } from './IndexRow'

const work = featuredProject ? [featuredProject, ...selectedWork] : selectedWork

const heading = css({
  textStyle: 'xs',
  fontWeight: 'bold',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'textMuted',
  marginBottom: '12px',
})

export function WorkIndex() {
  return (
    <section
      className={css({
        gridArea: { lg: 'index' },
        bg: 'surface',
        paddingTop: { base: '40px', lg: '132px' },
        paddingBottom: { base: '36px', lg: '24px' },
        paddingLeft: { base: '20px', lg: '5vw' },
        paddingRight: { base: '20px', lg: '0' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <h2 className={heading}>Selected work</h2>
      {work.map((p) => (
        <IndexRow
          key={p.slug}
          href={`/work/${p.slug}`}
          title={p.title}
          meta={`${p.type} · ${p.year}`}
        />
      ))}
      <div className={css({ marginTop: '30px' })}>
        <h2 className={heading}>Experiments</h2>
        {experiments.map((p) => (
          <IndexRow
            key={p.slug}
            quiet
            href={p.externalUrl ?? `/work/${p.slug}`}
            title={p.title}
            meta={`${p.type} · ${p.year}`}
          />
        ))}
      </div>
    </section>
  )
}
