import { css } from '../../../styled-system/css'
import { capabilities, education } from '../../content/timeline'

const degreeLine = [education.degree, education.concentration].filter(Boolean).join(', ')

export function CapabilitiesBlock() {
  return (
    <section
      className={css({
        paddingBlock: 'clamp(48px, 7vw, 112px)',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        display: 'grid',
        gap: 'clamp(32px, 4vw, 56px)',
        gridTemplateColumns: { lg: 'minmax(0, 1.5fr) minmax(0, 1fr)' },
        alignItems: 'start',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div>
        <h2
          className={css({
            fontSize: '12px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'accent',
            fontWeight: 'bold',
            marginBottom: '20px',
          })}
        >
          capabilities
        </h2>
        <ul className={css({ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '8px' })}>
          {capabilities.map((c) => (
            <li
              key={c}
              className={css({
                fontSize: 'sm',
                bg: 'fieldInkMuted',
                color: 'accentAlt',
                _dark: { color: 'field' },
                borderRadius: 'sm',
                paddingInline: '10px',
                paddingBlock: '4px',
                fontWeight: '500',
              })}
            >
              {c}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2
          className={css({
            fontSize: '12px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'accent',
            fontWeight: 'bold',
            marginBottom: '20px',
          })}
        >
          education
        </h2>
        <div
          className={css({
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'border',
            paddingTop: '12px',
          })}
        >
          <div
            className={css({
              fontFamily: 'display',
              fontWeight: '600',
              fontSize: 'md',
              color: 'text',
            })}
          >
            {education.school}
          </div>
          <div className={css({ fontSize: 'sm', color: 'textMuted', marginTop: '4px' })}>
            {degreeLine}
          </div>
          {education.years ? (
            <div
              className={css({
                fontSize: 'sm',
                color: 'textFaint',
                marginTop: '4px',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              {education.years}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
