import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { NavSentence } from './NavSentence'

export function HomeBand() {
  return (
    <section
      className={css({
        position: 'relative',
        minHeight: { base: '46vh', md: '48vh' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBlock: '7',
        paddingInline: '6vw',
        overflow: 'hidden',
        bg: 'field',
        color: 'fieldInk',
        textAlign: 'center',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '5',
        })}
      >
        <p
          className={css({
            fontSize: { base: '18px', lg: '21px' },
            lineHeight: 'normal',
            maxWidth: 'min(48ch, 92vw)',
            color: 'fieldInk',
          })}
        >
          {identity.name}, designer and engineer in Aldie, Virginia. He spends his days closing the
          gap between design and build, so the handoff is a little less difficult.
        </p>
        <div data-home-nav="">
          <NavSentence onField />
        </div>
      </div>
    </section>
  )
}
