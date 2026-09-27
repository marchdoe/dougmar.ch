import { css } from '../../../styled-system/css'

export function StatementBanner({ statement, kicker }: { statement: string; kicker: string }) {
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
          fontSize: { base: '22px', lg: 'clamp(28px, 2.6vw, 40px)' },
          lineHeight: '1.2',
          color: 'text',
          textAlign: 'justify',
          maxWidth: '64ch',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {statement}
      </h1>
    </section>
  )
}
