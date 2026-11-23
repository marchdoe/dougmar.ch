import { css } from '../../../styled-system/css'

export function MissingProject({ slug }: { slug: string }) {
  return (
    <section
      className={css({
        paddingInline: 'clamp(24px, 5vw, 72px)',
        paddingBlock: 'clamp(48px, 7vw, 112px)',
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: '2xl',
          color: 'text',
        })}
      >
        No case study under {slug}
      </h1>
      <a
        href="/#work"
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          marginTop: '4',
          textStyle: 'sm',
          fontWeight: 'bold',
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'accent',
        })}
      >
        Back to the work →
      </a>
    </section>
  )
}
