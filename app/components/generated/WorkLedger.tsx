import { css, cx } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { riseOnScroll } from './motion'
import { SignalsPanel } from './SignalsPanel'
import { WorkGroup } from './WorkList'

type Project = (typeof projects)[number]

export function WorkLedger({
  selected,
  experiments,
}: {
  selected: Project[]
  experiments: Project[]
}) {
  return (
    <section
      className={cx(
        riseOnScroll,
        css({
          paddingInline: 'clamp(28px, 6vw, 108px)',
          paddingTop: 'clamp(48px, 6vw, 80px)',
          paddingBottom: 'clamp(48px, 6vw, 80px)',
          display: 'grid',
          gridTemplateColumns: '1fr',
          rowGap: '56px',
          lg: { gridTemplateColumns: 'repeat(12, 1fr)', columnGap: '24px', rowGap: '0' },
        })
      )}
    >
      <div aria-hidden="true" className={css({ height: '96px', lg: { gridColumn: '1 / -1' } })} />
      <div className={css({ minWidth: 0, lg: { gridColumn: '1 / 9' } })}>
        <WorkGroup label="Selected work" items={selected} />
        <WorkGroup label="Experiments" items={experiments} spaced />
      </div>
      <SignalsPanel />
    </section>
  )
}
