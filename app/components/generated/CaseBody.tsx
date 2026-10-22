import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CaseLinks } from './CaseLinks'
import { BonePanel, EvLabel } from './Panel'

type Project = (typeof projects)[number]

function str(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function CaseFacts({ project }: { project: Project }) {
  const extra: Record<string, unknown> = { ...project }
  const facts = [
    { k: 'Type', v: project.type },
    { k: 'Year', v: String(project.year) },
    { k: 'Role', v: str(extra.role) },
    { k: 'Timeline', v: str(extra.timeline) },
    { k: 'Status', v: str(extra.status) },
  ].filter((f) => f.v !== '')
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '3',
        paddingBottom: '4',
        marginBottom: '4',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderColor: 'borderStrong',
      })}
    >
      {facts.map((f) => (
        <div key={f.k}>
          <div
            className={css({
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 'wider',
              fontSize: '2xs',
              color: 'textFaint',
            })}
          >
            {f.k}
          </div>
          <div className={css({ marginTop: '1', fontSize: 'sm', color: 'text' })}>{f.v}</div>
        </div>
      ))}
    </div>
  )
}

function CaseNarrative({ project }: { project: Project }) {
  const parts = [
    { h: 'Overview', body: project.description },
    { h: 'Problem', body: project.problem },
    { h: 'Approach', body: project.approach },
    { h: 'Outcome', body: project.outcome },
  ].flatMap((p) => (p.body ? [{ h: p.h, body: p.body }] : []))
  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '5' })}>
      {parts.map((p) => (
        <div key={p.h}>
          <h2
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              textStyle: 'lg',
              color: 'text',
              marginBottom: '2',
            })}
          >
            {p.h}
          </h2>
          <p
            className={css({
              fontFamily: 'body',
              fontSize: 'base',
              lineHeight: 'normal',
              color: 'text',
              maxWidth: '56ch',
            })}
          >
            {p.body}
          </p>
        </div>
      ))}
    </div>
  )
}

export function CaseBody({ project }: { project: Project }) {
  return (
    <BonePanel label={`${project.title}, case study`}>
      <EvLabel>The work</EvLabel>
      <CaseFacts project={project} />
      <CaseNarrative project={project} />
      <CaseLinks stack={project.stack ?? []} project={project} />
    </BonePanel>
  )
}
