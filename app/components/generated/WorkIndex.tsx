import { css } from '../../../styled-system/css'
import { experiments, featuredProject, type projects, selectedWork } from '../../content/projects'
import { FeaturedCard } from './FeaturedCard'
import { IndexList } from './IndexList'

type P = (typeof projects)[number]

const small = css({
  fontFamily: 'body',
  fontWeight: 'normal',
  fontSize: 'xs',
  letterSpacing: 'wider',
  textTransform: 'uppercase',
  color: 'textFaint',
})

export function WorkIndex() {
  const work = [featuredProject, ...selectedWork].filter((p): p is P => Boolean(p))
  const workItems = work.map((p) => ({
    key: p.slug,
    title: p.title,
    href: `/work/${p.slug}`,
    meta: `${p.type} · ${p.year}`,
  }))
  const expItems = experiments.map((p) => ({
    key: p.slug,
    title: p.title,
    href: p.externalUrl ?? `/work/${p.slug}`,
    meta: `${p.type} · ${p.year}`,
  }))
  return (
    <section
      id="work"
      className={css({
        paddingBlock: 'clamp(40px, 6vw, 72px)',
        paddingInline: 'clamp(24px, 6vw, 96px)',
        bg: 'bgAlt',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
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
          textStyle: 'lg',
          color: 'text',
          marginBottom: '28px',
        })}
      >
        <small className={css({ display: 'block', marginBottom: '8px' }, { fontSize: 'xs' })}>
          <span className={small}>Selected work</span>
        </small>
        The things I’ve built
      </h2>
      <FeaturedCard />
      <div className={css({ marginTop: '40px', marginBottom: '4px' })}>
        <span className={small}>The index</span>
      </div>
      <IndexList items={workItems} />
      <div
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: 'lg',
          color: 'text',
          marginTop: '44px',
          marginBottom: '4px',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
        })}
      >
        Experiments <span className={small}>Older · still online</span>
      </div>
      <IndexList items={expItems} />
    </section>
  )
}
