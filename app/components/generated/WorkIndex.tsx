import { css, cx } from '../../../styled-system/css'
import { experiments, featuredProject, selectedWork } from '../../content/projects'
import { grid, label, reveal, whead, wheadTitle } from './styles'
import { FeatureTile, ProjTile } from './WorkTiles'

export function WorkIndex() {
  return (
    <section id="work" className={cx(reveal, css({ marginTop: '80px' }))}>
      <div className={grid}>
        <div className={whead}>
          <h2 className={wheadTitle}>The work, index</h2>
          <span className={cx(label, css({ color: 'textMuted' }))}>Selected &amp; experiments</span>
        </div>
        {featuredProject ? <FeatureTile project={featuredProject} /> : null}
        {selectedWork.map((p) => (
          <ProjTile key={p.slug} project={p} href={`/work/${p.slug}`} />
        ))}
        {experiments.map((p) => (
          <ProjTile key={p.slug} project={p} href={p.externalUrl ?? `/work/${p.slug}`} />
        ))}
      </div>
    </section>
  )
}
