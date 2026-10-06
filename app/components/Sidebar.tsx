import { css } from '../../styled-system/css'
import { identity } from '../content/about'

const cols = [
  { label: 'Location', value: 'Aldie, Virginia' },
  { label: 'Year', value: '2026' },
  { label: 'In rotation', value: 'Wet Leg · The War on Drugs' },
]

const footerClass = css({
  bg: 'field',
  color: 'fieldInk',
  paddingTop: 'clamp(28px, 5vh, 56px)',
  paddingBottom: 'clamp(32px, 6vh, 64px)',
  paddingInline: 'clamp(20px, 5vw, 88px)',
  borderTopWidth: '4px',
  borderTopStyle: 'solid',
  borderTopColor: 'borderStrong',
})

const colophonClass = css({ display: 'flex', flexWrap: 'wrap', rowGap: '24px', columnGap: '48px' })
const colClass = css({ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '0' })
const labelClass = css({
  textStyle: '2xs',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'fieldInkMuted',
  fontWeight: 'bold',
})
const valClass = css({ textStyle: 'base', color: 'fieldInk' })
const wordmarkClass = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  textStyle: 'lg',
  letterSpacing: '-0.015em',
  color: 'fieldInk',
})
const roleClass = css({
  textStyle: 'xs',
  letterSpacing: 'wider',
  textTransform: 'uppercase',
  color: 'fieldInkMuted',
})
const linksClass = css({ display: 'flex', flexWrap: 'wrap', columnGap: '16px' })

const linkClass = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  textStyle: 'base',
  color: 'fieldInk',
  textDecoration: 'underline',
  textDecorationColor: 'fieldBorder',
  textUnderlineOffset: '4px',
  _hover: { color: 'accentAlt', textDecorationColor: 'accentAlt' },
})

export function Sidebar() {
  return (
    <footer className={footerClass}>
      <div className={colophonClass}>
        <div className={colClass}>
          <span className={wordmarkClass}>{identity.name}</span>
          <span className={roleClass}>{identity.role}</span>
        </div>
        {cols.map((col) => (
          <div key={col.label} className={colClass}>
            <span className={labelClass}>{col.label}</span>
            <span className={valClass}>{col.value}</span>
          </div>
        ))}
        <div className={colClass}>
          <span className={labelClass}>Contact</span>
          <a href={`mailto:${identity.email}`} className={linkClass}>
            {identity.email}
          </a>
        </div>
        <div className={colClass}>
          <span className={labelClass}>Index</span>
          <div className={linksClass}>
            <a href="/#work" className={linkClass}>
              Work
            </a>
            <a href="/about" className={linkClass}>
              About
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
