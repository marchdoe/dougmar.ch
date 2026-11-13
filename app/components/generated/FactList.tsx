import { css } from '../../../styled-system/css'

const dtGround = css({
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  fontSize: '2xs',
  color: 'textMuted',
})
// fieldInkMuted measured 4.00:1 on field; labels on the field take fieldInk instead.
const dtField = css({
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  fontSize: '2xs',
  color: 'fieldInk',
})
const ddGround = css({ margin: '0', color: 'text', minWidth: '0', overflowWrap: 'break-word' })
const ddField = css({ margin: '0', color: 'fieldInk', minWidth: '0', overflowWrap: 'break-word' })

export function FactList({
  rows,
  onField,
}: {
  rows: { term: string; detail: string }[]
  onField: boolean
}) {
  const shown = rows.filter((r) => r.detail !== '')
  return (
    <dl
      className={css({
        margin: '0',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        rowGap: '6px',
        columnGap: '16px',
        fontSize: 'sm',
        lineHeight: '1.4',
        alignItems: 'baseline',
      })}
    >
      {shown.map((r) => (
        <div key={r.term} className={css({ display: 'contents' })}>
          <dt className={onField ? dtField : dtGround}>{r.term}</dt>
          <dd className={onField ? ddField : ddGround}>{r.detail}</dd>
        </div>
      ))}
    </dl>
  )
}
