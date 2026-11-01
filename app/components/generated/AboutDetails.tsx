import { css } from '../../../styled-system/css'
import { RevealSection } from './RevealSection'
import { SectionHead } from './SectionHead'

type Props = {
  capabilities: string[]
  education: { school: string; degree: string; concentration: string; years: string }
}

export function AboutDetails({ capabilities, education }: Props) {
  const eduLines = [
    education.school,
    education.degree,
    education.concentration,
    education.years,
  ].filter(Boolean)
  return (
    <RevealSection
      className={css({
        bg: 'surface',
        paddingBlock: { base: '7', lg: '8' },
        paddingInline: { base: '5', md: '7', xl: '8' },
        display: 'grid',
        gap: '7',
        gridTemplateColumns: { base: '1fr', lg: '1.4fr 1fr' },
      })}
    >
      <div>
        <SectionHead>Capabilities</SectionHead>
        <ul
          className={css({
            listStyle: 'none',
            margin: '0',
            padding: '0',
            display: 'flex',
            flexWrap: 'wrap',
            rowGap: '2',
            columnGap: '5',
          })}
        >
          {capabilities.map((c) => (
            <li
              key={c}
              className={css({
                fontSize: 'sm',
                fontVariant: 'small-caps',
                letterSpacing: 'wide',
                color: 'textMuted',
              })}
            >
              {c}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <SectionHead>Education</SectionHead>
        <div
          className={css({
            borderTop: '1px solid',
            borderBottom: '1px solid',
            borderColor: 'fieldBorder',
            paddingBlock: '4',
            display: 'flex',
            flexDirection: 'column',
            gap: '1',
          })}
        >
          {eduLines.map((line, i) => (
            <span
              key={line}
              className={css({
                fontFamily: i === 0 ? 'display' : 'body',
                fontSize: i === 0 ? 'lg' : 'sm',
                color: i === 0 ? 'text' : 'textMuted',
              })}
            >
              {line}
            </span>
          ))}
        </div>
      </div>
    </RevealSection>
  )
}
