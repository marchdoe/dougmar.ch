import { css } from '../../../styled-system/css'
import { featuredProject } from '../../content/projects'
import { identity } from '../../content/about'
import { ColophonSignals } from './ColophonSignals'

const footLink = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  minWidth: '44px',
  paddingInline: '4px',
  color: 'fieldInk',
  fontFamily: 'body',
  fontWeight: 'bold',
  fontSize: '13px',
  letterSpacing: '0.09em',
  textTransform: 'uppercase',
  _hover: { textDecoration: 'underline', textUnderlineOffset: '0.2em' },
})

const sep = css({ color: 'fieldInk', fontSize: '13px' })

export function Colophon() {
  const workHref = `/work/${featuredProject?.slug ?? 'spaceman'}`
  return (
    <footer
      className={css({
        marginTop: '44px',
        bg: 'field',
        color: 'fieldInk',
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'fieldBorder',
        paddingTop: { base: '40px', md: '48px', lg: '56px' },
        paddingBottom: { base: '48px', md: '56px', lg: '64px' },
        paddingInline: { base: '20px', md: '40px', lg: '5vw' },
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '8px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'fieldBorder',
          paddingBottom: '12px',
          marginBottom: '20px',
        })}
      >
        <span
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: '14px',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            color: 'fieldInk',
          })}
        >
          Specimen Colophon, 30 Oct 2026
        </span>
        <span
          className={css({
            fontFamily: 'body',
            fontWeight: 'bold',
            fontSize: '2xs',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'fieldInk',
          })}
        >
          Signals of the day · 01–09
        </span>
      </div>
      <ColophonSignals />
      <div
        className={css({
          marginTop: '26px',
          paddingTop: '8px',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'fieldBorder',
          display: 'flex',
          flexWrap: 'wrap',
          rowGap: '4px',
          columnGap: '16px',
          alignItems: 'center',
        })}
      >
        <a href="/about" className={footLink}>
          About
        </a>
        <span className={sep} aria-hidden="true">
          ·
        </span>
        <a href={`mailto:${identity.email}`} className={footLink}>
          Contact
        </a>
        <span className={sep} aria-hidden="true">
          ·
        </span>
        <a href={workHref} className={footLink}>
          Work
        </a>
        <span
          className={css({
            marginLeft: 'auto',
            fontFamily: 'body',
            fontWeight: 'bold',
            fontSize: '2xs',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'fieldInk',
          })}
        >
          Set in Unbounded &amp; Figtree
        </span>
      </div>
    </footer>
  )
}
