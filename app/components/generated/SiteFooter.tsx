import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

const linkCls = css({
  color: 'fieldInk',
  fontFamily: 'body',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wider',
  textStyle: 'xs',
  minHeight: '44px',
  display: 'inline-flex',
  alignItems: 'center',
  _hover: { color: 'fieldInkMuted' },
})

export function SiteFooter() {
  return (
    <footer
      className={css({
        bg: 'field',
        color: 'fieldInk',
        borderTop: '2px solid',
        borderTopColor: 'borderStrong',
        paddingTop: '34px',
        paddingBottom: '40px',
        paddingInline: 'clamp(16px, 4vw, 44px)',
      })}
    >
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: '1.4fr 1fr 1fr' },
          alignItems: { lg: 'end' },
          rowGap: '22px',
          columnGap: '40px',
        })}
      >
        <div>
          <div
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              textStyle: '3xl',
              textTransform: 'uppercase',
              letterSpacing: 'normal',
              lineHeight: '1',
            })}
          >
            {identity.name}
          </div>
          <div
            className={css({
              fontFamily: 'body',
              textTransform: 'uppercase',
              letterSpacing: 'wider',
              fontWeight: 'bold',
              textStyle: 'xs',
              color: 'fieldInkMuted',
              marginTop: '10px',
            })}
          >
            {identity.role} · Detroit, MI · 2026
          </div>
        </div>
        <div
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            textStyle: 'md',
            lineHeight: 'snug',
            color: 'fieldInk',
          })}
        >
          On rotation, Guided by Voices and Wet Leg.
        </div>
        <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '20px' })}>
          <a href="/work" className={linkCls}>
            Work
          </a>
          <a href="/about" className={linkCls}>
            About
          </a>
          <a href={`mailto:${identity.email}`} className={linkCls}>
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
