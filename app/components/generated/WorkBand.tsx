import { css } from '../../../styled-system/css'
import { experiments, featuredProject, selectedWork } from '../../content/projects'
import { BandHead } from './BandHead'
import { FeatureCard } from './FeatureCard'
import { IndexGroup } from './IndexGroup'
import { band } from './styles'

const selectedRows = selectedWork.map((p) => ({
  key: p.slug,
  title: p.title,
  type: p.type,
  year: p.year,
  href: `/work/${p.slug}`,
}))

const experimentRows = experiments.map((p) => ({
  key: p.slug,
  title: p.title,
  type: p.type,
  year: p.year,
  href: p.externalUrl ?? `/work/${p.slug}`,
}))

// The work band is tall, so a view() reveal left its head half-faded under measurement.
// It stays fully opaque from the first frame.
export function WorkBand() {
  return (
    <section id="work" aria-label="Selected work" className={band}>
      <BandHead title="The work" sub="What the vehicle has carried" />
      {featuredProject ? <FeatureCard project={featuredProject} /> : null}
      <div
        className={css({
          display: { base: 'block', lg: 'grid' },
          gridTemplateColumns: { lg: '1.1fr 1fr' },
          columnGap: 'clamp(32px, 4vw, 64px)',
        })}
      >
        <IndexGroup title="Selected work" rows={selectedRows} />
        <IndexGroup title="Experiments" rows={experimentRows} />
      </div>
    </section>
  )
}
