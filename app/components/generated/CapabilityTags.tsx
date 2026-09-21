import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'

export function CapabilityTags() {
  return (
    <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '3' })}>
      {capabilities.map((capability) => (
        <span
          key={capability}
          className={css({
            fontFamily: 'body',
            fontWeight: 'bold',
            fontSize: 'xs',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
            fontVariant: 'small-caps',
            color: 'fieldInkMuted',
            bg: 'field',
            borderRadius: 'sm',
            paddingInline: '3',
            paddingBlock: '1',
          })}
        >
          {capability}
        </span>
      ))}
    </div>
  )
}
