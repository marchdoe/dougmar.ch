import { css } from '../../../styled-system/css'

export function ProjectBanner({ title, kicker }: { title: string; kicker: string }) {
  return (
    <section
      className={css({
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
        {kicker}
      </div>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: { base: 'clamp(32px, 9vw, 56px)', lg: 'clamp(56px, 6vw, 96px)' },
          lineHeight: '1',
          letterSpacing: '-0.01em',
          color: 'text',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {title}
      </h1>
    </section>
  )
}
