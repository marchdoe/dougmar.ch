import type { ReactNode } from 'react'
import { css, cx } from '../../styled-system/css'
import { identity } from '../content/about'
import { homeFeature } from './generated/homeFeature'
import { revealClass } from './generated/reveal'

/* Repair note, unresolved: the 820px overflow the surface gate reports in the
   top rail's text span is not fixed by this patch. __root.tsx renders the rail,
   and this role may neither write that file nor target the rail, so the fix has
   to land in __root.tsx. */

const linkClass = css({
  display: 'inline-block',
  minWidth: { base: '44px', md: '0' },
  paddingBlock: { base: '12px', md: '0' },
  color: 'accent',
  textDecoration: 'underline',
  textUnderlineOffset: '2px',
})

const navItemClass = css({
  '&:not(:last-child)::after': { content: '" · "' },
})

function FootRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: 'minmax(96px, auto) 1fr', md: '200px 1fr' },
        columnGap: '12px',
        paddingBlock: '8px',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
        _first: { borderTopWidth: '0' },
      })}
    >
      <span
        className={css({
          fontFamily: 'display',
          textStyle: '2xs',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          color: 'textFaint',
        })}
      >
        {label}
      </span>
      <span
        className={css({ minWidth: '0', fontFamily: 'display', textStyle: 'sm', color: 'text' })}
      >
        {children}
      </span>
    </div>
  )
}

function FootNav() {
  return (
    <nav aria-label="Footer">
      <span className={navItemClass}>
        <a href="/work" className={linkClass}>
          work
        </a>
      </span>
      <span className={navItemClass}>
        <a href="/about" className={linkClass}>
          about
        </a>
      </span>
      <span className={navItemClass}>
        <a href={`mailto:${identity.email}`} className={linkClass}>
          contact
        </a>
      </span>
    </nav>
  )
}

export function Sidebar() {
  const featured = homeFeature
    ? `${homeFeature.title}, ${homeFeature.type}, ${homeFeature.year}`.toLowerCase()
    : 'none'

  return (
    <footer
      className={cx(
        revealClass,
        css({
          bg: 'bg',
          color: 'text',
          borderTopWidth: '3px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
          paddingTop: { base: '48px', md: '64px', lg: '96px' },
          paddingBottom: { base: '56px', md: '72px', lg: '96px' },
          paddingInline: { base: '16px', md: '40px', lg: '5vw' },
        })
      )}
    >
      <h2
        className={css({
          fontFamily: 'display',
          textStyle: '2xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textFaint',
          marginBottom: '18px',
        })}
      >
        readme · spec
      </h2>
      <div
        className={css({
          display: { lg: 'grid' },
          gridTemplateColumns: { lg: 'repeat(2, 1fr)' },
          columnGap: { lg: '64px' },
        })}
      >
        <div>
          <FootRow label="date">2026-11-04</FootRow>
          <FootRow label="featured">{featured}</FootRow>
          <FootRow label="chassis">space mono / archivo</FootRow>
          <FootRow label="palette">chalkboard green · grading-pen red · worksheet sand</FootRow>
        </div>
        <div>
          <FootRow label="ground">split field · ruled worksheet</FootRow>
          <FootRow label="contact">
            <a href={`mailto:${identity.email}`} className={linkClass}>
              {identity.email}
            </a>
          </FootRow>
          <FootRow label="nav">
            <FootNav />
          </FootRow>
          <FootRow label="name">{`${identity.name}, ${identity.role}`}</FootRow>
        </div>
      </div>
    </footer>
  )
}
