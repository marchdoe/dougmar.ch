import { Box } from '../../../styled-system/jsx'
import type { Education } from '../../content/timeline'

export function EducationBlock({ education }: { education: Education }) {
  return (
    <Box
      as="section"
      px={{ base: '28px', md: '52px', lg: '88px' }}
      py={{ base: '30px', md: '52px' }}
      bg="bg"
    >
      <Box
        as="h2"
        fontFamily="display"
        fontWeight="700"
        textStyle="2xl"
        mb={{ base: '18px', md: '26px' }}
      >
        Education
      </Box>
      <Box display="flex" flexDirection="column" alignItems="flex-start" gap="6px">
        <Box fontFamily="display" fontWeight="700" textStyle="lg" color="text">
          {education.school}
        </Box>
        <Box textStyle="base" color="textMuted">
          {education.degree} · {education.concentration}
        </Box>
        <Box textStyle="sm" color="textFaint" fontVariantNumeric="tabular-nums">
          {education.years}
        </Box>
      </Box>
    </Box>
  )
}
