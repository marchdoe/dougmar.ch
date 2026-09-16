import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Step = { phase: string; does: string; produces: string }

export function ProcessSteps({ steps }: { steps: Step[] }) {
  return (
    <Box
      px={{ base: '4', md: '6', lg: '96px' }}
      py={{ base: '8', md: '10' }}
      display="flex"
      flexDirection="column"
      gap="5"
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
        process
      </p>
      <ol
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '4',
          pl: '0',
          listStyle: 'none',
        })}
      >
        {steps.map((step, index) => (
          <li
            key={step.phase}
            className={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', md: '160px 1fr' },
              gap: '2',
              borderTop: '1px solid',
              borderColor: 'border',
              pt: '3',
            })}
          >
            <span className={css({ fontFamily: 'display', textStyle: 'md', color: 'fieldBorder' })}>
              {String(index + 1).padStart(2, '0')} &middot; {step.phase}
            </span>
            <span className={css({ textStyle: 'md', color: 'textMuted' })}>
              {step.does}. Produces: {step.produces}.
            </span>
          </li>
        ))}
      </ol>
    </Box>
  )
}
