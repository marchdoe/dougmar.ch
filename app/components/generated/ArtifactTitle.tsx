import { css } from '../../../styled-system/css'
import { featuredProject } from '../../content/projects'

export function ArtifactTitle() {
  const label = [
    'Featured project',
    featuredProject?.role,
    featuredProject ? String(featuredProject.year) : '',
  ]
    .filter(Boolean)
    .join(' · ')
  return (
    <div
      className={css({
        position: 'relative',
        zIndex: 1,
        bg: 'bg',
        paddingInline: 'clamp(28px, 6vw, 104px)',
        paddingTop: 'clamp(14px, 3vw, 24px)',
        paddingBottom: 'clamp(6px, 2vw, 14px)',
        animationName: 'wipe',
        animationDuration: '500ms',
        animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        animationFillMode: 'both',
        animationDelay: '160ms',
        lg: { paddingRight: '0', paddingTop: 'clamp(18px, 2vw, 26px)' },
      })}
    >
      <div
        className={css({
          fontSize: 'xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'accent',
          fontWeight: 'bold',
          marginBottom: '0.6em',
        })}
      >
        {label}
      </div>
      <div
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: { base: '40px', lg: 'clamp(72px, 7vw, 100px)' },
          letterSpacing: '0.015em',
          lineHeight: '0.92',
          color: 'text',
        })}
      >
        {featuredProject?.title ?? 'Spaceman'}
      </div>
      <p
        className={css({
          fontSize: 'sm',
          letterSpacing: '0.02em',
          color: 'textMuted',
          marginTop: '0.9em',
          fontVariantNumeric: 'tabular-nums',
          maxWidth: '50ch',
        })}
      >
        <b className={css({ color: 'text', fontWeight: 'bold' })}>Ten years, one pair of hands.</b>{' '}
        Design and code, first sketch to last commit, for Zeldman, Rolex, The Nature Conservancy,
        Intuit, LastPass and more.
      </p>
    </div>
  )
}
