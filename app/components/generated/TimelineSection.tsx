import { css } from '../../../styled-system/css'
import type { timeline } from '../../content/timeline'
import { RevealSection } from './RevealSection'
import { SectionHead } from './SectionHead'

type Entry = (typeof timeline)[number]

export function TimelineSection({ entries }: { entries: Entry[] }) {
  return (
    <RevealSection
      className={css({
        bg: 'bg',
        paddingBlock: { base: '7', lg: '8' },
        paddingInline: { base: '5', md: '7', xl: '8' },
      })}
    >
      <SectionHead>Experience</SectionHead>
      <ul className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
        {entries.map((entry) => (
          <li
            key={`${entry.year}-${entry.company}-${entry.role}`}
            className={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', md: '160px 1fr' },
              columnGap: '6',
              rowGap: '1',
              paddingBlock: '4',
              borderBottom: '1px solid',
              borderColor: 'fieldBorder',
            })}
          >
            <span
              className={css({
                fontSize: 'sm',
                color: 'textFaint',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              {entry.year}
            </span>
            <div
              className={css({ display: 'flex', flexDirection: 'column', gap: '2', minWidth: '0' })}
            >
              <span className={css({ fontSize: { base: 'base', md: 'lede' }, color: 'text' })}>
                {[entry.role, entry.company].filter(Boolean).join(', ')}
              </span>
              {entry.description ? (
                <p className={css({ fontSize: 'sm', color: 'textMuted', maxWidth: '50ch' })}>
                  {entry.description}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </RevealSection>
  )
}
