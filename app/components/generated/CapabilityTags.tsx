import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'

export function CapabilityTags() {
  return (
    <ul
      className={css({
        listStyle: 'none',
        margin: '0',
        padding: '0',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
      })}
    >
      {capabilities.map((c) => (
        <li
          key={c}
          className={css({
            fontSize: 'sm',
            color: 'text',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'borderStrong',
            borderRadius: 'sm',
            paddingBlock: '6px',
            paddingInline: '12px',
          })}
        >
          {c}
        </li>
      ))}
    </ul>
  )
}
