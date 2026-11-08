import { css } from '../../../styled-system/css'
import { capabilities, education } from '../../content/timeline'

function JustifiedRow({ left, right }: { left: string; right: string }) {
  return (
    <div
      className={css({
        display: 'flex',
        flexWrap: { base: 'wrap', md: 'nowrap' },
        alignItems: 'baseline',
        justifyContent: 'space-between',
        columnGap: '12px',
        paddingTop: '14px',
        paddingBottom: '12px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'textMuted',
      })}
    >
      <span className={css({ textStyle: 'base', fontWeight: 'bold', color: 'text' })}>{left}</span>
      <span
        className={css({
          display: { base: 'none', md: 'block' },
          flex: '1',
          minWidth: '16px',
          borderBottomWidth: '2px',
          borderBottomStyle: 'dotted',
          borderBottomColor: 'borderStrong',
          transform: 'translateY(-4px)',
          opacity: 0.7,
        })}
      />
      <span className={css({ textStyle: 'sm', color: 'textMuted' })}>{right}</span>
    </div>
  )
}

// Mockup notes ask for gold700 chips. accent reads 4.3:1 on surface, so the ink moves
// to textMuted and gold700 stays in the chip's rule.
export function AboutCredentials() {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingBottom: 'clamp(44px,5vw,80px)',
        paddingInline: 'var(--pad)',
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '1fr 1fr' },
        gap: 'clamp(32px,4vw,56px)',
      })}
    >
      <div>
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            textTransform: 'uppercase',
            textStyle: 'lg',
            letterSpacing: 'wide',
            color: 'textFaint',
            paddingBottom: '10px',
            marginBottom: '12px',
            borderBottomWidth: '2px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'borderStrong',
          })}
        >
          Capabilities
        </h2>
        <ul
          className={css({
            listStyle: 'none',
            padding: '0',
            margin: '0',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
          })}
        >
          {capabilities.map((capability) => (
            <li
              key={capability}
              className={css({
                bg: 'surface',
                color: 'textMuted',
                textStyle: 'sm',
                fontVariant: 'small-caps',
                letterSpacing: 'wide',
                fontWeight: 'bold',
                paddingBlock: '4px',
                paddingInline: '10px',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'borderStrong',
              })}
            >
              {capability}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            textTransform: 'uppercase',
            textStyle: 'lg',
            letterSpacing: 'wide',
            color: 'textFaint',
            paddingBottom: '10px',
            borderBottomWidth: '2px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'borderStrong',
          })}
        >
          Education
        </h2>
        <JustifiedRow left={education.school} right={education.years} />
        <JustifiedRow left={education.degree} right={education.concentration} />
      </div>
    </section>
  )
}
