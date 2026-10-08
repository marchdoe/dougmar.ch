import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'
import { Band, SecHead } from './Band'

export function CapabilityTags() {
  return (
    <Band label="Capabilities">
      <SecHead title="Capabilities" />
      <ul
        className={css({
          listStyle: 'none',
          margin: '0',
          padding: '0',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2',
        })}
      >
        {capabilities.map((c) => (
          <li
            key={c}
            className={css({
              fontSize: 'sm',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              fontWeight: 'bold',
              bg: 'surface',
              color: 'text',
              borderRadius: 'sm',
              paddingBlock: '1',
              paddingInline: '3',
            })}
          >
            {c}
          </li>
        ))}
      </ul>
    </Band>
  )
}
