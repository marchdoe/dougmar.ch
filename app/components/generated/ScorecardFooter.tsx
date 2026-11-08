import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { BrandLockup } from '../BrandLockup'

// NOT FIXED: the 820px clipped-text error on every route is inside the rail that
// __root.tsx renders. That file is orchestrator-owned and the rail may not be styled,
// hidden or targeted from Layout or a route, so no file in this patch can reach it.
// The error stays until the span in __root.tsx can wrap or the rail is given more room.
// This patch only widens the footer links to the 44px target asked for at 360.

function Fig({ children }: { children: ReactNode }) {
  return (
    <b className={css({ fontFamily: 'display', fontWeight: 'normal', letterSpacing: '0.01em' })}>
      {children}
    </b>
  )
}

const cells: { key: string; value: ReactNode }[] = [
  {
    key: 'WWT Championship',
    value: (
      <>
        <Fig>James −21</Fig> · Gerard −18 · Kirk −17 · McCarthy −16 · Ortiz −15
      </>
    ),
  },
  {
    key: 'NHL',
    value: (
      <>
        Red Wings <Fig>0–4</Fig> · shutout
      </>
    ),
  },
  {
    key: 'Markets',
    value: (
      <>
        SPY <Fig>735.29</Fig> ▲ 0.31%
      </>
    ),
  },
  {
    key: 'Moon',
    value: (
      <>
        New · <Fig>0.4%</Fig>
      </>
    ),
  },
  {
    key: 'Weather',
    value: (
      <>
        <Fig>42.8°F</Fig> · Sunny
      </>
    ),
  },
  {
    key: 'Calendar',
    value: (
      <>
        Veterans Day · <Fig>Nov 11</Fig>
      </>
    ),
  },
  { key: 'In Rotation', value: 'Wet Leg · Radiohead · Tobin Sprout' },
]

const footLinks = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/about' },
  { label: identity.email, href: `mailto:${identity.email}` },
]

function ScoreCell({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '5px', minWidth: '0' })}>
      <span
        className={css({
          textStyle: 'xs',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          fontWeight: 'bold',
          color: 'textFaint',
        })}
      >
        {label}
      </span>
      <span className={css({ textStyle: 'base', color: 'text', lineHeight: '1.35' })}>{value}</span>
    </div>
  )
}

function FootBrand() {
  return (
    <div
      className={css({
        marginTop: '28px',
        paddingTop: '18px',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        flexWrap: 'wrap',
      })}
    >
      <BrandLockup variant="mark-only-md" mode={{ light: 'single-color', dark: 'original' }} />
      <span className={css({ textStyle: 'sm', color: 'textMuted' })}>
        {[identity.name, identity.role].filter(Boolean).join(', ')}
      </span>
      {footLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={css({
            textStyle: 'sm',
            fontWeight: 'bold',
            color: 'text',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            minHeight: '44px',
            minWidth: '44px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          })}
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}

export function ScorecardFooter() {
  return (
    <footer
      id="contact"
      className={css({
        bg: 'bg',
        color: 'text',
        borderTopWidth: '4px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        paddingTop: 'clamp(32px,4vw,52px)',
        paddingBottom: '48px',
        paddingInline: 'var(--pad)',
      })}
    >
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: '8px',
          paddingBottom: '12px',
          marginBottom: '20px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'border',
        })}
      >
        <span
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            textTransform: 'uppercase',
            textStyle: 'lg',
            letterSpacing: 'wide',
            color: 'text',
          })}
        >
          {identity.name} · Scorecard
        </span>
        <span
          className={css({
            textStyle: 'xs',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            color: 'textFaint',
          })}
        >
          Saturday, November 8, 2026
        </span>
      </div>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr 1fr', sm: '1fr 1fr 1fr', lg: 'repeat(7,1fr)' },
          rowGap: '18px',
          columnGap: '28px',
        })}
      >
        {cells.map((cell) => (
          <ScoreCell key={cell.key} label={cell.key} value={cell.value} />
        ))}
      </div>
      <FootBrand />
    </footer>
  )
}
