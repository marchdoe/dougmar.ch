import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { education } from '../../content/timeline'
import { ClusterRow } from './LedgerRows'

const eduClass = css({ display: 'flex', flexDirection: 'column', gap: '2px', paddingBlock: '6px' })
const schoolClass = css({ textStyle: 'sm', color: 'fieldInk', fontWeight: 'bold' })
const lineClass = css({ textStyle: 'sm', color: 'fieldInkMuted' })

const figRowClass = css({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: '12px',
  paddingBlock: '6px',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'borderStrong',
})

const figLabelClass = css({ textStyle: 'sm', color: 'fieldInk' })

const figClass = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  fontSize: 'clamp(30px, 2.6vw, 42px)',
  lineHeight: '0.9',
  color: 'fieldInk',
  fontVariantNumeric: 'tabular-nums',
})

const focusLabelClass = css({
  textStyle: '2xs',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'fieldInkMuted',
  fontWeight: 'bold',
  marginTop: '6px',
})
const focusClass = css({ textStyle: 'sm', color: 'fieldInk', maxWidth: '48ch' })

export function EducationRow() {
  return (
    <div className={eduClass}>
      <span className={schoolClass}>{education.school}</span>
      <span className={lineClass}>{education.degree}</span>
      <span className={lineClass}>{education.concentration}</span>
      {education.years ? <span className={lineClass}>{education.years}</span> : null}
    </div>
  )
}

export function PersonalCluster() {
  return (
    <>
      <div className={figRowClass}>
        <span className={figLabelClass}>Holes in one</span>
        <span className={figClass}>{personal.holesInOne}</span>
      </div>
      <ClusterRow name="Sport" value={personal.sport} />
      <ClusterRow name="Teams" value={personal.teams.join(', ')} />
      <span className={focusLabelClass}>Current focus</span>
      <p className={focusClass}>{personal.currentFocus}</p>
    </>
  )
}
