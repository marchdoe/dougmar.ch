import { css } from '../../../styled-system/css'

type WorkItem = {
  slug: string
  title: string
  type: string
  year: number
  liveUrl?: string
  externalUrl?: string
}

type FeaturedProject = {
  slug: string
  title: string
  type: string
  year: number
  problem?: string
  externalUrl?: string
}

function workHref(item: WorkItem): string {
  return item.liveUrl ?? item.externalUrl ?? `/work/${item.slug}`
}

function WorkRow({ item, large }: { item: WorkItem; large?: boolean }) {
  return (
    <li className={css({ borderTop: '1px solid', borderColor: 'border' })}>
      <a
        href={workHref(item)}
        className={css({
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '4',
          flexWrap: 'wrap',
          minHeight: '44px',
          paddingBlock: '3',
        })}
      >
        <span
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            lineHeight: '1',
            fontSize: large ? '2xl' : 'xl',
          })}
        >
          {item.title}
        </span>
        <span
          className={css({
            fontSize: 'sm',
            color: 'textFaint',
            whiteSpace: 'nowrap',
            textAlign: 'right',
          })}
        >
          {item.type}, {item.year}
        </span>
      </a>
    </li>
  )
}

export function WorkIndexCard({
  featured,
  selected,
  experiments,
}: {
  featured?: FeaturedProject
  selected: WorkItem[]
  experiments: WorkItem[]
}) {
  return (
    <div
      className={css({
        bg: 'surface',
        border: '1px solid',
        borderColor: 'border',
        borderRadius: 'md',
        paddingInline: '6',
        paddingBlock: '7',
      })}
    >
      {featured && (
        <div
          className={css({
            borderBottom: '2px solid',
            borderColor: 'borderStrong',
            paddingBottom: '6',
            marginBottom: '6',
          })}
        >
          <span
            className={css({
              display: 'block',
              marginBottom: '2',
              fontSize: 'xs',
              fontWeight: 'bold',
              letterSpacing: 'wide',
              textTransform: 'uppercase',
              color: 'accent',
            })}
          >
            Featured
          </span>
          <h3
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: '2xl',
              lineHeight: '1',
              color: 'text',
            })}
          >
            {featured.title}
          </h3>
          <p
            className={css({
              color: 'textFaint',
              fontSize: 'sm',
              marginTop: '2',
              marginBottom: '3',
            })}
          >
            {featured.type}, {featured.year}
          </p>
          {featured.problem && (
            <p
              className={css({
                color: 'textMuted',
                fontSize: 'base',
                maxWidth: '52ch',
                lineHeight: 'loose',
              })}
            >
              {featured.problem}
            </p>
          )}
          {featured.externalUrl && (
            <a
              href={featured.externalUrl}
              className={css({
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2',
                minHeight: '44px',
                color: 'accentAlt',
                fontWeight: 'bold',
                fontSize: 'sm',
                marginTop: '3',
              })}
            >
              Visit the live site →
            </a>
          )}
        </div>
      )}

      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: 'lg',
          color: 'text',
          marginBottom: '3',
        })}
      >
        Selected Work
      </h2>
      <ul
        className={css({
          listStyle: 'none',
          margin: 0,
          padding: 0,
          borderBottom: '1px solid',
          borderColor: 'border',
        })}
      >
        {selected.map((item) => (
          <WorkRow key={item.slug} item={item} large />
        ))}
      </ul>

      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: 'lg',
          color: 'text',
          marginTop: '7',
          marginBottom: '3',
        })}
      >
        Experiments
      </h2>
      <ul
        className={css({
          listStyle: 'none',
          margin: 0,
          padding: 0,
          borderBottom: '1px solid',
          borderColor: 'border',
        })}
      >
        {experiments.map((item) => (
          <WorkRow key={item.slug} item={item} />
        ))}
      </ul>
    </div>
  )
}
