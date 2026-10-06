import { Block } from './LedgerRows'
import { Rail } from './Rail'
import { EducationRow, PersonalCluster } from './RecordExtras'
import { TimelineRows } from './TimelineRows'

export function AboutRail() {
  return (
    <Rail label="Career record" title="The Record">
      <Block label="Experience">
        <TimelineRows />
      </Block>
      <Block label="Education">
        <EducationRow />
      </Block>
      <Block label="Off the clock">
        <PersonalCluster />
      </Block>
    </Rail>
  )
}
