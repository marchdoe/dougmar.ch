import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { HeroField } from './HeroField'
import { HeroMeta } from './HeroMeta'

export function AboutHero() {
  return (
    <HeroField meta={<HeroMeta kicker="About" line={identity.role} />}>
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          textAlign: 'right',
          marginTop: 'auto',
          paddingTop: { base: '6', lg: '8' },
        })}
      >
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            textStyle: 'lg',
            // The statement is a paragraph, so it sits well under the 48px ceiling.
            fontSize: { base: '22px', lg: '34px' },
            lineHeight: 'snug',
            maxWidth: '34ch',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {identity.statement}
        </h1>
        {/* Small type over the halftone gets its own flat ground. */}
        <span
          className={css({
            marginTop: '4',
            paddingBlock: '1',
            paddingInline: '2',
            bg: 'bg',
            textStyle: 'sm',
            color: 'textMuted',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          {identity.name}
        </span>
      </div>
    </HeroField>
  )
}
