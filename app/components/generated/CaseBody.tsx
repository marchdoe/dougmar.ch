import { css } from '../../../styled-system/css'
import type { CaseProject } from './caseFields'
import { field } from './caseFields'
import { Ledger } from './Ledger'
import { RevealSection } from './RevealSection'

const labelClass = css({
  display: 'block',
  textStyle: 'xs',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'accent',
  marginBottom: '4',
})

export function CaseBody({ project }: { project: CaseProject }) {
  const blocks = [
    { k: 'Problem', v: field(project, 'problem') },
    { k: 'Approach', v: field(project, 'approach') },
    { k: 'Outcome', v: field(project, 'outcome') },
  ].filter((b) => b.v !== '')
  const links = [
    {
      label: 'Visit the live project',
      href: field(project, 'liveUrl') || field(project, 'externalUrl'),
    },
    { label: 'Read the source', href: field(project, 'githubUrl') },
  ].filter((l) => l.href !== '')
  return (
    <>
      <RevealSection title="Mission data" sub="Readout">
        <Ledger
          rows={[
            { k: 'Type', v: project.type },
            { k: 'Year', v: String(project.year) },
            { k: 'Role', v: field(project, 'role') },
            { k: 'Timeline', v: field(project, 'timeline') },
            { k: 'Status', v: field(project, 'status') },
            { k: 'Stack', v: (project.stack ?? []).join(', ') },
          ]}
        />
      </RevealSection>
      <RevealSection
        title="The work"
        sub={field(project, 'description') ? 'Account' : 'Record'}
        tone="bgAlt"
      >
        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', lg: 'repeat(3, minmax(0, 1fr))' },
            columnGap: '7',
            rowGap: '7',
          })}
        >
          {blocks.map((b) => (
            <div key={b.k} className={css({ minWidth: '0' })}>
              <span className={labelClass}>{b.k}</span>
              <p
                className={css({ margin: '0', textStyle: 'lede', color: 'text', maxWidth: '50ch' })}
              >
                {b.v}
              </p>
            </div>
          ))}
          <div
            className={css({
              gridColumn: '1 / -1',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '5',
            })}
          >
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={css({
                  display: 'inline-flex',
                  alignItems: 'center',
                  minHeight: '44px',
                  textStyle: 'base',
                  color: 'accent',
                })}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </RevealSection>
    </>
  )
}
