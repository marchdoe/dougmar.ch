import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CaseAside } from './CaseAside'
import { CaseNarrative } from './CaseNarrative'

type Entry = (typeof projects)[number]

export function CaseStudy({ project }: { project: Entry }) {
  return (
    <section
      className={css({
        bg: 'bg',
        color: 'text',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        paddingBlock: 'clamp(56px, 9vh, 110px)',
        paddingInline: { base: '4', md: '5vw' },
        display: 'flex',
        flexDirection: 'column',
        gap: { base: '6', lg: '7' },
      })}
    >
      <CaseNarrative project={project} />
      <CaseAside project={project} />
    </section>
  )
}
