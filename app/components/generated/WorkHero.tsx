import { css } from '../../../styled-system/css'

type Meta = { type: string; year: number; role?: string; timeline?: string; status?: string }

export function WorkHero({ title, meta }: { title: string; meta: Meta }) {
  const parts = [meta.type, String(meta.year), meta.role, meta.timeline, meta.status].filter(
    Boolean
  )
  return (
    <section
      className={css({
        bg: 'bg',
        minHeight: '46vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingInline: '6vw',
        paddingBlock: '9',
        textAlign: 'right',
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          lineHeight: '1',
          letterSpacing: 'tight',
          color: 'text',
          maxWidth: '16ch',
          textAlign: 'right',
          fontSize: { base: '4xl', md: '5xl', xl: 'hero' },
          animationName: 'settle',
          animationDuration: '500ms',
          animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          animationFillMode: 'both',
          animationDelay: '0ms',
        })}
      >
        {title}
      </h1>
      <p
        className={css({
          fontSize: 'sm',
          color: 'textFaint',
          marginTop: '3',
          animationName: 'settle',
          animationDuration: '500ms',
          animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          animationFillMode: 'both',
          animationDelay: '80ms',
        })}
      >
        {parts.join(', ')}
      </p>
    </section>
  )
}
