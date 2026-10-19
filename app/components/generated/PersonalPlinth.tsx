import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { PageSection } from './PageSection'

export function PersonalPlinth() {
  const items = [
    { label: 'Holes in one', value: String(personal.holesInOne) },
    { label: 'Sport', value: personal.sport },
    { label: 'Teams', value: personal.teams.join(', ') },
    { label: 'Current focus', value: personal.currentFocus },
  ]
  return (
    <PageSection title="off the clock">
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          rowGap: { base: '26px', lg: '34px' },
          columnGap: { base: '32px', lg: '40px' },
          fontVariantNumeric: 'tabular-nums',
        })}
      >
        {items.map((item) => (
          <div key={item.label}>
            <div
              className={css({
                fontSize: '2xs',
                letterSpacing: 'widest',
                textTransform: 'uppercase',
                color: 'textMuted',
                fontWeight: 'bold',
                marginBottom: '6px',
              })}
            >
              {item.label}
            </div>
            <p className={css({ textStyle: 'base', color: 'text', lineHeight: 'snug' })}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </PageSection>
  )
}
