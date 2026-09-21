import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { projects } from '../../content/projects'

export function NavSentence() {
  const linkProject = projects[0]
  const linkClass = css({ fontWeight: 'bold', display: 'inline-block', paddingBlock: '1' })
  return (
    <nav aria-label="Primary">
      <p
        className={css({
          fontFamily: 'body',
          fontWeight: 'medium',
          fontSize: 'sm',
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
          color: 'textFaint',
          lineHeight: 'loose',
          maxWidth: '46ch',
          marginBottom: '8',
        })}
      >
        See the{' '}
        {linkProject ? (
          <a href={`/work/${linkProject.slug}`} className={linkClass}>
            work
          </a>
        ) : (
          'work'
        )}
        , read{' '}
        <a href="/about" className={linkClass}>
          about
        </a>{' '}
        Doug, or get in{' '}
        <a href={`mailto:${identity.email}`} className={linkClass}>
          touch
        </a>
        . A designer and builder in Aldie, following golf, Detroit and the shape of good type.
      </p>
    </nav>
  )
}
