import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { PageSection } from './PageSection'

export function TimelineSection() {
  return (
    <PageSection title="experience">
      <ul className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
        {timeline.map((entry) => (
          <li
            key={`${entry.year}${entry.role}${entry.company}`}
            className={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', lg: '220px 1fr' },
              columnGap: '6',
              rowGap: '1',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'border',
              paddingBlock: '5',
            })}
          >
            <div
              className={css({
                textStyle: { base: 'sm', lg: 'xl' },
                fontFamily: 'display',
                color: 'accent',
                fontWeight: 'bold',
              })}
            >
              {entry.year}
            </div>
            <div>
              <div className={css({ textStyle: 'base', color: 'text', fontWeight: 'bold' })}>
                {[entry.role, entry.company].filter(Boolean).join(', ')}
              </div>
              {entry.description ? (
                <p
                  className={css({
                    textStyle: 'base',
                    color: 'textMuted',
                    maxWidth: '58ch',
                    marginTop: '2',
                  })}
                >
                  {entry.description}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </PageSection>
  )
}
