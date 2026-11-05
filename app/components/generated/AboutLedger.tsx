import { css } from '../../../styled-system/css'
import { capabilities, timeline } from '../../content/timeline'
import { sentence } from './copyText'

type Entry = (typeof timeline)[number]

const headClass = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  textTransform: 'uppercase',
  fontSize: 'clamp(24px,3vw,34px)',
  letterSpacing: '0.03em',
  color: 'text',
  marginBottom: '18px',
})

const ruleClass = css({
  borderTopWidth: '2px',
  borderTopStyle: 'solid',
  borderTopColor: 'borderStrong',
})

function TimelineRow({ entry }: { entry: Entry }) {
  const heading = [entry.role, entry.company].filter(Boolean).join(', ')
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '128px 1fr' },
        columnGap: '16px',
        rowGap: '4px',
        alignItems: { lg: 'baseline' },
        paddingBlock: '18px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
      })}
    >
      {/* Set in text, not accent: accent on the light bg stops at 3.9:1 at this size. */}
      <div
        className={css({
          fontFamily: 'display',
          fontSize: '20px',
          letterSpacing: '0.02em',
          color: 'text',
          fontVariantNumeric: 'tabular-nums',
        })}
      >
        {entry.year}
      </div>
      <div className={css({ minWidth: '0' })}>
        <div
          className={css({
            fontFamily: { base: 'body', lg: 'display' },
            fontSize: { base: 'base', lg: 'clamp(24px,2.6vw,36px)' },
            lineHeight: { base: '1.4', lg: '0.95' },
            letterSpacing: { lg: '0.01em' },
            textTransform: { base: 'none', lg: 'uppercase' },
            color: 'text',
          })}
        >
          {heading}
        </div>
        {entry.description && (
          <p
            className={css({
              marginTop: '2',
              fontSize: 'base',
              lineHeight: '1.55',
              color: 'text',
              maxWidth: '56ch',
            })}
          >
            {sentence(entry.description)}
          </p>
        )}
      </div>
    </div>
  )
}

function CapabilityLadder() {
  return (
    <aside className={css({ minWidth: '0' })}>
      <h2 className={headClass}>Capabilities</h2>
      <div className={ruleClass}>
        {capabilities.map((capability, index) => (
          <div
            key={capability}
            className={css({
              display: 'grid',
              gridTemplateColumns: '44px 1fr',
              alignItems: 'baseline',
              gap: '14px',
              paddingBlock: '14px',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
            })}
          >
            <span className={css({ fontFamily: 'display', fontSize: '20px', color: 'accent' })}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <span
              className={css({
                fontFamily: 'display',
                textTransform: 'uppercase',
                fontSize: 'clamp(20px,2.4vw,27px)',
                lineHeight: '0.95',
                letterSpacing: '0.015em',
                color: 'text',
                minWidth: '0',
              })}
            >
              {sentence(capability)}
            </span>
          </div>
        ))}
      </div>
    </aside>
  )
}

export function AboutLedger() {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingInline: 'clamp(28px,6vw,112px)',
        paddingBlock: 'clamp(48px,6vh,96px)',
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '8fr 4fr' },
        gap: { base: 'clamp(48px,6vh,96px)', lg: 'clamp(28px,6vw,112px)' },
        alignItems: { lg: 'start' },
        // From lg only: on a phone this tall section rests mid-fade under the hero, which drops its small type below 4.5:1.
        lg: {
          '@supports (animation-timeline: view())': {
            animationName: 'rise',
            animationTimeline: 'view()',
            animationRange: 'entry 0% entry 40%',
            animationFillMode: 'both',
          },
        },
      })}
    >
      <div className={css({ minWidth: '0' })}>
        <h2 className={headClass}>Timeline</h2>
        <div className={ruleClass}>
          {timeline.map((entry) => (
            <TimelineRow key={`${entry.year}-${entry.role}`} entry={entry} />
          ))}
        </div>
      </div>
      <CapabilityLadder />
    </section>
  )
}
