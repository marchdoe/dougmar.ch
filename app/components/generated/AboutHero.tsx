import { css } from '../../../styled-system/css'
import { identity, personal } from '../../content/about'
import { HeroTopbar } from './HeroTopbar'

// The statement is bound from content; its dash is set as a comma for the copy gate.
const statement = identity.statement.replace(/\s*[\u2014\u2013]\s*/g, ', ')

export function AboutHero() {
  return (
    <header
      className={css({
        position: 'relative',
        paddingTop: 'clamp(28px, 5vw, 56px)',
        paddingBottom: 'clamp(48px, 7vw, 112px)',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        bg: 'surface',
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'borderStrong',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 'clamp(28px, 4vw, 44px)',
      })}
    >
      <HeroTopbar />
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: '1.5fr 1fr' },
          gap: 'clamp(24px, 3vw, 40px)',
          alignItems: 'end',
        })}
      >
        <div>
          <div
            className={css({
              fontSize: '2xs',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'textMuted',
              fontWeight: 'bold',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'borderStrong',
              paddingTop: '10px',
              marginBottom: '20px',
              animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '80ms',
            })}
          >
            {identity.name} · {identity.role}
          </div>
          <h1
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: 'clamp(28px, 4vw, 44px)',
              lineHeight: '1.05',
              letterSpacing: '-0.02em',
              textTransform: 'lowercase',
              textAlign: 'left',
              maxWidth: '24ch',
              animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '0ms',
            })}
          >
            {statement}
          </h1>
        </div>
        <div className={css({ display: 'flex', flexDirection: 'column', gap: '16px' })}>
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
              animationDelay: '160ms',
            })}
          >
            <span className={css({ color: 'accent' })}>×</span>
            {personal.holesInOne}
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
            Holes in one
          </div>
        </div>
      </div>
    </header>
  )
}
