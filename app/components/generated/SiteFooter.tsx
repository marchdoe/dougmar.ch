import { css } from '../../../styled-system/css'

const lbl = css({
  fontSize: '2xs',
  textTransform: 'uppercase',
  letterSpacing: 'wider',
  color: 'fieldInkMuted',
  fontWeight: 'bold',
  marginBottom: '10px',
})

const val = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  fontSize: 'xl',
  letterSpacing: 'tight',
  lineHeight: 'tight',
  color: 'fieldInk',
})

export function SiteFooter() {
  return (
    <footer
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingBlock: 'clamp(48px, 7vw, 112px)',
        paddingInline: 'clamp(24px, 6vw, 96px)',
      })}
    >
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', md: '1fr 1fr 1.2fr' },
          gap: { base: '28px', md: '40px' },
        })}
      >
        <div>
          <p className={lbl}>Based</p>
          <p className={val}>Aldie, Virginia</p>
        </div>
        <div>
          <p className={lbl}>Year</p>
          <p className={val}>2026</p>
        </div>
        <div>
          <p className={lbl}>On rotation</p>
          <ul
            className={css({
              listStyle: 'none',
              margin: '0',
              padding: '0',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            })}
          >
            <li className={css({ fontSize: 'base', color: 'fieldInk' })}>My Morning Jacket</li>
            <li className={css({ fontSize: 'base', color: 'fieldInk' })}>Wet Leg</li>
          </ul>
        </div>
      </div>
      <hr
        className={css({
          borderWidth: '0',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'fieldBorder',
          marginTop: 'clamp(32px, 5vw, 56px)',
          marginBottom: '24px',
        })}
      />
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: 'xs',
          color: 'fieldInkMuted',
          letterSpacing: 'normal',
        })}
      >
        <span>Doug March. Design and engineering, shipped in sync.</span>
        <span>energy · frequency · vibration</span>
      </div>
    </footer>
  )
}
