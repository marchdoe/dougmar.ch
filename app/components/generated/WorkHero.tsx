import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { openRange } from './copyText'
import { HeroField } from './HeroField'

type Project = (typeof projects)[number]

const titleClass = css({
  marginTop: 'auto',
  paddingTop: 'clamp(40px,8vh,96px)',
  fontFamily: 'display',
  fontWeight: 'normal',
  textTransform: 'uppercase',
  textAlign: 'left',
  fontSize: { base: '64px', md: 'clamp(80px,10vw,150px)' },
  lineHeight: '0.86',
  letterSpacing: '0.01em',
  color: 'text',
  animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '0ms',
})

export function WorkHero({ project }: { project: Project }) {
  const chips = [
    { key: 'type', value: project.type },
    { key: 'year', value: String(project.year) },
    { key: 'role', value: project.role },
    { key: 'timeline', value: openRange(project.timeline) },
    { key: 'status', value: project.status },
  ].filter((chip) => chip.value)
  return (
    <HeroField>
      <h1 className={titleClass}>{project.title}</h1>
      <div
        className={css({
          marginTop: 'clamp(28px,4vh,48px)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        {chips.map((chip) => (
          <span
            key={chip.key}
            className={css({
              bg: 'bg',
              paddingBlock: '1',
              paddingInline: '2',
              textStyle: 'xs',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'text',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            {chip.value}
          </span>
        ))}
      </div>
    </HeroField>
  )
}

export function MissingWorkHero() {
  return (
    <HeroField>
      <h1 className={titleClass}>Project not found</h1>
    </HeroField>
  )
}
