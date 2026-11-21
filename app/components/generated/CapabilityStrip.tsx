import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'
import { Reveal } from './Reveal'
import { SectionHead } from './SectionHead'

export function CapabilityStrip() {
  return (
    <Reveal className={css({ paddingBlock: '24px', paddingInline: '6vw' })}>
      <SectionHead title="Capabilities" />
      <ul
        className={css({
          listStyle: 'none',
          margin: '0',
          bg: 'surface',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'border',
          borderRadius: 'md',
          padding: '4',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2',
        })}
      >
        {capabilities.map((cap) => (
          <li
            key={cap}
            className={css({
              textStyle: 'sm',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              color: 'text',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'borderStrong',
              borderRadius: 'sm',
              paddingBlock: '1',
              paddingInline: '3',
            })}
          >
            {cap}
          </li>
        ))}
      </ul>
    </Reveal>
  )
}
