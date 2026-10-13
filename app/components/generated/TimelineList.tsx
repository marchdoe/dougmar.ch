import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'

const listCss = css({ listStyle: 'none', margin: '0', padding: '0' })
const rowCss = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', lg: '140px 1fr 1.2fr' },
  columnGap: '5',
  rowGap: '1',
  paddingBlock: '4',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'borderStrong',
  '&:last-child': {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'borderStrong',
  },
})
const yearCss = css({
  fontFamily: 'body',
  fontSize: 'sm',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: 'accentAlt',
  minWidth: { lg: '120px' },
  fontVariantNumeric: 'tabular-nums',
})
const roleBlockCss = css({ display: 'flex', flexDirection: 'column', gap: '1', minWidth: '0' })
const roleCss = css({ fontFamily: 'body', fontSize: 'base', fontWeight: 'bold', color: 'text' })
const companyCss = css({ fontFamily: 'body', fontSize: 'sm', color: 'textMuted' })
const descCss = css({
  fontFamily: 'body',
  fontSize: 'sm',
  lineHeight: 'normal',
  color: 'textMuted',
  maxWidth: '48ch',
})

export function TimelineList() {
  return (
    <ul className={listCss}>
      {timeline.map((entry) => (
        <li key={`${entry.year}-${entry.company}-${entry.role}`} className={rowCss}>
          <span className={yearCss}>{entry.year}</span>
          <div className={roleBlockCss}>
            <span className={roleCss}>{entry.role}</span>
            <span className={companyCss}>{entry.company}</span>
          </div>
          {entry.description ? <p className={descCss}>{entry.description}</p> : null}
        </li>
      ))}
    </ul>
  )
}
