import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'
import { RevealSection } from './RevealSection'

export function CapabilityChips() {
  return (
    <RevealSection title="Capabilities" sub="In orbit" tone="bgAlt">
      <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '3' })}>
        {capabilities.map((c) => (
          <span
            key={c}
            className={css({
              display: 'inline-block',
              textStyle: 'sm',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              color: 'text',
              bg: 'surface',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'border',
              borderRadius: 'md',
              paddingBlock: '2',
              paddingInline: '4',
            })}
          >
            {c}
          </span>
        ))}
      </div>
    </RevealSection>
  )
}
