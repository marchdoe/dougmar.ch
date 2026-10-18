import { css } from '../../../styled-system/css'
import { projects } from '../../content/projects'
import { Reveal } from './Reveal'
import { WorkRow } from './WorkRow'

// The 820px fault named in the repair brief ("A new design ships every
// morning...") sits in the site rail rendered by __root.tsx above <Layout>.
// That rail is orchestrator-owned and may not be styled, hidden or targeted
// from any file this run writes, so no change here reaches it.

const ordered = [...projects].sort((a, b) => a.year - b.year)
const years = projects.map((p) => p.year)
const first = Math.min(...years)
const last = Math.max(...years)
const count = String(projects.length).padStart(2, '0')
const numberWords = [
  'Zero',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
]
const countWord = numberWords[projects.length] ?? String(projects.length)
const span = `${first}–${last}`

export function WorkIndex() {
  return (
    <Reveal label={`Selected work, ${first} to ${last}`}>
      <div
        className={css({
          bg: 'bg',
          paddingInline: 'clamp(24px, 6vw, 112px)',
          paddingTop: 'clamp(26px, 6vw, 88px)',
          paddingBottom: 'clamp(48px, 6vw, 96px)',
          display: { base: 'block', lg: 'grid' },
          gridTemplateColumns: { lg: 'repeat(12, 1fr)' },
          columnGap: { lg: 'clamp(16px, 2vw, 32px)' },
        })}
      >
        <div
          className={css({
            marginBottom: { base: 'clamp(20px, 4vw, 44px)', lg: '0' },
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: { base: 'baseline', lg: 'flex-start' },
            flexDirection: { lg: 'column' },
            rowGap: { base: '4px', lg: '0' },
            columnGap: { base: 'clamp(14px, 3vw, 24px)', lg: '0' },
            gridColumn: { lg: '1 / 4' },
            position: { lg: 'sticky' },
            top: { lg: '28px' },
            alignSelf: { lg: 'start' },
          })}
        >
          <span
            className={css({
              display: 'block',
              flexBasis: '100%',
              fontFamily: 'body',
              fontWeight: 'bold',
              textStyle: '2xs',
              letterSpacing: 'widest',
              textTransform: 'uppercase',
              color: 'textMuted',
              marginBottom: '12px',
            })}
          >
            Selected Work
          </span>
          <span
            className={css({
              display: 'block',
              fontFamily: 'display',
              fontWeight: 'normal',
              fontSize: { base: '20px', lg: '30px' },
              lineHeight: 'snug',
              color: 'text',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap',
            })}
          >
            {span}
          </span>
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: 'clamp(26px, 5vw, 48px)',
              color: 'accent',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: '1',
              marginTop: { lg: '18px' },
            })}
          >
            {count}
          </span>
          <p
            className={css({
              flexBasis: '100%',
              order: 3,
              marginTop: '8px',
              fontSize: '15px',
              lineHeight: 'normal',
              color: 'textMuted',
              maxWidth: '42ch',
            })}
          >
            {countWord} projects {span}. None of them waited for permission.
          </p>
        </div>
        <div
          role="list"
          className={css({
            gridColumn: { lg: '4 / 13' },
            minWidth: '0',
            borderTopWidth: '2px',
            borderTopStyle: 'solid',
            borderTopColor: 'borderStrong',
          })}
        >
          {ordered.map((project, i) => (
            <WorkRow key={project.slug} project={project} index={i + 1} />
          ))}
        </div>
      </div>
    </Reveal>
  )
}
