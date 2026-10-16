import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CornerHeader } from './CornerHeader'
import { CreamPanel, FieldPanel, SplitHero } from './Panels'
import { Roster } from './Roster'
import { WorkMeta } from './WorkMeta'

type Proj = (typeof projects)[number]

export function WorkHero({ project }: { project: Proj }) {
  const deck = project.description ?? `${project.type}, ${project.year}.`
  return (
    <SplitHero>
      <CreamPanel>
        <CornerHeader />
        <div
          className={css({
            fontSize: 'xs',
            fontWeight: 'bold',
            letterSpacing: 'widest',
            textTransform: 'uppercase',
            color: 'textFaint',
            marginBottom: '18px',
          })}
        >
          Case study
        </div>
        <p
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: { base: 'base', md: 'lg' },
            color: 'text',
            maxWidth: '30ch',
            minWidth: '0',
            overflowWrap: 'break-word',
          })}
        >
          {deck}
        </p>
      </CreamPanel>
      <FieldPanel>
        <div
          className={css({
            fontSize: 'xs',
            fontWeight: 'bold',
            letterSpacing: 'widest',
            textTransform: 'uppercase',
            color: 'fieldInkMuted',
            marginBottom: '3',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          The Evidence
        </div>
        <h1
          className={css({
            textStyle: 'hero',
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: {
              base: 'clamp(40px, 12vw, 56px)',
              md: 'clamp(56px, 9vw, 96px)',
              lg: 'clamp(48px, 5.2vw, 112px)',
            },
            lineHeight: '0.92',
            letterSpacing: 'tight',
            color: 'fieldInk',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {project.title}
        </h1>
        <WorkMeta project={project} />
        <Roster project={project} />
      </FieldPanel>
    </SplitHero>
  )
}
