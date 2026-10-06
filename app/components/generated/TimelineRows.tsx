import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'

const listClass = css({ listStyle: 'none', margin: '0', padding: '0' })

const rowClass = css({
  display: 'flex',
  flexDirection: { base: 'column', sm: 'row' },
  gap: { base: '4px', sm: '16px' },
  paddingBlock: '10px',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'borderStrong',
  _last: { borderBottomWidth: '0' },
})

const yearClass = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  fontSize: { base: 'sm', sm: 'md' },
  lineHeight: '1.1',
  color: 'fieldInk',
  fontVariantNumeric: 'tabular-nums',
  minWidth: { sm: '120px' },
  flexBasis: { sm: '120px' },
  flexShrink: 0,
})

const bodyClass = css({ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '0' })
const roleClass = css({ textStyle: 'sm', color: 'fieldInk', fontWeight: 'bold' })
const companyClass = css({ textStyle: 'sm', color: 'fieldInkMuted' })
const descClass = css({
  textStyle: 'sm',
  color: 'fieldInkMuted',
  maxWidth: '48ch',
  marginTop: '4px',
})

export function TimelineRows() {
  return (
    <ol className={listClass}>
      {timeline.map((entry) => (
        <li key={`${entry.year}-${entry.company}-${entry.role}`} className={rowClass}>
          <span className={yearClass}>{entry.year}</span>
          <div className={bodyClass}>
            <span className={roleClass}>{entry.role}</span>
            <span className={companyClass}>{entry.company}</span>
            {entry.description ? <p className={descClass}>{entry.description}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  )
}
