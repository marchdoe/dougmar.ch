import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { NavSentence } from './NavSentence'
import { Signals } from './Signals'

export function Colophon() {
  const who = [identity.name, identity.role].filter(Boolean).join(', ')
  return (
    <footer
      className={css({
        bg: 'bg',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderColor: 'borderStrong',
        paddingTop: '6',
        paddingBottom: '7',
        paddingInline: '6vw',
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
          marginBottom: '5',
          'main:has([data-home-nav]) ~ footer &': { display: 'none' },
        })}
      >
        <NavSentence onField={false} />
      </div>
      {/* textFaint on bg is under 4.5:1 in the light scheme; textMuted clears it */}
      <div
        className={css({
          fontSize: 'xs',
          letterSpacing: 'wide',
          color: 'textMuted',
          marginBottom: '4',
        })}
      >
        aldie, virginia · september 29, 2026
      </div>
      <Signals />
      <p
        className={css({
          marginTop: '3',
          fontSize: 'sm',
          lineHeight: 'loose',
          color: 'textMuted',
          maxWidth: '48ch',
          marginInline: 'auto',
        })}
      >
        in rotation: tobin sprout, the war on drugs, wet leg
      </p>
      <div
        className={css({
          marginTop: '4',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          columnGap: '4',
          fontSize: 'sm',
          color: 'textMuted',
        })}
      >
        <span>{who}</span>
        <a
          href={`mailto:${identity.email}`}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            color: 'text',
          })}
        >
          {identity.email}
        </a>
      </div>
    </footer>
  )
}
