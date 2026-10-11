import { css, cx } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { MetaGroup } from './MetaGroup'
import { wipeThird } from './motion'
import { textField } from './projectFields'
import { TagList } from './TagList'

type Project = (typeof projects)[number]

const linkStyle = css({
  fontFamily: 'display',
  fontStyle: 'italic',
  fontSize: 'clamp(18px, 1.8vw, 22px)',
  color: 'fieldInk',
  textDecoration: 'underline',
  textDecorationThickness: '1px',
  textDecorationColor: 'accent',
  _hover: { textDecorationThickness: '2px' },
})

export function CaseFacts({ project }: { project: Project }) {
  const links = [
    ['Live site', textField(project, 'liveUrl')],
    ['Source', textField(project, 'githubUrl')],
    ['Elsewhere', textField(project, 'externalUrl')],
  ].filter(([, url]) => url !== '')
  const stack = project.stack ?? []
  return (
    <aside
      aria-label={`${project.title} record`}
      className={cx(
        wipeThird,
        css({
          bg: 'field',
          color: 'fieldInk',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'fieldBorder',
          padding: 'clamp(22px, 3vw, 30px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '5',
          flex: '1',
        })
      )}
    >
      <MetaGroup
        label="The record"
        lines={[
          ['Type', project.type],
          ['Year', String(project.year)],
          ['Role', textField(project, 'role')],
          ['Timeline', textField(project, 'timeline')],
          ['Status', textField(project, 'status')],
        ]}
      />
      <div
        className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '20px', rowGap: '10px' })}
      >
        {links.map(([label, url]) => (
          <a key={label} href={url} className={linkStyle}>
            {label}&nbsp;→
          </a>
        ))}
      </div>
      {stack.length > 0 ? <TagList items={stack} /> : null}
    </aside>
  )
}
