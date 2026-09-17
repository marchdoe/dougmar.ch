import { css } from '../../../styled-system/css'
import { Box } from '../../../styled-system/jsx'
import { Ground } from '../Material'

type Project = { title: string; type: string; year: number; role?: string }

export function WorkHeader({ project }: { project: Project }) {
  return (
    <Box
      as="section"
      position="relative"
      overflow="hidden"
      bg="bg"
      className={css({
        paddingInline: '7vw',
        paddingBlock: { base: '56px 40px', md: '96px 56px' },
      })}
    >
      <Ground material="grain" seed={2127111272} />
      <Box position="relative" zIndex="1">
        <Box
          as="h1"
          fontFamily="display"
          fontWeight="light"
          fontVariant="small-caps"
          textTransform="lowercase"
          color="text"
          textAlign="left"
          className={css({
            textStyle: { base: 'xl', md: '3xl' },
            letterSpacing: 'wide',
            lineHeight: 'snug',
            maxWidth: '20ch',
          })}
        >
          {project.title}
        </Box>
        <Box className={css({ display: 'flex', flexWrap: 'wrap', gap: '4', marginTop: '5' })}>
          <Marker label="Type" value={project.type} />
          <Marker label="Year" value={String(project.year)} />
          {project.role && <Marker label="Role" value={project.role} />}
        </Box>
      </Box>
    </Box>
  )
}

function Marker({ label, value }: { label: string; value: string }) {
  return (
    <Box className={css({ display: 'flex', flexDirection: 'column', gap: '1' })}>
      <span
        className={css({
          fontSize: 'xs',
          fontWeight: '600',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'textFaint',
        })}
      >
        {label}
      </span>
      <span className={css({ fontFamily: 'display', fontSize: 'sm', color: 'textMuted' })}>
        {value}
      </span>
    </Box>
  )
}
