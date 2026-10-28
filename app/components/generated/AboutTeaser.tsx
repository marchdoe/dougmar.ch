import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { CapabilityList } from './CapabilityList'

export function AboutTeaser() {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingBlock: 'clamp(48px, 6vw, 112px)',
        paddingInline: 'clamp(24px, 5vw, 80px)',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderColor: 'border',
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: '1.2fr 1fr', lg: '1.4fr 1fr' },
        gap: 'clamp(24px, 4vw, 64px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div>
        <p
          className={css({
            fontFamily: 'display',
            textStyle: 'xl',
            lineHeight: 'snug',
            color: 'text',
            maxWidth: '30ch',
          })}
        >
          {identity.statement}
        </p>
        <a
          href="/about"
          className={css({
            display: 'inline-block',
            marginTop: '22px',
            fontSize: 'sm',
            color: 'text',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderColor: 'accent',
            paddingBottom: '1px',
            _hover: { color: 'accent' },
          })}
        >
          More about Doug →
        </a>
      </div>
      <CapabilityList />
    </section>
  )
}
