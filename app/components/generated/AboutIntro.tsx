import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

export function AboutIntro() {
  return (
    <section
      className={css({
        paddingTop: 'clamp(40px, 6vw, 80px)',
        paddingBottom: 'clamp(32px, 4vw, 56px)',
        paddingInline: 'clamp(24px, 6vw, 96px)',
        bg: 'bg',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '24px',
        lg: { gridTemplateColumns: '1fr 1fr', alignItems: 'end', gap: '64px' },
      })}
    >
      <div>
        <div
          className={css({
            fontSize: 'xs',
            letterSpacing: 'widest',
            textTransform: 'uppercase',
            color: 'textFaint',
            fontWeight: 'bold',
            marginBottom: '20px',
          })}
        >
          {identity.role}
        </div>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            textStyle: '4xl',
            lineHeight: '1',
            color: 'text',
            textAlign: 'left',
          })}
        >
          {identity.name}
        </h1>
      </div>
      <p
        className={css({
          textStyle: 'lede',
          color: 'textMuted',
          lineHeight: '1.55',
          maxWidth: '48ch',
          margin: '0',
        })}
      >
        {identity.statement}
      </p>
    </section>
  )
}
