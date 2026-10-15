import { css } from '../../../styled-system/css'
import { experiments, projects, selectedWork } from '../../content/projects'
import { FeaturedCard } from './FeaturedCard'
import { IndexGroup } from './IndexGroup'

export function WorkIndex() {
  const years = projects.map((p) => p.year)
  const range = `${Math.min(...years)}–${Math.max(...years)}`
  return (
    <section
      id="work"
      className={css({ bg: 'surface', paddingTop: '7', paddingBottom: '8', paddingInline: '6vw' })}
    >
      <div className={css({ maxWidth: '1400px', marginInline: 'auto', minWidth: '0' })}>
        <div
          className={css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            flexWrap: 'wrap',
            gap: '12px',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'borderStrong',
            paddingBottom: '3',
            marginBottom: '6',
          })}
        >
          <h2
            className={css({
              fontFamily: 'display',
              textStyle: { base: 'lg', md: '2xl' },
              fontWeight: 'normal',
              color: 'text',
              minWidth: '0',
            })}
          >
            Selected work &amp; experiments
          </h2>
          <span
            className={css({
              fontSize: 'xs',
              letterSpacing: 'wide',
              textTransform: 'uppercase',
              color: 'textFaint',
            })}
          >
            {projects.length} entries · {range}
          </span>
        </div>
        <FeaturedCard />
        <IndexGroup label="Selected work" items={selectedWork} offset={0} />
        <IndexGroup label="Experiments" items={experiments} offset={selectedWork.length} />
      </div>
    </section>
  )
}
