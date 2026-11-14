import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { HeroField } from './HeroField'

export function AboutHero() {
  return (
    <HeroField label="About">
      <h1
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'light',
          fontSize: { base: 'lg', lg: 'xl' },
          lineHeight: 'snug',
          maxWidth: '34ch',
          color: 'fieldInk',
          textAlign: 'left',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {identity.statement}
      </h1>
      <div
        className={css({
          marginTop: '5',
          fontFamily: 'body',
          fontSize: 'xs',
          textTransform: 'uppercase',
          letterSpacing: 'wider',
          color: 'fieldInkMuted',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        {identity.name}, {identity.role}
      </div>
    </HeroField>
  )
}
