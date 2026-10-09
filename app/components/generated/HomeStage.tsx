import { css } from '../../../styled-system/css'
import { selectedWork } from '../../content/projects'
import { FeaturedRow } from './FeaturedRow'
import { HeroBand } from './HeroBand'
import { WorkRow } from './WorkRow'

// Note: the 820px overflow fault on "A new design ships every morning" sits in the
// site rail rendered by __root.tsx ([data-live-frame]). No file in this set renders
// or styles that element, and the rail is not ours to target.

const slots = [
  css({ lg: { gridColumn: '7 / 13' } }),
  css({ lg: { gridColumn: '6 / 12' } }),
  css({ lg: { gridColumn: '6 / 13' } }),
]

function IndexLead() {
  return (
    <div
      className={css({
        paddingTop: '40px',
        paddingInline: '2px',
        paddingBottom: '6px',
        lg: {
          gridColumn: '7 / 13',
          gridRow: '1',
          paddingTop: '4px',
          paddingInline: '0',
          paddingBottom: '0',
        },
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
        Selected Work
      </h2>
      <p
        className={css({
          marginTop: { base: '14px', lg: '16px' },
          maxWidth: { base: '40ch', lg: '42ch' },
          fontSize: { base: '18px', lg: '22px' },
          lineHeight: 'snug',
          color: 'textMuted',
        })}
      >
        Ten years of choosing the harder right build. Buildable products shaped before the first
        line of code and held to that shape after it.
      </p>
    </div>
  )
}

export function HomeStage() {
  return (
    <section
      className={css({
        position: 'relative',
        paddingTop: '40px',
        paddingInline: '24px',
        paddingBottom: '2',
        lg: {
          display: 'grid',
          gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
          columnGap: '2vw',
          rowGap: 'clamp(18px, 2.4vh, 34px)',
          paddingTop: '60px',
          paddingInline: '4vw',
          paddingBottom: '20px',
          alignItems: 'start',
        },
        xl: { paddingTop: '72px', paddingInline: '5vw', paddingBottom: '24px' },
      })}
    >
      <HeroBand home>
        <h1
          className={css({
            position: 'relative',
            bg: 'field',
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'light',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            textAlign: 'left',
            fontSize: { base: '31px', lg: '4xl' },
            lineHeight: 'tight',
            color: 'fieldInk',
            maxWidth: '12ch',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          What is easy and what is right
        </h1>
        <div
          className={css({
            marginTop: '22px',
            maxWidth: '46ch',
            bg: 'field',
            position: 'relative',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '160ms',
            lg: { marginTop: 'auto', paddingTop: '28px' },
          })}
        >
          <p className={css({ color: 'fieldInkMuted', fontSize: 'base', lineHeight: 'normal' })}>
            “Dark times lie ahead of us and there will be a time when we must choose between what is
            easy and what is right.”
          </p>
          <cite
            className={css({
              display: 'block',
              marginTop: '12px',
              fontStyle: 'normal',
              fontVariant: 'small-caps',
              letterSpacing: 'wider',
              fontSize: 'sm',
              color: 'fieldInk',
            })}
          >
            Albus Dumbledore
          </cite>
        </div>
      </HeroBand>
      <IndexLead />
      <FeaturedRow />
      {selectedWork.map((p, i) => (
        <WorkRow
          key={p.slug}
          project={p}
          href={`/work/${p.slug}`}
          kind="selected"
          placement={slots[i % 3] ?? ''}
        />
      ))}
    </section>
  )
}
