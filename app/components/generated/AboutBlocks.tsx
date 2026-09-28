import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'

const heading = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  textStyle: 'lg',
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
  borderBottomWidth: '2px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'borderStrong',
  paddingBottom: '6px',
})

export function Capabilities() {
  return (
    <div className={css({ marginTop: '6' })}>
      <h2 className={heading}>Capabilities</h2>
      <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '2', marginTop: '3' })}>
        {capabilities.map((c) => (
          <span
            key={c}
            className={css({
              fontFamily: 'body',
              fontSize: 'xs',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'text',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'border',
              bg: 'surface',
              paddingInline: '2',
              paddingBlock: '1',
            })}
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  )
}

export function CellGroup({
  title,
  cells,
}: {
  title: string
  cells: { label: string; value: string }[]
}) {
  const shown = cells.filter((c) => c.value !== '')
  return (
    <div className={css({ marginTop: '6' })}>
      <h2 className={heading}>{title}</h2>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', sm: 'repeat(2, 1fr)' },
          borderLeftWidth: '1px',
          borderLeftStyle: 'solid',
          borderLeftColor: 'border',
        })}
      >
        {shown.map((c) => (
          <div
            key={c.label}
            className={css({
              bg: 'surface',
              paddingBlock: '12px',
              paddingInline: '14px',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
              borderRightWidth: '1px',
              borderRightStyle: 'solid',
              borderRightColor: 'border',
              minWidth: '0',
            })}
          >
            <div
              className={css({
                fontFamily: 'body',
                fontSize: '2xs',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'textFaint',
                marginBottom: '1',
              })}
            >
              {c.label}
            </div>
            <div
              className={css({
                fontFamily: 'body',
                fontSize: 'sm',
                color: 'text',
                lineHeight: '1.35',
              })}
            >
              {c.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
