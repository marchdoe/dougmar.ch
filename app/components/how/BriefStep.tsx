import { Suspense, lazy } from 'react'
import { css } from '../../../styled-system/css'
import { type BriefSection, briefSections } from '../../lib/archive-explainer'
import type { ArchiveDetail } from '../../types/archive-record'
import { Absent, Step } from './Step'
import { prose, subhead } from './styles'

/**
 * Code-split. The markdown parser is only needed by this route, and the main
 * chunk is 268KB before it.
 */
const ArchiveMarkdown = lazy(() =>
  import('../ArchiveMarkdown').then((m) => ({ default: m.ArchiveMarkdown }))
)

const specDetails = css({
  marginTop: '26px',
  borderTop: '1px solid',
  borderColor: 'archive.line',
  paddingTop: '14px',
  maxWidth: '68ch',
})

const specSummary = css({
  fontSize: 'archive.micro',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'archive.dim',
  cursor: 'pointer',
  userSelect: 'none',
  paddingY: '4px',
  _hover: { color: 'archive.text' },
})

const specBody = css({ marginTop: '12px' })

function Markdown({ children }: { children: string }) {
  return (
    <Suspense fallback={<p className={prose}>{children}</p>}>
      <ArchiveMarkdown>{children}</ArchiveMarkdown>
    </Suspense>
  )
}

function Specification({ sections }: { sections: BriefSection[] }) {
  return (
    <details className={specDetails}>
      <summary className={specSummary}>The full specification ({sections.length} sections)</summary>
      <div className={specBody}>
        {sections.map((s) => (
          <div key={s.heading}>
            <p className={subhead}>{s.heading}</p>
            <Markdown>{s.body}</Markdown>
          </div>
        ))}
      </div>
    </details>
  )
}

export function BriefStep({ detail }: { detail: ArchiveDetail }) {
  const sections = briefSections(detail.adBrief)
  return (
    <Step n="02" title="A brief was written">
      {detail.brief ? (
        <p className={prose}>{detail.brief}</p>
      ) : (
        <Absent field="brief" era={detail.era} noun="brief" />
      )}
      {detail.rationale ? (
        <>
          <p className={subhead}>Why</p>
          <Markdown>{detail.rationale}</Markdown>
        </>
      ) : null}
      {sections.length > 0 && <Specification sections={sections} />}
    </Step>
  )
}
