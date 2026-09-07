import { Box } from '../../../styled-system/jsx'
import { AlmanacGrid } from './AlmanacGrid'

type Education = { school: string; degree: string; concentration: string; years: string }
type Personal = { holesInOne: number; sport: string; teams: string[]; currentFocus: string }

export function RecordGrid({ education, personal }: { education: Education; personal: Personal }) {
  return (
    <Box
      as="section"
      bg="bgAlt"
      paddingInline="clamp(24px, 8vw, 160px)"
      paddingBlock={{ base: '8', lg: '9' }}
    >
      <Box
        as="p"
        fontFamily="body"
        textStyle="xs"
        fontWeight="600"
        textTransform="uppercase"
        letterSpacing="wide"
        color="textFaint"
        marginBottom={{ base: '6', lg: '7' }}
      >
        Record
      </Box>
      <AlmanacGrid
        rows={[
          {
            k: 'Education',
            v: `${education.school} — ${education.degree}, ${education.concentration} (${education.years})`,
          },
          { k: 'Holes in one', v: `${personal.holesInOne} · ${personal.sport}` },
          { k: 'Teams', v: personal.teams.join(' · ') },
          { k: 'Currently', v: personal.currentFocus },
        ]}
      />
    </Box>
  )
}
