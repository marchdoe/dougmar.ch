import { css } from '../../../styled-system/css'
import { experiments, selectedWork } from '../../content/projects'
import { IndexList } from './IndexList'

export function WorkIndex() {
  const work = selectedWork.map((p) => ({
    key: p.slug,
    href: `/work/${p.slug}`,
    title: p.title,
    meta: `${p.type} · ${p.year}`,
  }))
  const labs = experiments.map((p) => ({
    key: p.slug,
    href: p.externalUrl ?? `/work/${p.slug}`,
    title: p.title,
    meta: `${p.type} · ${p.year}`,
  }))
  return (
    <div
      className={css({
        marginTop: 'clamp(26px, 4vw, 40px)',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '26px',
        lg: { gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 4vw, 64px)' },
      })}
    >
      <IndexList heading="Selected work" items={work} />
      <IndexList heading="Experiments" items={labs} />
    </div>
  )
}
