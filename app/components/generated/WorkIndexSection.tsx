import { css } from '../../../styled-system/css'

type Project = { slug: string; title: string; type: string; year: number; externalUrl?: string }

function WorkColumn({ heading, items }: { heading: string; items: Project[] }) {
  return (
    <div>
      <h3
        className={css({
          fontFamily: 'body',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          fontSize: 'xs',
          color: 'textFaint',
          paddingBottom: '2',
          borderBottom: '1px solid',
          borderColor: 'borderStrong',
          marginBottom: '2',
        })}
      >
        {heading}
      </h3>
      {items.map((item) => (
        <a
          key={item.slug}
          href={item.externalUrl ?? `/work/${item.slug}`}
          target={item.externalUrl ? '_blank' : undefined}
          rel={item.externalUrl ? 'noopener' : undefined}
          className={css({
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'baseline',
            gap: '4',
            padding: '3',
            borderBottom: '1px solid',
            borderColor: 'border',
            minHeight: '56px',
          })}
        >
          <span>
            <span
              className={css({
                display: 'block',
                fontFamily: 'display',
                fontWeight: 'normal',
                fontSize: 'lg',
              })}
            >
              {item.title}
            </span>
            <span
              className={css({
                fontSize: 'xs',
                color: 'textMuted',
                textTransform: 'uppercase',
                letterSpacing: 'wide',
              })}
            >
              {item.type}
            </span>
          </span>
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: 'sm',
              color: 'textFaint',
            })}
          >
            {item.year}
          </span>
        </a>
      ))}
    </div>
  )
}

export function WorkIndexSection({
  selectedWork,
  experiments,
}: {
  selectedWork: Project[]
  experiments: Project[]
}) {
  return (
    <section
      className={css({
        bg: 'surface',
        color: 'text',
        padding: { base: '6', md: '8' },
        borderTop: '1px solid',
        borderColor: 'border',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div
        className={css({
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '3',
          marginBottom: '5',
        })}
      >
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: '2xl',
            letterSpacing: 'tight',
          })}
        >
          Selected Work &amp; Experiments
        </h2>
        <p className={css({ fontSize: 'sm', color: 'textMuted', maxWidth: '40ch' })}>
          Founder, SaaS and AI builds, plus the small experiments that taught the rest.
        </p>
      </div>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
          gap: '7',
        })}
      >
        <WorkColumn heading="Selected Work" items={selectedWork} />
        <WorkColumn heading="Experiments" items={experiments} />
      </div>
    </section>
  )
}
