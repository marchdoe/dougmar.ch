import { css } from '../../../styled-system/css'
import { experiments } from '../../content/projects'
import { WorkRow } from './WorkRow'

const offsets = [
  css({ lg: { marginLeft: '16.66%' } }),
  css({ lg: { marginRight: '25%' } }),
  css({ lg: { marginLeft: '33.33%' } }),
]

export function Experiments() {
  return (
    <section
      aria-label="Experiments"
      className={css({
        position: 'relative',
        marginTop: 'max(12vh, 64px)',
        paddingInline: '24px',
        lg: { paddingInline: '4vw' },
        xl: { paddingInline: '5vw' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <span
        aria-hidden="true"
        className={css({
          display: 'none',
          lg: {
            display: 'block',
            position: 'absolute',
            top: '40px',
            left: 'calc(4vw - 26px)',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            fontVariant: 'small-caps',
            letterSpacing: 'widest',
            fontSize: '2xs',
            color: 'textFaint',
            zIndex: 2,
            pointerEvents: 'none',
          },
          xl: { left: 'calc(5vw - 26px)' },
        })}
      >
        Selected Work · 2008–2026
      </span>
      <div
        className={css({
          paddingTop: '26px',
          paddingInline: '6px',
          paddingBottom: '1',
          borderTop: '2px solid',
          borderColor: 'borderStrong',
          lg: { paddingTop: '28px', paddingInline: '0', paddingBottom: '6px' },
        })}
      >
        <h2
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'normal',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            fontSize: { base: 'lg', lg: 'xl' },
            color: 'text',
          })}
        >
          Experiments
        </h2>
        <span
          className={css({
            display: 'block',
            marginTop: '10px',
            fontSize: 'xs',
            color: 'textFaint',
            fontVariant: 'small-caps',
            letterSpacing: 'wider',
          })}
        >
          Smaller swings, kept honest
        </span>
      </div>
      {experiments.map((p, i) => (
        <WorkRow
          key={p.slug}
          project={p}
          href={p.externalUrl ?? `/work/${p.slug}`}
          kind="experiment"
          placement={offsets[i % 3] ?? ''}
        />
      ))}
    </section>
  )
}
