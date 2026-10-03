import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { SectionHeading } from './SectionHeading'
import { SigItem } from './SigItem'

export function PersonalSection() {
  return (
    <section
      className={css({
        maxWidth: '720px',
        marginInline: 'auto',
        paddingTop: '64px',
        paddingBottom: '64px',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        boxSizing: 'content-box',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionHeading label="off the clock" title="the rest of the card" flush />
      <div
        className={css({
          marginTop: '20px',
          bg: 'bgAlt',
          display: 'grid',
          gridTemplateColumns: { base: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          rowGap: '4px',
          columnGap: '24px',
          justifyItems: 'center',
          paddingBlock: '16px',
        })}
      >
        <SigItem label="holes in one">
          <b
            className={`tnum ${css({ fontFamily: 'display', fontWeight: 'normal', fontSize: 'xl', color: 'fieldBorder' })}`}
          >
            {personal.holesInOne}
          </b>
        </SigItem>
        <SigItem label="sport">{personal.sport}</SigItem>
        <SigItem label="teams">{personal.teams.join(', ')}</SigItem>
        <SigItem label="current focus">{personal.currentFocus}</SigItem>
      </div>
    </section>
  )
}
