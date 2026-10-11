import { css, cx } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { ClientMarks } from './ClientMarks'
import { Lab } from './Lab'
import { textField } from './projectFields'

type Project = (typeof projects)[number]

const fact = css({
  fontFamily: 'display',
  fontStyle: 'italic',
  fontSize: 'clamp(18px, 1.8vw, 22px)',
  color: 'fieldInk',
  fontVariantNumeric: 'tabular-nums',
})

const factLink = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  textDecoration: 'underline',
  textDecorationThickness: '1px',
  textDecorationColor: 'accent',
  _hover: { textDecorationThickness: '2px' },
})

// The ledger is static: present from first paint, only the hero type wipes in.
export function EvidencePanel({ project }: { project: Project }) {
  const role = textField(project, 'role')
  const outbound = textField(project, 'externalUrl') || textField(project, 'liveUrl')
  return (
    <aside
      aria-label={`${project.title} client set`}
      className={css({
        bg: 'field',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'fieldBorder',
        padding: 'clamp(22px, 3vw, 30px)',
        display: 'flex',
        flexDirection: 'column',
        flex: '1',
      })}
    >
      <div className={css({ marginBottom: '18px' })}>
        <Lab alt>{`${project.title}, built for`}</Lab>
      </div>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          rowGap: '2px',
          columnGap: '20px',
          paddingBottom: '5',
          marginBottom: '5',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderColor: 'fieldBorder',
        })}
      >
        {role ? <span className={fact}>{role}</span> : null}
        <span className={fact}>Since {project.year}</span>
        <a href={`/work/${project.slug}`} className={cx(fact, factLink)}>
          Read the case&nbsp;→
        </a>
        {outbound ? (
          <a href={outbound} className={cx(fact, factLink)}>
            {outbound.replace(/^https?:\/\//, '').replace(/\/$/, '')}
          </a>
        ) : null}
      </div>
      <ClientMarks clients={project.clients ?? []} />
    </aside>
  )
}
