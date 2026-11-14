import { css } from '../../../styled-system/css'
import type { timeline } from '../../content/timeline'

type Entry = (typeof timeline)[number]

const rowCls = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', md: '140px 1fr' },
  rowGap: '2',
  columnGap: '6',
  paddingBlock: '4',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'border',
})

const yearCls = css({
  fontSize: 'sm',
  fontWeight: 'bold',
  fontVariantNumeric: 'tabular-nums',
  color: 'textMuted',
  minWidth: { md: '140px' },
})

const bodyCls = css({ display: 'flex', flexDirection: 'column', gap: '1', minWidth: '0' })
const roleCls = css({ fontSize: { base: 'base', md: 'md' }, fontWeight: 'bold', color: 'text' })
const companyCls = css({ fontSize: 'sm', color: 'textMuted' })
const descCls = css({ fontSize: 'sm', color: 'textMuted', maxWidth: '50ch', marginTop: '1' })

export function TimelineRow({ entry }: { entry: Entry }) {
  return (
    <div className={rowCls}>
      <span className={yearCls}>{entry.year}</span>
      <div className={bodyCls}>
        <span className={roleCls}>{entry.role}</span>
        {entry.company && <span className={companyCls}>{entry.company}</span>}
        {entry.description && <p className={descCls}>{entry.description}</p>}
      </div>
    </div>
  )
}
