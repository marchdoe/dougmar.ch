import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

const cell = css({ display: 'flex', flexDirection: 'column', gap: '1' })
const key = css({
  textTransform: 'uppercase',
  letterSpacing: 'widest',
  fontSize: '2xs',
  color: 'fieldInkMuted',
})
const val = css({ color: 'fieldInkMuted', fontSize: 'sm' })

export function FooterStrip() {
  return (
    <footer
      id="contact"
      className={css({
        gridColumn: '1 / -1',
        bg: 'field',
        color: 'fieldInk',
        display: 'flex',
        flexDirection: { base: 'column', md: 'row' },
        flexWrap: 'wrap',
        justifyContent: { md: 'space-between' },
        alignItems: { md: 'flex-end' },
        rowGap: '4',
        columnGap: '6',
        paddingTop: '5',
        paddingBottom: '6',
        paddingInline: { base: '4', md: '5vw' },
        fontFamily: 'body',
      })}
    >
      <div className={cell}>
        <span className={css({ fontFamily: 'display', fontSize: 'lede', color: 'fieldInk' })}>
          {identity.name}
        </span>
        <span className={val}>{identity.role}</span>
      </div>
      <div className={cell}>
        <span className={key}>In rotation</span>
        <span className={val}>The War on Drugs · My Morning Jacket</span>
      </div>
      <div className={cell}>
        <span className={key}>Write</span>
        <a
          href={`mailto:${identity.email}`}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            fontSize: 'sm',
            color: 'fieldInk',
            textDecoration: 'underline',
            textUnderlineOffset: '4px',
          })}
        >
          {identity.email}
        </a>
      </div>
      <div className={cell}>
        <span className={key}>Aldie, VA</span>
        <span className={val}>© 2026 {identity.name}</span>
      </div>
    </footer>
  )
}
