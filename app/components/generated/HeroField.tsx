import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'
import { Ground } from '../Material'

const metaLines = ['Aldie, VA', 'Nov 5, 2026', 'Rain · 65°F']

function HeroTop() {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      })}
    >
      <a href="/" className={css({ display: 'block', flexShrink: '0', color: 'text' })}>
        <BrandLockup variant="stacked-lg" mode="original" />
      </a>
      {/* The flat bg plate keeps small type clear of the halftone dots. */}
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          alignItems: 'flex-end',
          textAlign: 'right',
          minWidth: '0',
          bg: 'bg',
          paddingBlock: '2',
          paddingInline: { base: '2', md: '3' },
          textStyle: 'xs',
          letterSpacing: '0.09em',
          textTransform: 'uppercase',
          color: 'text',
        })}
      >
        {metaLines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>
    </div>
  )
}

export function HeroField({ children }: { children: ReactNode }) {
  return (
    <header
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'field',
        minHeight: { base: '88vh', lg: '100vh' },
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      <div
        aria-hidden="true"
        data-allow-x-overflow
        className={css({
          position: 'absolute',
          inset: '-4%',
          zIndex: '0',
          bg: 'field',
          animation: 'drift 40s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate',
        })}
      >
        <Ground material="halftone" seed={1483042273} />
      </div>
      <div
        className={css({
          position: 'relative',
          zIndex: '1',
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 'clamp(24px,5vw,56px)',
          paddingInline: 'clamp(28px,6vw,112px)',
          paddingBottom: 'clamp(48px,6vh,96px)',
        })}
      >
        <HeroTop />
        {children}
      </div>
    </header>
  )
}
