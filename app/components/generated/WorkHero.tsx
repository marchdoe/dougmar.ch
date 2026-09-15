import { css } from '../../../styled-system/css'
import { Box, styled } from '../../../styled-system/jsx'
import { Ground } from '../Material'
import { FieldHead } from './FieldHead'
import type { Project } from '../../content/projects'

export function WorkHero({ project }: { project: Project }) {
  return (
    <Box
      as="section"
      position="relative"
      overflow="hidden"
      bg="bg"
      minWidth="0px"
      className={css({
        display: 'flex',
        flexDirection: 'column',
        padding: { base: '28px 6vw', lg: '36px 4vw', xl: '44px 72px' },
        minHeight: { base: 'auto', lg: '70vh' },
      })}
    >
      <Ground material="dots" seed={13182863} />
      <Box
        position="relative"
        zIndex={1}
        display="flex"
        flexDirection="column"
        flex="1 1 auto"
        minWidth="0px"
      >
        <FieldHead />
        <Box
          className={css({
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: { base: '36px 0 44px' },
            minWidth: '0px',
          })}
        >
          <styled.h1
            className={css({
              fontFamily: 'display',
              fontStyle: 'italic',
              fontWeight: 'normal',
              textTransform: 'uppercase',
              textStyle: { base: '3xl', lg: '5xl' },
              lineHeight: 'tight',
              color: 'transparent',
              WebkitTextStrokeWidth: { base: '2px', lg: '3px' },
              WebkitTextStrokeColor: 'var(--colors-accent)',
              margin: 0,
              maxWidth: '100%',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
              animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '0ms',
            })}
          >
            {project.title}
          </styled.h1>
          <Box
            className={css({
              display: 'flex',
              gap: '4',
              flexWrap: 'wrap',
              justifyContent: 'center',
              mt: '4',
              fontSize: 'sm',
              textTransform: 'uppercase',
              letterSpacing: 'wide',
              color: 'textFaint',
              animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '80ms',
              minWidth: '0px',
            })}
          >
            <span>{project.type}</span>
            <span>{project.year}</span>
            {project.role && <span>{project.role}</span>}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
