import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { WorkList } from './WorkList'

type Item = (typeof projects)[number]

export function HomeWork({ selected, experiments }: { selected: Item[]; experiments: Item[] }) {
  return (
    <section
      id="work"
      className={css({
        paddingTop: { base: '56px', lg: '112px' },
        paddingBottom: { base: '48px', lg: '112px' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <p
        className={css({
          fontSize: 'clamp(18px, 2vw, 22px)',
          lineHeight: '1.45',
          color: 'textMuted',
          maxWidth: '46ch',
          marginBottom: '40px',
        })}
      >
        A score is a score. The rest is the work, a decade of founding and building, with side
        projects going back to 2008, indexed below.
      </p>
      <WorkList label="Selected work" items={selected} spaced={false} />
      <WorkList label="Experiments" items={experiments} spaced />
    </section>
  )
}
