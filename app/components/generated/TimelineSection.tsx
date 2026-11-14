import { css, cx } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { TimelineRow } from './TimelineRow'
import { revealOnScroll } from './motion'

const sectionCls = css({
  bg: 'bgAlt',
  paddingBlock: { base: '7', lg: '8' },
  paddingInline: { base: '4', lg: '7', xl: '8' },
})

const h2Cls = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  textTransform: 'lowercase',
  textStyle: '2xl',
  color: 'text',
  marginBottom: { base: '5', lg: '6' },
})

const listCls = css({
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'border',
})

export function TimelineSection() {
  return (
    <section className={cx(sectionCls, revealOnScroll)}>
      <h2 className={h2Cls}>experience</h2>
      <div className={listCls}>
        {timeline.map((entry, i) => (
          <TimelineRow key={`${entry.year}-${entry.role}-${i}`} entry={entry} />
        ))}
      </div>
    </section>
  )
}
