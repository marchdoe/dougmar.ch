import { css, cx } from '../../../styled-system/css'
import { experiments, featuredProject, selectedWork } from '../../content/projects'
import { FeaturedProject } from './FeaturedProject'
import { ProjectIndex } from './ProjectIndex'
import { revealClass } from './reveal'

const sectionClass = css({
  bg: 'bg',
  paddingBlock: 'clamp(40px, 7vh, 88px)',
  paddingInline: 'clamp(20px, 5vw, 88px)',
})

const headClass = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  borderBottomWidth: '3px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'borderStrong',
  paddingBottom: '18px',
  marginBottom: '8px',
})

const h2Class = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  fontSize: 'clamp(28px, 4vw, 52px)',
  lineHeight: '1',
  textTransform: 'uppercase',
  letterSpacing: '0.01em',
  color: 'text',
})

const subClass = css({
  textStyle: 'sm',
  letterSpacing: 'wider',
  textTransform: 'uppercase',
  color: 'textFaint',
  fontWeight: 'bold',
})

const groupClass = css({ marginTop: 'clamp(30px, 5vh, 56px)' })

const h3Class = css({
  textStyle: 'xs',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'textFaint',
  fontWeight: 'bold',
  borderBottomWidth: '3px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'borderStrong',
  paddingBottom: '10px',
  marginBottom: '4px',
})

export function WorkSection() {
  return (
    <section id="work" className={cx(revealClass, sectionClass)}>
      <div className={headClass}>
        <h2 className={h2Class}>Selected Work</h2>
        <p className={subClass}>Studio, products and experiments, 2008 to today</p>
      </div>
      {featuredProject ? <FeaturedProject project={featuredProject} /> : null}
      <ProjectIndex items={selectedWork} />
      <div className={groupClass}>
        <h3 className={h3Class}>Experiments</h3>
        <ProjectIndex items={experiments} />
      </div>
    </section>
  )
}
