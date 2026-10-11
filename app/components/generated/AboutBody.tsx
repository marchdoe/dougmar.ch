import { css, cx } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { AboutPanel } from './AboutPanel'
import { Lab } from './Lab'
import { riseOnScroll } from './motion'
import { TimelineRow } from './TimelineRow'

export function AboutBody() {
  return (
    <section
      className={cx(
        riseOnScroll,
        css({
          paddingInline: 'clamp(28px, 6vw, 108px)',
          paddingTop: 'clamp(48px, 6vw, 80px)',
          paddingBottom: 'clamp(48px, 6vw, 80px)',
          display: 'grid',
          gridTemplateColumns: '1fr',
          rowGap: '56px',
          lg: { gridTemplateColumns: 'repeat(12, 1fr)', columnGap: '24px', rowGap: '0' },
        })
      )}
    >
      <div className={css({ minWidth: 0, lg: { gridColumn: '1 / 9' } })}>
        <div className={css({ marginBottom: '2' })}>
          <Lab>Timeline</Lab>
        </div>
        {timeline.map((entry) => (
          <TimelineRow key={`${entry.year}-${entry.company}-${entry.role}`} entry={entry} />
        ))}
      </div>
      <AboutPanel />
    </section>
  )
}
