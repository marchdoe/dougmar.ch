import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { ScoreStrip } from './ScoreStrip'
import { SectionHead } from './SectionHead'

export function AboutPersonal() {
  const items = [
    { k: 'Holes in one', v: <b>{personal.holesInOne}</b> },
    { k: 'Sport', v: personal.sport },
    { k: 'Teams', v: personal.teams.join(', ') },
    { k: 'Current focus', v: personal.currentFocus },
  ]
  return (
    <section
      className={css({
        paddingInline: { base: '22px', md: '40px', lg: '6vw' },
        paddingBottom: '56px',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionHead title="Off the clock" meta="Box score" />
      <div
        className={css({
          bg: 'field',
          borderTop: '2px solid',
          borderColor: 'fieldBorder',
          borderRadius: 'md',
          paddingBlock: '6',
          paddingInline: { base: '22px', md: '34px' },
        })}
      >
        <ScoreStrip items={items} />
      </div>
    </section>
  )
}
