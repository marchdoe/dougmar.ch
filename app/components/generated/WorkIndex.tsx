import { css } from '../../../styled-system/css'
import type { Project } from '../../content/projects'

function Column({ heading, items }: { heading: string; items: Project[] }) {
  return (
    <div className={css({ minWidth: 0 })}>
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: 'xl',
          color: 'text',
          borderBottom: '2px solid',
          borderColor: 'text',
          paddingBottom: '2',
          marginBottom: '1',
        })}
      >
        {heading}
      </h2>
      {items.map((item) => (
        <a
          key={item.slug}
          href={item.externalUrl ?? `/work/${item.slug}`}
          className={css({
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'baseline',
            gap: '1 4',
            padding: '4 0',
            borderBottom: '1px solid',
            borderColor: 'border',
            minHeight: '44px',
          })}
        >
          <span
            className={css({
              minWidth: 0,
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: 'lg',
              color: 'text',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
            })}
          >
            {item.title}
          </span>
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: 'base',
              color: 'textFaint',
            })}
          >
            {item.year}
          </span>
          <span
            className={css({
              gridColumn: '1 / -1',
              fontSize: 'xs',
              letterSpacing: 'wider',
              textTransform: 'uppercase',
              color: 'textFaint',
            })}
          >
            {item.type}
          </span>
        </a>
      ))}
    </div>
  )
}

export function WorkIndex({
  selectedWork,
  experiments,
  studio,
}: {
  selectedWork: Project[]
  experiments: Project[]
  studio?: Project
}) {
  return (
    <section
      className={css({
        bg: 'surface',
        borderTop: '1px solid',
        borderColor: 'borderStrong',
        padding: { base: '9 5 10', lg: '64px 5vw 72px' },
      })}
    >
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: 'repeat(3, 1fr)' },
          gap: '8',
        })}
      >
        <Column heading="Selected Work" items={selectedWork} />
        <Column heading="Experiments" items={experiments} />
        <div className={css({ minWidth: 0 })}>
          <h2
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: 'xl',
              color: 'text',
              borderBottom: '2px solid',
              borderColor: 'text',
              paddingBottom: '2',
              marginBottom: '1',
            })}
          >
            The Studio
          </h2>
          {studio && (
            <a
              href={`/work/${studio.slug}`}
              className={css({
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'baseline',
                gap: '1 4',
                padding: '4 0',
                borderBottom: '1px solid',
                borderColor: 'border',
                minHeight: '44px',
              })}
            >
              <span
                className={css({
                  minWidth: 0,
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  fontSize: 'lg',
                  color: 'text',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word',
                })}
              >
                {studio.title}
              </span>
              <span
                className={css({
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  fontSize: 'base',
                  color: 'textFaint',
                })}
              >
                {studio.year}
              </span>
            </a>
          )}
          <p className={css({ marginTop: '5', color: 'textMuted', fontSize: 'sm' })}>
            The vehicle for the client set above, ten years of taking design across the gap into
            shipped, working software.
          </p>
        </div>
      </div>
    </section>
  )
}
