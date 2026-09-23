import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'

export function CapabilityTags() {
  return (
    <div>
      <h2
        className={css({
          textStyle: 'lg',
          fontFamily: 'display',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          marginBottom: '3',
        })}
      >
        Capabilities
      </h2>
      <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '2' })}>
        {capabilities.map((c) => (
          <span
            key={c}
            className={css({
              fontSize: 'sm',
              color: 'text',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'borderStrong',
              borderRadius: 'none',
              paddingInline: '3',
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
