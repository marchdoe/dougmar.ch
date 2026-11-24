import { css } from '../../../styled-system/css'

export function AboutIntro({
  name,
  role,
  statement,
}: {
  name: string
  role: string
  statement: string
}) {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingInline: 'clamp(24px, 5vw, 88px)',
        paddingTop: { base: '48px', lg: '72px' },
        paddingBottom: { base: '48px', lg: '72px' },
        display: 'flex',
        flexDirection: 'column',
        gap: '5',
      })}
    >
      <div
        className={css({
          fontFamily: 'body',
          fontWeight: 'bold',
          textStyle: '2xs',
          textTransform: 'uppercase',
          letterSpacing: 'wider',
          color: 'textMuted',
        })}
      >
        {role}
      </div>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: { base: '2xl', lg: '3xl' },
          lineHeight: '0.95',
          letterSpacing: 'tight',
          color: 'text',
        })}
      >
        {name}
      </h1>
      <p
        className={css({
          fontFamily: 'body',
          textStyle: 'lede',
          lineHeight: '1.5',
          color: 'text',
          maxWidth: '48ch',
        })}
      >
        {statement}
      </p>
    </section>
  )
}
