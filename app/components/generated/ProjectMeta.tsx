import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Props = { stack?: string[]; liveUrl?: string }

export function ProjectMeta({ stack, liveUrl }: Props) {
  const hasStack = Boolean(stack && stack.length > 0)
  return (
    <Box
      className={css({
        marginTop: '9',
        borderTop: '1px solid',
        borderColor: 'borderStrong',
        paddingTop: '6',
      })}
    >
      {hasStack && (
        <Box className={css({ display: 'flex', flexWrap: 'wrap', gap: '3', marginBottom: '5' })}>
          {stack!.map((tech) => (
            <span
              key={tech}
              className={css({
                border: '1px solid',
                borderColor: 'border',
                paddingX: '4',
                paddingY: '2',
                textStyle: '2xs',
                fontVariant: 'small-caps',
                letterSpacing: 'wide',
                color: 'text',
              })}
            >
              {tech}
            </span>
          ))}
        </Box>
      )}
      {liveUrl && (
        <a
          href={liveUrl}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            gap: '2',
            fontWeight: '700',
            textStyle: 'sm',
            fontVariant: 'small-caps',
            borderBottom: '2px solid',
            borderColor: 'text',
            color: 'text',
            _hover: { color: 'border', borderColor: 'border' },
          })}
        >
          Visit live ↗
        </a>
      )}
    </Box>
  )
}
