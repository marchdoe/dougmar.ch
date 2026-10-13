import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { CapabilityTags } from './CapabilityTags'
import { EducationRow } from './EducationRow'
import { FootMeta } from './FootMeta'
import { TimelineList } from './TimelineList'

const sectionCss = css({
  position: 'relative',
  zIndex: 1,
  bg: 'bg',
  color: 'text',
  paddingBlock: '8',
  paddingInline: '6vw',
  borderTopWidth: '2px',
  borderTopStyle: 'solid',
  borderTopColor: 'borderStrong',
  display: 'grid',
  gridTemplateColumns: { base: '1fr', lg: '1.6fr 1fr' },
  columnGap: '8',
  rowGap: '7',
  alignItems: 'start',
  '@supports (animation-timeline: view())': {
    animationName: 'rise',
    animationTimeline: 'view()',
    animationRange: 'entry 0% entry 40%',
    animationFillMode: 'both',
  },
})
const colCss = css({ display: 'flex', flexDirection: 'column', gap: '7', minWidth: '0' })
const headCss = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  fontSize: 'xl',
  lineHeight: 'tight',
  color: 'text',
  marginBottom: '4',
})

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className={headCss}>{title}</h2>
      {children}
    </div>
  )
}

const personalItems = [
  { k: 'Holes in one', v: String(personal.holesInOne) },
  { k: 'Sport', v: personal.sport },
  { k: 'Teams', v: personal.teams.join(', ') },
  { k: 'Current focus', v: personal.currentFocus },
]

export function AboutBody() {
  return (
    <section className={sectionCss}>
      <div className={colCss}>
        <Block title="Experience">
          <TimelineList />
        </Block>
        <Block title="Education">
          <EducationRow />
        </Block>
      </div>
      <div className={colCss}>
        <Block title="Capabilities">
          <CapabilityTags />
        </Block>
        <Block title="Off the clock">
          <FootMeta items={personalItems} />
        </Block>
      </div>
    </section>
  )
}
