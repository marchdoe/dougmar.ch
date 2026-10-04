import { css } from '../../../styled-system/css'
import { experiments, projects } from '../../content/projects'
import { Featured } from './Featured'
import { WorkRows } from './WorkRows'

export function Evidence() {
  const full = projects.filter((p) => p.depth === 'full')
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        minWidth: '0',
      })}
    >
      <Featured />
      <WorkRows label="Selected Work" heading="Things I decided to make." items={full} />
      <WorkRows label="Experiments" items={experiments} />
    </div>
  )
}
