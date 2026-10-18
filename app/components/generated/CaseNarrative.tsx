import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Item = (typeof projects)[number]

export function CaseNarrative({ project }: { project: Item }) {
  const blocks = [
    { k: 'Overview', v: project.description ?? '' },
    { k: 'Problem', v: project.problem ?? '' },
    { k: 'Approach', v: project.approach ?? '' },
    { k: 'Outcome', v: project.outcome ?? '' },
  ].filter((b) => b.v !== '')
  return (
    <div className={css({ borderTop: '1px solid', borderColor: 'border' })}>
      {blocks.map((b, i) => (
        <div
          key={b.k}
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', lg: '140px 1fr' },
            columnGap: '24px',
            rowGap: '8px',
            paddingBlock: '24px',
            borderBottom: '1px solid',
            borderColor: 'border',
          })}
        >
          <div
            className={css({
              fontSize: '13px',
              fontVariant: 'small-caps',
              letterSpacing: 'wider',
              color: 'textFaint',
              paddingTop: '4px',
            })}
          >
            {b.k}
          </div>
          <p
            className={css({
              fontSize: i === 0 ? 'clamp(18px, 2vw, 22px)' : '16px',
              lineHeight: '1.55',
              color: i === 0 ? 'text' : 'textMuted',
              maxWidth: '58ch',
            })}
          >
            {b.v}
          </p>
        </div>
      ))}
    </div>
  )
}
