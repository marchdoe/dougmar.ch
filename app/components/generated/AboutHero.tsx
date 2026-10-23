import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { HeroGround } from './HeroGround'
import { PersonalNotes } from './PersonalNotes'

export function AboutHero() {
  return (
    <section
      aria-label="About Doug March"
      className={css({
        position: 'relative',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        paddingBottom: 'clamp(48px, 7vw, 112px)',
        display: { base: 'block', lg: 'grid' },
        gridTemplateColumns: { lg: 'minmax(0, 1.9fr) minmax(280px, 1fr)' },
        columnGap: { lg: '5vw' },
        alignItems: 'start',
      })}
    >
      <HeroGround />
      <div className={css({ position: 'relative', zIndex: 1 })}>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'light',
            fontSize: 'clamp(26px, 3.4vw, 44px)',
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
            color: 'text',
            maxWidth: '28ch',
            textAlign: 'left',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {identity.statement}
        </h1>
        <hr
          className={css({
            height: '2px',
            bg: 'borderStrong',
            borderWidth: '0',
            marginTop: 'clamp(32px, 4vw, 48px)',
          })}
        />
      </div>
      <PersonalNotes />
    </section>
  )
}
