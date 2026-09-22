import { css } from '../../../styled-system/css'

export function ClauseField() {
  return (
    <section
      className={css({
        bg: 'field',
        color: 'fieldInk',
        minHeight: '46vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingInline: '6vw',
        paddingBlock: '9',
        textAlign: 'right',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <span
        className={css({
          display: 'block',
          fontSize: 'xs',
          fontWeight: 'bold',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          color: 'fieldInkMuted',
          marginBottom: '3',
        })}
      >
        After the last line
      </span>
      <p
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          lineHeight: '1',
          color: 'fieldInk',
          maxWidth: '12ch',
          textAlign: 'right',
          fontSize: { base: '4xl', md: '4xl', xl: 'hero' },
        })}
      >
        Faithful after the last.
      </p>
    </section>
  )
}
