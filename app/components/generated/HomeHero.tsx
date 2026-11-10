import { css } from '../../../styled-system/css'
import { HeroTopbar } from './HeroTopbar'
import { Leaderboard } from './Leaderboard'

export function HomeHero() {
  return (
    <header
      className={css({
        position: 'relative',
        minHeight: '78vh',
        paddingTop: 'clamp(28px, 5vw, 56px)',
        paddingBottom: 'clamp(48px, 7vw, 112px)',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        bg: 'surface',
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'borderStrong',
        display: 'grid',
        gridTemplateColumns: '1fr',
        alignContent: 'start',
        gap: 'clamp(28px, 4vw, 44px)',
      })}
    >
      <HeroTopbar />
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: '3% repeat(5, 1fr) 0.5fr repeat(5, 1fr)' },
          columnGap: { base: 'clamp(24px, 3vw, 40px)', lg: '24px' },
          rowGap: 'clamp(24px, 3vw, 40px)',
          alignItems: 'start',
        })}
      >
        <div
          className={css({
            fontSize: '2xs',
            letterSpacing: { base: '0.22em', lg: '0.26em' },
            textTransform: 'uppercase',
            color: 'textMuted',
            fontWeight: 'bold',
            borderColor: 'borderStrong',
            borderStyle: 'solid',
            borderTopWidth: { base: '1px', lg: '0' },
            borderRightWidth: { base: '0', lg: '1px' },
            borderBottomWidth: '0',
            borderLeftWidth: '0',
            paddingTop: { base: '10px', lg: '0' },
            paddingRight: { base: '0', lg: '10px' },
            writingMode: { base: 'horizontal-tb', lg: 'vertical-rl' },
            transform: { base: 'none', lg: 'rotate(180deg)' },
            gridColumn: { lg: '1' },
            gridRow: { lg: '1' },
            justifySelf: { lg: 'start' },
            alignSelf: { lg: 'stretch' },
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '160ms',
          })}
        >
          World Wide Technology Championship · El Cardonal
        </div>

        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(16px, 2vw, 24px)',
            gridColumn: { lg: '2 / 7' },
            gridRow: { lg: '1' },
          })}
        >
          <div
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: 'clamp(72px, 12vw, 160px)',
              lineHeight: '0.82',
              letterSpacing: '-0.03em',
              color: 'text',
              fontVariantNumeric: 'tabular-nums',
              animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '80ms',
            })}
          >
            <span className={css({ color: 'accent' })}>−</span>25
          </div>
          <div
            className={css({
              fontSize: '2xs',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'textMuted',
              fontWeight: 'bold',
            })}
          >
            Final · Blades Brown, winner
          </div>
        </div>

        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: 'clamp(32px, 7vw, 68px)',
            lineHeight: '0.98',
            letterSpacing: '-0.02em',
            textTransform: 'lowercase',
            textAlign: 'left',
            color: 'text',
            maxWidth: '16ch',
            textWrap: 'balance',
            gridColumn: { lg: '2 / 8' },
            gridRow: { lg: '2' },
            marginTop: { base: '0', lg: 'clamp(28px, 3vw, 52px)' },
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          twenty-five under.{' '}
          <em className={css({ fontStyle: 'normal', color: 'accentAlt' })}>one shot clear.</em>
        </h1>

        <Leaderboard />
      </div>
    </header>
  )
}
