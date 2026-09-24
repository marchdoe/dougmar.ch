import { css } from '../../../styled-system/css'
import { experiments, featuredProject, selectedWork } from '../../content/projects'
import { LedgerColumn } from './LedgerColumn'
import { StudioColumn } from './StudioColumn'
import { ZoneHead } from './ZoneHead'

export function WorkLedger() {
  return (
    <section
      id="work"
      className={css({
        paddingTop: { base: '88px', xl: '120px' },
        paddingBottom: { base: '72px', xl: '96px' },
        paddingInline: '6vw',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <ZoneHead title="A ledger of commitments" kicker="Ten years · one LLC · seven builds" />
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: {
            base: '1fr',
            md: 'repeat(2, minmax(0, 1fr))',
            xl: 'repeat(3, minmax(0, 1fr))',
          },
          columnGap: '3vw',
          rowGap: '40px',
        })}
      >
        {featuredProject ? <StudioColumn project={featuredProject} /> : null}
        <LedgerColumn label="Selected work" items={selectedWork} />
        <LedgerColumn label="Experiments" items={experiments} />
      </div>
    </section>
  )
}
