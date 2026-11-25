import { css } from '../../../styled-system/css'
import { featuredProject, selectedWork } from '../../content/projects'

const lead = featuredProject ?? selectedWork.find((p) => p.slug === 'spaceman') ?? selectedWork[0]
const leadText = lead?.problem ?? lead?.description ?? ''
const outbound = lead?.externalUrl ?? lead?.liveUrl ?? ''

const linkCls = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  columnGap: '6px',
  fontFamily: 'body',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  textStyle: 'xs',
  color: 'accent',
  borderBottom: '2px solid',
  borderBottomColor: 'accent',
  width: 'max-content',
  paddingTop: '4px',
  _hover: { color: 'accentAlt', borderBottomColor: 'accentAlt', textDecoration: 'none' },
})

export function FeaturedCase() {
  if (!lead) return null
  return (
    <article
      className={css({
        paddingBlock: '22px',
        borderBottom: '1px solid',
        borderBottomColor: 'border',
        display: 'grid',
        rowGap: '14px',
      })}
    >
      <span
        className={css({
          fontFamily: 'body',
          textTransform: 'uppercase',
          letterSpacing: 'wider',
          fontWeight: 'bold',
          textStyle: '2xs',
          color: 'accent',
        })}
      >
        Featured · {lead.type}, {lead.year}
      </span>
      <h3
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          color: 'text',
          fontSize: { base: '36px', lg: '56px' },
          lineHeight: '0.98',
          letterSpacing: 'tight',
        })}
      >
        {lead.title}{' '}
        <span
          className={css({
            fontWeight: 'normal',
            fontSize: '0.4em',
            color: 'textMuted',
            letterSpacing: 'wide',
          })}
        >
          {lead.type}
        </span>
      </h3>
      {leadText ? (
        <p
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            textStyle: 'lede',
            lineHeight: 'normal',
            color: 'text',
            maxWidth: '50ch',
          })}
        >
          {leadText}
        </p>
      ) : null}
      <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '6', rowGap: '2' })}>
        <a href={`/work/${lead.slug}`} className={linkCls}>
          Read the case <span aria-hidden="true">→</span>
        </a>
        {outbound ? (
          <a href={outbound} className={linkCls}>
            Visit <span aria-hidden="true">↗</span>
          </a>
        ) : null}
      </div>
    </article>
  )
}
