import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { DriftGround } from './DriftGround'
import { HomeQuote } from './HomeQuote'
import { SignalRail } from './SignalRail'

const navLink = css({
  fontFamily: 'body',
  textStyle: 'sm',
  color: 'text',
  letterSpacing: '0.01em',
  paddingBlock: '3',
  minHeight: '44px',
  display: 'inline-flex',
  alignItems: 'center',
  _hover: { color: 'accent' },
})

export function HomeHero() {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'bg',
        marginTop: { base: '-96px', md: '-120px' },
      })}
    >
      <DriftGround />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: 'minmax(0, 1.55fr) minmax(300px, 1fr)' },
          minHeight: '100vh',
        })}
      >
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            minWidth: '0',
            paddingTop: { base: '96px', md: '120px' },
            paddingBottom: 'clamp(24px, 4vw, 48px)',
            paddingLeft: { base: 'clamp(18px, 4vw, 56px)', lg: 'clamp(32px, 3.5vw, 60px)' },
            paddingRight: { base: 'clamp(18px, 4vw, 56px)', lg: 'clamp(16px, 1.5vw, 28px)' },
          })}
        >
          <HomeQuote />
          <nav
            aria-label="Primary"
            className={css({
              display: 'flex',
              flexWrap: 'wrap',
              columnGap: 'clamp(20px, 3vw, 44px)',
              marginTop: 'auto',
              paddingTop: 'clamp(24px, 3vh, 40px)',
            })}
          >
            <a href="#work" className={navLink}>
              Work
            </a>
            <a href="/about" className={navLink}>
              About
            </a>
            <a href={`mailto:${identity.email}`} className={navLink}>
              Contact
            </a>
          </nav>
        </div>
        <SignalRail />
      </div>
    </section>
  )
}
