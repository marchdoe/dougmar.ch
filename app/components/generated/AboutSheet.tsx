import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { capabilities, education, timeline } from '../../content/timeline'
import { LedgerBlock, LedgerRow, TagRun, Worksheet, WorksheetHead } from './Worksheet'

type Entry = (typeof timeline)[number]

function TimelineRow({ entry }: { entry: Entry }) {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: '132px 1fr' },
        rowGap: '4px',
        columnGap: '12px',
        alignItems: 'baseline',
        minHeight: '36px',
        paddingTop: '9px',
      })}
    >
      <span
        className={css({
          justifySelf: 'start',
          bg: 'bg',
          fontFamily: 'display',
          textStyle: '2xs',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          color: 'textMuted',
        })}
      >
        {entry.year}
      </span>
      <div className={css({ justifySelf: 'start', minWidth: '0', bg: 'bg' })}>
        <div
          className={css({
            fontFamily: 'display',
            textStyle: 'sm',
            lineHeight: '1.35',
            color: 'text',
          })}
        >
          {[entry.role, entry.company].filter(Boolean).join(', ')}
        </div>
        {entry.description ? (
          <p
            className={css({
              fontFamily: 'body',
              textStyle: 'sm',
              color: 'textMuted',
              maxWidth: '45ch',
              marginTop: '4px',
            })}
          >
            {entry.description}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function EducationLedger() {
  const focus = [education.concentration, education.years].filter(Boolean).join(' · ')
  return (
    <LedgerBlock title="education">
      <LedgerRow label="school">{education.school}</LedgerRow>
      <LedgerRow label="degree">{education.degree}</LedgerRow>
      {focus ? <LedgerRow label="focus">{focus}</LedgerRow> : null}
    </LedgerBlock>
  )
}

function MarginsLedger() {
  const faint = css({ color: 'textFaint' })
  return (
    <LedgerBlock title="margins" wide>
      <LedgerRow label="holes in one">
        <span className={faint}>{personal.holesInOne}</span>
      </LedgerRow>
      <LedgerRow label="sport">
        <span className={faint}>{personal.sport}</span>
      </LedgerRow>
      <LedgerRow label="teams">
        <span className={faint}>{personal.teams.join(' · ')}</span>
      </LedgerRow>
      <LedgerRow label="current focus">
        <span className={faint}>{personal.currentFocus}</span>
      </LedgerRow>
    </LedgerBlock>
  )
}

export function AboutSheet() {
  return (
    <Worksheet label="Career">
      <WorksheetHead title="the years · ledger" detail="2006 to present" />
      <div>
        {timeline.map((entry) => (
          <TimelineRow key={`${entry.year}-${entry.role}-${entry.company}`} entry={entry} />
        ))}
      </div>
      <LedgerBlock title="capabilities">
        <TagRun tags={capabilities} />
      </LedgerBlock>
      <EducationLedger />
      <MarginsLedger />
    </Worksheet>
  )
}
