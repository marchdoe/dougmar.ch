import { css } from '../../../styled-system/css'
import { featuredProject } from '../../content/projects'
import { rangeText, textField } from './projectFields'

const linkCls = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  width: 'fit-content',
  fontWeight: 'bold',
  textStyle: 'sm',
  color: 'text',
  borderBottom: '2px solid',
  borderBottomColor: 'text',
  _hover: { textDecoration: 'none', borderBottomWidth: '4px' },
})

export function FeaturedWork() {
  const p = featuredProject
  if (!p) return null
  const meta = [p.role ?? '', rangeText(textField(p, 'timeline'))].filter((v) => v !== '')
  const body = p.problem ?? p.description ?? ''
  const outbound = p.externalUrl ?? p.liveUrl ?? ''
  return (
    <article
      className={css({
        borderTop: '2px solid',
        borderTopColor: 'text',
        paddingTop: '5',
        display: 'grid',
        gap: '4',
        marginBottom: '7',
      })}
    >
      <span
        className={css({
          textStyle: '2xs',
          fontWeight: 'bold',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'text',
        })}
      >
        Featured
      </span>
      <h2
        className={css({
          fontFamily: 'display',
          fontSize: { base: '44px', md: '64px', lg: '80px' },
          lineHeight: '0.9',
          letterSpacing: '-0.01em',
          color: 'text',
        })}
      >
        {p.title}
      </h2>
      {meta.length > 0 ? (
        <div
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: '5',
            rowGap: '1',
            textStyle: 'sm',
            fontWeight: 'bold',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
            color: 'text',
          })}
        >
          {meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      ) : null}
      {body ? (
        <p className={css({ textStyle: 'lede', color: 'text', maxWidth: '48ch' })}>{body}</p>
      ) : null}
      <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '5', rowGap: '2' })}>
        <a href={`/work/${p.slug}`} className={linkCls}>
          Read the case →
        </a>
        {outbound ? (
          <a href={outbound} className={linkCls}>
            Visit the site ↗
          </a>
        ) : null}
      </div>
    </article>
  )
}
