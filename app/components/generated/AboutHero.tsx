import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { label } from './styles'

export function AboutHero() {
  return (
    <section
      className={css({
        paddingInline: 'clamp(24px, 5vw, 72px)',
        paddingTop: 'clamp(40px, 8vh, 96px)',
        paddingBottom: 'clamp(40px, 6vw, 80px)',
      })}
    >
      <span className={label}>About {identity.name}</span>
      <h1
        className={css({
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
          fontFamily: 'display',
          fontWeight: 'normal',
          textStyle: 'xl',
          lineHeight: 'snug',
          color: 'text',
          maxWidth: '44ch',
        })}
      >
        {identity.statement}
      </h1>
      <a
        href={`mailto:${identity.email}`}
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          marginTop: '5',
          textStyle: 'sm',
          fontWeight: 'bold',
          color: 'text',
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'accent',
        })}
      >
        {identity.email}
      </a>
    </section>
  )
}
