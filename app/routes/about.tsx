import { createFileRoute } from '@tanstack/react-router'
import { identity, personal } from '../content/about'
import { timeline, capabilities, education } from '../content/timeline'
import { IndexRow } from '../components/generated/IndexRow'
import { CapabilitiesTags } from '../components/generated/CapabilitiesTags'
import { Colophon } from '../components/generated/Colophon'
import { Box } from '../../styled-system/jsx'
import { css } from '../../styled-system/css'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <Box
        as="main"
        paddingInline={{ base: '20px', md: '6', lg: '8' }}
        paddingBlock={{ base: '9', md: '9' }}
        display="flex"
        flexDirection="column"
        gap="6"
      >
        <Box
          className={css({ textStyle: '2xl', fontWeight: '600', color: 'text', maxWidth: '28ch' })}
        >
          {identity.name} — {identity.role}
        </Box>
        <Box className={css({ textStyle: 'xl', color: 'textMuted', maxWidth: '48ch' })}>
          {identity.statement}
        </Box>

        <Box as="section" display="flex" flexDirection="column">
          {timeline.map((entry) => (
            <IndexRow
              key={`${entry.year}-${entry.company}`}
              year={entry.year}
              title={entry.role}
              subtitle={entry.company}
              description={entry.description}
            />
          ))}
          <IndexRow
            year={education.years}
            title={education.degree}
            subtitle={education.concentration}
            description={education.school}
          />
        </Box>

        <CapabilitiesTags items={capabilities} />
      </Box>
      <Colophon
        signals={[
          { label: 'Holes in one', value: String(personal.holesInOne) },
          { label: personal.sport, value: personal.teams.join(' · ') },
          { label: 'Focused on', value: personal.currentFocus },
        ]}
      />
    </>
  )
}
