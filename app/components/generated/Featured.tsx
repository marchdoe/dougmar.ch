import { css } from '../../../styled-system/css'
import { featuredProject } from '../../content/projects'
import { extLinkClass, microClass } from './styles'
import { hostOf } from './url'

export function Featured() {
  const p = featuredProject
  if (!p) return null
  const url = p.externalUrl ?? p.liveUrl ?? ''
  return (
    <div>
      <div className={microClass}>Featured</div>
      <div
        className={css({
          borderTopWidth: '2px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'border',
          paddingTop: '20px',
          paddingBottom: '22px',
        })}
      >
        <a
          href={`/work/${p.slug}`}
          className={css({
            display: 'block',
            color: 'text',
            _hover: { color: 'text', textDecoration: 'none' },
          })}
        >
          <h2
            className={css({
              fontFamily: 'display',
              fontWeight: 'normal',
              fontSize: '30px',
              lineHeight: '1',
              letterSpacing: '-0.01em',
              color: 'text',
            })}
          >
            {p.title}
          </h2>
          <div
            className={css({
              marginTop: '6px',
              fontFamily: 'body',
              fontSize: 'sm',
              fontWeight: 'bold',
              letterSpacing: 'wide',
              textTransform: 'uppercase',
              color: 'text',
            })}
          >
            {p.type} · {p.year}
          </div>
        </a>
        <p
          className={css({
            marginTop: '14px',
            maxWidth: '46ch',
            fontFamily: 'body',
            fontSize: '15px',
            lineHeight: '1.5',
            color: 'textMuted',
          })}
        >
          {p.description ?? p.problem ?? ''}
        </p>
        {url !== '' ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className={extLinkClass}>
            Visit {hostOf(url)} →
          </a>
        ) : null}
      </div>
    </div>
  )
}
