import { css } from '../../../styled-system/css'
import { education } from '../../content/timeline'

const rowCss = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', lg: '140px 1fr' },
  columnGap: '5',
  rowGap: '1',
  paddingBlock: '4',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'borderStrong',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'borderStrong',
})
const yearCss = css({
  fontFamily: 'body',
  fontSize: 'sm',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: 'accentAlt',
  minWidth: { lg: '120px' },
})
const blockCss = css({ display: 'flex', flexDirection: 'column', gap: '1', minWidth: '0' })
const schoolCss = css({ fontFamily: 'body', fontSize: 'base', fontWeight: 'bold', color: 'text' })
const degreeCss = css({ fontFamily: 'body', fontSize: 'sm', color: 'textMuted' })

export function EducationRow() {
  const degree = [education.degree, education.concentration].filter(Boolean).join(', ')
  return (
    <div className={rowCss}>
      <span className={yearCss}>{education.years}</span>
      <div className={blockCss}>
        <span className={schoolCss}>{education.school}</span>
        <span className={degreeCss}>{degree}</span>
      </div>
    </div>
  )
}
