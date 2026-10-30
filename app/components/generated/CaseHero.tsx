import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { ArtifactLabel } from './ArtifactLabel'
import { HeroBand } from './HeroBand'

type Project = (typeof projects)[number]

function textField(p: Project, key: string): string {
  const v = (p as unknown as Record<string, unknown>)[key]
  return typeof v === 'string' ? v : ''
}

export function CaseHero({ project }: { project: Project }) {
  const meta = [
    { k: 'Year', v: String(project.year) },
    { k: 'Role', v: project.role ?? '' },
    { k: 'Timeline', v: textField(project, 'timeline') },
    { k: 'Status', v: textField(project, 'status') },
  ].filter((m) => m.v !== '')
  return (
    <>
      <ArtifactLabel left={`Case Study · ${project.type}`} right={String(project.year)} />
      <HeroBand>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: { base: 'clamp(26px, 7.6vw, 40px)', md: '68px', lg: 'min(6.6vw, 96px)' },
            lineHeight: '0.96',
            letterSpacing: '0.005em',
            textTransform: 'uppercase',
            color: 'fieldInk',
          })}
        >
          {project.title}
        </h1>
        <div
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: { base: '18px', lg: '28px' },
          })}
        >
          {meta.map((m) => (
            <span
              key={m.k}
              className={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                bg: 'field',
                paddingBlock: '6px',
                paddingInline: '10px',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'fieldBorder',
              })}
            >
              <span
                className={css({
                  fontFamily: 'body',
                  fontWeight: 'bold',
                  fontSize: '2xs',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'fieldInk',
                })}
              >
                {m.k}
              </span>
              <span
                className={css({
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  fontVariant: 'small-caps',
                  letterSpacing: 'wide',
                  fontSize: 'sm',
                  color: 'fieldInk',
                })}
              >
                {m.v}
              </span>
            </span>
          ))}
        </div>
      </HeroBand>
    </>
  )
}
