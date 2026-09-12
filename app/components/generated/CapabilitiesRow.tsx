import { css } from '../../../styled-system/css'
import { Wrap } from '../../../styled-system/jsx'
import { capabilities } from '../../content/timeline'

export function CapabilitiesRow() {
  return (
    <Wrap gap="3">
      {capabilities.map((cap) => (
        <span
          key={cap}
          className={css({
            textStyle: 'xs',
            textTransform: 'lowercase',
            letterSpacing: 'wide',
            color: 'textMuted',
            border: '1px solid',
            borderColor: 'border',
            paddingInline: '4',
            paddingBlock: '2',
            fontVariant: 'small-caps',
          })}
        >
          {cap}
        </span>
      ))}
    </Wrap>
  )
}
