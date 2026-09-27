import { css } from '../../../styled-system/css'

export function HeroBanner() {
  return (
    <section
      className={css({
        gridColumn: { lg: '1 / -1' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: { lg: '46vh' },
        paddingTop: { base: '28px', lg: '6vh' },
        paddingBottom: { base: '5', lg: '6vh' },
        paddingLeft: { base: '3', lg: '6vw' },
        paddingRight: { base: '3', lg: '4vw' },
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'borderStrong',
      })}
    >
      <div
        className={css({
          fontFamily: 'display',
          fontSize: { base: '2xs', lg: 'xs' },
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'accent',
          marginBottom: '3',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        Sunday · 27 Sep 2026 · Ashburn VA
      </div>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: { base: 'clamp(27px, 7.4vw, 60px)', lg: 'clamp(38px, 4.1vw, 58px)' },
          lineHeight: '1.16',
          letterSpacing: '0.005em',
          color: 'text',
          textAlign: 'justify',
          textAlignLast: { base: 'justify', lg: 'auto' },
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        <span
          className={css({
            display: { base: 'inline', lg: 'block' },
            textAlignLast: { lg: 'justify' },
          })}
        >
          No one ever said life was fair.
        </span>{' '}
        <span
          className={css({
            display: { base: 'inline', lg: 'block' },
            textAlign: { lg: 'left' },
            textAlignLast: { lg: 'left' },
          })}
        >
          Just Eventful.
        </span>
      </h1>
      <div
        className={css({
          marginTop: '18px',
          fontFamily: 'display',
          fontSize: 'xs',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          color: 'accent',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '160ms',
        })}
      >
        Carol Burnett
      </div>
    </section>
  )
}
