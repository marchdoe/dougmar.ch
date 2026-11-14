import { css } from '../../../styled-system/css'
import { experiments, selectedWork } from '../../content/projects'
import { FeaturedProject } from './FeaturedProject'
import { ProjectList } from './ProjectList'

const products = selectedWork.map((p) => ({
  key: p.slug,
  title: p.title,
  meta: `${p.type} · ${p.year}`,
  href: `/work/${p.slug}`,
}))

const lab = experiments.map((p) => ({
  key: p.slug,
  title: p.title,
  meta: `${p.type} · ${p.year}`,
  href: p.externalUrl ?? `/work/${p.slug}`,
}))

// The scroll reveal is left off: a section whose top sits inside the first
// viewport was held mid-fade, and its small labels measured under 3:1.
export function WorkIndex() {
  return (
    <section
      id="work"
      className={css({
        bg: 'bg',
        color: 'text',
        paddingBlock: 'clamp(56px, 9vh, 110px)',
        paddingInline: { base: '4', md: '5vw' },
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
      })}
    >
      <h2
        className={css({
          fontFamily: 'display',
          fontSize: '3xl',
          fontStyle: 'italic',
          fontWeight: 'light',
          color: 'text',
          marginBottom: '6',
        })}
      >
        Selected work
      </h2>
      <FeaturedProject />
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) minmax(0, 1fr)' },
          gap: { base: '6', md: '56px' },
        })}
      >
        <ProjectList heading="Products" rows={products} />
        <ProjectList heading="Experiments" rows={lab} />
      </div>
    </section>
  )
}
