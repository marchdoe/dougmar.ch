import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { capabilities, education } from '../../content/timeline'
import { Lab } from './Lab'
import { MetaGroup } from './MetaGroup'
import { TagList } from './TagList'

export function AboutPanel() {
  return (
    <aside
      className={css({
        bg: 'field',
        color: 'fieldInk',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'fieldBorder',
        padding: 'clamp(22px, 3vw, 30px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6',
        minWidth: 0,
        lg: { gridColumn: '9 / 13' },
      })}
    >
      <div>
        <div className={css({ marginBottom: '3' })}>
          <Lab alt>Capabilities</Lab>
        </div>
        <TagList items={capabilities} />
      </div>
      <MetaGroup
        label="Education"
        lines={[
          ['School', education.school],
          ['Degree', education.degree],
          ['Concentration', education.concentration],
          ['Years', education.years],
        ]}
      />
      <MetaGroup
        label="Off the clock"
        lines={[
          ['Holes in one', String(personal.holesInOne)],
          ['Sport', personal.sport],
          ['Teams', personal.teams.join(', ')],
          ['Current focus', personal.currentFocus],
        ]}
      />
    </aside>
  )
}
