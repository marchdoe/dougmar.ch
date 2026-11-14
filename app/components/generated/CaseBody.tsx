import { css, cx } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CaseFacts } from './CaseFacts'
import { revealOnScroll } from './motion'

type Project = (typeof projects)[number]

const sectionCls = css({
  bg: 'bg',
  display: 'grid',
  gridTemplateColumns: { base: '1fr', lg: 'minmax(0, 1fr) 320px' },
  rowGap: '7',
  columnGap: '8',
  paddingBlock: { base: '7', lg: '8' },
  paddingInline: { base: '4', lg: '7', xl: '8' },
})

const blockCls = css({ marginBottom: '6' })
const labelCls = css({
  fontSize: '2xs',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'accent',
  fontWeight: 'bold',
  marginBottom: '2',
})
const proseCls = css({
  fontSize: { base: 'base', lg: 'lede' },
  lineHeight: 'normal',
  color: 'text',
  maxWidth: '52ch',
})

export function CaseBody({ project }: { project: Project }) {
  const blocks = [
    { label: 'problem', text: project.problem },
    { label: 'approach', text: project.approach },
    { label: 'outcome', text: project.outcome },
  ].filter((b) => b.text)
  return (
    <section className={cx(sectionCls, revealOnScroll)}>
      <div>
        {blocks.map((b) => (
          <div key={b.label} className={blockCls}>
            <h2 className={labelCls}>{b.label}</h2>
            <p className={proseCls}>{b.text}</p>
          </div>
        ))}
      </div>
      <CaseFacts project={project} />
    </section>
  )
}
