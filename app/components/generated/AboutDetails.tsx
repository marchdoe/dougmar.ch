import { css } from '../../../styled-system/css'
import type { personal } from '../../content/about'
import type { education } from '../../content/timeline'
import { EvLabel } from './Panel'

const block = css({ marginTop: '6' })

export function Capabilities({ items }: { items: string[] }) {
  return (
    <div className={block}>
      <EvLabel>Capability</EvLabel>
      <ul
        className={css({
          listStyle: 'none',
          margin: '0',
          padding: '0',
          display: 'flex',
          flexWrap: 'wrap',
          rowGap: '2',
          columnGap: '4',
          paddingBottom: '3',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderColor: 'border',
        })}
      >
        {items.map((c) => (
          <li
            key={c}
            className={css({
              fontFamily: 'body',
              fontSize: 'sm',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              color: 'text',
            })}
          >
            {c}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function EducationBlock({ school }: { school: typeof education }) {
  const detail = [school.degree, school.concentration, school.years]
    .filter((s) => s !== '')
    .join(', ')
  return (
    <div className={block}>
      <EvLabel>Education</EvLabel>
      <div
        className={css({
          paddingBlock: '3',
          borderTopWidth: '1px',
          borderBottomWidth: '1px',
          borderStyle: 'solid',
          borderLeftWidth: '0',
          borderRightWidth: '0',
          borderColor: 'border',
        })}
      >
        <div
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: { base: 'base', lg: 'lg' },
            color: 'text',
          })}
        >
          {school.school}
        </div>
        <div
          className={css({
            marginTop: '1',
            fontFamily: 'body',
            fontSize: 'sm',
            color: 'textMuted',
          })}
        >
          {detail}
        </div>
      </div>
    </div>
  )
}

const k = css({
  flexShrink: 0,
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wider',
  fontSize: '2xs',
  color: 'textFaint',
})
const v = css({ fontSize: 'sm', color: 'textMuted', maxWidth: '48ch' })

export function PersonalCluster({ data }: { data: typeof personal }) {
  const facts = [
    { label: 'Holes in one', value: String(data.holesInOne) },
    { label: 'Sport', value: data.sport },
    { label: 'Teams', value: data.teams.join(', ') },
    { label: 'Current focus', value: data.currentFocus },
  ]
  return (
    <div className={block}>
      <EvLabel>Off the clock</EvLabel>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          rowGap: '2',
          columnGap: '18px',
          fontFamily: 'body',
        })}
      >
        {facts.map((f) => (
          <div
            key={f.label}
            className={css({ display: 'flex', alignItems: 'baseline', gap: '6px', minWidth: 0 })}
          >
            <span className={k}>{f.label}</span>
            <span className={v}>{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
