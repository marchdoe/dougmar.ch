import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Education = { school: string; degree: string; concentration: string; years: string }

export function EducationCard({ education }: { education: Education }) {
  return (
    <Box
      className={css({
        bg: 'surface',
        border: '1px solid',
        borderColor: 'border',
        padding: '5',
        marginTop: '6',
        maxWidth: '48ch',
      })}
    >
      <p className={css({ textStyle: 'lg', fontFamily: 'display', color: 'text' })}>
        {education.school}
      </p>
      <p className={css({ textStyle: 'sm', color: 'textMuted', marginTop: '2' })}>
        {education.degree} · {education.concentration}
      </p>
      <p
        className={css({
          textStyle: '2xs',
          color: 'textFaint',
          marginTop: '2',
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
        })}
      >
        {education.years}
      </p>
    </Box>
  )
}
