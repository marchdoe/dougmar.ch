import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Reference = { title: string; url: string; note?: string }

export function ReferencesList({ references }: { references: Reference[] }) {
  return (
    <Box
      px={{ base: '4', md: '6', lg: '96px' }}
      py={{ base: '8', md: '10' }}
      display="flex"
      flexDirection="column"
      gap="4"
      className={css({
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <p
        className={css({
          fontSize: 'sm',
          color: 'textFaint',
          textTransform: 'lowercase',
          letterSpacing: 'wide',
        })}
      >
        references
      </p>
      {references.map((ref) => (
        <a
          key={ref.url}
          href={ref.url}
          className={css({
            display: 'block',
            borderTop: '1px solid',
            borderColor: 'border',
            pt: '3',
          })}
        >
          <span
            className={css({
              fontSize: 'sm',
              color: 'accentAlt',
              borderBottom: '1px solid',
              borderColor: 'accentAlt',
            })}
          >
            {ref.title}
          </span>
          {ref.note && (
            <span
              className={css({ display: 'block', fontSize: 'sm', color: 'textFaint', mt: '1' })}
            >
              {ref.note}
            </span>
          )}
        </a>
      ))}
    </Box>
  )
}
