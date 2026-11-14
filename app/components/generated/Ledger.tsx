import { css } from '../../../styled-system/css'

const lead = { pos: '1', name: 'Trace Crowe', thru: 'thru 16', score: '−13' }
const rest = [
  { pos: '2', name: 'Carl Yu', score: '−12' },
  { pos: 'T3', name: 'Brian Harman', score: '−11' },
  { pos: 'T3', name: 'Nico Ventura', score: '−11' },
  { pos: '5', name: 'Sami Välimäki', score: '−10' },
]

const rowBase = css({
  display: 'grid',
  gridTemplateColumns: '1.8em 1fr auto',
  gap: '12px',
  paddingBlock: '9px',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'fieldBorder',
  textStyle: 'sm',
  color: 'fieldInk',
})
const pos = css({ color: 'fieldInkMuted', textStyle: 'sm' })

function LeadRow() {
  return (
    <li className={rowBase}>
      <span className={css({ color: 'fieldInkMuted', textStyle: 'sm', alignSelf: 'center' })}>
        {lead.pos}
      </span>
      <span
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          columnGap: '8px',
          alignSelf: 'center',
        })}
      >
        <span className={css({ fontWeight: 'bold', textStyle: 'sm' })}>{lead.name}</span>
        <span className={css({ color: 'fieldInkMuted', fontWeight: 'normal', textStyle: 'sm' })}>
          {lead.thru}
        </span>
      </span>
      <span
        className={css({
          fontWeight: 'bold',
          fontSize: { base: '28px', lg: '40px' },
          lineHeight: '1',
          alignSelf: 'center',
        })}
      >
        {lead.score}
      </span>
    </li>
  )
}

export function Ledger() {
  return (
    <aside
      aria-label="Today's signals"
      className={css({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: { md: 'clamp(24px, 3vw, 56px)' },
        color: 'fieldInk',
      })}
    >
      <div className={css({ marginBottom: '14px' })}>
        <span
          className={css({
            textStyle: '2xs',
            textTransform: 'uppercase',
            letterSpacing: 'wider',
            fontWeight: 'bold',
            color: 'fieldInk',
          })}
        >
          Austin Championship · in progress
        </span>
        <p className={css({ textStyle: 'sm', color: 'fieldInkMuted', marginTop: '3px' })}>
          pres. by Compliance Solutions
        </p>
      </div>
      <ol
        className={css({
          listStyle: 'none',
          margin: '0',
          padding: '0',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'fieldBorder',
        })}
      >
        <LeadRow />
        {rest.map((r) => (
          <li key={r.name} className={rowBase}>
            <span className={pos}>{r.pos}</span>
            <span className={css({ fontWeight: 'normal' })}>{r.name}</span>
            <span className={css({ fontWeight: 'bold' })}>{r.score}</span>
          </li>
        ))}
      </ol>
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          textStyle: 'sm',
          color: 'fieldInkMuted',
          paddingTop: '12px',
          marginTop: '12px',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'fieldBorder',
        })}
      >
        <span>SPY</span>
        <span>
          <span className={css({ fontWeight: 'bold', color: 'fieldInk' })}>754.37</span> · −0.37%
        </span>
      </div>
    </aside>
  )
}
