import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { ColophonBlock, ColophonLead, ColophonLine, ColophonScore } from './ColophonParts'

// The footer carries no scroll reveal. A view() entry range scales with the height of its
// subject, so on this tall block the small labels stayed near transparent while in view.
export function Colophon() {
  return (
    <footer
      id="contact"
      className={css({
        bg: 'bgAlt',
        paddingTop: 'clamp(40px, 5vw, 72px)',
        paddingInline: 'clamp(16px, 5vw, 80px)',
        paddingBottom: '48px',
      })}
    >
      <div
        className={css({
          borderTopWidth: '2px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
          paddingTop: '28px',
        })}
      >
        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' },
            rowGap: '26px',
            columnGap: '48px',
          })}
        >
          <ColophonBlock label="On the course">
            <ColophonLead>Blades Brown −25</ColophonLead>
            <ColophonLine faint>James −24 · Kim −22</ColophonLine>
            <ColophonLine spaced>WWT Championship · Final</ColophonLine>
          </ColophonBlock>
          <ColophonBlock label="Detroit">
            <ColophonScore>Lions 19–9 · W</ColophonScore>
            <ColophonScore>Pistons 116–121 · L</ColophonScore>
            <ColophonLine faint spaced>
              SPY 735.29 · +0.31%
            </ColophonLine>
          </ColophonBlock>
          <ColophonBlock label="In rotation">
            <ColophonLine>The War on Drugs</ColophonLine>
            <ColophonLine>Guided by Voices</ColophonLine>
            <ColophonLine faint spaced>
              Veterans Day · Nov 11
            </ColophonLine>
          </ColophonBlock>
          <ColophonBlock label="Aldie, Virginia">
            <ColophonLine faint>48°F · Sunny · New moon</ColophonLine>
            <ColophonLine spaced>{identity.name}</ColophonLine>
            <ColophonLine>{identity.role}</ColophonLine>
            <ColophonLine>
              <a
                href={`mailto:${identity.email}`}
                className={css({
                  display: 'inline-flex',
                  alignItems: 'center',
                  minHeight: { base: '44px', lg: 'auto' },
                  color: 'text',
                  textDecoration: 'underline',
                })}
              >
                {identity.email}
              </a>
            </ColophonLine>
          </ColophonBlock>
        </div>
        <div
          className={css({
            marginTop: '36px',
            paddingTop: '20px',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'border',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            rowGap: '8px',
            columnGap: '20px',
            textStyle: '2xs',
            letterSpacing: '0.04em',
            color: 'textFaint',
          })}
        >
          <span>© 2026 {identity.name} · Spaceman LLC</span>
          <span>Designed and shipped by the same hands.</span>
        </div>
      </div>
    </footer>
  )
}
