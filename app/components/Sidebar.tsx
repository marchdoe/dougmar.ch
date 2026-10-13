import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BrandLockup } from './BrandLockup'
import { FootMeta } from './generated/FootMeta'

const footCss = css({
  position: 'relative',
  zIndex: 1,
  minHeight: '180px',
  paddingBlock: '8vh',
  paddingInline: '6vw',
  bg: 'bgAlt',
  color: 'text',
  borderTopWidth: '2px',
  borderTopStyle: 'solid',
  borderTopColor: 'borderStrong',
  display: 'grid',
  gap: '7',
  gridTemplateColumns: { lg: '1fr 1fr 1.4fr' },
  alignItems: { lg: 'start' },
})

const lockupCss = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: { base: 'center', lg: 'flex-start' },
  textAlign: { base: 'center', lg: 'left' },
  color: 'text',
})

const navCss = css({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: { lg: '420px' },
})

const navLinkCss = css({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  minHeight: '52px',
  fontFamily: 'display',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wider',
  fontSize: 'lg',
  color: 'text',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'borderStrong',
  '&:last-child': {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'borderStrong',
  },
  _hover: { color: 'accentAlt' },
})

const signals = [
  { k: 'Location', v: 'Aldie, Virginia' },
  { k: 'Date', v: '13 October 2026' },
  { k: 'Moon', v: 'Waxing crescent, 9% lit' },
  { k: 'In rotation', v: 'Radiohead · My Morning Jacket' },
]

export function Sidebar() {
  return (
    <footer className={footCss}>
      <div className={lockupCss}>
        <BrandLockup variant="stacked-md" mode="single-color" />
      </div>
      <nav aria-label="Primary" className={navCss}>
        <a href="/work" className={navLinkCss}>
          Work
        </a>
        <a href="/about" className={navLinkCss}>
          About
        </a>
        <a href={`mailto:${identity.email}`} className={navLinkCss}>
          Contact
        </a>
      </nav>
      <FootMeta items={[{ k: 'Practice', v: identity.role }, ...signals]} />
    </footer>
  )
}
