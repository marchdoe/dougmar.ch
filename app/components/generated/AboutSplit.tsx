import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { capabilities, education, timeline } from '../../content/timeline'

function RailBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section
      className={css({
        marginTop: 'clamp(40px, 5vw, 64px)',
        paddingTop: '16px',
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
      })}
    >
      <h2
        className={css({
          textStyle: '2xs',
          fontWeight: 'bold',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'textFaint',
          marginBottom: '14px',
        })}
      >
        {label}
      </h2>
      {children}
    </section>
  )
}

function AboutRail() {
  const degree = [education.degree, education.concentration].filter(Boolean).join(', ')
  const schooling = [education.school, degree, education.years].filter(Boolean)
  return (
    <div
      className={css({
        gridColumn: { lg: '2' },
        gridRow: { lg: '1' },
        paddingTop: { base: '26px', lg: '168px' },
        paddingInline: { base: '14px', lg: 'clamp(28px, 3vw, 52px)' },
        paddingBottom: { base: '40px', lg: '56px' },
      })}
    >
      <h1
        className={css({
          textStyle: '3xl',
          fontFamily: 'display',
          fontWeight: 'bold',
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
          fontSize: { base: '28px', lg: 'clamp(30px, 3vw, 44px)' },
          lineHeight: '1.04',
          textAlign: 'right',
          color: 'text',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {identity.statement}
      </h1>
      <RailBlock label="Capabilities">
        <ul
          className={css({ display: 'flex', flexWrap: 'wrap', rowGap: '8px', columnGap: '18px' })}
        >
          {capabilities.map((capability) => (
            <li
              key={capability}
              className={css({
                textStyle: 'sm',
                fontWeight: 'bold',
                fontVariant: 'small-caps',
                textTransform: 'lowercase',
                letterSpacing: '0.06em',
                color: 'textMuted',
              })}
            >
              {capability}
            </li>
          ))}
        </ul>
      </RailBlock>
      <RailBlock label="Education">
        {schooling.map((line) => (
          <p key={line} className={css({ textStyle: 'sm', color: 'textMuted' })}>
            {line}
          </p>
        ))}
      </RailBlock>
    </div>
  )
}

function TimelineRow({ entry }: { entry: (typeof timeline)[number] }) {
  return (
    <li
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', sm: '136px 1fr' },
        rowGap: '4px',
        columnGap: '24px',
        paddingBlock: '16px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'fieldBorder',
      })}
    >
      <span
        className={css({
          textStyle: 'sm',
          fontWeight: 'bold',
          fontVariantNumeric: 'tabular-nums',
          color: 'fieldInkMuted',
        })}
      >
        {entry.year}
      </span>
      <div>
        <span
          className={css({
            display: 'block',
            textStyle: 'base',
            fontWeight: 'bold',
            color: 'fieldInk',
          })}
        >
          {entry.role}
        </span>
        <span className={css({ display: 'block', textStyle: 'sm', color: 'fieldInkMuted' })}>
          {entry.company}
        </span>
        {entry.description ? (
          <p
            className={css({
              textStyle: 'sm',
              color: 'fieldInkMuted',
              maxWidth: '62ch',
              marginTop: '8px',
            })}
          >
            {entry.description}
          </p>
        ) : null}
      </div>
    </li>
  )
}

function AboutTimeline() {
  return (
    <div
      className={css({
        gridColumn: { lg: '1' },
        gridRow: { lg: '1' },
        bg: 'field',
        color: 'fieldInk',
        minHeight: { lg: '88vh' },
        paddingTop: { base: '40px', lg: '64px' },
        paddingBottom: { base: '40px', lg: '64px' },
        paddingInline: { base: '14px', lg: 'clamp(32px, 4vw, 64px)' },
      })}
    >
      <h2
        className={css({
          textStyle: '2xs',
          fontWeight: 'bold',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'fieldInkMuted',
          marginBottom: '16px',
        })}
      >
        Timeline
      </h2>
      <ul>
        {timeline.map((entry) => (
          <TimelineRow key={`${entry.year}-${entry.role}`} entry={entry} />
        ))}
      </ul>
    </div>
  )
}

export function AboutSplit() {
  return (
    <section
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '1fr 1.2fr' },
        marginTop: { lg: '-128px' },
      })}
    >
      <AboutRail />
      <AboutTimeline />
    </section>
  )
}
