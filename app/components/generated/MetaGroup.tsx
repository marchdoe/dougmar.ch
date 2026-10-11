import { css } from '../../../styled-system/css'
import { Lab } from './Lab'

type Line = readonly [string, string]

export function MetaGroup({ label, lines }: { label: string; lines: Line[] }) {
  const shown = lines.filter(([, value]) => value !== '')
  return (
    <div>
      <div className={css({ marginBottom: '2' })}>
        <Lab alt>{label}</Lab>
      </div>
      {shown.map(([key, value]) => (
        <div
          key={key}
          className={css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: '3',
            paddingBlock: '7px',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderColor: 'fieldBorder',
            textStyle: 'sm',
            _last: { borderBottomWidth: '0' },
          })}
        >
          <span className={css({ color: 'textFaint', flexShrink: 0 })}>{key}</span>
          <span
            className={css({
              color: 'fieldInk',
              fontFamily: 'display',
              fontStyle: 'italic',
              textAlign: 'right',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  )
}
