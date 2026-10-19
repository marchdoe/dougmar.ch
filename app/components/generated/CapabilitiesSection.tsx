import { css } from '../../../styled-system/css'
import { capabilities, education } from '../../content/timeline'
import { PageSection } from './PageSection'

export function CapabilitiesSection() {
  const detail = [education.degree, education.concentration, education.years]
    .filter(Boolean)
    .join(' · ')
  return (
    <>
      <PageSection title="capabilities">
        <ul
          className={css({
            listStyle: 'none',
            margin: '0',
            padding: '0',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2',
          })}
        >
          {capabilities.map((c) => (
            <li
              key={c}
              className={css({
                textStyle: 'sm',
                color: 'text',
                bg: 'surface',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'border',
                paddingBlock: '1',
                paddingInline: '3',
              })}
            >
              {c}
            </li>
          ))}
        </ul>
      </PageSection>
      <PageSection title="education">
        <div
          className={css({
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'border',
            paddingTop: '4',
          })}
        >
          <div
            className={css({
              textStyle: 'lg',
              fontFamily: 'display',
              fontWeight: 'bold',
              color: 'text',
            })}
          >
            {education.school}
          </div>
          <p
            className={css({
              textStyle: 'base',
              color: 'textMuted',
              marginTop: '2',
              maxWidth: '58ch',
            })}
          >
            {detail}
          </p>
        </div>
      </PageSection>
    </>
  )
}
