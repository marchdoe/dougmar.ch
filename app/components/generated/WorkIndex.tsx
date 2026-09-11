import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'
import { featuredProject, selectedWork, experiments } from '../../content/projects'

const rowClass = css({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gap: '2 4',
  alignItems: 'baseline',
  paddingBlock: { base: '4', lg: '5' },
  borderTop: '1px solid',
  borderColor: 'border',
  _hover: { color: 'accentAlt' },
})

function Row({
  title,
  type,
  year,
  href,
  description,
}: {
  title: string
  type: string
  year: number
  href: string
  description?: string
}) {
  return (
    <a href={href} className={rowClass}>
      <span
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: 'lg',
          letterSpacing: 'tight',
          gridColumn: '1',
          gridRow: '1',
        })}
      >
        {title}
      </span>
      <span
        className={css({
          fontFamily: 'display',
          textStyle: 'xs',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          color: 'textFaint',
          textAlign: 'right',
          gridColumn: '2',
          gridRow: '1',
        })}
      >
        {type} · {year}
      </span>
      <span
        className={css({
          fontFamily: 'body',
          textStyle: 'sm',
          color: 'textMuted',
          gridColumn: '1',
          gridRow: '2',
        })}
      >
        {description ?? type}
      </span>
    </a>
  )
}

const secHeadClass = css({
  fontFamily: 'display',
  textStyle: '2xs',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'textFaint',
  display: 'flex',
  justifyContent: 'space-between',
  gap: '3',
  flexWrap: 'wrap',
  borderBottom: '1px solid',
  borderColor: 'border',
  paddingBottom: '3',
  marginBottom: '6',
})

export function WorkIndex() {
  return (
    <Box
      as="section"
      id="work"
      aria-label="Selected work"
      className={css({
        order: 3,
        paddingInline: { base: '5', md: '6', lg: '8' },
        paddingBlock: { base: '8', lg: '9' },
        borderBottom: '2px solid',
        borderColor: 'borderStrong',
      })}
    >
      <div className={secHeadClass}>
        <span>featured</span>
        <span>the thing that owns itself</span>
      </div>

      {featuredProject && (
        <Box
          as="article"
          className={css({
            bg: 'surface',
            border: '1px solid',
            borderColor: 'border',
            borderTop: '2px solid',
            borderTopColor: 'accent',
            padding: { base: '6', lg: '8' },
            marginBottom: '8',
            display: 'grid',
            gap: '4',
          })}
        >
          <h2
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              textStyle: '2xl',
              letterSpacing: 'tight',
            })}
          >
            {featuredProject.title}
          </h2>
          <div
            className={css({
              fontFamily: 'display',
              textStyle: 'xs',
              letterSpacing: 'wide',
              textTransform: 'uppercase',
              color: 'textFaint',
            })}
          >
            {featuredProject.type} · {featuredProject.year}
          </div>
          {featuredProject.problem && (
            <p className={css({ textStyle: 'md', color: 'textMuted', maxWidth: '64ch' })}>
              {featuredProject.problem}
            </p>
          )}
          {featuredProject.externalUrl && (
            <a
              href={featuredProject.externalUrl}
              target="_blank"
              rel="noopener"
              className={css({
                fontFamily: 'display',
                textStyle: 'sm',
                fontWeight: 'bold',
                color: 'accentAlt',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2',
                minHeight: '44px',
              })}
            >
              <span>visit {featuredProject.externalUrl.replace('https://', '')}</span> ▸
            </a>
          )}
        </Box>
      )}

      <div className={secHeadClass}>
        <span>selected work</span>
        <span>{String(selectedWork.length).padStart(2, '0')}</span>
      </div>
      <div>
        {selectedWork.map((p) => (
          <Row
            key={p.slug}
            title={p.title}
            type={p.type}
            year={p.year}
            href={`/work/${p.slug}`}
            description={p.description}
          />
        ))}
      </div>

      <div className={css({ marginTop: '8' })}>
        <div className={secHeadClass}>
          <span>experiments</span>
          <span>{String(experiments.length).padStart(2, '0')}</span>
        </div>
        <div>
          {experiments.map((p) => (
            <Row
              key={p.slug}
              title={p.title}
              type={p.type}
              year={p.year}
              href={p.externalUrl ?? `/work/${p.slug}`}
              description={p.description}
            />
          ))}
        </div>
      </div>
    </Box>
  )
}
