import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'
import { Ground } from '../Material'
import { identity } from '../../content/about'

type HeroVariant = 'phrase' | 'title' | 'prose'

// Folded hero: mark + wordmark, the day's hero phrase, numbered nav.
// Reused as the h1 carrier on every route per the shell posture.
// `heroVariant` picks the register the phrase reads in: a short display
// phrase (home), a case-study title (work), or a long-form statement that
// must read as prose, not as poster type (about).
export function Masthead({
  heroContent,
  heroVariant = 'phrase',
}: {
  heroContent: ReactNode
  heroVariant?: HeroVariant
}) {
  const headingClass =
    heroVariant === 'prose'
      ? proseHeadingClass
      : heroVariant === 'title'
        ? titleHeadingClass
        : phraseHeadingClass

  return (
    <header className={headerClass}>
      <Ground material="mesh" seed={1975965606} />
      <div className={css({ position: 'relative', zIndex: 1 })}>
        <a href="/" aria-label="Doug March, home" className={markClass}>
          <BrandLockup variant="stacked-lg" mode="original" />
        </a>
        <h1 className={headingClass}>{heroContent}</h1>
        <nav aria-label="Primary" className={navClass}>
          <a href="/" className={navLinkClass}>
            <span className={numSpanClass}>01</span> work
          </a>
          <a href="/about" className={navLinkClass}>
            <span className={numSpanClass}>02</span> about
          </a>
          <a href={`mailto:${identity.email}`} className={navLinkClass}>
            <span className={numSpanClass}>03</span> contact
          </a>
        </nav>
      </div>
    </header>
  )
}

const headerClass = css({
  position: 'relative',
  overflow: 'hidden',
  bg: 'field',
  color: 'fieldInk',
  paddingTop: { base: '6', md: '14' },
  paddingBottom: { base: '6', md: '12' },
  paddingLeft: { base: '5', md: '6vw' },
  paddingRight: { base: '5', md: '6vw' },
  borderBottom: '3px solid',
  borderColor: 'fieldBorder',
  minHeight: { md: '52vh' },
  display: { md: 'flex' },
  flexDirection: { md: 'column' },
  justifyContent: { md: 'center' },
})

const markClass = css({
  display: 'inline-flex',
  color: 'fieldInk',
  marginBottom: { base: '4', md: '8' },
  animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '80ms',
})

const phraseHeadingClass = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  textTransform: 'lowercase',
  letterSpacing: 'tight',
  lineHeight: 'tight',
  color: 'fieldInk',
  fontSize: { base: 'lg', md: '3xl' },
  whiteSpace: 'normal',
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
  maxWidth: { base: '100%', md: '20ch' },
  marginBottom: { base: '4', md: '7' },
  animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '0ms',
})

const titleHeadingClass = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  textTransform: 'lowercase',
  letterSpacing: 'tight',
  lineHeight: 'tight',
  color: 'fieldInk',
  fontSize: { base: 'xl', md: '2xl' },
  whiteSpace: 'normal',
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
  maxWidth: { base: '100%', md: '18ch' },
  marginBottom: { base: '4', md: '7' },
  animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '0ms',
})

const proseHeadingClass = css({
  fontFamily: 'body',
  fontWeight: 'normal',
  textTransform: 'none',
  letterSpacing: 'normal',
  lineHeight: 'normal',
  color: 'fieldInk',
  fontSize: { base: 'base', md: 'lg' },
  whiteSpace: 'normal',
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
  maxWidth: { base: '100%', md: '52ch' },
  marginBottom: { base: '4', md: '7' },
  animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '0ms',
})

const navClass = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: { base: '4', md: '6' },
  animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '160ms',
})

const navLinkClass = css({
  fontFamily: 'display',
  fontSize: 'sm',
  textTransform: 'lowercase',
  color: 'fieldInk',
  display: 'inline-flex',
  alignItems: 'baseline',
  gap: '2',
  minHeight: '44px',
  paddingTop: '3',
})

const numSpanClass = css({ color: 'accent', fontWeight: 'bold' })
