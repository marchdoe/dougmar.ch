import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { FooterFacts } from './generated/FooterFacts'
import { FooterNav } from './generated/FooterNav'

export function Sidebar() {
  return (
    <footer
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingBlock: 'clamp(48px, 7vw, 112px)',
        paddingInline: 'clamp(24px, 6vw, 112px)',
      })}
    >
      <div
        className={css({
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'fieldBorder',
          paddingBottom: 'clamp(28px, 4vw, 44px)',
          marginBottom: 'clamp(28px, 4vw, 44px)',
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: '0.9fr 1.6fr' },
          alignItems: { lg: 'start' },
          gap: 'clamp(32px, 4vw, 56px)',
        })}
      >
        <FooterNav />
        <FooterFacts />
      </div>

      <blockquote
        className={css({
          marginTop: 'clamp(28px, 4vw, 44px)',
          paddingTop: 'clamp(24px, 3vw, 32px)',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'fieldBorder',
          fontFamily: 'display',
          fontWeight: 'normal',
          fontSize: 'clamp(18px, 2.4vw, 26px)',
          lineHeight: '1.3',
          color: 'fieldInk',
          maxWidth: '36ch',
        })}
      >
        “Hope is a good thing, maybe the best of things, and no good thing ever dies.”
        <cite
          className={css({
            display: 'block',
            marginTop: '14px',
            fontFamily: 'body',
            fontSize: '2xs',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'fieldInkMuted',
            fontStyle: 'normal',
            fontWeight: 'bold',
          })}
        >
          Stephen King
        </cite>
      </blockquote>

      <div
        className={css({
          marginTop: 'clamp(28px, 4vw, 44px)',
          paddingTop: 'clamp(20px, 2.4vw, 28px)',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'fieldBorder',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
          fontSize: '2xs',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'fieldInkMuted',
          fontWeight: 'bold',
        })}
      >
        <span>
          {identity.name} · {identity.role}
        </span>
        <span className={css({ fontVariantNumeric: 'tabular-nums' })}>© 2026</span>
      </div>
    </footer>
  )
}
