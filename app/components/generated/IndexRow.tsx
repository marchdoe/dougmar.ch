import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

const rowCls = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', sm: '1fr auto' },
  alignItems: 'baseline',
  rowGap: '2',
  columnGap: '4',
  paddingBlock: '4',
  minHeight: '44px',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'border',
  color: 'text',
  _hover: { color: 'accent' },
})

const titleCls = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  textTransform: 'lowercase',
  textStyle: 'xl',
  lineHeight: 'tight',
  letterSpacing: 'tight',
  color: 'inherit',
})

const metaCls = css({
  display: 'flex',
  gap: '4',
  alignItems: 'baseline',
  fontSize: 'xs',
  letterSpacing: 'wide',
  color: 'textMuted',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
})

const yrCls = css({ color: 'text', fontVariantNumeric: 'tabular-nums' })

export function IndexRow({ project, mark }: { project: Project; mark: string }) {
  return (
    <a href={`/work/${project.slug}`} className={rowCls}>
      <span className={titleCls}>{project.title}</span>
      <span className={metaCls}>
        <span>{project.type}</span>
        <span className={yrCls}>{project.year}</span>
        <span aria-hidden="true">{mark}</span>
      </span>
    </a>
  )
}
