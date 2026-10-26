import type { projects } from '../../content/projects'
import { css } from '../../../styled-system/css'
import { Masthead } from './Masthead'

type Project = (typeof projects)[number]

function readString(obj: object, key: string): string {
  const v: unknown = Reflect.get(obj, key)
  return typeof v === 'string' ? v : ''
}

function caseFacts(p: Project) {
  return [
    { label: 'Type', value: p.type },
    { label: 'Year', value: String(p.year) },
    { label: 'Role', value: p.role ?? '' },
    { label: 'Timeline', value: readString(p, 'timeline') },
    { label: 'Status', value: readString(p, 'status') },
    { label: 'Clients', value: (p.clients ?? []).map((c) => c.name).join(', ') },
  ].filter((f) => f.value !== '')
}

export function CaseHero({ project }: { project: Project }) {
  return (
    <Masthead>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: 'minmax(0, 1fr) 320px' },
          gap: '6',
          alignItems: 'end',
        })}
      >
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: 'clamp(38px, 9vw, 128px)',
            lineHeight: '0.9',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            color: 'fieldInk',
            minWidth: '0',
          })}
        >
          {project.title}
        </h1>
        <dl
          className={css({
            bg: 'field',
            margin: '0',
            paddingBlock: '3',
            paddingInline: '4',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '3',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'fieldBorder',
          })}
        >
          {caseFacts(project).map((f) => (
            <div key={f.label}>
              <dt
                className={css({
                  fontSize: '12px',
                  letterSpacing: 'widest',
                  textTransform: 'uppercase',
                  color: 'fieldInkMuted',
                })}
              >
                {f.label}
              </dt>
              <dd className={css({ margin: '0', textStyle: 'sm', color: 'fieldInk' })}>
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Masthead>
  )
}
