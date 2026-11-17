import { css } from '../../../styled-system/css'
import { ThesisTop } from './ThesisTop'

export function MissingProject() {
  return (
    <section
      className={css({
        bg: 'field',
        color: 'fieldInk',
        padding: 'clamp(28px, 6vw, 72px)',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(24px, 5vw, 44px)',
      })}
    >
      <ThesisTop />
      <h1
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          fontVariant: 'small-caps',
          fontSize: 'clamp(32px, 6vw, 60px)',
          lineHeight: '0.98',
          color: 'fieldInk',
        })}
      >
        Not in the index.
      </h1>
      <a
        href="/"
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: 'sm',
          color: 'accentAlt',
          _hover: { textDecoration: 'underline' },
        })}
      >
        Back to the work log
      </a>
    </section>
  )
}
