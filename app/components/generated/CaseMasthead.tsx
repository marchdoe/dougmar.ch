import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { FloodHero } from './FloodHero'
import { HeroChip } from './HeroChip'

type Project = (typeof projects)[number]

function metaOf(p: Project): string[] {
  return [String(p.year), p.role ?? '', p.type].filter((v) => v !== '')
}

export function CaseMasthead({ project }: { project: Project }) {
  const deck = project.description ?? ''
  return (
    <FloodHero labelledBy="case-hed">
      <HeroChip>Case file · {project.type}</HeroChip>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          columnGap: '6',
          rowGap: '3',
          marginBlock: '14px',
        })}
      >
        <h1
          id="case-hed"
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            color: 'fieldInk',
            fontSize: { base: '40px', lg: '56px' },
            lineHeight: '0.9',
            letterSpacing: 'tight',
            minWidth: '0',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {project.title}
        </h1>
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            alignItems: { base: 'flex-start', lg: 'flex-end' },
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            textStyle: 'lg',
            color: 'fieldInk',
          })}
        >
          {metaOf(project).map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>
      {deck ? (
        <p
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            fontSize: { base: '16px', lg: '20px' },
            lineHeight: 'snug',
            color: 'fieldInk',
            width: '100%',
            minWidth: '0',
            maxWidth: '40ch',
            textWrap: 'wrap',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '160ms',
          })}
        >
          {deck}
        </p>
      ) : null}
    </FloodHero>
  )
}
