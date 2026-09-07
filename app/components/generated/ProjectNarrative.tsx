import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Props = {
  role?: string
  problem?: string
  approach?: string
  outcome?: string
  stack?: string[]
  liveUrl?: string
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Box maxWidth="66ch">
      <Box
        fontFamily="body"
        textStyle="xs"
        fontWeight="600"
        textTransform="uppercase"
        letterSpacing="wide"
        color="textFaint"
        marginBottom="2"
      >
        {label}
      </Box>
      <Box fontFamily="body" textStyle="base" color="textMuted" lineHeight="1.55">
        {value}
      </Box>
    </Box>
  )
}

export function ProjectNarrative({ role, problem, approach, outcome, stack, liveUrl }: Props) {
  return (
    <Box
      as="section"
      bg="bg"
      paddingInline="clamp(24px, 8vw, 160px)"
      paddingBlock={{ base: '9', lg: '9' }}
      display="flex"
      flexDirection="column"
      gap="7"
    >
      {role && <Field label="Role" value={role} />}
      {problem && <Field label="Problem" value={problem} />}
      {approach && <Field label="Approach" value={approach} />}
      {outcome && <Field label="Outcome" value={outcome} />}
      {stack && stack.length > 0 && <Field label="Stack" value={stack.join(' · ')} />}
      {liveUrl && (
        <a
          href={liveUrl}
          className={css({
            fontFamily: 'body',
            textStyle: 'sm',
            fontWeight: '600',
            color: 'accent',
          })}
        >
          Visit live site →
        </a>
      )}
    </Box>
  )
}
