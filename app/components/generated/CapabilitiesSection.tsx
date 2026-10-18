import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'
import { Reveal } from './Reveal'

export function CapabilitiesSection() {
  return (
    <Reveal label="Capabilities">
      <div
        className={css({
          bg: 'bg',
          paddingInline: 'clamp(24px, 6vw, 112px)',
          paddingBottom: 'clamp(48px, 6vw, 96px)',
        })}
      >
        <h2
          className={css({
            fontFamily: 'body',
            fontWeight: 'bold',
            textStyle: '2xs',
            letterSpacing: 'widest',
            textTransform: 'uppercase',
            color: 'textMuted',
            marginBottom: '4',
          })}
        >
          Capabilities
        </h2>
        <div
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            rowGap: '3',
            columnGap: '5',
          })}
        >
          {capabilities.map((cap) => (
            <span
              key={cap}
              className={css({
                fontFamily: 'body',
                fontWeight: 'bold',
                textStyle: 'xs',
                letterSpacing: 'wider',
                textTransform: 'uppercase',
                color: 'text',
                paddingBlock: '1',
                borderBottomWidth: '2px',
                borderBottomStyle: 'solid',
                borderBottomColor: 'borderStrong',
              })}
            >
              {cap}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  )
}
