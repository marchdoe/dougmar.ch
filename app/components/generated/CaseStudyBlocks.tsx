import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Block = { label: string; body?: string }

export function CaseStudyBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <Box
      px={{ base: '4', md: '6', lg: '96px' }}
      display="flex"
      flexDirection="column"
      gap={{ base: '9', md: '12' }}
    >
      {blocks.map(
        (block) =>
          block.body && (
            <Box
              key={block.label}
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
                  mb: '2',
                })}
              >
                {block.label}
              </p>
              <p className={css({ textStyle: 'md', color: 'textMuted', maxW: '68ch' })}>
                {block.body}
              </p>
            </Box>
          )
      )}
    </Box>
  )
}
