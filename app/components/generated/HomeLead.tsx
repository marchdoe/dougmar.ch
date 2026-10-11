import { css, cx } from '../../../styled-system/css'
import { Lab } from './Lab'
import { wipeFirst, wipeSecond, wipeThird } from './motion'

// Small type on the ruled field gets its own flat bg box (same token as the field)
// so no rule line runs through its glyphs. The marquee's box is padded past its
// tight leading so the flat ground covers the full glyph height, italic overhang included.
export function HomeLead({ title, standfirst }: { title: string; standfirst: string }) {
  return (
    <>
      <h2
        className={cx(
          wipeFirst,
          css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontSize: 'clamp(56px, 8vw, 116px)',
            lineHeight: '0.9',
            letterSpacing: 'tight',
            color: 'accentAlt',
            marginTop: 'clamp(26px, 4vw, 40px)',
            paddingTop: '0.14em',
            paddingBottom: '0.18em',
            paddingInlineEnd: '0.12em',
            bg: 'bg',
            width: 'fit-content',
          })
        )}
      >
        {title}
      </h2>
      <h1
        className={cx(
          wipeFirst,
          css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'normal',
            fontSize: 'clamp(26px, 3.9vw, 56px)',
            lineHeight: '1.1',
            letterSpacing: 'tight',
            color: 'text',
            maxWidth: '18ch',
            marginTop: 'clamp(18px, 2.4vw, 26px)',
            textAlign: 'left',
          })
        )}
      >
        Better to die fighting for freedom than be a prisoner all the days of your life.
      </h1>
      <div className={cx(wipeSecond, css({ marginTop: '3', bg: 'bg', width: 'fit-content' }))}>
        <Lab>Bob Marley</Lab>
      </div>
      <p
        className={cx(
          wipeThird,
          css({
            fontFamily: 'body',
            fontSize: 'clamp(16px, 1.5vw, 21px)',
            lineHeight: '1.5',
            color: 'textMuted',
            maxWidth: '44ch',
            width: 'fit-content',
            bg: 'bg',
            marginTop: 'clamp(26px, 3.5vw, 40px)',
            marginBottom: '0',
          })
        )}
      >
        {standfirst}
      </p>
    </>
  )
}
