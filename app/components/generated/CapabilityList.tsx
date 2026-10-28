import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'

export function CapabilityList() {
  return (
    <div>
      <span
        className={css({
          display: 'block',
          fontSize: 'sm',
          fontVariantCaps: 'all-small-caps',
          letterSpacing: 'widest',
          color: 'textMuted',
          marginBottom: '3',
        })}
      >
        Capabilities
      </span>
      <ul className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
        {capabilities.map((c) => (
          <li
            key={c}
            className={css({
              fontSize: 'base',
              lineHeight: 'loose',
              color: 'textMuted',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderColor: 'border',
              paddingBlock: '1',
            })}
          >
            {c}
          </li>
        ))}
      </ul>
    </div>
  )
}
