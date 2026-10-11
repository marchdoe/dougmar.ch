import { css, cx } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { riseOnScroll } from './motion'
import { textField } from './projectFields'

type Project = (typeof projects)[number]

// At lg the narrative sets as side-by-side columns across the full grid,
// so the row is filled without stretching any line past its measure.
export function CaseBody({ project }: { project: Project }) {
  const sections = [
    ['Problem', textField(project, 'problem')],
    ['Approach', textField(project, 'approach')],
    ['Outcome', textField(project, 'outcome')],
    ['Overview', textField(project, 'description')],
  ].filter(([, body]) => body !== '')
  return (
    <section
      className={cx(
        riseOnScroll,
        css({
          paddingInline: 'clamp(28px, 6vw, 108px)',
          paddingTop: 'clamp(16px, 3vw, 32px)',
          paddingBottom: 'clamp(48px, 6vw, 80px)',
          display: 'grid',
          gridTemplateColumns: '1fr',
          rowGap: '6',
          lg: {
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            columnGap: '48px',
          },
        })
      )}
    >
      {sections.map(([label, body]) => (
        <div
          key={label}
          className={css({
            minWidth: 0,
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderColor: 'borderStrong',
            paddingTop: '4',
          })}
        >
          <h2
            className={css({
              fontFamily: 'display',
              fontStyle: 'italic',
              fontWeight: 'normal',
              textStyle: 'xl',
              color: 'text',
              marginBottom: '3',
            })}
          >
            {label}
          </h2>
          <p
            className={css({
              marginBlock: '0',
              textStyle: 'base',
              color: 'text',
              maxWidth: '52ch',
            })}
          >
            {body}
          </p>
        </div>
      ))}
    </section>
  )
}
