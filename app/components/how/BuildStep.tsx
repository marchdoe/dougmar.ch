import { css } from '../../../styled-system/css'
import type { ArchiveDetail } from '../../types/archive-record'
import { RunStages } from '../RunStages'
import { Absent, Step } from './Step'
import { defEmpty, defKey, defList, defRow, defValue } from './styles'

const fileList = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
})

const runAbsent = css({ marginBottom: '26px' })

function FilesChanged({ files }: { files: string[] | undefined }) {
  if (!files?.length) return <span className={defEmpty}>not logged</span>
  return (
    <span className={`${defValue} ${fileList}`}>
      {files.map((f) => (
        <span key={f}>{f}</span>
      ))}
    </span>
  )
}

export function BuildStep({ detail, hasDesign }: { detail: ArchiveDetail; hasDesign: boolean }) {
  return (
    <Step n="06" title="It was built">
      {detail.run ? (
        <RunStages run={detail.run} />
      ) : (
        <div className={runAbsent}>
          <Absent field="run" era={detail.era} noun="run record" />
        </div>
      )}
      <div className={defList}>
        <div className={defRow}>
          <span className={defKey}>Attempts</span>
          <span className={detail.attempts ? defValue : defEmpty}>
            {detail.attempts ? detail.attempts : 'not logged'}
          </span>
        </div>
        <div className={defRow}>
          <span className={defKey}>Files changed</span>
          <FilesChanged files={detail.filesChanged} />
        </div>
        <div className={defRow}>
          <span className={defKey}>Pages kept</span>
          <span className={hasDesign ? defValue : defEmpty}>
            {hasDesign ? detail.pages : 'none — the capture did not survive'}
          </span>
        </div>
      </div>
    </Step>
  )
}
