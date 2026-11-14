import { css, cx } from '../../../styled-system/css'
import { capabilities, education } from '../../content/timeline'
import { revealOnScroll } from './motion'

const degreeLine = [education.degree, education.concentration, education.years]
  .filter(Boolean)
  .join(', ')

const sectionCls = css({
  bg: 'bg',
  display: 'grid',
  gridTemplateColumns: { base: '1fr', lg: '1.4fr 1fr' },
  rowGap: '7',
  columnGap: '8',
  paddingBlock: { base: '7', lg: '8' },
  paddingInline: { base: '4', lg: '7', xl: '8' },
})

const labelCls = css({
  fontSize: '2xs',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'accent',
  fontWeight: 'bold',
  marginBottom: '4',
})

const listCls = css({ display: 'flex', flexWrap: 'wrap', rowGap: '2', columnGap: '3' })

const itemCls = css({
  fontSize: 'base',
  textTransform: 'lowercase',
  color: 'text',
  paddingBlock: '1',
  paddingInline: '3',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'border',
})

const schoolCls = css({ fontFamily: 'display', fontWeight: 'bold', fontSize: 'md', color: 'text' })
const degreeCls = css({ fontSize: 'md', color: 'textMuted', maxWidth: '40ch' })

export function CapabilitySection() {
  return (
    <section className={cx(sectionCls, revealOnScroll)}>
      <div>
        <h2 className={labelCls}>capabilities</h2>
        <ul className={listCls}>
          {capabilities.map((c) => (
            <li key={c} className={itemCls}>
              {c}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className={labelCls}>education</h2>
        <p className={schoolCls}>{education.school}</p>
        <p className={degreeCls}>{degreeLine}</p>
      </div>
    </section>
  )
}
