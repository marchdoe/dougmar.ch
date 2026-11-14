import { css, cx } from '../../../styled-system/css'
import { experiments, featuredProject, projects, selectedWork } from '../../content/projects'
import { IndexRow } from './IndexRow'
import { revealOnScroll } from './motion'

const years = projects.map((p) => p.year)
const range = `${Math.min(...years)}–${Math.max(...years)}`

const sectionCls = css({
  bg: 'bgAlt',
  paddingBlock: { base: '7', lg: '8' },
  paddingInline: { base: '4', lg: '7', xl: '8' },
})

const headCls = css({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '4',
  marginBottom: { base: '5', lg: '6' },
})

const h2Cls = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  textTransform: 'lowercase',
  textStyle: '2xl',
  color: 'text',
})

const countCls = css({
  fontSize: '2xs',
  letterSpacing: 'wider',
  textTransform: 'uppercase',
  color: 'textFaint',
})

const subCls = css({
  fontSize: '2xs',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'accent',
  paddingTop: { base: '5', lg: '6' },
  marginBottom: '1',
})

const listCls = css({
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'border',
})

export function WorkIndex() {
  return (
    <section id="work" className={cx(sectionCls, revealOnScroll)}>
      <div className={headCls}>
        <h2 className={h2Cls}>selected work</h2>
        <span className={countCls}>index {range}</span>
      </div>
      <div className={listCls}>
        {featuredProject && <IndexRow project={featuredProject} mark="↑ featured" />}
        {selectedWork.map((p) => (
          <IndexRow key={p.slug} project={p} mark="↗" />
        ))}
      </div>
      <div className={subCls}>experiments</div>
      <div className={listCls}>
        {experiments.map((p) => (
          <IndexRow key={p.slug} project={p} mark="↗" />
        ))}
      </div>
    </section>
  )
}
