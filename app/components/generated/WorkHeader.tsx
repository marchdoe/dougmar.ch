import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function WorkHeader({ project }: { project: Project }) {
  return (
    <div
      className={css({
        width: '100%',
        maxWidth: '1040px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        textAlign: 'left',
        paddingBlock: '6',
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: '4',
          rowGap: '1',
          fontFamily: 'body',
          textStyle: 'xs',
          fontWeight: 'bold',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textMuted',
        })}
      >
        <span>{project.type}</span>
        <span>{project.year}</span>
      </div>
      <h1
        className={css({
          fontFamily: 'display',
          textStyle: '4xl',
          fontWeight: 'bold',
          textTransform: 'lowercase',
          lineHeight: '0.9',
          color: 'text',
        })}
      >
        {project.title}
      </h1>
      <div
        aria-hidden="true"
        className={css({ width: 'min(72vw, 420px)', height: '2px', bg: 'accent' })}
      />
    </div>
  )
}
