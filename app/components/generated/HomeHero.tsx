import { css } from '../../../styled-system/css'
import { HeroField } from './HeroField'
import { Topbar } from './Topbar'

export function HomeHero() {
  return (
    <HeroField edge="Marcus Aurelius" tall>
      <Topbar />
      <div
        className={css({
          alignSelf: 'start',
          justifySelf: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginTop: { base: '6', lg: '8' },
          bg: 'bg',
          color: 'text',
          paddingBlock: { base: '5', lg: '6' },
          paddingInline: { base: '4', lg: '7' },
          borderRadius: 'md',
          minWidth: '0',
        })}
      >
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            fontSize: { base: '40px', lg: '86px' },
            lineHeight: 'tight',
            textTransform: 'uppercase',
            textAlign: 'center',
            color: 'text',
            maxWidth: '22ch',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          Loss is nothing else but change, and change is{' '}
          {/* mockup #f094a9 (rose.300) has no semantic token; accent is the nearest rose glow */}
          <span
            className={css({
              color: 'accent',
              fontStyle: 'italic',
              textTransform: 'none',
              letterSpacing: 'normal',
            })}
          >
            nature’s delight.
          </span>
        </h1>
        <p
          className={css({
            marginTop: { base: '5', lg: '6' },
            fontFamily: 'body',
            fontWeight: 'normal',
            fontSize: { base: 'base', lg: 'md' },
            letterSpacing: 'widest',
            textTransform: 'uppercase',
            color: 'textMuted',
            display: 'flex',
            alignItems: 'center',
            gap: '3',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
            _before: { content: '""', width: '34px', height: '1px', bg: 'borderStrong' },
          })}
        >
          Marcus Aurelius
        </p>
      </div>
    </HeroField>
  )
}
